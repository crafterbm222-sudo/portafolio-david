import { useEffect, useRef } from 'react';

// busqueda es el texto actual; alCambiar entrega el texto nuevo a App.
export default function BarraBusqueda({ busqueda, alCambiar }) {
  // El ref permite enfocar el input sin guardar un elemento HTML en el estado.
  const referenciaInput = useRef(null);
  useEffect(() => {
    referenciaInput.current.focus();
  }, []);
  return (
    <div className="campo">
      <label htmlFor="busqueda">Buscar producto</label>
      <input id="busqueda" ref={referenciaInput} type="search" value={busqueda}
        onChange={(evento) => alCambiar(evento.target.value)} placeholder="Ejemplo: apple, chair, perfume…" />
      <small>La API tiene nombres en inglés. La búsqueda espera 450 ms al escribir.</small>
    </div>
  );
}
