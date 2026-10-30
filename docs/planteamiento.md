# Planteamiento del problema y objetivos

## Problema

Un sector creciente de estudiantes y jóvenes emprendedores vende productos de bajo
volumen (ropa de segunda mano, postres, accesorios) por Instagram, Facebook y WhatsApp.
Administran todo a mano en varias cuentas y chats, con libretas o notas del teléfono.
Eso provoca pedidos perdidos, anticipos sin seguimiento, confusiones en el lugar y la
hora de entrega, y mucho tiempo respondiendo mensajes repetitivos.

Mercado Libre y Shopify están pensadas para catálogos grandes, son complejas y cobran
comisiones. WhatsApp Business atiende una sola red y no controla anticipos ni entregas.
Falta una herramienta sencilla que reúna las cuentas del emprendedor y, con IA,
automatice el flujo de venta, el estado del pago y la cita de entrega.

## Objetivo general

Desarrollar una página web de gestión administrativa para estudiantes y jóvenes
micro-emprendedores que comercializan productos a través de redes sociales, la cual,
mediante automatizaciones con inteligencia artificial en n8n, conecte sus cuentas y
centralice la atención de mensajes, el control de pedidos, el seguimiento de anticipos y
la coordinación de entregas, con el fin de disminuir las pérdidas económicas por
desorganización y eficientizar la operación de sus ventas.

## Objetivos particulares

| # | Objetivo | Dónde se ve en el repo |
|---|---|---|
| 1 | **Analizar** los procesos actuales de venta, registro y atención de los estudiantes micro-emprendedores, así como la viabilidad técnica de conectar sus redes sociales mediante n8n, para establecer los requerimientos funcionales y técnicos. | [`requerimientos.md`](requerimientos.md), [`whatsapp.md`](whatsapp.md) |
| 2 | **Diseñar** la arquitectura del sistema, los flujos de automatización con IA y la interfaz, priorizando la simplicidad y la accesibilidad técnica. | [`arquitectura.md`](arquitectura.md), [`../n8n/`](../n8n) |
| 3 | **Desarrollar e integrar** los módulos de mensajes, pedidos, anticipos y entregas, la conexión con redes sociales mediante n8n y el espacio público de contacto, en una única plataforma web. | [`../web/`](../web), [`../supabase/`](../supabase) |
| 4 | **Evaluar** la utilidad y usabilidad mediante pruebas de campo con emprendedores reales, para comprobar la reducción de errores administrativos y del tiempo de gestión. | [`evaluacion.md`](evaluacion.md) |

## Cómo demostraremos que se cumplió

- Página funcional con **al menos una red social (WhatsApp) conectada** mediante n8n,
  que cubra registro de pedidos, control de anticipos y coordinación de entregas.
- Pruebas de uso con emprendedores reales.
- Comparación antes/después en pedidos perdidos, pagos sin registrar y tiempo de gestión.

## Preguntas abiertas (del análisis)

- ¿Qué permisos pide Meta para conectar cuentas reales de otros vendedores (no solo el número de prueba)?
- ¿Hasta dónde la IA interpreta los mensajes de forma confiable? → medirlo con los casos de [`../n8n/prompt-extraccion.md`](../n8n/prompt-extraccion.md).
- ¿Cobro dentro de la página o solo registro de pagos? → por ahora **solo registro**; el cobro lo hace cada vendedor.
