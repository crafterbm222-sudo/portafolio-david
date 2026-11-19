// Elementos del formulario de acceso y registro.
const pantallaLogin = document.getElementById('pantalla-login');
const aplicacion = document.getElementById('aplicacion');
const formularioLogin = document.getElementById('formulario-login');
const campoUsuario = document.getElementById('usuario');
const campoContrasena = document.getElementById('contrasena');
const mensajeLogin = document.getElementById('mensaje-login');
const tituloLogin = document.getElementById('titulo-login');
const textoIngresar = document.getElementById('texto-ingresar');
const botonCambiarModo = document.getElementById('boton-cambiar-modo');
const nombreUsuario = document.getElementById('nombre-usuario');
const botonSalir = document.getElementById('boton-salir');

// Elementos de las tareas y sus filtros.
const formularioTarea = document.getElementById('formulario-tarea');
const entradaTarea = document.getElementById('entrada-tarea');
const listaTareas = document.getElementById('lista-tareas');
const mensajeError = document.getElementById('mensaje-error');
const mensajeAccion = document.getElementById('mensaje-accion');
const contadorCaracteres = document.getElementById('contador-caracteres');
const estadoVacio = document.getElementById('estado-vacio');
const textoVacio = document.getElementById('texto-vacio');
const ayudaVacio = document.getElementById('ayuda-vacio');
const totalTareas = document.getElementById('total-tareas');
const cantidadPendientes = document.getElementById('cantidad-pendientes');
const cantidadCompletadas = document.getElementById('cantidad-completadas');
const filtroTareas = document.getElementById('filtro-tareas');
const mensajeAlmacenamiento = document.getElementById('mensaje-almacenamiento');

let modoRegistro = false;
let usuarioActual = '';
let tareas = [];

