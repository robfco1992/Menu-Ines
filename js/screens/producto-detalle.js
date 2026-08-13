// ==========================================
// EXPERIENCIA INÉS — screens/producto-detalle.js
// Detalle de un platillo. Dos modos, según los
// parámetros de navegación:
//
//  - Con productoId  → detalle de un platillo puntual
//    (o de una variante ya elegida). Muestra nombre,
//    precio, descripción y sugerencias de otros
//    platillos/grupos de la misma categoría.
//
//  - Sin productoId (solo categoriaId + grupoId) →
//    "modo grupo": el usuario llegó a un grupo de
//    variantes (ej. "Huevos al gusto") recomendado como
//    unidad. Aquí, y SOLO aquí, se listan sus variantes
//    para elegir una.
// ==========================================

"use strict";

import { el, formatPrice } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import { getCategoria, obtenerUnidadRecomendable } from "../core/store.js";
import { crearTopbar } from "../components/topbar.js";

/**
 * Hasta 4 unidades recomendables (platillos o grupos de variantes) más
 * de la misma categoría, excluyendo el grupo que se está viendo.
 * Nunca devuelve una variante suelta.
 */
function sugerencias(categoria, grupoActualId) {
  const resultados = [];

  for (const grupo of categoria.grupos || []) {
    if (grupo.id === grupoActualId) continue;
    const unidad = obtenerUnidadRecomendable(categoria, grupo);
    if (unidad) resultados.push(unidad);
  }

  return resultados.slice(0, 4);
}

function nombreDeUnidad(unidad) {
  return unidad.tipo === "producto" ? unidad.producto.nombre : unidad.grupo.nombre;
}

function precioDeUnidad(unidad) {
  return unidad.tipo === "producto" ? formatPrice(unidad.producto.precio) : `Desde ${formatPrice(unidad.precioDesde)}`;
}

function paramsDeUnidad(unidad) {
  const base = { categoriaId: unidad.categoria.id, grupoId: unidad.grupo.id };
  if (unidad.tipo === "producto") base.productoId = unidad.producto.id;
  return base;
}

function renderSugerencias(body, categoria, grupoActualId) {
  const relacionados = sugerencias(categoria, grupoActualId);
  if (!relacionados.length) return;

  body.appendChild(
    el("p", { className: "product-suggestions__label", text: `También en ${categoria.nombre}` })
  );

  const lista = el("div", { className: "product-suggestions" });

  relacionados.forEach((unidad, index) => {
    const fila = el(
      "button",
      { className: `product-suggestion stagger-item stagger-item--${index + 1}`, attrs: { type: "button" } },
      [
        el("span", { className: "product-suggestion__name", text: nombreDeUnidad(unidad) }),
        el("span", { className: "product-suggestion__price", text: precioDeUnidad(unidad) }),
      ]
    );
    fila.addEventListener("click", () => {
      router.push("producto", paramsDeUnidad(unidad));
    });
    lista.appendChild(fila);
  });

  body.appendChild(lista);
}

function renderNoEncontrado(container, tituloTopbar) {
  container.appendChild(crearTopbar(tituloTopbar));
  const body = el("div", { className: "screen-body" }, [
    el("div", { className: "empty-state" }, [
      el("div", { html: icon("compass", 40) }),
      el("p", { className: "empty-state__title", text: "No encontramos este platillo" }),
      el("p", { className: "empty-state__text", text: "Puede que ya no esté disponible." }),
    ]),
  ]);
  container.appendChild(body);
}

