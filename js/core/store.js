// ==========================================
// EXPERIENCIA INÉS — core/store.js
// Responsabilidad única: mantener y consultar
// los datos de la app (config, menú, promociones).
// No conoce navegación ni DOM.
// ==========================================

"use strict";

let state = {
  config: {},
  menu: { categorias: [] },
  promociones: { promociones: [] },
};

export function setDatos(datos) {
  state = { ...state, ...datos };
}

export function getConfig() {
  return state.config;
}

export function getCategorias() {
  return state.menu.categorias || [];
}

export function getCategoria(categoriaId) {
  return getCategorias().find((c) => c.id === categoriaId) || null;
}

export function getPromociones() {
  return state.promociones.promociones || [];
}

/** Localiza un producto y su contexto (categoría + grupo) por id */
export function getProducto(categoriaId, grupoId, productoId) {
  const categoria = getCategoria(categoriaId);
  if (!categoria) return null;
  const grupo = (categoria.grupos || []).find((g) => g.id === grupoId);
  if (!grupo) return null;
  const producto = (grupo.productos || []).find((p) => p.id === productoId);
  if (!producto) return null;
  return { categoria, grupo, producto };
}

/** ¿La categoría todavía no tiene productos cargados? */
export function categoriaVacia(categoria) {
  if (!categoria) return true;
  return !categoria.grupos || categoria.grupos.every((g) => !g.productos || g.productos.length === 0);
}

/**
 * ¿Puede venderse esta variante/producto puntual? Precio válido y no
 * marcada como oculta/inactiva/no disponible. Estas banderas son
 * opcionales: si menu.json no las define, se considera disponible.
 */
function esVarianteValida(producto) {
  const precio = Number(producto.precio);
  if (!Number.isFinite(precio) || precio <= 0) return false;
  if (producto.disponible === false) return false;
  if (producto.activo === false) return false;
  if (producto.oculto === true) return false;
  return true;
}

/**
 * Convierte un grupo en la UNIDAD que puede recomendarse, entendiendo
 * la diferencia entre plato y variante:
 *
 *  - Grupo con 1 solo producto  → es un PLATILLO. Se recomienda ese
 *    producto directamente: { tipo: "producto", categoria, grupo, producto }.
 *
 *  - Grupo con 2+ productos     → es un GRUPO DE VARIANTES (ej. "Huevos
 *    al gusto"). Nunca se recomienda una variante suelta ("Con jamón");
 *    se recomienda el grupo completo como una sola unidad:
 *    { tipo: "grupo", categoria, grupo, variantesDisponibles, precioDesde }.
 *    Las variantes ocultas/sin precio se excluyen del cálculo; si no
 *    queda ninguna variante válida, el grupo entero no es recomendable.
 *
 * Devuelve null si el grupo no puede recomendarse en absoluto.
 */
export function obtenerUnidadRecomendable(categoria, grupo) {
  if (!grupo || !Array.isArray(grupo.productos) || grupo.productos.length === 0) {
    return null;
  }

  if (grupo.productos.length === 1) {
    const producto = grupo.productos[0];
    if (!esVarianteValida(producto)) return null;
    return { tipo: "producto", categoria, grupo, producto };
  }

  const variantesDisponibles = grupo.productos.filter(esVarianteValida);
  if (variantesDisponibles.length === 0) return null;

  const precioDesde = Math.min(...variantesDisponibles.map((p) => Number(p.precio)));
  return { tipo: "grupo", categoria, grupo, variantesDisponibles, precioDesde };
}

/**
 * Etiquetas de "antojo" de una unidad recomendable.
 *
 *  - Platillo (tipo "producto"): hereda de producto → grupo → categoría,
 *    en cascada (el primer nivel que tenga etiquetas gana). Hay un único
 *    producto, no hay ambigüedad.
 *
 *  - Grupo de variantes (tipo "grupo"): la unidad que se recomienda es
 *    el grupo completo (ej. "Huaraches"), nunca una variante suelta. Pero
 *    si ALGUNA variante individual trae su propia etiqueta (ej.
 *    "hu_naturales": antojos:["ligero"] dentro de "Huaraches", como ya
 *    existe en el menú real), el grupo hereda esa etiqueta — así "Algo
 *    ligero" sigue encontrando "Huaraches" (mostrado como grupo, con su
 *    "Desde $X"), sin exponer nunca "Naturales" como resultado suelto.
 *    Se combina con las etiquetas propias del grupo o, en su defecto,
 *    de la categoría.
 */
function etiquetasDeUnidad(unidad) {
  if (unidad.tipo === "producto") {
    return unidad.producto.antojos || unidad.grupo.antojos || unidad.categoria.antojos || [];
  }

  const propias = unidad.grupo.antojos || unidad.categoria.antojos || [];
  const heredadasDeVariantes = unidad.variantesDisponibles.flatMap((variante) => variante.antojos || []);
  return [...new Set([...propias, ...heredadasDeVariantes])];
}

/**
 * Devuelve todas las UNIDADES recomendables (platillos o grupos de
 * variantes, nunca variantes sueltas) etiquetadas con un "antojo" dado.
 * Usado por el selector inteligente "¿Qué se te antoja hoy?".
 */
export function getProductosPorAntojo(antojo) {
  const resultados = [];

  for (const categoria of getCategorias()) {
    for (const grupo of categoria.grupos || []) {
      const unidad = obtenerUnidadRecomendable(categoria, grupo);
      if (!unidad) continue;
      if (etiquetasDeUnidad(unidad).includes(antojo)) {
        resultados.push(unidad);
      }
    }
  }

  return resultados;
}

/**
 * Elige al azar una UNIDAD recomendable (platillo o grupo de variantes,
 * nunca una variante suelta) para "Sorpréndeme".
 */
export function getProductoAleatorio() {
  const todas = [];

  for (const categoria of getCategorias()) {
    for (const grupo of categoria.grupos || []) {
      const unidad = obtenerUnidadRecomendable(categoria, grupo);
      if (unidad) todas.push(unidad);
    }
  }

  if (!todas.length) return null;
  return todas[Math.floor(Math.random() * todas.length)];
}

/** Categoría "más relevante" para un tipo de antojo (mapeo 1 a 1 cuando existe) */
export function getCategoriaPorAntojo(antojo) {
  return getCategorias().find((c) => (c.antojos || []).includes(antojo)) || null;
}
