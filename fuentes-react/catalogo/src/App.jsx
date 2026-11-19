import { useEffect, useState } from 'react';
import BarraBusqueda from './components/BarraBusqueda';
import PanelFiltros from './components/PanelFiltros';
import ListaTarjetas from './components/ListaTarjetas';
import EstadoCarga from './components/EstadoCarga';
import MensajeError from './components/MensajeError';
import useFetch from './hooks/useFetch';
import useDebounce from './hooks/useDebounce';
import { categorias, crearUrlProductos, adaptarProductos } from './services/productos';
import { leerGuardado, guardarDato } from './services/almacenamiento';

// Sin props. App conserva los controles, favoritos y datos del catálogo.
export default function App() {
  const [busqueda, setBusqueda] = useState(() => {
    const valor = leerGuardado('sessionStorage', 'catalogo-busqueda', '');
    return typeof valor === 'string' ? valor : '';
  });
  const [categoria, setCategoria] = useState(() => {
    const valor = leerGuardado('sessionStorage', 'catalogo-categoria', 'todas');
    return categorias.some((opcion) => opcion.id === valor) ? valor : 'todas';
  });
  const [favoritos, setFavoritos] = useState(() => {
    const valor = leerGuardado('localStorage', 'catalogo-favoritos', []);
    return Array.isArray(valor) ? [...new Set(valor.filter((id) => Number.isInteger(id)))] : [];
  });
  const [soloFavoritos, setSoloFavoritos] = useState(false);
  const [avisoGuardado, setAvisoGuardado] = useState('');
  const [intento, setIntento] = useState(0);
  const busquedaPausada = useDebounce(busqueda);
  const url = crearUrlProductos(busquedaPausada, categoria);
  // El parámetro permite reintentar la misma petición sin recargar la página.
  const { datos, cargando, error } = useFetch(url + '&reintento=' + intento);

  useEffect(() => {
    const guardado = guardarDato('localStorage', 'catalogo-favoritos', favoritos);
    setAvisoGuardado(guardado ? '' : 'El navegador no permite guardar favoritos. Se mantendrán solo mientras uses esta página.');
  }, [favoritos]);
  useEffect(() => {
    guardarDato('sessionStorage', 'catalogo-busqueda', busqueda);
    guardarDato('sessionStorage', 'catalogo-categoria', categoria);
  }, [busqueda, categoria]);

  function cambiarFavorito(id) {
    setFavoritos((anteriores) => anteriores.includes(id)
      ? anteriores.filter((favorito) => favorito !== id) : [...anteriores, id]);
  }

  const productos = adaptarProductos(datos, categoria);
  const visibles = soloFavoritos ? productos.filter((producto) => favoritos.includes(producto.id)) : productos;
  const esperandoBusqueda = busqueda !== busquedaPausada;
  return (
    <main className="pagina">
      <header><p className="etiqueta">PROYECTO REACT · VITE</p><h1>Mi catálogo</h1>
        <p>Explora productos y guarda los que más te gustan.</p></header>
      <section className="controles" aria-label="Búsqueda y filtros">
        <BarraBusqueda busqueda={busqueda} alCambiar={setBusqueda} />
        <PanelFiltros opciones={categorias} categoria={categoria} alCambiarCategoria={setCategoria}
          soloFavoritos={soloFavoritos} alCambiarFavoritos={setSoloFavoritos} />
        <p className="nota">{favoritos.length} favoritos guardados. Los filtros también se aplican a tus favoritos.</p>
      </section>
      {avisoGuardado && <p role="status">{avisoGuardado}</p>}
      {cargando || esperandoBusqueda ? <EstadoCarga /> : error ? (
        <MensajeError mensaje={error} alReintentar={() => setIntento((anterior) => anterior + 1)} />
      ) : visibles.length === 0 ? (
        <p className="aviso" role="status">No hay productos para esta búsqueda y estos filtros. Prueba otras opciones.</p>
      ) : (
        <section aria-label="Productos"><p className="contador" role="status">{visibles.length} productos encontrados</p>
          <ListaTarjetas items={visibles} favoritos={favoritos} alFavorito={cambiarFavorito} />
        </section>
      )}
      <footer>Datos de DummyJSON · Precios de ejemplo en USD · No es una tienda real</footer>
    </main>
  );
}
