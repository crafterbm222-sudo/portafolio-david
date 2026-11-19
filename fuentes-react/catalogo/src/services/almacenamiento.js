// Un almacenamiento bloqueado o un JSON dañado no debe cerrar la aplicación.
export function leerGuardado(tipo, clave, defecto) {
  try {
    const valor = window[tipo].getItem(clave);
    return valor === null ? defecto : JSON.parse(valor);
  } catch {
    return defecto;
  }
}

export function guardarDato(tipo, clave, valor) {
  try {
    window[tipo].setItem(clave, JSON.stringify(valor));
    return true;
  } catch {
    return false;
  }
}
