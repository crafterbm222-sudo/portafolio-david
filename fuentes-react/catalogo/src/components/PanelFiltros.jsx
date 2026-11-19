// opciones contiene las categorías; categoria y soloFavoritos son los valores de App.
// alCambiarCategoria y alCambiarFavoritos notifican los cambios al padre.
export default function PanelFiltros({ opciones, categoria, soloFavoritos, alCambiarCategoria, alCambiarFavoritos }) {
  return (
    <div className="filtros">
      <div className="campo">
        <label htmlFor="categoria">Categoría</label>
        <select id="categoria" value={categoria} onChange={(evento) => alCambiarCategoria(evento.target.value)}>
          {opciones.map((opcion) => <option key={opcion.id} value={opcion.id}>{opcion.nombre}</option>)}
        </select>
      </div>
      <label className="casilla"><input type="checkbox" checked={soloFavoritos}
        onChange={(evento) => alCambiarFavoritos(evento.target.checked)} /> Ver solo favoritos</label>
    </div>
  );
}
