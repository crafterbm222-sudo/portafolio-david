# Contacto con MongoDB

Esta carpeta contiene la parte que recibe los mensajes. Se publica como proyecto aparte en Vercel. GitHub Pages sigue mostrando el portafolio.

**Estado:** servidor publicado en Vercel y base de datos creada en MongoDB Atlas. Se verificó un envío real y la lectura del documento guardado. El formulario utiliza `https://contacto-portafolio-david.vercel.app/api/contacto`.

Atlas: proyecto **Portafolio David**, clúster **portafolio-david**, base **portafolio**, colección **contactos**. Vercel: equipo **Dandred**, proyecto **contacto-portafolio-david**, plan Hobby. MongoDB: clúster Free. La lista de acceso a red permite cualquier IP con autenticación, con autorización del propietario; el usuario del formulario tiene lectura/escritura únicamente sobre `portafolio`.

Las instrucciones siguientes permiten entender o repetir la configuración. No es necesario volver a crear los recursos.

## 1. MongoDB Atlas

1. Crear una cuenta en https://www.mongodb.com/cloud/atlas/register y completar personalmente las verificaciones.
2. Crear un proyecto y un clúster de tipo **Free**. No seleccionar Flex ni un plan de pago para este ejercicio.
3. Crear un usuario de base de datos con permisos de lectura y escritura únicamente sobre `portafolio`. El usuario de la base es distinto del usuario de la cuenta de Atlas.
4. Configurar Network Access para permitir las conexiones del alojamiento. La lista de IP de tu PC no permite por sí sola que conecte Vercel. Revisar las opciones de salida de red del plan antes de abrir el acceso; permitir `0.0.0.0/0` amplía el acceso a cualquier IP y requiere mantener la autenticación y los permisos restringidos. No es lo mismo que publicar los mensajes.
5. En **Connect → Drivers → Node.js**, obtener la cadena de conexión. Guardarla directamente en los ajustes privados de Vercel. Nunca en GitHub, `config.js` ni en el chat.

## 2. Vercel

1. Crear cuenta en https://vercel.com/signup. Para este proyecto académico personal, elegir Hobby si cumple las condiciones del plan.
2. Importar el repositorio `crafterbm222-sudo/portafolio-david` y elegir **Root Directory: servidor** y **Framework Preset: Other**. No hace falta compilar React. No indicar `dist` como carpeta de salida: este proyecto es la API.
3. Añadir en los ajustes de **Environment Variables**, para Production:
   - `MONGODB_URI`: la cadena privada de Atlas, con el usuario y contraseña de base de datos.
   - `MONGODB_DB`: `portafolio`.
   - `ALLOWED_ORIGINS`: `https://crafterbm222-sudo.github.io` (sin barra al final).
4. Desplegar. El endpoint tendrá la forma `https://DOMINIO-REAL-DEL-PROYECTO.vercel.app/api/contacto`. Esa dirección es un ejemplo; usar la URL que devuelva Vercel.
5. El formulario necesita acceso público al endpoint de producción. Si hay protección de despliegue que obliga a iniciar sesión, revisar la configuración con el propietario antes de probarlo.

## 3. Conectar el formulario

En el `config.js` de la raíz del portafolio, sustituir la cadena vacía de `window.CONTACTO_URL` por la dirección real del endpoint. Subir el cambio a GitHub y esperar la publicación de Pages.

La URL de la API es pública; la cadena de MongoDB debe permanecer solo en Vercel. Cuando hay URL, el botón pasa a decir **Enviar mensaje**. No realiza un envío de email: guarda el contacto para consultarlo en Atlas.

## 4. Verificar el guardado real

1. Abrir el portafolio publicado y enviar un mensaje de prueba, sin datos personales reales.
2. Debe mostrarse la confirmación solo después de recibir la respuesta correcta del servidor.
3. Entrar a Atlas, **Browse Collections → portafolio → contactos**. Comprobar el mismo nombre, correo, texto y fecha. Esta es la prueba que confirma la conexión real.
4. `GET /api/contacto` no lista ni revela los mensajes. Solo el propietario accede a ellos desde Atlas con sus permisos.
5. Comprobar también un fallo de conexión y que el formulario conserve el texto para reintentar.

## Datos guardados

La base `portafolio` contiene la colección `contactos`. Cada documento tiene `_id`, `nombre`, `correo`, `mensaje` y `fecha`. La primera inserción crea la colección si no existe.

`limites_contacto` guarda contadores temporales con una versión hash de la dirección del visitante y un bloque de diez minutos. El índice TTL elimina esos contadores vencidos automáticamente. Es una protección básica contra repeticiones, no un sistema completo contra spam.

No hay bandeja pública ni panel de administración. Para responder, consultar el correo indicado en el documento de Atlas o responder al aviso recibido.

## Avisos al correo personal

`correo.js` solicita un aviso a FormSubmit con el nombre, correo y mensaje del visitante. El destino está en `CONTACT_EMAIL`, configurado como `crafterbm222@gmail.com`; el visitante no puede cambiarlo. No se requiere añadir una contraseña de Gmail al servidor.

El propietario debe buscar el primer correo de FormSubmit en su Gmail y pulsar **Activate Form**. Puede localizarlo con `in:anywhere FormSubmit`. Sin activar el destinatario, los avisos quedan pendientes. La activación y la entrega en la bandeja no se consideran comprobadas solo porque el servicio diga que solicitó el correo.

El campo `avisoCorreo` de MongoDB registra `aceptado` o `pendiente`. Si falla el aviso, se mantiene el contacto y se informa al visitante sin pedir que lo vuelva a enviar. No hay reintento automático de pendientes. Referencia: https://formsubmit.co/

## Probar el código en el computador (opcional)

Se requiere Node.js 22 o posterior. Dentro de `servidor`, ejecutar `npm ci` y `npm test`. Las pruebas usan almacenamiento simulado y verifican validación, respuestas, límites y errores; no acreditan conexión real a Atlas.

Para probar contra una base propia, copiar `.env.example` como `.env`, completar sus valores y ejecutar `npm start`. La API escucha en `http://127.0.0.1:3001/api/contacto`. La página de prueba debe abrirse con un servidor estático en el puerto 5500 y tener esa URL en `config.js`. Al abrir el HTML por doble clic se conserva el modo correo, salvo que se configure explícitamente otra URL.

Referencias: https://www.mongodb.com/docs/drivers/node/current/crud/insert/ y https://vercel.com/docs/functions/runtimes/node-js
