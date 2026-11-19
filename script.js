// Abre y cierra el menú en celular.
const botonMenu = document.getElementById('boton-menu');
const enlaces = document.getElementById('enlaces');
botonMenu.addEventListener('click', function () {
    const abierto = enlaces.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', abierto);
});
enlaces.querySelectorAll('a').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
        enlaces.classList.remove('abierto');
        botonMenu.setAttribute('aria-expanded', 'false');
    });
});

// Si la API está conectada, guarda en MongoDB. Si no, prepara un correo.
const formulario = document.getElementById('formulario');
const respuesta = document.getElementById('respuesta');
const botonEnviar = formulario.querySelector('button[type="submit"]');
const urlContacto = window.CONTACTO_URL || '';
let contactoGuardado = null;

// Web3Forms permite el envío desde el navegador con su clave pública.
async function enviarAviso(datos, referencia, signal) {
    if (!window.CLAVE_FORMULARIO) throw new Error('El correo todavía no está configurado.');
    const peticion = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
            access_key: window.CLAVE_FORMULARIO,
            from_name: 'Portafolio de David',
            subject: 'Nuevo mensaje de tu portafolio',
            name: datos.nombre,
            email: datos.correo,
            message: datos.mensaje,
            referencia,
            botcheck: false
        }),
        signal
    });
    const respuestaCorreo = await peticion.json();
    if (!peticion.ok || respuestaCorreo.success !== true) {
        throw new Error('No se pudo enviar el aviso al correo.');
    }
}
if (urlContacto) {
    botonEnviar.textContent = 'Enviar mensaje';
    formulario.querySelector('.ayuda').textContent =
        'Tu mensaje se guardará y se enviará un aviso a mi correo personal. Tus datos no se publicarán en la página.';
}

formulario.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    if (botonEnviar.disabled) return;
    const nombre = formulario.elements.nombre.value.trim();
    const correo = formulario.elements.email.value.trim();
    const mensaje = formulario.elements.mensaje.value.trim();
    if (!nombre || !correo || !mensaje) {
        respuesta.dataset.estado = 'error';
        respuesta.textContent = 'Completa los campos. No se aceptan datos que solo tengan espacios.';
        return;
    }
    if (urlContacto) {
        const datosFormulario = { nombre, correo, mensaje, sitio: formulario.elements.sitio.value };
        const firma = JSON.stringify(datosFormulario);
        let correoEnviado = false;
        botonEnviar.disabled = true;
        botonEnviar.textContent = 'Enviando…';
        formulario.setAttribute('aria-busy', 'true');
        respuesta.dataset.estado = '';
        respuesta.textContent = 'Guardando tu mensaje…';
        const control = new AbortController();
        const espera = setTimeout(function () { control.abort(); }, 30000);
        try {
            // Al reintentar el aviso, evitamos volver a guardar el mismo contacto.
            if (!contactoGuardado || contactoGuardado.firma !== firma) {
                const peticion = await fetch(urlContacto, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosFormulario),
                    signal: control.signal
                });
                const datos = await peticion.json();
                if (!peticion.ok || datos.ok !== true) {
                    throw new Error(datos.error || 'No se pudo guardar el mensaje.');
                }
                contactoGuardado = { firma, id: datos.id };
            }
            respuesta.textContent = 'Enviando el aviso al correo…';
            await enviarAviso(datosFormulario, contactoGuardado.id, control.signal);
            correoEnviado = true;
            contactoGuardado = null;
            respuesta.dataset.estado = 'correcto';
            respuesta.textContent = 'Tu mensaje quedó guardado y el aviso por correo fue enviado. ¡Gracias!';
            formulario.reset();
        } catch (error) {
            respuesta.dataset.estado = 'error';
            respuesta.textContent = contactoGuardado && contactoGuardado.firma === firma
                ? 'Tu mensaje quedó guardado, pero no pudimos enviar el aviso al correo. Pulsa de nuevo para reintentar el aviso.'
                : error.name === 'AbortError' || error instanceof TypeError
                ? 'No pudimos confirmar el envío. Tus datos siguen aquí. Puedes reintentar o usar el enlace de correo.'
                : error.message;
        } finally {
            clearTimeout(espera);
            botonEnviar.disabled = false;
            botonEnviar.textContent = !correoEnviado && contactoGuardado && contactoGuardado.firma === firma
                ? 'Reintentar aviso' : 'Enviar mensaje';
            formulario.removeAttribute('aria-busy');
        }
        return;
    }
    const asunto = 'Contacto desde el portafolio: ' + nombre;
    const cuerpo = 'Nombre: ' + nombre + '\nCorreo: ' + correo + '\n\n' + mensaje;
    const destino = 'mailto:crafterbm222@gmail.com?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    respuesta.textContent = 'El mensaje está preparado. Revisa tu aplicación de correo y pulsa Enviar allí. Si no se abre, usa el enlace de correo de esta sección.';
    respuesta.dataset.estado = '';
    window.location.href = destino;
});
