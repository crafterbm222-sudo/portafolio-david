// tiempo, nombre y guardado son el resultado actual de App.
// alCambiarNombre actualiza el campo; alGuardar registra el intento una sola vez.
export default function FormularioTiempo({ tiempo, nombre, guardado, alCambiarNombre, alGuardar }) {
  if (tiempo === null) return null;
  return (
    <section className="panel" aria-label="Guardar resultado">
      <h2>Tu tiempo: {tiempo} ms</h2>
      {guardado ? <p role="status">Tiempo guardado en el ranking.</p> : (
        <form onSubmit={(evento) => { evento.preventDefault(); alGuardar(); }}>
          <label htmlFor="nombre">Tu nombre</label>
          <input id="nombre" value={nombre} onChange={(evento) => alCambiarNombre(evento.target.value)}
            required maxLength={30} pattern=".*\S.*" title="Escribe al menos un carácter que no sea un espacio." />
          <button type="submit" disabled={!nombre.trim()}>Guardar tiempo</button>
        </form>
      )}
    </section>
  );
}
