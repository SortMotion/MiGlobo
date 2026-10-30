# Conectar WhatsApp (Cloud API de Meta)

WhatsApp es la primera red del proyecto porque Meta da un **número de prueba gratis**
sin tener que verificar un negocio.

## 1. Crear la app en Meta

1. Entra a https://developers.facebook.com con una cuenta de Facebook y regístrate como desarrollador.
2. **Create App** → caso de uso *Connect with customers through WhatsApp*
   (o tipo *Business*) → crea o elige un portafolio comercial.
3. En el panel de la app, agrega el producto **WhatsApp** → *API Setup*.

Ahí aparece:

| Dato | Para qué |
|---|---|
| **Temporary access token** (dura 24 h) | Credencial *WhatsApp API* de n8n |
| **Phone number ID** | `negocios.whatsapp_phone_number_id` en Supabase |
| **WhatsApp Business Account ID** | Credencial *WhatsApp API* de n8n |
| Número de prueba | El número al que escribirán los "clientes" |

4. En *To*, agrega y verifica los números de celular del equipo (máximo 5). **El número de
   prueba solo puede mandar mensajes a números verificados.**
5. *App settings → Basic*: copia **App ID** y **App Secret** para la credencial
   *WhatsApp OAuth API* de n8n (la usa el *WhatsApp Trigger*).

## 2. Webhook

1. Con n8n corriendo y el túnel abierto ([`../n8n/README.md`](../n8n/README.md)), activa el
   flujo que tiene el *WhatsApp Trigger*. n8n registra el webhook en tu app de Meta.
2. Desde un celular verificado, manda un mensaje al número de prueba y revisa la ejecución en n8n.
3. Si no llega nada, revisa en Meta → WhatsApp → *Configuration* que el webhook esté
   suscrito al campo **messages**.

## 3. Token permanente

El token temporal vence cada 24 h. Para no estar cambiándolo:

1. *Business Settings → Users → System users* → crea uno con rol *Admin*.
2. Asígnale la app y la cuenta de WhatsApp.
3. **Generate token** con permisos `whatsapp_business_messaging` y `whatsapp_business_management`.

## Límites que hay que documentar (objetivo 1)

- **Ventana de 24 horas:** solo puedes responder con texto libre si el cliente te escribió en
  las últimas 24 h. Fuera de esa ventana, Meta exige *plantillas* aprobadas
  (importa para los recordatorios de entrega, RF-53).
- **Números reales:** para conectar el WhatsApp de un emprendedor real hace falta registrar
  ese número en la API. Ese número deja de funcionar en la app normal de WhatsApp. Para las
  pruebas de campo conviene que cada emprendedor use un **número aparte** o que se pruebe con
  el número del proyecto.
- **Instagram y Facebook** usan la misma app de Meta pero necesitan cuenta profesional ligada a
  una página de Facebook y permisos que pasan por revisión de Meta para usuarios externos.

Las reglas de Meta cambian seguido: verifiquen estos puntos en la documentación oficial
(developers.facebook.com/docs/whatsapp) cuando lleguen a cada paso.
