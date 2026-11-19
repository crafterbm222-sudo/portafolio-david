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

// Valida los datos y prepara un correo. No simula un envío que no ocurrió.
const formulario = document.getElementById('formulario');
const respuesta = document.getElementById('respuesta');
formulario.addEventListener('submit', function (evento) {
    evento.preventDefault();
    const nombre = formulario.elements.nombre.value.trim();
    const correo = formulario.elements.email.value.trim();
    const mensaje = formulario.elements.mensaje.value.trim();
    if (!nombre || !correo || !mensaje) {
        respuesta.textContent = 'Completa los campos. No se aceptan datos que solo tengan espacios.';
        return;
    }
    const asunto = 'Contacto desde el portafolio: ' + nombre;
    const cuerpo = 'Nombre: ' + nombre + '\nCorreo: ' + correo + '\n\n' + mensaje;
    const destino = 'mailto:david.bustamante251@tau.usbmed.edu.co?subject=' + encodeURIComponent(asunto) + '&body=' + encodeURIComponent(cuerpo);
    respuesta.textContent = 'El mensaje está preparado. Revisa tu aplicación de correo y pulsa Enviar allí. Si no se abre, usa el enlace de correo de esta sección.';
    window.location.href = destino;
});
