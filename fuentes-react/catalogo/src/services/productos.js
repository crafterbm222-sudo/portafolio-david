// Toda la información de la API queda en este archivo.
export const URL_BASE = 'https://dummyjson.com';
export const categorias = [
  { id: 'todas', nombre: 'Todas las categorías' },
  { id: 'beauty', nombre: 'Belleza' },
  { id: 'fragrances', nombre: 'Perfumes' },
  { id: 'furniture', nombre: 'Muebles' },
  { id: 'groceries', nombre: 'Alimentos' }
];

export function crearUrlProductos(busqueda, categoria) {
  const texto = busqueda.trim();
  // La API no combina búsqueda y categoría en un solo endpoint.
  // Si hay búsqueda, pido todas sus coincidencias y filtro la categoría después.
  if (texto) return URL_BASE + '/products/search?q=' + encodeURIComponent(texto) + '&limit=0';
  if (categoria !== 'todas') return URL_BASE + '/products/category/' + encodeURIComponent(categoria) + '?limit=0';
  return URL_BASE + '/products?limit=0';
}

export function adaptarProductos(datos, categoria) {
  if (!datos || !Array.isArray(datos.products)) return [];
  return datos.products
    .filter((producto) => categoria === 'todas' || producto.category === categoria)
    .map((producto) => ({
      id: producto.id,
      nombre: producto.title || 'Producto sin nombre',
      imagen: producto.thumbnail || '',
      descripcion: producto.description || 'Este producto no tiene descripción.',
      categoria: producto.category,
      precio: producto.price
    }));
}
