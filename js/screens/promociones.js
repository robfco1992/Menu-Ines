// ==========================================
// EXPERIENCIA INÉS — screens/promociones.js
// Sección independiente (no es parte del menú).
// Lee de promociones.json; si está vacío, muestra
// un estado vacío elegante en vez de ocultarse.
// ==========================================

"use strict";

import { el, formatPrice } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { getPromociones } from "../core/store.js";
import { router } from "../core/router.js";

function renderPromoCard(promo, index) {
  const card = el("div", { className: `promo-card stagger-item stagger-item--${index + 1}` }, [
    el("h3", { className: "promo-card__title", text: promo.titulo }),
  ]);

  if (promo.etiqueta) {
    card.appendChild(el("span", { className: "promo-card__tag", text: promo.etiqueta }));
  }

  if (promo.descripcion) {
    card.appendChild(el("p", { className: "promo-card__desc", text: promo.descripcion }));
  }

  if (promo.precio) {
    card.appendChild(el("p", { className: "promo-card__price", text: formatPrice(promo.precio) }));
  }

  return card;
}

export function renderPromociones(container) {
  container.classList.add("screen--with-navbar");

  const body = el("div", { className: "screen-body" });

  body.appendChild(
    el("div", { className: "section-heading" }, [
      el("h1", { className: "section-heading__title", text: "Promociones" }),
      el("p", { className: "section-heading__subtitle", text: "Ofertas especiales de INÉS Café." }),
    ])
  );

  const promos = getPromociones();

  if (!promos.length) {
    body.appendChild(
      el("div", { className: "empty-state" }, [
        el("div", { html: icon("tag", 40) }),
        el("p", { className: "empty-state__title", text: "Muy pronto, promociones especiales" }),
        el("p", {
          className: "empty-state__text",
          text: "Estamos preparando ofertas para ti. Vuelve pronto a esta sección.",
        }),
      ])
    );
    body.appendChild(
      el("div", { className: "antojo-footer" }, [
        el("button", { className: "btn btn--ghost", attrs: { type: "button" }, text: "Ver el menú mientras tanto" }),
      ])
    );
    body.querySelector(".btn--ghost").addEventListener("click", () => router.switchTab("menu"));
  } else {
    const lista = el("div", { className: "list-stack" });
    promos.forEach((promo, index) => lista.appendChild(renderPromoCard(promo, index)));
    body.appendChild(lista);
  }

  container.appendChild(body);
}
