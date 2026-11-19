# Cómo funciona mi portafolio

El portafolio reúne una presentación personal, información sobre mí, habilidades, trabajos del curso y un formulario de contacto. Conserva las cinco secciones previstas en el wireframe de Figma.

## Qué se hizo

Se completó la estructura de la página y se añadieron colores, espacios, tarjetas y capturas reales de los trabajos. Las tarjetas son compactas y usan azul, verde, ámbar y violeta. Se incluyeron las demos de Facebook, ToDoList, catálogo interactivo, juego de reacción y buscador de personajes. Como no se proporcionó una foto personal, se usaron las iniciales DB.

La página principal está hecha con HTML, CSS y JavaScript. Algunos proyectos mostrados se hicieron con React y Vite; sus demos ya están compiladas para que el visitante no tenga que instalar nada.

## Herramientas y su función

| Herramienta | Para qué se usó |
| --- | --- |
| Figma | Diseñar el wireframe que organiza las secciones. |
| HTML | Escribir títulos, textos, enlaces, imágenes y formulario. |
| CSS | Definir colores, tamaños, columnas y adaptación a pantallas. |
| JavaScript | Abrir el menú móvil, validar campos y enviar el contacto. |
| Git y GitHub | Guardar versiones y publicar el código en un repositorio público. |
| GitHub Pages | Alojar la página del portafolio. |
| Node.js y Vercel | Ejecutar el código que recibe y procesa los mensajes. |
| MongoDB Atlas | Guardar los contactos en una base de datos en Internet. |
| Web3Forms | Enviar el aviso del contacto al Gmail personal del propietario. |
| Biblioteca oficial mongodb | Conectar el código del servidor con la base de datos. |
| Playwright y pruebas de Node.js | Revisar tamaños de pantalla, formulario y respuestas del servidor. |
| Codex | Ayudar a preparar el código, configurar servicios y comprobar resultados. |

## Qué sucede cuando alguien escribe

1. El visitante completa nombre, correo y mensaje, y pulsa **Enviar mensaje**.
2. JavaScript revisa los campos y envía los datos a la API de Vercel.
3. El servidor vuelve a validar los datos y comprueba el límite de intentos.
4. El servidor guarda un documento en MongoDB Atlas con nombre, correo, mensaje y fecha. MongoDB añade un identificador `_id`.
5. Si MongoDB confirma, el servidor responde y la página muestra el aviso de guardado. Si falla, conserva el formulario para reintentar.

La contraseña de la base está en Vercel como variable privada `MONGODB_URI`. No está en el navegador, el ZIP ni GitHub. La dirección de la API que aparece en `config.js` sí es pública y no es una contraseña.

Después de guardar en MongoDB, el navegador envía el aviso a Web3Forms, cuyo formulario está asociado a `crafterbm222@gmail.com`. La clave de `config.js` es pública y representa ese formulario; no es una contraseña de Gmail. El servicio permite usarla en el navegador. El correo del visitante se incluye para poder responderle.

Si falla el envío del correo, la página avisa que el contacto sí quedó guardado, conserva los campos y muestra **Reintentar aviso**. Al pulsarlo durante esa misma visita, reintenta el correo sin volver a guardar el mismo contacto. Si se recarga la página, se pierde esa memoria temporal. No hay reintento automático en segundo plano. El campo `avisoCorreo: gestionado_desde_navegador` indica dónde se gestiona el aviso; no acredita su entrega en la bandeja.

## Dónde leer los mensajes

Entrar a MongoDB Atlas con la cuenta del propietario y seleccionar **Portafolio David → portafolio-david → Browse Collections → portafolio → contactos**. Cada documento representa un mensaje. Usar el correo indicado para responder desde la cuenta personal.

No hay una lista de contactos visible para los visitantes. La API del formulario no ofrece una ruta para leer los mensajes.

## Cómo se adapta a celular y computador

El diseño adaptable o responsive significa que la misma página cambia de distribución según el espacio disponible.

- La etiqueta `viewport` del HTML hace que el navegador móvil use el ancho real del dispositivo.
- El contenedor ocupa el 88% del ancho y tiene un máximo de 1120 píxeles. Así evita que el contenido quede pegado a los bordes o se estire demasiado en un monitor grande.
- CSS Grid organiza las columnas de presentación, habilidades, proyectos y contacto.
- Las reglas `@media` cambian la distribución a 1000, 700 y 380 píxeles. En pantallas pequeñas se reducen columnas y tamaños; las tarjetas de proyectos pasan a una columna y aparece el botón Menú.
- Las imágenes usan un tamaño que se ajusta al contenedor. Los formularios y botones se acomodan al ancho disponible.
- Se revisaron anchos de 1440, 768, 390 y 320 píxeles, sin desplazamiento horizontal en esas pruebas. Estos tamaños representan casos de escritorio, tableta y celular; no sustituyen probar todos los dispositivos existentes.

No se hacen dos páginas distintas: HTML, CSS y JavaScript son los mismos para todos.

## Qué archivo cambiar

- `index.html`: contenido, secciones y enlaces.
- `styles.css`: apariencia y adaptación a pantallas.
- `script.js`: menú y comportamiento del formulario.
- `config.js`: dirección pública de la API.
- `assets/`: capturas de los trabajos.
- `proyectos/`: demos.
- `servidor/api/contacto.js`: recepción y guardado del mensaje.
- `servidor/base-datos.js`: conexión con MongoDB.
- `servidor/validacion.js`: revisión de datos en el servidor.

Los cambios en la página se publican al subirlos a GitHub y completar el despliegue de Pages. Los cambios del servidor se deben publicar también en Vercel. La conexión automática de Vercel con GitHub requiere vincular ambas cuentas; no es necesaria para el servidor ya publicado mediante la herramienta oficial.

## Enlaces

- Portafolio: https://crafterbm222-sudo.github.io/portafolio-david/
- Código: https://github.com/crafterbm222-sudo/portafolio-david
- Wireframe: https://www.figma.com/design/tu6biTJQiJgsIMtqQpnyrU
- Gestión del servidor: https://vercel.com/dandred/contacto-portafolio-david

Referencias de los servicios: https://www.mongodb.com/docs/drivers/node/current/crud/insert/ y https://vercel.com/docs/functions/runtimes/node-js
