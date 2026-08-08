// ==========================================
// EXPERIENCIA INÉS — components/navbar.js
// Responsabilidad única: navbar inferior persistente.
// Se monta una sola vez y se actualiza reactivamente
// suscribiéndose al router.
// ==========================================

"use strict";

import { el, empty } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";

const PANTALLAS_SIN_NAVBAR = new Set(["hero"]);

/**
 * @param {HTMLElement} navEl - <nav id="navbar"> ya presente en index.html
 * @param {Array} items - config.nav: [{id, label, icono}]
 */
export function montarNavbar(navEl, items) {
  function pintar(activeId) {
    empty(navEl);

    if (PANTALLAS_SIN_NAVBAR.has(activeId)) {
      navEl.classList.add("is-hidden");
      return;
    }

    navEl.classList.remove("is-hidden");

    for (const item of items) {
      const boton = el(
        "button",
        {
          className: `navbar-item${item.id === activeId ? " is-active" : ""}`,
          attrs: { type: "button", "aria-label": item.label },
          html: `${icon(item.icono, 22)}<span>${item.label}</span>`,
        }
      );

      boton.addEventListener("click", () => {
        if (item.id === activeId) return;
        router.switchTab(item.id);
      });

      navEl.appendChild(boton);
    }
  }

  router.subscribe(({ screenId }) => pintar(screenId));
  pintar(router.getScreenActual());
}
