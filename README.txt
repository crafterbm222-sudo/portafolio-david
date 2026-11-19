PORTAFOLIO PERSONAL - DAVID ANDRÉS BUSTAMANTE MESA
================================================

CÓMO ABRIR
Extraer el ZIP completo y abrir index.html con doble clic. Mantener las carpetas
assets y proyectos junto al archivo. No se requiere instalar Node.js.
El portafolio usa HTML, CSS y JavaScript separados, con navegación a cinco secciones.

DISEÑO
Se respetó el orden y la distribución general del wireframe y se añadieron
colores azul y blanco, tarjetas, capturas, tipografía y menú adaptable.
Wireframe: https://www.figma.com/design/tu6biTJQiJgsIMtqQpnyrU
Se usan iniciales como imagen de perfil porque no se proporcionó una fotografía.
GitHub del estudiante: https://github.com/crafterbm222-sudo

PROYECTOS
Facebook: maqueta HTML/CSS. Sus controles son parte de una maqueta visual.
ToDoList: crear cuentas de prueba y agregar tareas. Guarda datos en este navegador.
Catálogo: consulta DummyJSON y necesita Internet para cargar productos e imágenes.
Juego: se abre desde la tarjeta del catálogo. Permite guardar tiempos y reiniciar.
Las capturas de los cuatro trabajos corresponden a sus interfaces reales.
Buscador de personajes: busca por nombre o ID en The Rick and Morty API,
permite personajes aleatorios y paginación. Requiere conexión a Internet.

Las demos React están compiladas como scripts clásicos para abrirlas sin instalar
dependencias. El código original de React se incluye en fuentes-react. Para editar
esos proyectos con Vite, entrar a su carpeta, ejecutar npm ci y npm run dev.

CONTACTO
El formulario envía nombre, correo, mensaje y fecha a MongoDB Atlas mediante una
función de Node.js publicada en Vercel. El navegador solo conoce la URL pública de
la API. La contraseña está guardada como secreto del servidor, fuera de GitHub.
Solo muestra confirmación cuando el guardado se completa. Si hay un error,
conserva los campos para reintentar. También solicita un aviso a Gmail mediante FormSubmit; requiere activar el destinatario. Los avisos pendientes no se reenvían automáticamente.
Para leer los mensajes: Atlas > Portafolio David > portafolio-david >
Browse Collections > portafolio > contactos.
El enlace de correo de la página sigue disponible como alternativa.
El destino es crafterbm222@gmail.com. El servicio de correo debe activarse desde el enlace de FormSubmit recibido en esa cuenta. La carpeta servidor contiene la guía.
Se verificó un envío real y su lectura en MongoDB Atlas.

ARCHIVOS
index.html: contenido del portafolio.
styles.css: colores, distribución, estados y adaptación a distintos tamaños.
script.js: menú móvil, validación y envío del formulario.
assets/: capturas locales de los proyectos.
proyectos/: demos que abren los botones del portafolio.
fuentes-react/: código fuente original del catálogo y juego.

PRUEBAS
Se verificaron los anchos 1440, 768, 390 y 320 px, el menú móvil, validación de
campos en blanco, imágenes locales, destinos de demos, el reinicio del juego
y la carga real de productos desde la API. Se revisaron las capturas visualmente.

ENLACES DE ENTREGA
Repositorio público: https://github.com/crafterbm222-sudo/portafolio-david
Página: https://crafterbm222-sudo.github.io/portafolio-david/
Wireframe: https://www.figma.com/design/tu6biTJQiJgsIMtqQpnyrU
El buscador original ya está incluido con captura y demo funcional.