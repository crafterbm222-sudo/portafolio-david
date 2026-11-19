const { createHash } = require('node:crypto');
const { validarContacto } = require('../validacion');
const { obtenerBaseDatos } = require('../base-datos');
const { enviarAviso } = require('../correo');

module.exports = async function contacto(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Vary', 'Origin');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const origenes = (process.env.ALLOWED_ORIGINS ||
        'https://crafterbm222-sudo.github.io').split(',').map(function (origen) {
        return origen.trim();
    });
    if (!origenes.includes(req.headers.origin)) {
        return res.status(403).json({ error: 'Origen no permitido.' });
    }
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST, OPTIONS');
        return res.status(405).json({ error: 'Usa el formulario para enviar un mensaje.' });
    }
    if (!(req.headers['content-type'] || '').startsWith('application/json')) {
        return res.status(415).json({ error: 'Formato no permitido.' });
    }
    let datos = req.body;
    try {
        if (typeof datos === 'string') datos = JSON.parse(datos);
        if (Buffer.byteLength(JSON.stringify(datos) || '') > 10000) {
            return res.status(413).json({ error: 'El mensaje es demasiado grande.' });
        }
    } catch {
        return res.status(400).json({ error: 'Los datos no son válidos.' });
    }
    // Campo oculto que ayuda a descartar envíos automáticos básicos.
    if (datos && datos.sitio) {
        return res.status(400).json({ error: 'No se pudo aceptar el formulario.' });
    }
    const resultado = validarContacto(datos);
    if (resultado.error) return res.status(400).json({ error: resultado.error });
    if (!process.env.MONGODB_URI) {
        return res.status(503).json({ error: 'El formulario aún no está disponible. Usa el enlace de correo.' });
    }
    try {
        const db = await obtenerBaseDatos();
        // Máximo cinco intentos por dirección en cada bloque de diez minutos.
        // El hash evita guardar la dirección IP en texto dentro de MongoDB.
        const ip = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'desconocida')
            .split(',')[0].trim();
        const hash = createHash('sha256').update(ip + process.env.MONGODB_URI).digest('hex');
        const bloque = Math.floor(Date.now() / 600000);
        const limite = await db.collection('limites_contacto').findOneAndUpdate(
            { _id: hash + ':' + bloque },
            { $inc: { intentos: 1 }, $setOnInsert: { expira: new Date(Date.now() + 1200000) } },
            { upsert: true, returnDocument: 'after' }
        );
        if (limite.intentos > 5) {
            res.setHeader('Retry-After', '600');
            return res.status(429).json({ error: 'Has enviado varios mensajes. Espera diez minutos.' });
        }
        const guardado = await db.collection('contactos').insertOne({
            ...resultado.contacto,
            fecha: new Date(),
            avisoCorreo: 'pendiente'
        });
        const id = guardado.insertedId.toString();
        const avisoCorreo = await enviarAviso(resultado.contacto, id);
        try {
            await db.collection('contactos').updateOne(
                { _id: guardado.insertedId },
                { $set: { avisoCorreo } }
            );
        } catch {
            // El contacto ya está guardado; no pedir al visitante que lo duplique.
        }
        return res.status(201).json({ ok: true, id, avisoCorreo });
    } catch {
        // No mostramos errores internos que puedan contener datos de conexión.
        return res.status(503).json({ error: 'No se pudo guardar el mensaje. Inténtalo más tarde o usa el correo.' });
    }
};
