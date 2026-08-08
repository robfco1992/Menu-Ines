// ==========================================
// EXPERIENCIA INÉS — core/router.js
// Motor de navegación tipo app: usa el History API
// del navegador como pila de navegación real (permite
// back físico/gesto del celular). No conoce el
// contenido de las pantallas, solo cómo montarlas.
// ==========================================

"use strict";

let screens = {};
let rootEl = null;
let currentCleanup = null;
let listeners = [];

function limpiarPantallaActual() {
  if (typeof currentCleanup === "function") {
    try {
      currentCleanup();
    } catch (error) {
      console.error("Router: error al limpiar pantalla anterior", error);
    }
  }
  currentCleanup = null;
}

function renderizar(screenId, params, claseTransicion) {
  const render = screens[screenId];

  if (!render) {
    console.error(`Router: la pantalla "${screenId}" no está registrada`);
    return;
  }

  limpiarPantallaActual();

  const section = document.createElement("section");
  section.className = `screen ${claseTransicion}`;
  section.dataset.screen = screenId;

  currentCleanup = render(section, params, router) || null;

  rootEl.replaceChildren(section);

  for (const listener of listeners) listener({ screenId, params });
}

export const router = {
  /** Navega hacia adelante (drill-down): categoría → producto, etc. */
  push(screenId, params = {}) {
    history.pushState({ screenId, params, modo: "push" }, "", `#${screenId}`);
    renderizar(screenId, params, "screen--enter-push");
  },

  /** Regresa un nivel en la pila (equivalente a back físico) */
  pop() {
    history.back();
  },

  /** Cambia de pestaña en el navbar inferior: no apila, reemplaza */
  switchTab(screenId, params = {}) {
    history.replaceState({ screenId, params, modo: "tab" }, "", `#${screenId}`);
    renderizar(screenId, params, "screen--enter-fade");
  },

  /** Reemplaza la pantalla actual sin dejar rastro en el historial */
  replace(screenId, params = {}) {
    history.replaceState({ screenId, params, modo: "replace" }, "", `#${screenId}`);
    renderizar(screenId, params, "screen--enter-fade");
  },

  getScreenActual() {
    return history.state?.screenId || null;
  },

  /** Se notifica en cada navegación: { screenId, params } */
  subscribe(fn) {
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((l) => l !== fn);
    };
  },
};

window.addEventListener("popstate", (event) => {
  const estado = event.state;
  if (!estado) return;
  renderizar(estado.screenId, estado.params || {}, "screen--enter-pop");
});

/**
 * Inicializa el router.
 * @param {HTMLElement} root - contenedor donde se monta la pantalla activa
 * @param {Object<string, Function>} screenMap - id de pantalla → función render
 * @param {string} initialScreen
 */
export function initRouter(root, screenMap, initialScreen, initialParams = {}) {
  rootEl = root;
  screens = screenMap;
  history.replaceState({ screenId: initialScreen, params: initialParams, modo: "replace" }, "", `#${initialScreen}`);
  renderizar(initialScreen, initialParams, "screen--enter-fade");
}
