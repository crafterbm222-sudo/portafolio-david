BUSCADOR DE PERSONAJES - RICK AND MORTY
Autor: David Andrés Bustamante Mesa

1. DESCRIPCIÓN
Aplicación que consulta una API pública real para buscar personajes por nombre
o ID. Los resultados se crean dinámicamente con JavaScript sin recargar la página.

2. ARCHIVOS
index.html: estructura semántica y controles de la aplicación.
styles.css: diseño, colores y adaptación a móvil y escritorio.
script.js: búsqueda, peticiones, renderizado, errores y botones.
README.txt: instrucciones y explicación del proyecto.

3. API UTILIZADA
Nombre: The Rick and Morty API.
URL base de la API: https://rickandmortyapi.com/api
Recurso de personajes: https://rickandmortyapi.com/api/character
Documentación: https://rickandmortyapi.com/documentation/
No necesita registro, contraseña ni clave de API.

Ejemplo por ID: https://rickandmortyapi.com/api/character/1
Ejemplo por nombre: https://rickandmortyapi.com/api/character?name=rick
Ejemplo de otra página: https://rickandmortyapi.com/api/character?name=rick&page=2

4. CÓMO ABRIR Y UTILIZAR
Extraer el ZIP y mantener todos los archivos en la misma carpeta.
Abrir index.html en un navegador moderno (Chrome, Edge o Firefox actualizado).
Es necesaria una conexión a Internet para las peticiones y las imágenes.
Escribir un nombre o ID y presionar Enter o el botón Buscar.
Usar Limpiar para borrar el campo y volver al estado inicial.
Personaje aleatorio consulta la API y elige un personaje al azar.
Si hay varias páginas de resultados, usar Anterior y Siguiente.
Si el navegador restringe las peticiones desde archivos locales, abrir la carpeta
con Visual Studio Code y utilizar la extensión Live Server sobre index.html.

5. DATOS MOSTRADOS
Nombre, imagen, ID, estado, especie, género, origen, ubicación y cantidad de
episodios. Los nombres y lugares se conservan como los devuelve la API.
Cada personaje se muestra en una tarjeta creada mediante document.createElement.

6. FUNCIONAMIENTO DEL CÓDIGO
El formulario utiliza submit y preventDefault para buscar sin recargar.
Una expresión regular detecta si el texto contiene solo números (un ID).
Para los nombres se usa encodeURIComponent para formar correctamente la URL.
consultarApi es una función async. await espera las Promesas de fetch y json.
Se comprueba respuesta.ok porque fetch no rechaza automáticamente los errores HTTP.
try ejecuta la consulta; catch muestra errores; finally termina el estado de carga.
Durante la consulta se desactivan los controles para evitar peticiones simultáneas.
Las consultas tienen un límite de 15 segundos para que la carga no sea indefinida.
Los datos de texto se insertan con textContent.

7. ERRORES Y ESTADOS
Campo vacío: indica que se debe escribir un nombre o ID.
Cargando: muestra Consultando personajes mientras espera la API.
Personaje inexistente (404): muestra un mensaje para intentar otra búsqueda.
Fallo HTTP, red o tiempo de espera: muestra un mensaje y permite volver a intentar.
Limpiar: devuelve el formulario y los resultados a su estado inicial.

8. FUNCIONES ADICIONALES PARA LA RÚBRICA
Personaje aleatorio: primero consulta la cantidad actual de personajes, luego
elige un ID con Math.random y realiza una segunda petición para mostrarlo.
Paginación: permite recorrer todas las coincidencias de una búsqueda por nombre.

9. PRUEBAS QUE SE PUEDEN HACER
Buscar 1: debe mostrar Rick Sanchez.
Buscar Morty: debe mostrar personajes que coincidan con ese nombre.
Buscar Rick: debe mostrar varias tarjetas y controles de páginas.
Buscar un nombre inventado: debe mostrar un error claro.
Buscar con el campo vacío: debe mostrar la validación.
Usar Limpiar y Personaje aleatorio.
Desconectar Internet e intentar buscar: debe mostrar un error de conexión.
Reducir el ancho del navegador: las tarjetas pasan de tres a dos y a una columna.

Proyecto realizado con HTML, CSS y JavaScript puro, con variables descriptivas
y comentarios para facilitar su comprensión por un estudiante principiante.
