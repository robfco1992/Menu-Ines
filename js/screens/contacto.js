// ==========================================
// EXPERIENCIA INÉS — screens/contacto.js
// Sección independiente: acciones de contacto como
// botones con icono (WhatsApp, redes, cómo llegar).
// Nunca se muestra una URL en pantalla.
// ==========================================

"use strict";

import { el } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { getConfig } from "../core/store.js";
import { crearLogo } from "../components/brand-logo.js";

function botonAccion({ iconName, label, href, index }) {
  return el(
    "a",
    {
      className: `action-btn stagger-item stagger-item--${index}`,
      attrs: { href, target: "_blank", rel: "noopener" },
    },
    [
      el("span", { className: "action-btn__icon", html: icon(iconName, 19) }),
      el("span", { className: "action-btn__label", text: label }),
    ]
  );
}

export function renderContacto(container) {
  container.classList.add("screen--with-navbar");

  const config = getConfig();
  const contact = config.contact || {};

  const body = el("div", { className: "screen-body" });

  body.appendChild(crearLogo("contacto"));

  body.appendChild(
    el("div", { className: "section-heading" }, [
      el("h1", { className: "section-heading__title", text: "Contacto" }),
      el("p", { className: "section-heading__subtitle", text: "Escríbenos o síguenos." }),
    ])
  );

  const acciones = [];
  let i = 1;

  if (contact.whatsapp) {
    acciones.push(
      botonAccion({
        iconName: "whatsapp",
        label: "WhatsApp",
        href: `https://wa.me/${contact.whatsapp}`,
        index: i++,
      })
    );
  }

  if (contact.instagram) {
    acciones.push(
      botonAccion({
        iconName: "instagram",
        label: "Instagram",
        href: contact.instagram,
        index: i++,
      })
    );
  }

  if (contact.facebook) {
    acciones.push(
      botonAccion({
        iconName: "facebook",
        label: "Facebook",
        href: contact.facebook,
        index: i++,
      })
    );
  }

  if (acciones.length) {
    const grid = el("div", { className: "action-grid" });
    acciones.forEach((btn) => grid.appendChild(btn));
    body.appendChild(grid);
  } else {
    body.appendChild(
      el("div", { className: "empty-state" }, [
        el("div", { html: icon("whatsapp", 38) }),
        el("p", { className: "empty-state__title", text: "Datos de contacto próximamente" }),
      ])
    );
  }

  if (contact.mapsUrl) {
    body.appendChild(
      el("div", { className: "antojo-footer" }, [
        el("a", {
          className: "btn btn--map",
          attrs: { href: contact.mapsUrl, target: "_blank", rel: "noopener" },
          html: `${icon("compass", 18)}<span>Cómo llegar</span>`,
        }),
      ])
    );
  }

  container.appendChild(body);
}
