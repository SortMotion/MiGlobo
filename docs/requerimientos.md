# Requerimientos

Versión inicial, basada en el planteamiento. **Tarea del objetivo 1:** validarla con
entrevistas a 3–5 emprendedores (guía abajo) y ajustar prioridades.

Prioridad: **M** = mínimo para la demo · **D** = deseable · **F** = futuro.

## Funcionales

### Cuenta y negocio
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-01 | vendedor | crear cuenta e iniciar sesión | M | ✅ base |
| RF-02 | vendedor | registrar mi negocio con nombre, liga pública y WhatsApp | M | ✅ base |
| RF-03 | vendedor | editar los datos de mi negocio y conectar mi número de WhatsApp | M | ⬜ |

### Productos
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-10 | vendedor | dar de alta productos con precio | M | ✅ base |
| RF-11 | vendedor | editar, ocultar y poner foto a un producto | D | ⬜ |

### Mensajes
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-20 | vendedor | ver en el panel los mensajes que llegan por WhatsApp | M | ✅ base (falta n8n) |
| RF-21 | vendedor | ver los mensajes agrupados por cliente (conversación) | M | ⬜ |
| RF-22 | vendedor | responder desde el panel | D | ⬜ |
| RF-23 | vendedor | que la IA responda sola preguntas frecuentes (precio, disponibilidad) | D | ⬜ |
| RF-24 | vendedor | conectar Instagram y Facebook | F | ⬜ |

### Pedidos
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-30 | vendedor | que la IA registre un pedido cuando un cliente pide algo | M | ✅ SQL (falta n8n) |
| RF-31 | vendedor | ver mis pedidos con estado, total, pagado y lo que falta | M | ✅ base |
| RF-32 | vendedor | avanzar el estado (pendiente → confirmado → listo → entregado) | M | ✅ base |
| RF-33 | vendedor | crear, corregir o cancelar un pedido a mano | M | ⬜ |
| RF-34 | vendedor | ver de qué mensaje salió un pedido de la IA | D | ⬜ |

### Anticipos
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-40 | vendedor | registrar un anticipo o pago de un pedido | M | ⬜ |
| RF-41 | vendedor | subir la foto del comprobante | D | ⬜ |
| RF-42 | vendedor | marcar un pago como verificado | M | ⬜ |

### Entregas
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-50 | vendedor | programar lugar y hora de entrega de un pedido | M | ⬜ (la IA ya puede crearla) |
| RF-51 | vendedor | ver las entregas del día | M | ✅ base |
| RF-52 | vendedor | marcar una entrega como realizada | M | ⬜ |
| RF-53 | comprador | recibir recordatorio por WhatsApp el día de la entrega | D | ⬜ |

### Página pública
| ID | Como… | quiero… | Prioridad | Estado |
|---|---|---|---|---|
| RF-60 | comprador | ver los productos de una tienda y escribirle por WhatsApp | M | ✅ base |

## No funcionales

| ID | Requerimiento |
|---|---|
| RNF-01 | Se usa bien desde el celular (la mayoría de vendedores lo abrirá ahí). |
| RNF-02 | Un vendedor nuevo configura su negocio en menos de 10 minutos. |
| RNF-03 | Cada vendedor solo puede ver sus datos (RLS en todas las tablas). |
| RNF-04 | Costo $0 en la etapa escolar (planes gratis de Supabase, Vercel, n8n self-hosted). |
| RNF-05 | Un mensaje de WhatsApp aparece en el panel en menos de 10 segundos. |
| RNF-06 | Ninguna llave secreta en el repositorio. |

## Guía de entrevista (objetivo 1)

1. ¿Qué vendes y por qué redes? ¿Cuántos pedidos a la semana?
2. Cuéntame tu último pedido, desde el primer mensaje hasta la entrega.
3. ¿Dónde anotas los pedidos y los anticipos?
4. En el último mes, ¿cuántos pedidos o pagos se te perdieron o confundieron?
5. ¿Cuánto tiempo al día se te va en contestar mensajes?
6. ¿Qué preguntas te hacen una y otra vez?
7. ¿Usarías una página para esto? ¿Qué te haría dejar de usarla?

Guarden las respuestas resumidas en `docs/entrevistas/` (sin datos personales).
