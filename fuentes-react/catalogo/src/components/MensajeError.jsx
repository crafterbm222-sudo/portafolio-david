// mensaje explica qué pasó; alReintentar vuelve a montar la petición desde App.
export default function MensajeError({ mensaje, alReintentar }) {
  return <div className="aviso error" role="alert"><p>{mensaje}</p><button onClick={alReintentar}>Reintentar</button></div>;
}
