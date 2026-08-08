// ==========================================
// EXPERIENCIA INÉS — core/loader.js
// Responsabilidad única: obtener los JSON de /data
// con manejo de errores. No conoce la UI.
// ==========================================

"use strict";

async function fetchJSON(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path} (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Carga config.json, menu.json y promociones.json en paralelo.
 * Si alguno falla, se resuelve con un valor por defecto seguro
 * para que la app pueda seguir funcionando en modo degradado.
 */
export async function cargarDatos() {
  const [config, menu, promociones] = await Promise.allSettled([
    fetchJSON("data/config.json"),
    fetchJSON("data/menu.json"),
    fetchJSON("data/promociones.json"),
  ]);

  const errores = [];

  const resultado = {
    config: unwrap(config, {}, "config.json", errores),
    menu: unwrap(menu, { categorias: [] }, "menu.json", errores),
    promociones: unwrap(promociones, { promociones: [] }, "promociones.json", errores),
  };

  if (errores.length) {
    console.error("EXPERIENCIA INÉS — errores al cargar datos:", errores);
  }

  return resultado;
}

function unwrap(settledResult, fallback, label, errores) {
  if (settledResult.status === "fulfilled") return settledResult.value;
  errores.push(`${label}: ${settledResult.reason?.message || settledResult.reason}`);
  return fallback;
}
