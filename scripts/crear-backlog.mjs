// Crea en GitHub los labels, milestones, issues y el Project de MiGlobo.
// Usa GitHub CLI con la sesión de quien lo corre (todo queda a su nombre).
//
//   gh auth login --scopes project,read:org
//   node scripts/crear-backlog.mjs --dry-run   # solo muestra lo que haría
//   node scripts/crear-backlog.mjs
//
// Se puede correr varias veces: lo que ya existe (por título) no se duplica, y las
// asignaciones, Prioridad, Rol y Puntos se actualizan con lo que diga backlog.mjs.

import { execFileSync } from "node:child_process";
import { equipo, fases, issues, labels, prioridades, roles } from "./backlog.mjs";

const OWNER = "SortMotion";
const REPO = `${OWNER}/MiGlobo`;
const PROJECT_TITLE = "MiGlobo";
const ESTADOS = [
  { name: "Backlog", color: "GRAY", description: "Definido, sin fecha" },
  { name: "Por hacer", color: "BLUE", description: "Para la fase actual" },
  { name: "En progreso", color: "YELLOW", description: "Alguien está trabajando en esto" },
  { name: "En revisión", color: "PURPLE", description: "PR abierto esperando revisión" },
  { name: "Hecho", color: "GREEN", description: "Merge hecho o tarea terminada" },
];
const COLORES_ROL = ["BLUE", "ORANGE", "GREEN", "GRAY"];

const DRY = process.argv.includes("--dry-run");

function gh(args, input) {
  if (DRY) return "";
  return execFileSync("gh", args, { encoding: "utf8", input, stdio: ["pipe", "pipe", "pipe"] }).trim();
}
const ghJson = (args, input) => (DRY ? null : JSON.parse(gh(args, input)));
const pausa = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const log = (...a) => console.log(DRY ? "[dry-run]" : "", ...a);

// ─── Labels ───────────────────────────────────────────────────────────
for (const l of labels) {
  gh(["label", "create", l.nombre, "--repo", REPO, "--color", l.color, "--description", l.descripcion, "--force"]);
  log("label", l.nombre);
}

// ─── Milestones (fases) ───────────────────────────────────────────────
const milestonesExistentes = DRY
  ? []
  : ghJson(["api", `repos/${REPO}/milestones?state=all&per_page=100`]).map((m) => m.title);
for (const f of fases) {
  if (milestonesExistentes.includes(f.titulo)) continue;
  gh(["api", `repos/${REPO}/milestones`, "-f", `title=${f.titulo}`, "-f", `description=${f.descripcion}`]);
  log("milestone", f.titulo);
}

// ─── Project ──────────────────────────────────────────────────────────
let project = DRY
  ? { number: 0, id: "PROJECT" }
  : ghJson(["project", "list", "--owner", OWNER, "--format", "json", "--limit", "100"]).projects.find(
      (p) => p.title === PROJECT_TITLE,
    );
if (!project) {
  project = ghJson(["project", "create", "--owner", OWNER, "--title", PROJECT_TITLE, "--format", "json"]);
  log("project creado", project.url);
  try {
    gh(["project", "link", String(project.number), "--owner", OWNER, "--repo", REPO]);
  } catch (e) {
    console.warn("No se pudo ligar el Project al repo; hazlo desde la pestaña Projects del repo.", e.stderr ?? e.message);
  }
}

const campos = () =>
  DRY ? [] : ghJson(["project", "field-list", String(project.number), "--owner", OWNER, "--format", "json"]).fields;

