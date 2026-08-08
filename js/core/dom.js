// ==========================================
// EXPERIENCIA INÉS — core/dom.js
// Helpers de DOM puros y reutilizables.
// Responsabilidad única: crear/consultar el DOM.
// ==========================================

"use strict";

/**
 * Crea un elemento con atributos, dataset y contenido, sin innerHTML
 * salvo para el propio parámetro "html" (uso interno controlado).
 * @param {string} tag
 * @param {object} options { className, attrs, dataset, text, html }
 * @param {Array<Node|string>} children
 */
export function el(tag, options = {}, children = []) {
  const node = document.createElement(tag);

  if (options.className) node.className = options.className;

  if (options.attrs) {
    for (const [key, value] of Object.entries(options.attrs)) {
      if (value !== undefined && value !== null && value !== false) {
        node.setAttribute(key, value);
      }
    }
  }

  if (options.dataset) {
    for (const [key, value] of Object.entries(options.dataset)) {
      node.dataset[key] = value;
    }
  }

  if (options.text !== undefined) node.textContent = options.text;

  // "html" solo se usa con contenido generado internamente (iconos SVG propios),
  // nunca con datos externos sin sanitizar.
  if (options.html !== undefined) node.innerHTML = options.html;

  for (const child of [].concat(children)) {
    if (child === null || child === undefined || child === false) continue;
    node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
  }

  return node;
}

/** Formatea un precio numérico como moneda MXN sin decimales innecesarios */
export function formatPrice(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (Number.isNaN(num)) return String(value);
  return `$${num.toLocaleString("es-MX")}`;
}

/** Vacía un contenedor de forma eficiente */
export function empty(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

/** Devuelve el día de la semana actual en el formato usado por config.schedule */
export function nombreDiaActual() {
  const dias = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  return dias[new Date().getDay()];
}
