// ==========================================
// EXPERIENCIA INÉS — components/topbar.js
// Responsabilidad única: construir el header
// de una pantalla con navegación hacia atrás.
// ==========================================

"use strict";

import { el } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";

/**
 * @param {string} titulo
 * @param {object} options { onBack: function|null }
 */
export function crearTopbar(titulo, options = {}) {
  const backBtn = el(
    "button",
    {
      className: "icon-btn",
      attrs: { type: "button", "aria-label": "Regresar" },
      html: icon("arrow-left", 19),
    }
  );

  backBtn.addEventListener("click", () => {
    if (options.onBack) options.onBack();
    else router.pop();
  });

  return el("header", { className: "topbar" }, [
    backBtn,
    el("h1", { className: "topbar-title", text: titulo }),
  ]);
}