// Deja las opciones de un campo de selección exactamente como se piden.
// Ojo: reemplazar opciones borra el valor de ese campo en los items (se vuelve a poner abajo).
function asegurarOpciones(campo, opciones) {
  const f = campos().find((x) => x.name === campo);
  if (!f || f.options.map((o) => o.name).join() === opciones.map((o) => o.name).join()) return false;
  try {
    gh(
      ["api", "graphql", "--input", "-"],
      JSON.stringify({
        query: `mutation($id: ID!, $opts: [ProjectV2SingleSelectFieldOptionInput!]) {
          updateProjectV2Field(input: { fieldId: $id, singleSelectOptions: $opts }) { clientMutationId }
        }`,
        variables: { id: f.id, opts: opciones },
      }),
    );
    log(`opciones de ${campo}:`, opciones.map((o) => o.name).join(", "));
    return true;
  } catch (e) {
    console.warn(`No se pudieron cambiar las opciones de ${campo}; edítalas a mano en el Project.`, e.stderr ?? e.message);
    return false;
  }
}

const statusReiniciado = asegurarOpciones("Status", ESTADOS);

let lista = campos();
for (const [nombre, tipo, opciones] of [
  ["Prioridad", "SINGLE_SELECT", Object.values(prioridades)],
  ["Rol", "SINGLE_SELECT", Object.values(roles)],
  ["Puntos", "NUMBER"],
]) {
  if (lista.some((f) => f.name === nombre)) continue;
  const args = ["project", "field-create", String(project.number), "--owner", OWNER, "--name", nombre, "--data-type", tipo];
  if (opciones) args.push("--single-select-options", opciones.join(","));
  gh(args);
  log("campo", nombre);
}

asegurarOpciones(
  "Rol",
  Object.values(roles).map((name, n) => ({ name, color: COLORES_ROL[n], description: "" })),
);

lista = campos();
const ponerCampo = (itemId, campo, valor) => {
  if (DRY) return;
  const f = lista.find((x) => x.name === campo);
  if (!f) return console.warn(`No existe el campo ${campo}`);
  const valorArgs =
    f.type === "ProjectV2Field" || typeof valor === "number"
      ? ["--number", String(valor)]
      : (() => {
          const o = f.options?.find((x) => x.name === valor);
          if (!o) throw new Error(`No encontré la opción "${valor}" del campo ${campo}`);
          return ["--single-select-option-id", o.id];
        })();
  gh(["project", "item-edit", "--id", itemId, "--project-id", project.id, "--field-id", f.id, ...valorArgs]);
};

// ─── Issues ───────────────────────────────────────────────────────────
const existentes = new Map(
  DRY
    ? []
    : ghJson(["issue", "list", "--repo", REPO, "--state", "all", "--limit", "500", "--json", "title,url"]).map(
        (x) => [x.title, x.url],
      ),
);

let creados = 0;
for (const issue of issues) {
  const asignados = issue.rol ? equipo[issue.rol] : [];
  let url = existentes.get(issue.titulo);
  const nuevo = !url;
  if (nuevo) {
    url = gh(
      [
        "issue", "create", "--repo", REPO, "--title", issue.titulo, "--body-file", "-",
        "--milestone", fases[issue.fase].titulo,
        ...["tarea", ...issue.area].flatMap((l) => ["--label", l]),
        ...(asignados.length ? ["--assignee", asignados.join(",")] : []),
      ],
      issue.body,
    );
    creados++;
    pausa(1000); // GitHub limita la creación rápida de contenido.
  } else if (asignados.length) {
    gh(["issue", "edit", url, "--add-assignee", asignados.join(",")]);
  }

  const item = DRY
    ? { id: "ITEM" }
    : ghJson(["project", "item-add", String(project.number), "--owner", OWNER, "--url", url, "--format", "json"]);
  if (nuevo || statusReiniciado) ponerCampo(item.id, "Status", "Backlog");
  ponerCampo(item.id, "Prioridad", prioridades[issue.prio]);
  if (issue.rol) ponerCampo(item.id, "Rol", roles[issue.rol]);
  ponerCampo(item.id, "Puntos", issue.pts);

  log(nuevo ? "creado " : "actualizado", issue.titulo, asignados.join(", "), url ?? "");
}

console.log(`\nListo: ${creados} issues nuevos de ${issues.length}.`);
if (!DRY) console.log(`Project: https://github.com/orgs/${OWNER}/projects/${project.number}`);
