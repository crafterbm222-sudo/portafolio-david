// Guardamos los elementos HTML que vamos a utilizar.
const formulario = document.getElementById("formulario");
const campoBusqueda = document.getElementById("busqueda");
const botonBuscar = document.getElementById("boton-buscar");
const botonLimpiar = document.getElementById("boton-limpiar");
const botonAleatorio = document.getElementById("boton-aleatorio");
const resultados = document.getElementById("resultados");
const estadoInicial = document.getElementById("estado-inicial");
const mensajeCarga = document.getElementById("mensaje-carga");
const mensajeError = document.getElementById("mensaje-error");
const resumen = document.getElementById("resumen");
const seccionResultados = document.querySelector(".seccion-resultados");
const paginacion = document.getElementById("paginacion");
const botonAnterior = document.getElementById("boton-anterior");
const botonSiguiente = document.getElementById("boton-siguiente");
const numeroPagina = document.getElementById("numero-pagina");

const urlBase = "https://rickandmortyapi.com/api/character";
let paginaActual = 1;
let totalPaginas = 1;
let nombreBuscado = "";

// Activa el mensaje de carga y evita peticiones repetidas mientras esperamos.
function cambiarCarga(cargando) {
    mensajeCarga.classList.toggle("oculto", !cargando);
    seccionResultados.setAttribute("aria-busy", String(cargando));
    botonBuscar.disabled = cargando;
    botonAleatorio.disabled = cargando;
    botonLimpiar.disabled = cargando;
    campoBusqueda.disabled = cargando;
    botonAnterior.disabled = cargando || paginaActual === 1;
    botonSiguiente.disabled = cargando || paginaActual === totalPaginas;
}

// Crea una fila de datos usando el DOM. textContent muestra el texto de forma segura.
function agregarDato(lista, titulo, valor) {
    const fila = document.createElement("div");
    fila.className = "dato";
    const etiqueta = document.createElement("dt");
    etiqueta.textContent = titulo;
    const contenido = document.createElement("dd");
    contenido.textContent = valor;
    fila.appendChild(etiqueta);
    fila.appendChild(contenido);
    lista.appendChild(fila);
}

// Renderiza las tarjetas dinámicamente, sin recargar la página.
function mostrarPersonajes(personajes) {
    const estados = { Alive: "Vivo", Dead: "Muerto", unknown: "Desconocido" };
    const generos = { Male: "Masculino", Female: "Femenino", Genderless: "Sin género", unknown: "Desconocido" };

    for (const personaje of personajes) {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta";
        const imagen = document.createElement("img");
        imagen.src = personaje.image;
        imagen.alt = "Imagen de " + personaje.name;
        imagen.loading = "lazy";
        // Si una imagen falla, informamos sin afectar los demás datos.
        imagen.addEventListener("error", function () {
            imagen.alt = "Imagen no disponible: " + personaje.name;
        });
        const informacion = document.createElement("div");
        informacion.className = "informacion";
        const identificador = document.createElement("p");
        identificador.className = "identificador";
        identificador.textContent = "PERSONAJE #" + personaje.id;
        const nombre = document.createElement("h3");
        nombre.textContent = personaje.name;
        const datos = document.createElement("dl");
        agregarDato(datos, "Estado", estados[personaje.status] || personaje.status);
        agregarDato(datos, "Especie", personaje.species);
        agregarDato(datos, "Género", generos[personaje.gender] || personaje.gender);
        agregarDato(datos, "Origen", personaje.origin.name);
        agregarDato(datos, "Ubicación", personaje.location.name);
        agregarDato(datos, "Episodios", personaje.episode.length);
        informacion.appendChild(identificador);
        informacion.appendChild(nombre);
        informacion.appendChild(datos);
        tarjeta.appendChild(imagen);
        tarjeta.appendChild(informacion);
        resultados.appendChild(tarjeta);
    }
}

