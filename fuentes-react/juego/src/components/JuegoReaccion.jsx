import { useEffect, useRef, useState } from 'react';

// alTerminar entrega los milisegundos a App; alReiniciar limpia el resultado de App.
export default function JuegoReaccion({ alTerminar, alReiniciar }) {
  const [estado, setEstado] = useState('inicial');
  const temporizador = useRef(null);
  const inicio = useRef(0);
  // Este ref impide que un doble clic registre dos tiempos antes del siguiente render.
  const etapaActual = useRef('inicial');

  useEffect(() => {
    return () => clearTimeout(temporizador.current);
  }, []);

  function reiniciar() {
    clearTimeout(temporizador.current);
    temporizador.current = null;
    inicio.current = 0;
    etapaActual.current = 'inicial';
    setEstado('inicial');
    alReiniciar();
  }

  function empezar() {
    if (etapaActual.current !== 'inicial') return;
    etapaActual.current = 'esperando';
    setEstado('esperando');
    temporizador.current = setTimeout(() => {
      inicio.current = performance.now();
      etapaActual.current = 'listo';
      setEstado('listo');
    }, 1500 + Math.random() * 2500);
  }

  function reaccionar() {
    if (etapaActual.current === 'esperando') {
      clearTimeout(temporizador.current);
      etapaActual.current = 'anticipado';
      setEstado('anticipado');
    } else if (etapaActual.current === 'listo') {
      const tiempo = Math.round(performance.now() - inicio.current);
      etapaActual.current = 'resultado';
      setEstado('resultado');
      alTerminar(tiempo);
    }
  }

  const mensajes = {
    inicial: 'Pulsa Comenzar para jugar.',
    esperando: 'Espera… Todavía no pulses.',
    listo: '¡AHORA! Pulsa aquí.',
    anticipado: 'Te adelantaste. Reinicia para intentarlo otra vez.',
    resultado: 'Intento terminado. Guarda tu tiempo o reinicia.'
  };
  return (
    <section className="panel" aria-label="Zona de juego">
      <button type="button" className={'zona ' + estado} onClick={reaccionar}
        disabled={estado !== 'esperando' && estado !== 'listo'}>{mensajes[estado]}</button>
      <p role="status">{mensajes[estado]}</p>
      <div className="acciones">
        <button onClick={empezar} disabled={estado !== 'inicial'}>Comenzar</button>
        <button className="secundario" onClick={reiniciar}>Reiniciar</button>
      </div>
    </section>
  );
}