/** Modo grupo: se llegó a un grupo de variantes sin elegir una todavía */
function renderModoGrupo(container, categoria, grupo, params) {
  const unidad = obtenerUnidadRecomendable(categoria, grupo);

  if (!unidad || unidad.tipo !== "grupo") {
    renderNoEncontrado(container, categoria.nombre);
    return;
  }

  const esSorpresa = params.origen === "sorpresa";

  container.appendChild(crearTopbar(categoria.nombre));

  const body = el("div", { className: "screen-body" });

  const detalle = el(
    "div",
    { className: `product-detail surprise-reveal${esSorpresa ? " product-detail--sorpresa" : ""}` },
    [
      el("div", { className: "product-detail__icon", html: icon(esSorpresa ? "sparkles" : categoria.icono, 32) }),
      el("p", {
        className: "product-detail__category",
        text: esSorpresa ? "Tu sorpresa de hoy" : categoria.nombre,
      }),
      el("h1", { className: "product-detail__name", text: grupo.nombre }),
      el("span", { className: "product-detail__rule" }),
      el("p", { className: "product-detail__price", text: `Desde ${formatPrice(unidad.precioDesde)}` }),
    ]
  );

  if (grupo.descripcion) {
    detalle.appendChild(el("p", { className: "product-detail__desc", text: grupo.descripcion }));
  }

  body.appendChild(detalle);

  body.appendChild(el("p", { className: "product-suggestions__label", text: "Elige tu opción" }));

  const listaVariantes = el("div", { className: "product-group" });

  unidad.variantesDisponibles.forEach((variante, index) => {
    const fila = el(
      "button",
      { className: `product-row stagger-item stagger-item--${(index % 8) + 1}`, attrs: { type: "button" } },
      [
        el("span", { className: "product-row__name", text: variante.nombre }),
        el("span", { className: "product-row__leader" }),
        el("span", { className: "product-row__price", text: formatPrice(variante.precio) }),
      ]
    );
    fila.addEventListener("click", () => {
      router.push("producto", {
        categoriaId: categoria.id,
        grupoId: grupo.id,
        productoId: variante.id,
      });
    });
    listaVariantes.appendChild(fila);
  });

  body.appendChild(listaVariantes);

  renderSugerencias(body, categoria, grupo.id);

  const volver = el("div", { className: "antojo-footer" }, [
    el("button", { className: "btn btn--ghost", attrs: { type: "button" }, text: `Ver todo ${categoria.nombre}` }),
  ]);
  volver.querySelector("button").addEventListener("click", () => {
    router.push("categoria", { id: categoria.id });
  });
  body.appendChild(volver);

  container.appendChild(body);
}

/** Modo producto: platillo puntual ya elegido (o único de su grupo) */
function renderModoProducto(container, categoria, grupo, producto, params) {
  const esSorpresa = params.origen === "sorpresa";

  container.appendChild(crearTopbar(categoria.nombre));

  const body = el("div", { className: "screen-body" });

  const detalle = el(
    "div",
    { className: `product-detail surprise-reveal${esSorpresa ? " product-detail--sorpresa" : ""}` },
    [
      el("div", { className: "product-detail__icon", html: icon(esSorpresa ? "sparkles" : categoria.icono, 32) }),
      el("p", {
        className: "product-detail__category",
        text: esSorpresa ? "Tu sorpresa de hoy" : categoria.nombre,
      }),
      el("h1", { className: "product-detail__name", text: producto.nombre }),
      el("span", { className: "product-detail__rule" }),
      el("p", { className: "product-detail__price", text: formatPrice(producto.precio) }),
    ]
  );

  if (producto.descripcion) {
    detalle.appendChild(el("p", { className: "product-detail__desc", text: producto.descripcion }));
  }

  body.appendChild(detalle);

  renderSugerencias(body, categoria, grupo.id);

  const volver = el("div", { className: "antojo-footer" }, [
    el("button", { className: "btn btn--ghost", attrs: { type: "button" }, text: `Ver todo ${categoria.nombre}` }),
  ]);
  volver.querySelector("button").addEventListener("click", () => {
    router.push("categoria", { id: categoria.id });
  });
  body.appendChild(volver);

  container.appendChild(body);
}

export function renderProductoDetalle(container, params) {
  container.classList.add("screen--with-navbar");

  const categoria = getCategoria(params.categoriaId);
  const grupo = categoria ? (categoria.grupos || []).find((g) => g.id === params.grupoId) : null;

  if (!categoria || !grupo) {
    renderNoEncontrado(container, "Producto");
    return;
  }

  if (!params.productoId) {
    renderModoGrupo(container, categoria, grupo, params);
    return;
  }

  const producto = (grupo.productos || []).find((p) => p.id === params.productoId);
  if (!producto) {
    renderNoEncontrado(container, categoria.nombre);
    return;
  }

  renderModoProducto(container, categoria, grupo, producto, params);
}
