// ==========================================
// EXPERIENCIA INÉS — screens/categoria-detalle.js
// Lista los productos de UNA categoría, agrupados
// como en un menú impreso (grupo → productos).
// Todo viene de menu.json; nunca se escribe un
// producto directamente aquí.
// ==========================================

"use strict";

import { el, formatPrice } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import { getCategoria, categoriaVacia } from "../core/store.js";
import { crearTopbar } from "../components/topbar.js";

function esGrupoUnico(grupo) {
  return grupo.productos && grupo.productos.length === 1 && grupo.productos[0].nombre === grupo.nombre;
}

function crearFilaProducto(categoria, grupo, producto, index) {
  const fila = el(
    "button",
    {
      className: `product-row stagger-item stagger-item--${(index % 8) + 1}`,
      attrs: { type: "button" },
    },
    [
      el("span", { className: "product-row__name", text: producto.nombre }),
      el("span", { className: "product-row__leader" }),
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

  return fila;
}

function renderGrupo(categoria, grupo, index) {
  const wrap = el("div", { className: "product-group" });

  if (!esGrupoUnico(grupo)) {
    wrap.appendChild(el("span", { className: "product-group__label", text: grupo.nombre }));
  }

  if (grupo.descripcion) {
    wrap.appendChild(el("p", { className: "product-group__note", text: grupo.descripcion }));
  }

  grupo.productos.forEach((producto, i) => {
    wrap.appendChild(crearFilaProducto(categoria, grupo, producto, index + i));
  });

  return wrap;
}

function renderEstadoVacio(body) {
  body.appendChild(
    el("div", { className: "empty-state" }, [
      el("div", { html: icon("coffee-cup", 40) }),
      el("p", { className: "empty-state__title", text: "Muy pronto en esta sección" }),
      el("p", {
        className: "empty-state__text",
        text: "Estamos preparando esta carta. Vuelve pronto para verla completa.",
      }),
    ])
  );
  body.appendChild(
    el("div", { className: "antojo-footer" }, [
      el("button", { className: "btn btn--ghost", attrs: { type: "button" }, text: "Ver otras categorías" }),
    ])
  );
  body.querySelector(".btn--ghost").addEventListener("click", () => router.switchTab("menu"));
}

export function renderCategoriaDetalle(container, params) {
  const categoria = getCategoria(params.id);

  container.classList.add("screen--with-navbar");
  container.appendChild(crearTopbar(categoria ? categoria.nombre : "Categoría"));

  const body = el("div", { className: "screen-body" });

  if (!categoria) {
    renderEstadoVacio(body);
    container.appendChild(body);
    return;
  }

  if (categoriaVacia(categoria)) {
    renderEstadoVacio(body);
  } else {
    let contador = 0;
    categoria.grupos.forEach((grupo) => {
      if (!grupo.productos || !grupo.productos.length) return;
      body.appendChild(renderGrupo(categoria, grupo, contador));
      contador += grupo.productos.length;
    });

    if (categoria.nota) {
      body.appendChild(el("p", { className: "category-note", text: categoria.nota }));
    }
  }

  container.appendChild(body);
}
