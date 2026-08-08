// ==========================================
// EXPERIENCIA INÉS — screens/resultado-antojo.js
// Resultado del selector inteligente cuando el antojo
// no mapea 1 a 1 con una categoría (ej. "Algo ligero"):
// junta productos reales de varias categorías, cada uno
// mostrando su origen. Nunca inventa productos.
// ==========================================

"use strict";

import { el, formatPrice } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import { crearTopbar } from "../components/topbar.js";

const TITULOS = {
  ligero: "Algo ligero",
  tradicional: "Tradicional",
  dulce: "Algo dulce",
  cafe: "Un buen café",
};

export function renderResultadoAntojo(container, params) {
  const antojo = params.antojo;
  const coincidencias = params.coincidencias || [];

  container.classList.add("screen--with-navbar");
  container.appendChild(crearTopbar(TITULOS[antojo] || "Resultado", { onBack: () => router.pop() }));

  const body = el("div", { className: "screen-body" });

  if (!coincidencias.length) {
    body.appendChild(
      el("div", { className: "empty-state" }, [
        el("div", { html: icon("leaf", 40) }),
        el("p", { className: "empty-state__title", text: "Aún no tenemos opciones para este antojo" }),
        el("p", {
          className: "empty-state__text",
          text: "Explora el menú completo, seguro encuentras algo que se te antoje.",
        }),
        el(
          "button",
          { className: "btn", attrs: { type: "button" }, text: "Ver menú completo" }
        ),
      ])
    );
    body.querySelector(".btn").addEventListener("click", () => router.switchTab("menu"));
    container.appendChild(body);
    return;
  }

  const lista = el("div", { className: "list-stack" });

  coincidencias.forEach(({ categoria, grupo, producto }, index) => {
    const fila = el(
      "button",
      {
        className: `nav-row stagger-item stagger-item--${(index % 8) + 1}`,
        attrs: { type: "button" },
      },
      [
        el("span", { className: "nav-row__icon", html: icon(categoria.icono, 20) }),
        el("span", { className: "nav-row__body" }, [
          el("span", { className: "nav-row__title", text: producto.nombre }),
          el("span", { className: "nav-row__desc" }, [
            el("span", { className: "chip", text: grupo.nombre !== producto.nombre ? grupo.nombre : categoria.nombre }),
          ]),
        ]),
        el("span", { className: "product-row__price", text: formatPrice(producto.precio) }),
      ]
    );

    fila.addEventListener("click", () => {
      router.push("producto", {
        categoriaId: categoria.id,
        grupoId: grupo.id,
        productoId: producto.id,
      });
    });

    lista.appendChild(fila);
  });

  body.appendChild(lista);
  container.appendChild(body);
}
