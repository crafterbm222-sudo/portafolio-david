const { MongoClient } = require('mongodb');
let conexion;

async function obtenerBaseDatos() {
    if (!process.env.MONGODB_URI) {
        throw new Error('Falta configurar la conexión del servidor.');
    }
    // Reutilizamos la conexión entre mensajes para no abrir una por cada visita.
    if (!conexion) {
        const cliente = new MongoClient(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
            socketTimeoutMS: 5000,
            maxPoolSize: 5
        });
        conexion = cliente.connect().then(async function () {
            const db = cliente.db(process.env.MONGODB_DB || 'portafolio');
            // MongoDB borra automáticamente los contadores temporales vencidos.
            await db.collection('limites_contacto').createIndex({ expira: 1 }, { expireAfterSeconds: 0 });
            await db.collection('contactos').createIndex({ fecha: -1 });
            return cliente;
        }).catch(async function (error) {
            conexion = null;
            await cliente.close();
            throw error;
        });
    }
    const cliente = await conexion;
    return cliente.db(process.env.MONGODB_DB || 'portafolio');
}

module.exports = { obtenerBaseDatos };
