import { useState } from 'react';

// item tiene el formato del adaptador; esFavorito indica si está guardado.
// alFavorito recibe el ID del producto que se quiere marcar o desmarcar.
export default function TarjetaItem({ item, esFavorito, alFavorito }) {
  const [imagenFallida, setImagenFallida] = useState(false);
  return (
    <article className="tarjeta">
      <div className="foto">
        {item.imagen && !imagenFallida ? (
          <img src={item.imagen} alt={item.nombre} loading="lazy" onError={() => setImagenFallida(true)} />
        ) : <p className="sin-imagen">Imagen no disponible</p>}
      </div>
      <div className="contenido">
        <span className="categoria">{item.categoria}</span>
        <h2>{item.nombre}</h2>
        <p>{item.descripcion}</p>
        <strong>{typeof item.precio === 'number' ? '$' + item.precio.toFixed(2) + ' USD' : 'Precio no disponible'}</strong>
        <button type="button" className={esFavorito ? 'favorito activo' : 'favorito'}
          aria-pressed={esFavorito} aria-label={(esFavorito ? 'Quitar de favoritos: ' : 'Añadir a favoritos: ') + item.nombre}
          onClick={() => alFavorito(item.id)}>
          {esFavorito ? '★ Guardado' : '☆ Añadir a favoritos'}
        </button>
      </div>
    </article>
  );
}
