// ==========================================
// EXPERIENCIA INÉS — screens/menu-categorias.js
// Pantalla "Nuestro Menú": lista las categorías
// reales leídas de menu.json. Cero contenido
// hardcodeado en HTML.
// ==========================================

"use strict";

import { el } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import { getCategorias } from "../core/store.js";

export function renderMenuCategorias(container) {
  container.classList.add("screen--with-navbar");

  const body = el("div", { className: "screen-body" });

  body.appendChild(
    el("div", { className: "section-heading" }, [
      el("h1", { className: "section-heading__title", text: "Nuestro Menú" }),
      el("p", {
        className: "section-heading__subtitle",
        text: "Elige una categoría para ver los platillos.",
      }),
    ])
  );

  const lista = el("div", { className: "list-stack" });
  const categorias = getCategorias();

  categorias.forEach((categoria, index) => {
    const fila = el(
      "button",
      {
        className: `nav-row stagger-item stagger-item--${index + 1}`,
        attrs: { type: "button" },
      },
      [
        el("span", { className: "nav-row__icon", html: icon(categoria.icono, 20) }),
        el("span", { className: "nav-row__body" }, [
          el("span", { className: "nav-row__title", text: categoria.nombre }),
          el("span", { className: "nav-row__desc", text: categoria.descripcion || "" }),
        ]),
        el("span", { className: "nav-row__chevron", html: icon("chevron-right", 16) }),
      ]
    );

    fila.addEventListener("click", () => {
      router.push("categoria", { id: categoria.id });
    });

    lista.appendChild(fila);
  });

  body.appendChild(lista);
  container.appendChild(body);
}
