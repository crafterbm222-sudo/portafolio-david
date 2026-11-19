// El destino se configura en el servidor, nunca se toma del formulario.
async function enviarAviso(contacto, identificador) {
    const destino = process.env.CONTACT_EMAIL || 'crafterbm222@gmail.com';
    try {
        const respuesta = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(destino), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Referer: 'https://crafterbm222-sudo.github.io/portafolio-david/'
            },
            body: JSON.stringify({
                name: contacto.nombre,
                email: contacto.correo,
                message: contacto.mensaje,
                referencia: identificador,
                _subject: 'Nuevo mensaje de tu portafolio',
                _url: 'https://crafterbm222-sudo.github.io/portafolio-david/',
                _template: 'table',
                _captcha: 'false'
            }),
            signal: AbortSignal.timeout(12000)
        });
        const datos = await respuesta.json();
        if (!respuesta.ok || (datos.success !== true && datos.success !== 'true')) {
            return 'pendiente';
        }
        // Aceptado por el servicio no equivale a entrega confirmada en la bandeja.
        return 'aceptado';
    } catch {
        return 'pendiente';
    }
}

module.exports = { enviarAviso };
