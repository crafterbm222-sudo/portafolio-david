// Revisamos en el servidor aunque el navegador también valide el formulario.
function validarContacto(datos) {
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        return { error: 'Los datos del formulario no son válidos.' };
    }
    if (typeof datos.nombre !== 'string' || typeof datos.correo !== 'string' ||
        typeof datos.mensaje !== 'string') {
        return { error: 'Completa nombre, correo y mensaje.' };
    }
    const nombre = datos.nombre.trim();
    const correo = datos.correo.trim();
    const mensaje = datos.mensaje.trim();
    if (!nombre || !correo || !mensaje) {
        return { error: 'No se aceptan campos vacíos o con solo espacios.' };
    }
    if (nombre.length > 80 || correo.length > 150 || mensaje.length > 2000) {
        return { error: 'El nombre, correo o mensaje supera el tamaño permitido.' };
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
        return { error: 'Escribe un correo válido.' };
    }
    // Solo guardamos estos campos; ignoramos los demás datos recibidos.
    return { contacto: { nombre, correo, mensaje } };
}

module.exports = { validarContacto };
