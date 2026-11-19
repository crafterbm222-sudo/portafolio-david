import { useEffect, useState } from 'react';

// Recibe una URL (o null para no pedir nada).
// Devuelve los datos y los estados de carga y error para reutilizar la petición.
export default function useFetch(url) {
  const [respuesta, setRespuesta] = useState({ url: null, datos: null, cargando: false, error: '' });

  useEffect(() => {
    if (!url) {
      setRespuesta({ url: null, datos: null, cargando: false, error: '' });
      return;
    }
    const controlador = new AbortController();
    setRespuesta({ url, datos: null, cargando: true, error: '' });

    async function cargar() {
      try {
        const respuestaHttp = await fetch(url, { signal: controlador.signal });
        if (!respuestaHttp.ok) throw new Error('El servidor respondió con el código ' + respuestaHttp.status + '.');
        const datos = await respuestaHttp.json();
        if (!controlador.signal.aborted) setRespuesta({ url, datos, cargando: false, error: '' });
      } catch (error) {
        // Cancelar una petición no significa que falló la conexión.
        if (error.name !== 'AbortError' && !controlador.signal.aborted) {
          setRespuesta({ url, datos: null, cargando: false, error: 'No fue posible cargar los productos. Revisa tu conexión. ' + error.message });
        }
      }
    }
    cargar();
    // Cancelo al cambiar la URL y al desmontar: una respuesta vieja no pisa la nueva.
    return () => controlador.abort();
  }, [url]);

  // Al cambiar la URL, oculto inmediatamente los datos de la petición anterior.
  if (!url) return { datos: null, cargando: false, error: '' };
  if (respuesta.url !== url) return { datos: null, cargando: true, error: '' };
  return { datos: respuesta.datos, cargando: respuesta.cargando, error: respuesta.error };
}
