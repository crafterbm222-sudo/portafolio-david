PROYECTO: MI LISTA DE TAREAS
Autor: David Andrés Bustamante Mesa
================================

DESCRIPCIÓN
Aplicación de tareas hecha con HTML, CSS y JavaScript. Permite registrar
usuarios, iniciar y cerrar sesión, y agregar, completar y eliminar tareas.
Cada cuenta tiene su propia lista que se conserva al recargar.
Se mantiene el diseño del trabajo original.

CÓMO ABRIR
1. Extraer todo el ZIP en una carpeta.
2. Abrir index.html con doble clic en un navegador actualizado.
3. Este proyecto NO necesita Node.js, npm ni instalar paquetes.
4. Internet permite cargar los iconos y animaciones desde sus CDN.
   Las funciones de tareas no dependen de esas librerías.

REGISTRO E INICIO DE SESIÓN
1. Pulsar Crear una cuenta.
2. Escribir un usuario y una contraseña de al menos 4 caracteres.
3. Pulsar Registrarme. No se aceptan usuarios repetidos ni campos vacíos.
4. Ingresar con los datos que se acaban de registrar.
5. Para probar la separación de listas, cerrar sesión, registrar otra cuenta
   y agregar otras tareas. Al volver a la primera cuenta, recupera sus tareas.
No existen usuarios ni contraseñas preestablecidos.
Los nombres se guardan sin espacios en los extremos y en minúsculas para
no duplicar cuentas como David y david. La contraseña distingue mayúsculas.

CÓMO USAR LAS TAREAS
- Escribir una tarea y pulsar Agregar o Enter.
- No se permiten tareas vacías, solo espacios ni textos repetidos en esa cuenta.
- El campo se limpia al agregar y tiene un contador de hasta 80 caracteres.
- Marcar la casilla completa la tarea: cambia de color y se tacha el texto.
- Desmarcarla devuelve la tarea a pendiente.
- La papelera elimina solo la tarea elegida y muestra una confirmación visual.
- El selector permite ver Todas, Pendientes o Completadas.
- Los contadores muestran el total de la lista aunque haya un filtro aplicado.
- Cerrar sesión vuelve al acceso sin borrar la cuenta ni las tareas.

USO DE WEB STORAGE
localStorage mantiene los datos que deben durar entre visitas:
  todo-usuarios: arreglo de usuarios y contraseñas registrados.
  todo-tareas-NOMBRE: arreglo de tareas de esa cuenta.
Cada tarea tiene id, texto y completada. Las acciones guardan primero los
cambios y después dibujan la lista desde el arreglo.

sessionStorage mantiene información temporal de la pestaña:
  todo-sesion: nombre del usuario que inició sesión.
  todo-filtro-NOMBRE: último filtro elegido por esa cuenta en esa pestaña.
Al recargar se recuperan sesión y filtro. Cerrar sesión elimina el acceso.
La sesión NO se guarda en localStorage. Las cuentas y tareas permanecen aunque
se termine la sesión de la pestaña. Los navegadores pueden restaurar también
sessionStorage cuando restauran pestañas anteriores.

Los datos pertenecen al navegador y al origen/ruta utilizados. Para recuperarlos,
abrir el mismo archivo con el mismo navegador. Borrar los datos del sitio borra
cuentas y tareas; el proyecto no utiliza una base de datos externa.

ALCANCE DEL ACCESO
El registro es un ejercicio académico sin servidor. Las contraseñas se guardan
en el navegador como pide el ejercicio y pueden verse desde sus herramientas.
No usar contraseñas personales ni esta solución como autenticación de un sitio
real. La separación de listas organiza los datos; no ofrece seguridad de servidor.

ARCHIVOS
index.html: estructura, formularios y enlaces a librerías.
styles.css: diseño original y ajustes para registro, filtros y celulares.
script.js: datos, almacenamiento, manipulación del DOM y eventos.
capturas/: ejemplos de la aplicación funcionando.
README.txt: descripción e instrucciones.

LIBRERÍAS EXTERNAS
1. Font Awesome 6.5.2: iconos de acceso, agregar y papelera.
   https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css
2. Animate.css 4.1.1: animación de entrada de la pantalla y las tareas.
   https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css
Se respeta la preferencia del usuario de reducir animaciones.

EVENTOS Y FUNCIONES
submit: acceso/registro y agregar por botón o Enter sin duplicar eventos.
click: cambiar de modo, cerrar sesión y eliminar una tarea.
change: marcar/desmarcar y cambiar el filtro.
input: actualizar el contador y limpiar el error al volver a escribir.
registrarUsuario / iniciarSesion: guardan y verifican las cuentas registradas.
guardarTareas: sincroniza el arreglo con localStorage para la cuenta activa.
crearFila / dibujarTareas: muestran tareas con createElement y textContent.
leerDatos / guardarDatos: convierten JSON y avisan si falla el almacenamiento.

CAPTURAS
capturas/01-inicio.png: pantalla para ingresar o crear una cuenta.
capturas/02-tareas-escritorio.png: tareas pendientes y completadas.
capturas/03-tareas-celular.png: adaptación a una pantalla de 360 px.
Las cuentas de prueba de las capturas no se incluyen en el código ni en el ZIP.

PRUEBA MANUAL DE LA CORRECCIÓN
1. Registrar dos usuarios diferentes con sus propias contraseñas.
2. Intentar repetir un usuario: debe rechazarse.
3. Probar una contraseña incorrecta: no debe permitir ingresar.
4. Agregar dos tareas a la primera cuenta, completar una y recargar.
5. Elegir Completadas y recargar: deben mantenerse el filtro y el estado.
6. Cerrar sesión y entrar a la segunda cuenta: no debe mostrar tareas de la primera.
7. Agregar una tarea a la segunda, volver a la primera y revisar su lista original.
8. Desmarcar y eliminar tareas, recargar y comprobar que se conservan los cambios.
9. Probar espacios en blanco, texto repetido, botón y Enter.
10. Revisar en una ventana estrecha que no haya desbordamiento horizontal.
