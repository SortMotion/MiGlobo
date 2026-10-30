# Plan de evaluación (objetivo 4)

Meta: demostrar con datos que MiGlobo reduce pedidos perdidos, pagos sin registrar y
tiempo de gestión, y que es fácil de usar.

## Participantes

3–5 estudiantes que vendan por redes al menos 5 pedidos por semana. Consentimiento por
escrito; en el reporte se usan alias (Vendedor 1, 2…).

## Diseño antes / después

| Etapa | Duración | Qué hacen |
|---|---|---|
| Línea base | 1 semana | Venden como siempre. Al final de cada día llenan un mini formulario. |
| Con MiGlobo | 1–2 semanas | Usan la página + WhatsApp conectado. Mismo formulario diario. |

## Métricas

| Métrica | Cómo se mide | Antes | Después |
|---|---|---|---|
| Pedidos perdidos u olvidados por semana | Formulario diario | | |
| Pagos/anticipos sin registrar | Formulario diario + revisión con el vendedor | | |
| Minutos al día gestionando pedidos | Formulario diario (autoreporte) | | |
| Entregas con confusión de lugar u hora | Formulario diario | | |
| Usabilidad (SUS, 0–100) | Cuestionario al final; >68 = aceptable | — | |
| Precisión de la IA | % de mensajes bien clasificados vs. revisión manual | — | |

Formulario diario sugerido (Google Forms, 1 minuto):

1. ¿Cuántos pedidos tuviste hoy?
2. ¿Se te olvidó o perdió alguno? ¿Cuántos?
3. ¿Hubo algún anticipo o pago que no anotaste?
4. ¿Alguna confusión con lugar u hora de entrega?
5. ¿Cuánto tiempo aprox. le dedicaste a contestar y organizar pedidos?

## Precisión de la IA

Cada mensaje en `mensajes` tiene la `intencion` que puso la IA. Al final, revisen a mano
una muestra (o todos) y calculen:

```sql
-- Exporta para revisar a mano en una hoja de cálculo.
select created_at, texto, intencion
from mensajes
where direccion = 'entrante'
order by created_at;
```

## Cuestionario SUS

Las 10 preguntas estándar del System Usability Scale, en escala 1–5. Hay versiones en
español validadas; citen la que usen en el reporte.
