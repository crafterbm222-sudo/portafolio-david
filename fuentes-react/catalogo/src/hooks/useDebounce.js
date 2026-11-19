import { useEffect, useState } from 'react';

// Espero 450 ms sin escribir antes de usar el valor en la petición.
export default function useDebounce(valor) {
  const [valorPausado, setValorPausado] = useState(valor);
  useEffect(() => {
    const temporizador = setTimeout(() => setValorPausado(valor), 450);
    return () => clearTimeout(temporizador);
  }, [valor]);
  return valorPausado;
}
