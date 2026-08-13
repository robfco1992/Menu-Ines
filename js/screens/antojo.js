// ==========================================
// EXPERIENCIA INÉS — screens/antojo.js
// "¿Qué se te antoja hoy?" — selector inteligente.
// No es decorativo: cada opción resuelve la categoría
// (o unidad recomendable) más relevante y navega directo
// ahí, reduciendo el tiempo de decisión del cliente.
// También funciona como pestaña "Inicio".
// ==========================================

"use strict";

import { el } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { router } from "../core/router.js";
import {
  getCategoriaPorAntojo,
  getProductoAleatorio,
  getProductosPorAntojo,
} from "../core/store.js";

const OPCIONES = [
  {
    antojo: "tradicional",
    iconName: "sun",
    titulo: "Tradicional",
    desc: "Huevos, chilaquiles y desayunos clásicos.",
  },
  {
    antojo: "dulce",
    iconName: "cake",
    titulo: "Algo dulce",
    desc: "Hot cakes, pan francés y pan dulce.",
  },
  {
    antojo: "ligero",
    iconName: "leaf",
    titulo: "Algo ligero",
    desc: "Fruta y opciones frescas del menú.",
  },
  {
    antojo: "cafe",
    iconName: "coffee-cup",
    titulo: "Un buen café",
    desc: "Espresso, latte, cappuccino y más.",
  },
  {
    antojo: "sorpresa",
    iconName: "sparkles",
    titulo: "Sorpréndeme",
    desc: "Descubre un platillo al azar.",
  },
];

function resolverAntojo(antojo) {
  if (antojo === "sorpresa") {
    const unidad = getProductoAleatorio();
    if (!unidad) {
      router.switchTab("menu");
      return;
    }

    // Unidad tipo "grupo" (ej. "Huevos al gusto") navega sin productoId:
    // producto-detalle.js entra en "modo grupo" y ahí, y solo ahí, se
    // muestran las variantes para elegir. Unidad tipo "producto" navega
    // directo al platillo puntual.
    const params = {
      categoriaId: unidad.categoria.id,
      grupoId: unidad.grupo.id,
      origen: "sorpresa",
    };
    if (unidad.tipo === "producto") {
      params.productoId = unidad.producto.id;
    }

    router.push("producto", params);
    return;
  }

  // 1) ¿Existe una categoría completa dedicada a este antojo? → ir directo.
  const categoriaDirecta = getCategoriaPorAntojo(antojo);
  if (categoriaDirecta) {
    router.push("categoria", { id: categoriaDirecta.id });
    return;
  }

  // 2) Si no, mostrar un resultado filtrado con las unidades reales que
  // sí aplican (platillos o grupos de variantes, nunca variantes sueltas).
  const coincidencias = getProductosPorAntojo(antojo);
  router.push("resultado-antojo", { antojo, coincidencias });
}

export function renderAntojo(container) {
  container.classList.add("screen--with-navbar");

  const body = el("div", { className: "screen-body" });

  body.appendChild(
    el("div", { className: "section-heading" }, [
      el("h1", { className: "section-heading__title", text: "¿Qué se te antoja hoy?" }),
      el("p", {
        className: "section-heading__subtitle",
        text: "Elige un antojo y te llevamos directo a lo tuyo.",
      }),
    ])
  );

  const grid = el("div", { className: "grid-antojo" });

  OPCIONES.forEach((opcion, index) => {
    const esSorpresa = opcion.antojo === "sorpresa";
    const card = el(
      "button",
      {
        className: `antojo-card stagger-item stagger-item--${index + 1}${esSorpresa ? " antojo-card--surprise" : ""}`,
        attrs: { type: "button" },
      },
      [
        el("span", { className: "antojo-card__icon", html: icon(opcion.iconName, 22) }),
        el("span", { className: "antojo-card__body" }, [
          el("span", { className: "antojo-card__title", text: opcion.titulo }),
          el("span", { className: "antojo-card__desc", text: opcion.desc }),
        ]),
      ]
    );

    card.addEventListener("click", () => resolverAntojo(opcion.antojo));
    grid.appendChild(card);
  });

  body.appendChild(grid);

  body.appendChild(
    el("div", { className: "antojo-footer" }, [
      el(
        "button",
        {
          className: "btn btn--ghost",
          attrs: { type: "button" },
          text: "Ver el menú completo",
        }
      ),
    ])
  );

  body.querySelector(".btn--ghost").addEventListener("click", () => {
    router.switchTab("menu");
  });

  container.appendChild(body);
}
