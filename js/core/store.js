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
 * Devuelve todos los productos (con su contexto) que están etiquetados
 * con un "antojo" dado, ya sea a nivel de categoría, grupo o producto.
 * Usado por el selector inteligente "¿Qué se te antoja hoy?".
 */
export function getProductosPorAntojo(antojo) {
  const resultados = [];

  for (const categoria of getCategorias()) {
    for (const grupo of categoria.grupos || []) {
      for (const producto of grupo.productos || []) {
        const etiquetas = producto.antojos || grupo.antojos || categoria.antojos || [];
        if (etiquetas.includes(antojo)) {
          resultados.push({ categoria, grupo, producto });
        }
      }
    }
  }

  return resultados;
}

/** Elige un producto real al azar, ignorando categorías aún sin datos */
export function getProductoAleatorio() {
  const todos = [];

  for (const categoria of getCategorias()) {
    for (const grupo of categoria.grupos || []) {
      for (const producto of grupo.productos || []) {
        todos.push({ categoria, grupo, producto });
      }
    }
  }

  if (!todos.length) return null;
  return todos[Math.floor(Math.random() * todos.length)];
}

/** Categoría "más relevante" para un tipo de antojo (mapeo 1 a 1 cuando existe) */
export function getCategoriaPorAntojo(antojo) {
  return getCategorias().find((c) => (c.antojos || []).includes(antojo)) || null;
}
