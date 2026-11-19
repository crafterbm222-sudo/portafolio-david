const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validarContacto } = require('../validacion');

// Almacenamiento de prueba: verifica el comportamiento de la API, no una conexión real.
const documentos = [];
let intentos = 0;
let fallar = false;
const base = require('../base-datos');
base.obtenerBaseDatos = async function () {
    if (fallar) throw new Error('Error interno que no debe exponerse');
    return { collection(nombre) {
        if (nombre === 'limites_contacto') return {
            async findOneAndUpdate() { return { intentos: ++intentos }; }
        };
        return { async insertOne(documento) {
            documentos.push(documento);
            return { insertedId: 'identificador-de-prueba' };
        } };
    } };
};
const contacto = require('../api/contacto');
const originalUri = process.env.MONGODB_URI;
const originalOrigenes = process.env.ALLOWED_ORIGINS;
const datos = { nombre: 'David', correo: 'prueba@example.com', mensaje: 'Mensaje de prueba' };

async function enviar(cambios = {}) {
    const req = {
        method: 'POST',
        headers: { origin: 'https://crafterbm222-sudo.github.io', 'content-type': 'application/json' },
        body: datos,
        ...cambios
    };
    const res = {
        codigo: 200, cabeceras: {},
        setHeader(nombre, valor) { this.cabeceras[nombre] = valor; },
        status(codigo) { this.codigo = codigo; return this; },
        json(cuerpo) { this.cuerpo = cuerpo; return this; },
        end() { return this; }
    };
    await contacto(req, res);
    return res;
}

test('validación y recorrido de contacto', async function (t) {
    process.env.ALLOWED_ORIGINS = 'https://crafterbm222-sudo.github.io';
    try {
        await t.test('rechaza espacios, objetos, campos grandes y correos inválidos', function () {
            for (const body of [null, [], { ...datos, nombre: ' ' }, { ...datos, correo: {} },
                { ...datos, correo: 'sin-correo' }, { ...datos, mensaje: 'a'.repeat(2001) }]) {
                assert.ok(validarContacto(body).error);
            }
            assert.deepEqual(validarContacto({ ...datos, nombre: ' David ', extra: 'ignorar' }).contacto, datos);
        });
        await t.test('no deja leer mensajes y rechaza otro origen', async function () {
            assert.equal((await enviar({ method: 'GET' })).codigo, 405);
            assert.equal((await enviar({ headers: { origin: 'https://otro.example' } })).codigo, 403);
            assert.equal((await enviar({ method: 'OPTIONS' })).codigo, 204);
        });
        await t.test('rechaza JSON roto, cuerpo grande y campo automático', async function () {
            assert.equal((await enviar({ body: '{no es json' })).codigo, 400);
            assert.equal((await enviar({ body: { ...datos, extra: 'a'.repeat(10001) } })).codigo, 413);
            assert.equal((await enviar({ body: { ...datos, sitio: 'bot' } })).codigo, 400);
            assert.equal((await enviar({ headers: { origin: 'https://crafterbm222-sudo.github.io' } })).codigo, 415);
        });
        await t.test('sin conexión configurada no confirma el guardado', async function () {
            delete process.env.MONGODB_URI;
            const res = await enviar();
            assert.equal(res.codigo, 503);
            assert.equal(res.cuerpo.ok, undefined);
        });
        await t.test('guarda solo los campos previstos y fecha', async function () {
            process.env.MONGODB_URI = 'valor-simulado-para-prueba';
            const res = await enviar({ body: { ...datos, administrador: true } });
            assert.equal(res.codigo, 201);
            assert.equal(res.cuerpo.ok, true);
            assert.deepEqual(Object.keys(documentos[0]).sort(), ['correo', 'fecha', 'mensaje', 'nombre']);
            assert.ok(documentos[0].fecha instanceof Date);
        });
        await t.test('limita mensajes y oculta los detalles de errores internos', async function () {
            intentos = 5;
            assert.equal((await enviar()).codigo, 429);
            assert.equal(documentos.length, 1);
            fallar = true;
            const res = await enviar();
            assert.equal(res.codigo, 503);
            assert.doesNotMatch(JSON.stringify(res.cuerpo), /Error interno/);
        });
    } finally {
        if (originalUri === undefined) delete process.env.MONGODB_URI;
        else process.env.MONGODB_URI = originalUri;
        if (originalOrigenes === undefined) delete process.env.ALLOWED_ORIGINS;
        else process.env.ALLOWED_ORIGINS = originalOrigenes;
    }
});
