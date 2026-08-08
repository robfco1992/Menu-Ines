// ==========================================
// EXPERIENCIA INÉS — screens/producto-detalle.js
// Detalle de un producto individual. Además del
// nombre/precio, invita a seguir explorando con otros
// platillos de la misma categoría — usa datos que ya
// están en memoria, sin nuevas rutas ni fetch.
// ==========================================

"use strict";

import { el, formatPrice } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import { getProducto } from "../core/store.js";
import { crearTopbar } from "../components/topbar.js";

/** Hasta 4 platillos más de la misma categoría, priorizando el mismo grupo */
function sugerencias(categoria, grupoActualId, productoActualId) {
  const delMismoGrupo = [];
  const deOtrosGrupos = [];

  for (const grupo of categoria.grupos || []) {
    for (const producto of grupo.productos || []) {
      if (producto.id === productoActualId) continue;
      const entrada = { grupo, producto };
      if (grupo.id === grupoActualId) delMismoGrupo.push(entrada);
      else deOtrosGrupos.push(entrada);
    }
  }

  return [...delMismoGrupo, ...deOtrosGrupos].slice(0, 4);
}

export function renderProductoDetalle(container, params) {
  const contexto = getProducto(params.categoriaId, params.grupoId, params.productoId);

  container.classList.add("screen--with-navbar");
  container.appendChild(crearTopbar(contexto ? contexto.categoria.nombre : "Producto"));

  const body = el("div", { className: "screen-body" });

  if (!contexto) {
    body.appendChild(
      el("div", { className: "empty-state" }, [
        el("div", { html: icon("compass", 40) }),
        el("p", { className: "empty-state__title", text: "No encontramos este platillo" }),
        el("p", { className: "empty-state__text", text: "Puede que ya no esté disponible." }),
      ])
    );
    container.appendChild(body);
    return;
  }

  const { categoria, grupo, producto } = contexto;
  const esSorpresa = params.origen === "sorpresa";

  const detalle = el("div", { className: `product-detail surprise-reveal${esSorpresa ? " product-detail--sorpresa" : ""}` }, [
    el("div", { className: "product-detail__icon", html: icon(esSorpresa ? "sparkles" : categoria.icono, 32) }),
    el("p", {
      className: "product-detail__category",
      text: esSorpresa ? "Tu sorpresa de hoy" : categoria.nombre,
    }),
    el("h1", { className: "product-detail__name", text: producto.nombre }),
    el("span", { className: "product-detail__rule" }),
    el("p", { className: "product-detail__price", text: formatPrice(producto.precio) }),
  ]);

  if (producto.descripcion) {
    detalle.appendChild(el("p", { className: "product-detail__desc", text: producto.descripcion }));
  }

  body.appendChild(detalle);

  const relacionados = sugerencias(categoria, grupo.id, producto.id);

  if (relacionados.length) {
    body.appendChild(
      el("p", { className: "product-suggestions__label", text: `También en ${categoria.nombre}` })
    );

    const lista = el("div", { className: "product-suggestions" });

    relacionados.forEach(({ grupo: g, producto: p }, index) => {
      const fila = el(
        "button",
        { className: `product-suggestion stagger-item stagger-item--${index + 1}`, attrs: { type: "button" } },
        [
          el("span", { className: "product-suggestion__name", text: p.nombre }),
          el("span", { className: "product-suggestion__price", text: formatPrice(p.precio) }),
        ]
      );
      fila.addEventListener("click", () => {
        router.push("producto", { categoriaId: categoria.id, grupoId: g.id, productoId: p.id });
      });
      lista.appendChild(fila);
    });

    body.appendChild(lista);
  }

  const volver = el("div", { className: "antojo-footer" }, [
    el("button", { className: "btn btn--ghost", attrs: { type: "button" }, text: `Ver todo ${categoria.nombre}` }),
  ]);

  volver.querySelector("button").addEventListener("click", () => {
    router.push("categoria", { id: categoria.id });
  });

  body.appendChild(volver);
  container.appendChild(body);
}
