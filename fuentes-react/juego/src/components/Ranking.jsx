// tiempos contiene todos los intentos guardados. Ordeno una copia para no mutar el estado.
export default function Ranking({ tiempos }) {
  const ordenados = [...tiempos].sort((a, b) => a.tiempo - b.tiempo || a.id - b.id);
  return (
    <section className="panel"><h2>Ranking</h2><p>Menor tiempo = mejor posición.</p>
      {ordenados.length === 0 ? <p>Aún no hay tiempos guardados.</p> : (
        <ol className="ranking">{ordenados.map((registro) => (
          <li key={registro.id}><span>{registro.nombre}</span><strong>{registro.tiempo} ms</strong></li>
        ))}</ol>
      )}
    </section>
  );
}
