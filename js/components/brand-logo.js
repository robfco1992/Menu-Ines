// ==========================================
// EXPERIENCIA INÉS — components/brand-logo.js
// Responsabilidad única: renderizar el logotipo
// oficial de INÉS Café. El archivo de imagen nunca
// se recolorea, deforma ni recompone — solo se
// presenta dentro de un contenedor con esquinas
// redondeadas y sombra suave (ver logo-note.md).
// ==========================================

"use strict";

import { el } from "../core/dom.js";

/**
 * @param {"hero"|"contacto"} tamaño variante de tamaño
 */
export function crearLogo(tamaño = "hero") {
  return el("picture", { className: `brand-logo brand-logo--${tamaño}` }, [
    el("source", { attrs: { srcset: "img/logo.webp", type: "image/webp" } }),
    el("img", {
      attrs: {
        src: "img/logo.png",
        alt: "INÉS Café — logotipo oficial",
        width: "900",
        height: "817",
        loading: "eager",
      },
    }),
  ]);
}
