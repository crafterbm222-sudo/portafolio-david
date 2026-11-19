import TarjetaItem from './TarjetaItem';

// items son los productos visibles; favoritos son IDs; alFavorito viene de App.
export default function ListaTarjetas({ items, favoritos, alFavorito }) {
  return (
    <div className="lista">
      {items.map((item) => <TarjetaItem key={item.id} item={item}
        esFavorito={favoritos.includes(item.id)} alFavorito={alFavorito} />)}
    </div>
  );
}
