// ==========================================
// EXPERIENCIA INÉS — screens/hero.js
// Pantalla de bienvenida. Única responsabilidad:
// presentar la marca e invitar a comenzar.
// ==========================================

"use strict";

import { el } from "../core/dom.js";
import { getConfig } from "../core/store.js";
import { router } from "../core/router.js";
import { crearLogo } from "../components/brand-logo.js";

export function renderHero(container) {
  const config = getConfig();
  const restaurante = config.restaurant || {};

  container.classList.add("hero-screen");

  const contenido = el("div", { className: "hero-content" }, [
    crearLogo("hero"),
    el("h1", { className: "hero-title", text: "Buenos días" }),
    el("p", { className: "hero-slogan", text: restaurante.slogan || "" }),
    el(
      "button",
      {
        className: "btn",
        attrs: { type: "button" },
        text: "Comenzar",
      }
    ),
  ]);

  const boton = contenido.querySelector("button.btn");
  boton.addEventListener("click", () => {
    router.push("antojo");
  });

  container.appendChild(contenido);
}