// JSON permite guardar los arreglos como texto y recuperarlos después.
function leerDatos(almacenamiento, clave, valorInicial) {
    try {
        const guardado = almacenamiento.getItem(clave);
        return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch (error) {
        avisarAlmacenamiento();
        return valorInicial;
    }
}

function guardarDatos(almacenamiento, clave, datos) {
    try {
        almacenamiento.setItem(clave, JSON.stringify(datos));
        return true;
    } catch (error) {
        avisarAlmacenamiento();
        return false;
    }
}

function avisarAlmacenamiento() {
    mensajeAlmacenamiento.textContent = 'No se pudieron leer o guardar algunos datos. Revisa los permisos de almacenamiento del navegador.';
    mensajeAlmacenamiento.classList.remove('oculto');
}

function obtenerUsuarios() {
    const usuarios = leerDatos(localStorage, 'todo-usuarios', []);
    return Array.isArray(usuarios) ? usuarios : [];
}

// El mismo formulario sirve para crear una cuenta o ingresar.
function cambiarModo() {
    modoRegistro = !modoRegistro;
    tituloLogin.textContent = modoRegistro ? 'Crear cuenta' : 'Iniciar sesión';
    textoIngresar.textContent = modoRegistro ? 'Registrarme' : 'Ingresar';
    botonCambiarModo.textContent = modoRegistro ? 'Ya tengo una cuenta' : 'Crear una cuenta';
    campoContrasena.autocomplete = modoRegistro ? 'new-password' : 'current-password';
    campoContrasena.value = '';
    mensajeLogin.textContent = '';
    campoUsuario.focus();
}

function registrarUsuario(usuario, contrasena) {
    const usuarios = obtenerUsuarios();
    const repetido = usuarios.some(function (dato) { return dato.usuario === usuario; });
    if (repetido) {
        mensajeLogin.textContent = 'Ese usuario ya existe. Elige otro nombre o inicia sesión.';
        return;
    }
    if (contrasena.length < 4) {
        mensajeLogin.textContent = 'La contraseña debe tener al menos 4 caracteres.';
        return;
    }
    usuarios.push({ usuario: usuario, contrasena: contrasena });
    if (!guardarDatos(localStorage, 'todo-usuarios', usuarios)) return;
    cambiarModo();
    mensajeLogin.textContent = 'Cuenta creada. Ahora ingresa con tus datos.';
    campoContrasena.focus();
}

function iniciarSesion(usuario, contrasena) {
    const encontrado = obtenerUsuarios().find(function (dato) {
        return dato.usuario === usuario && dato.contrasena === contrasena;
    });
    if (!encontrado) {
        mensajeLogin.textContent = 'Usuario o contraseña incorrectos.';
        campoContrasena.value = '';
        campoContrasena.focus();
        return;
    }
    // sessionStorage conserva el acceso al recargar esta pestaña.
    if (!guardarDatos(sessionStorage, 'todo-sesion', usuario)) return;
    mostrarAplicacion(usuario);
}

function mostrarAplicacion(usuario) {
    usuarioActual = usuario;
    nombreUsuario.textContent = usuario;
    campoContrasena.value = '';
    const guardadas = leerDatos(localStorage, 'todo-tareas-' + usuario, []);
    tareas = Array.isArray(guardadas) ? guardadas : [];
    // Cada usuario recuerda su propio filtro durante esta pestaña.
    const filtro = leerDatos(sessionStorage, 'todo-filtro-' + usuario, 'todas');
    filtroTareas.value = ['todas', 'pendientes', 'completadas'].includes(filtro) ? filtro : 'todas';
    pantallaLogin.classList.add('oculto');
    aplicacion.classList.remove('oculto');
    dibujarTareas();
    entradaTarea.focus();
}

function cerrarSesion() {
    sessionStorage.removeItem('todo-sesion');
    usuarioActual = '';
    tareas = [];
    listaTareas.replaceChildren();
    entradaTarea.value = '';
    contadorCaracteres.textContent = '0/80';
    mensajeError.textContent = '';
    mensajeAccion.textContent = '';
    campoUsuario.value = '';
    campoContrasena.value = '';
    mensajeLogin.textContent = '';
    aplicacion.classList.add('oculto');
    pantallaLogin.classList.remove('oculto');
    campoUsuario.focus();
}

function guardarTareas(nuevasTareas) {
    // La clave incluye el usuario: así no se mezclan sus listas.
    if (!guardarDatos(localStorage, 'todo-tareas-' + usuarioActual, nuevasTareas)) return false;
    tareas = nuevasTareas;
    dibujarTareas();
    return true;
}

function agregarTarea() {
    const texto = entradaTarea.value.trim();
    if (texto === '') {
        mensajeError.textContent = 'Escribe una tarea antes de agregarla.';
        entradaTarea.focus();
        return;
    }
    const repetida = tareas.some(function (tarea) {
        return tarea.texto.toLowerCase() === texto.toLowerCase();
    });
    if (repetida) {
        mensajeError.textContent = 'Esa tarea ya está en tu lista.';
        return;
    }
    const nueva = {
        id: Date.now().toString() + '-' + Math.random().toString(16).slice(2),
        texto: texto,
        completada: false
    };
    if (!guardarTareas([...tareas, nueva])) return;
    entradaTarea.value = '';
    contadorCaracteres.textContent = '0/80';
    mensajeError.textContent = '';
    mensajeAccion.textContent = filtroTareas.value === 'completadas'
        ? 'Tarea agregada. Puedes verla en Todas o Pendientes.' : 'Tarea agregada.';
    entradaTarea.focus();
}

function cambiarEstado(id) {
    const nuevas = tareas.map(function (tarea) {
        if (tarea.id === id) return { ...tarea, completada: !tarea.completada };
        return tarea;
    });
    if (guardarTareas(nuevas)) mensajeAccion.textContent = 'Estado de la tarea actualizado.';
}

function eliminarTarea(id) {
    const nuevas = tareas.filter(function (tarea) { return tarea.id !== id; });
    if (guardarTareas(nuevas)) mensajeAccion.textContent = 'Tarea eliminada.';
}

// Genera una fila desde el dato guardado. textContent evita interpretar HTML del usuario.
function crearFila(tarea) {
    const fila = document.createElement('li');
    fila.className = 'tarea animate__animated animate__fadeInUp';
    fila.classList.toggle('completada', tarea.completada);
    const casilla = document.createElement('input');
    casilla.type = 'checkbox';
    casilla.checked = tarea.completada;
    casilla.setAttribute('aria-label', (tarea.completada ? 'Marcar pendiente: ' : 'Completar: ') + tarea.texto);
    casilla.addEventListener('change', function () { cambiarEstado(tarea.id); });
    const texto = document.createElement('span');
    texto.className = 'texto-tarea';
    texto.textContent = tarea.texto;
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton-eliminar';
    boton.setAttribute('aria-label', 'Eliminar: ' + tarea.texto);
    boton.innerHTML = '<i class="fa-solid fa-trash" aria-hidden="true"></i>';
    boton.addEventListener('click', function () { eliminarTarea(tarea.id); });
    fila.append(casilla, texto, boton);
    return fila;
}

function dibujarTareas() {
    const visibles = tareas.filter(function (tarea) {
        if (filtroTareas.value === 'pendientes') return !tarea.completada;
        if (filtroTareas.value === 'completadas') return tarea.completada;
        return true;
    });
    listaTareas.replaceChildren();
    visibles.forEach(function (tarea) { listaTareas.appendChild(crearFila(tarea)); });
    const completadas = tareas.filter(function (tarea) { return tarea.completada; }).length;
    cantidadCompletadas.textContent = completadas;
    cantidadPendientes.textContent = tareas.length - completadas;
    totalTareas.textContent = tareas.length === 1 ? '1 tarea' : tareas.length + ' tareas';
    estadoVacio.classList.toggle('oculto', visibles.length > 0);
    textoVacio.textContent = tareas.length === 0 ? 'Todavía no tienes tareas.' : 'No hay tareas con este filtro.';
    ayudaVacio.textContent = tareas.length === 0 ? 'Escribe una arriba para comenzar.' : 'Prueba con Todas para ver tu lista.';
}

formularioLogin.addEventListener('submit', function (evento) {
    evento.preventDefault();
    // El usuario no distingue mayúsculas; la contraseña sí.
    const usuario = campoUsuario.value.trim().toLowerCase();
    const contrasena = campoContrasena.value;
    if (usuario === '' || contrasena.trim() === '') {
        mensajeLogin.textContent = 'Completa el usuario y la contraseña.';
        return;
    }
    if (modoRegistro) registrarUsuario(usuario, contrasena);
    else iniciarSesion(usuario, contrasena);
});

botonCambiarModo.addEventListener('click', cambiarModo);
botonSalir.addEventListener('click', cerrarSesion);
// Un solo submit admite botón y Enter, sin agregar dos veces.
formularioTarea.addEventListener('submit', function (evento) {
    evento.preventDefault();
    agregarTarea();
});
entradaTarea.addEventListener('input', function () {
    contadorCaracteres.textContent = entradaTarea.value.length + '/80';
    mensajeError.textContent = '';
});
filtroTareas.addEventListener('change', function () {
    guardarDatos(sessionStorage, 'todo-filtro-' + usuarioActual, filtroTareas.value);
    dibujarTareas();
    mensajeAccion.textContent = 'Filtro aplicado: ' + filtroTareas.selectedOptions[0].textContent + '.';
});

// Al recargar se recupera la sesión solo si corresponde a una cuenta registrada.
const sesion = leerDatos(sessionStorage, 'todo-sesion', '');
if (obtenerUsuarios().some(function (dato) { return dato.usuario === sesion; })) {
    mostrarAplicacion(sesion);
} else {
    campoUsuario.focus();
}
