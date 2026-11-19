// Servidor pequeño para probar la API sin Vercel.
const http = require('node:http');
const contacto = require('./api/contacto');

http.createServer(async function (req, res) {
    res.status = function (codigo) { res.statusCode = codigo; return res; };
    res.json = function (datos) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.end(JSON.stringify(datos));
    };
    if (req.url !== '/api/contacto') return res.status(404).json({ error: 'Ruta no encontrada.' });
    let cuerpo = '';
    for await (const parte of req) {
        cuerpo += parte.toString();
        if (Buffer.byteLength(cuerpo) > 10000) {
            return res.status(413).json({ error: 'El mensaje es demasiado grande.' });
        }
    }
    req.body = cuerpo;
    await contacto(req, res);
}).listen(3001, '127.0.0.1', function () {
    console.log('API local: http://127.0.0.1:3001/api/contacto');
});