// async/await espera las Promesas que devuelven fetch y response.json.
// try/catch/finally maneja éxito, errores y el fin de la carga.
async function consultarApi(url, aleatorio = false) {
    resultados.replaceChildren();
    resumen.textContent = "";
    estadoInicial.classList.add("oculto");
    mensajeError.classList.add("oculto");
    paginacion.classList.add("oculto");
    cambiarCarga(true);

    try {
        let respuesta = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (respuesta.status === 404) {
            throw new Error("No encontramos personajes con esa búsqueda. Prueba otro nombre o ID.");
        }
        if (!respuesta.ok) {
            throw new Error("La API no pudo responder. Intenta de nuevo más tarde.");
        }
        let datos = await respuesta.json();

        // Función adicional: obtiene la cantidad real y elige un ID al azar.
        if (aleatorio) {
            const idAleatorio = Math.floor(Math.random() * datos.info.count) + 1;
            respuesta = await fetch(urlBase + "/" + idAleatorio, { signal: AbortSignal.timeout(15000) });
            if (!respuesta.ok) {
                throw new Error("No se pudo cargar el personaje aleatorio. Intenta de nuevo.");
            }
            datos = await respuesta.json();
            campoBusqueda.value = String(idAleatorio);
        }

        // El ID devuelve un objeto; la búsqueda por nombre devuelve una lista.
        if (datos.results) {
            mostrarPersonajes(datos.results);
            totalPaginas = datos.info.pages;
            resumen.textContent = datos.info.count + " coincidencias · " + datos.results.length + " en esta página";
            numeroPagina.textContent = "Página " + paginaActual + " de " + totalPaginas;
            paginacion.classList.toggle("oculto", totalPaginas <= 1);
        } else {
            mostrarPersonajes([datos]);
            totalPaginas = 1;
            resumen.textContent = "1 personaje encontrado";
        }
    } catch (error) {
        if (error.name === "TypeError") {
            mensajeError.textContent = "No se pudo conectar con la API. Revisa tu conexión a Internet e intenta de nuevo.";
        } else if (error.name === "TimeoutError") {
            mensajeError.textContent = "La API está tardando demasiado. Intenta de nuevo.";
        } else {
            mensajeError.textContent = error.message;
        }
        mensajeError.classList.remove("oculto");
    } finally {
        cambiarCarga(false);
    }
}

// El evento submit permite buscar tanto con Enter como con el botón.
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();
    const texto = campoBusqueda.value.trim();
    if (texto === "") {
        limpiarResultados();
        mensajeError.textContent = "Escribe un nombre o ID antes de buscar.";
        mensajeError.classList.remove("oculto");
        return;
    }
    paginaActual = 1;
    totalPaginas = 1;
    if (/^\d+$/.test(texto)) {
        consultarApi(urlBase + "/" + texto);
    } else {
        nombreBuscado = texto;
        consultarApi(urlBase + "?name=" + encodeURIComponent(nombreBuscado));
    }
});

function limpiarResultados() {
    campoBusqueda.value = "";
    resultados.replaceChildren();
    resumen.textContent = "";
    mensajeError.textContent = "";
    mensajeError.classList.add("oculto");
    estadoInicial.classList.remove("oculto");
    paginacion.classList.add("oculto");
    paginaActual = 1;
    totalPaginas = 1;
    nombreBuscado = "";
    campoBusqueda.focus();
}

botonLimpiar.addEventListener("click", limpiarResultados);
botonAleatorio.addEventListener("click", function () {
    paginaActual = 1;
    consultarApi(urlBase, true);
});

// Función adicional: recorrer todas las páginas de una búsqueda por nombre.
botonAnterior.addEventListener("click", function () {
    paginaActual--;
    consultarApi(urlBase + "?name=" + encodeURIComponent(nombreBuscado) + "&page=" + paginaActual);
});
botonSiguiente.addEventListener("click", function () {
    paginaActual++;
    consultarApi(urlBase + "?name=" + encodeURIComponent(nombreBuscado) + "&page=" + paginaActual);
});
