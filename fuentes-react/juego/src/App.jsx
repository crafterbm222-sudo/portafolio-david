import { useRef, useState } from 'react';
import JuegoReaccion from './components/JuegoReaccion';
import FormularioTiempo from './components/FormularioTiempo';
import Ranking from './components/Ranking';

// Sin props. El ranking vive aquí para que reiniciar el juego no lo borre.
export default function App() {
  const [tiempoActual, setTiempoActual] = useState(null);
  const [nombre, setNombre] = useState('');
  const [guardado, setGuardado] = useState(false);
  const [tiempos, setTiempos] = useState([]);
  const siguienteId = useRef(1);
  const registroActual = useRef(null);

  function recibirTiempo(tiempo) {
    registroActual.current = { id: siguienteId.current++, tiempo };
    setTiempoActual(tiempo);
    setGuardado(false);
  }

  function guardarTiempo() {
    if (!nombre.trim() || !registroActual.current || guardado) return;
    const registro = { ...registroActual.current, nombre: nombre.trim() };
    // El ID identifica el intento: dos personas pueden tener los mismos milisegundos.
    setTiempos((anteriores) => anteriores.some((dato) => dato.id === registro.id)
      ? anteriores : [...anteriores, registro]);
    setGuardado(true);
  }

  function limpiarResultado() {
    // Limpio el formulario y el resultado, pero nunca cambio tiempos.
    registroActual.current = null;
    setTiempoActual(null);
    setNombre('');
    setGuardado(false);
  }

  return (
    <main><header><p className="etiqueta">EJERCICIO DE CLASE</p><h1>Juego de reacción</h1>
      <p>Espera a que la zona diga ¡AHORA! y cambie a verde. Después pulsa lo más rápido posible.</p>
      <p>También puedes usar Tab para enfocar la zona y Enter para reaccionar.</p></header>
      <JuegoReaccion alTerminar={recibirTiempo} alReiniciar={limpiarResultado} />
      <FormularioTiempo tiempo={tiempoActual} nombre={nombre} guardado={guardado}
        alCambiarNombre={setNombre} alGuardar={guardarTiempo} />
      <Ranking tiempos={tiempos} />
      <footer>Guarda el resultado antes de reiniciar si quieres añadirlo al ranking.<br />
        El ranking se conserva al reiniciar el juego; al recargar la página comienza una sesión nueva.</footer>
    </main>
  );
}
