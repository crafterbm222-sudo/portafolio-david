const { test } = require('node:test');
const assert = require('node:assert/strict');
const { enviarAviso } = require('../correo');

test('envío del aviso por correo', async function (t) {
    const originalFetch = global.fetch;
    const destinoOriginal = process.env.CONTACT_EMAIL;
    process.env.CONTACT_EMAIL = 'crafterbm222@gmail.com';
    const contacto = { nombre: 'David', correo: 'visitante@example.com', mensaje: 'Hola' };
    try {
        await t.test('usa destino fijo y conserva el correo del visitante para responder', async function () {
            global.fetch = async function (url, opciones) {
                assert.equal(url, 'https://formsubmit.co/ajax/crafterbm222%40gmail.com');
                const cuerpo = JSON.parse(opciones.body);
                assert.equal(cuerpo.email, contacto.correo);
                assert.equal(cuerpo.message, contacto.mensaje);
                assert.equal(cuerpo.referencia, 'prueba-1');
                assert.equal(cuerpo._cc, undefined);
                assert.equal(cuerpo._url, 'https://crafterbm222-sudo.github.io/portafolio-david/');
                return { ok: true, async json() { return { success: 'true' }; } };
            };
            assert.equal(await enviarAviso(contacto, 'prueba-1'), 'aceptado');
        });
        await t.test('no confirma correo si falta activación o falla el servicio', async function () {
            global.fetch = async function () {
                return { ok: true, async json() { return { success: 'false', message: 'Activation required' }; } };
            };
            assert.equal(await enviarAviso(contacto, 'prueba-2'), 'pendiente');
            global.fetch = async function () { throw new Error('Sin conexión'); };
            assert.equal(await enviarAviso(contacto, 'prueba-3'), 'pendiente');
        });
    } finally {
        global.fetch = originalFetch;
        if (destinoOriginal === undefined) delete process.env.CONTACT_EMAIL;
        else process.env.CONTACT_EMAIL = destinoOriginal;
    }
});
