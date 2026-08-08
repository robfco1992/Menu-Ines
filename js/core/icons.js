// ==========================================
// EXPERIENCIA INÉS — core/icons.js
// Set de iconos SVG minimalistas inline (sin
// dependencias externas, sin fotografía de stock).
// Responsabilidad única: proveer markup de iconos.
// ==========================================

"use strict";

const STROKE = 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';

const PATHS = {
  "coffee-cup": `<path ${STROKE} d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z"/><path ${STROKE} d="M17 9h1.5a2.5 2.5 0 0 1 0 5H17"/><path ${STROKE} d="M8 3.5c-.5 1 .5 1.2.5 2.2S7.5 7 7.5 7"/><path ${STROKE} d="M12 3.5c-.5 1 .5 1.2.5 2.2S11.5 7 11.5 7"/>`,
  "sun": `<circle cx="12" cy="12" r="4.2" ${STROKE}/><path ${STROKE} d="M12 2.5v2.4M12 19.1v2.4M4.6 4.6l1.7 1.7M17.7 17.7l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.6 19.4l1.7-1.7M17.7 6.3l1.7-1.7"/>`,
  "sandwich": `<path ${STROKE} d="M3 11h18l-1.4 6.2a2 2 0 0 1-2 1.55H6.4a2 2 0 0 1-2-1.55L3 11Z"/><path ${STROKE} d="M4.5 11c0-4.4 3.4-7.2 7.5-7.2s7.5 2.8 7.5 7.2"/><path ${STROKE} d="M8 15h8"/>`,
  "glass-water": `<path ${STROKE} d="M6 3h12l-1.1 16.2A2 2 0 0 1 14.9 21H9.1a2 2 0 0 1-2-1.8L6 3Z"/><path ${STROKE} d="M6.6 9h10.8"/>`,
  "cake": `<path ${STROKE} d="M4 12.5h16V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19v-6.5Z"/><path ${STROKE} d="M4 12.5c1.6 1.4 3 1.4 4.5 0s3-1.4 4.5 0 3 1.4 4.5 0 1.5-.7 2.5 0"/><path ${STROKE} d="M9 9V6M12 9V4.5M15 9V6"/><path ${STROKE} d="M12 2.6c-1.2.9-1.2 1.8 0 2.6"/>`,
  "sparkles": `<path ${STROKE} d="M11 3.5 12.4 8 17 9.4 12.4 10.8 11 15.4 9.6 10.8 5 9.4 9.6 8Z"/><path ${STROKE} d="M18 14.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8Z"/>`,
  "leaf": `<path ${STROKE} d="M5 19c8.5 0 14-5.5 14-14 0 0-14-1.5-14 9.5 0 1.7.4 3.2 1 4.5Z"/><path ${STROKE} d="M5 19c2-3 4.5-6 9-9.5"/>`,
  "tag": `<path ${STROKE} d="M20 12.5 12.5 20a1.5 1.5 0 0 1-2.1 0L4 13.6a1.5 1.5 0 0 1 0-2.1L11.5 4H18a2 2 0 0 1 2 2v6.5Z"/><circle cx="15" cy="8" r="1.3" ${STROKE}/>`,
  "map-pin": `<path ${STROKE} d="M12 21.5s7-6.6 7-12A7 7 0 0 0 5 9.5c0 5.4 7 12 7 12Z"/><circle cx="12" cy="9.4" r="2.4" ${STROKE}/>`,
  "phone": `<path ${STROKE} d="M6.6 3.5h2.7l1.2 4-2 1.3a12.2 12.2 0 0 0 5.6 5.6l1.3-2 4 1.2v2.7a1.6 1.6 0 0 1-1.7 1.6A16 16 0 0 1 5 4.7a1.6 1.6 0 0 1 1.6-1.2Z"/>`,
  "whatsapp": `<path ${STROKE} d="M4.5 20.5 5.8 16A8.5 8.5 0 1 1 9 18.7L4.5 20.5Z"/><path ${STROKE} d="M8.5 8.7c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5s.7 1.7.7 1.8.1.3 0 .5-.2.3-.4.5-.4.4-.5.6c-.2.2-.4.4-.2.8s1 1.6 2 2.4c1.2 1 2 1.2 2.4 1.4s.6.1.8-.1.9-1 1.1-1.3.5-.3.8-.2l1.7.8c.3.1.5.2.5.4s0 .9-.4 1.4-1.5 1.1-2.5 1.1-2.6-.4-4.3-1.9c-2.1-1.9-3.2-3.9-3.4-4.4s-.6-1.4-.2-2.5Z"/>`,
  "instagram": `<rect x="3.5" y="3.5" width="17" height="17" rx="5" ${STROKE}/><circle cx="12" cy="12" r="3.6" ${STROKE}/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>`,
  "facebook": `<path ${STROKE} d="M14.5 21v-7h2.3l.4-3h-2.7V9c0-.9.2-1.5 1.5-1.5h1.3V4.8c-.2 0-1-.1-1.9-.1-1.9 0-3.2 1.2-3.2 3.3V11H9.8v3h2.4v7Z"/>`,
  "clock": `<circle cx="12" cy="12" r="8.5" ${STROKE}/><path ${STROKE} d="M12 7.5V12l3 2"/>`,
  "chevron-right": `<path ${STROKE} d="M9 5.5 15.5 12 9 18.5"/>`,
  "arrow-left": `<path ${STROKE} d="M19 12H5M11 6l-6 6 6 6"/>`,
  "home": `<path ${STROKE} d="M4 11.5 12 4l8 7.5"/><path ${STROKE} d="M6 10v9.5a1 1 0 0 0 1 1h3.5v-5.5h3V20.5H17a1 1 0 0 0 1-1V10"/>`,
  "book": `<path ${STROKE} d="M4 5.2c2.2-.9 4.7-.9 7 0v14c-2.3-.9-4.8-.9-7 0V5.2Z"/><path ${STROKE} d="M20 5.2c-2.2-.9-4.7-.9-7 0v14c2.3-.9 4.8-.9 7 0V5.2Z"/>`,
  "compass": `<circle cx="12" cy="12" r="8.5" ${STROKE}/><path ${STROKE} d="m14.8 9.2-1.6 4-4 1.6 1.6-4Z"/>`,
  "check-circle": `<circle cx="12" cy="12" r="8.5" ${STROKE}/><path ${STROKE} d="m8 12.3 2.6 2.6 5-5.4"/>`,
};

/**
 * Devuelve el markup SVG de un icono minimalista.
 * @param {string} name - clave en PATHS
 * @param {number} size
 */
export function icon(name, size = 22) {
  const body = PATHS[name] || PATHS["compass"];
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${body}</svg>`;
}

// Alias: menu.json usa "coffee" para la categoría de bebidas calientes.
PATHS.coffee = PATHS["coffee-cup"];
