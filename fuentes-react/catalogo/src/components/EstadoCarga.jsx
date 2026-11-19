// Sin props: informa que hay una petición pendiente.
export default function EstadoCarga() {
  return <div className="aviso" role="status"><span className="spinner" aria-hidden="true" /> Cargando productos…</div>;
}
