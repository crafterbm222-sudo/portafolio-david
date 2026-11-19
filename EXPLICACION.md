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

Después de guardar en MongoDB, el servidor solicita a FormSubmit un aviso para `crafterbm222@gmail.com`. El propietario debe activar ese destinatario pulsando **Activate Form** en el primer correo de FormSubmit. Hasta completar esa confirmación no se puede considerar verificada la recepción de avisos. Los contactos siguen disponibles en Atlas y el enlace de Gmail sigue siendo otra forma de contacto.

La API devuelve `avisoCorreo` con el valor `aceptado` cuando el servicio acepta el aviso, o `pendiente` si aún no está activado, hay un fallo o se agota la espera. Aceptado no garantiza que un correo haya llegado a la bandeja: también puede aparecer en spam. Esta versión no reenvía automáticamente los avisos pendientes; no se pierden sus contactos en la base de datos.

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
