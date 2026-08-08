// ==========================================
// EXPERIENCIA INÉS — screens/ubicacion.js
// Sección independiente: dirección, horario y una
// ilustración SVG minimalista (sin fotografía de stock,
// sin dependencias externas de mapas).
// ==========================================

"use strict";

import { el, nombreDiaActual } from "../core/dom.js";
import { icon } from "../core/icons.js";
import { getConfig } from "../core/store.js";

const DIAS = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

function ilustracionMapa() {
  return `
    <svg viewBox="0 0 400 160" width="100%" height="140" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="160" fill="#EFE6D6"/>
      <path d="M0 40 Q100 10 200 45 T400 30" stroke="#E0D3B8" stroke-width="18" fill="none"/>
      <path d="M0 120 Q120 90 240 125 T400 100" stroke="#E7DBC2" stroke-width="26" fill="none"/>
      <circle cx="200" cy="78" r="34" fill="rgba(154,106,69,.12)"/>
      <path d="M200 58a20 20 0 0 1 20 20c0 13-20 34-20 34s-20-21-20-34a20 20 0 0 1 20-20Z" fill="#9A6A45"/>
      <circle cx="200" cy="78" r="7" fill="#EFE6D6"/>
    </svg>
  `;
}

export function renderUbicacion(container) {
  container.classList.add("screen--with-navbar");

  const config = getConfig();
  const address = config.address || {};
  const schedule = config.schedule || {};
  const hoy = nombreDiaActual();

  const body = el("div", { className: "screen-body" });

  body.appendChild(
    el("div", { className: "section-heading" }, [
      el("h1", { className: "section-heading__title", text: "Ubicación" }),
      el("p", { className: "section-heading__subtitle", text: "Ven a visitarnos." }),
    ])
  );

  const mapaWrap = el("div", { className: "map-illustration", html: ilustracionMapa() });
  if (config.contact?.mapsUrl) {
    const link = el("a", { attrs: { href: config.contact.mapsUrl, target: "_blank", rel: "noopener" } }, [mapaWrap]);
    body.appendChild(link);
  } else {
    body.appendChild(mapaWrap);
  }

  const tieneDireccion = address.linea1 || address.linea2;

  const tarjeta = el("div", { className: "info-section" });

  tarjeta.appendChild(
    el("div", { className: "info-row" }, [
      el("span", { className: "info-row__icon", html: icon("map-pin", 18) }),
      el("div", {}, [
        el("span", { className: "info-row__label", text: "Dirección" }),
        el("p", {
          className: "info-row__value",
          text: tieneDireccion
            ? [
                address.linea1,
                address.linea2,
                [address.municipio, address.estado].filter(Boolean).join(", "),
                address.cp ? `C.P. ${address.cp}` : null,
              ]
                .filter(Boolean)
                .join(" · ")
            : "Próximamente",
        }),
      ]),
    ])
  );

  tarjeta.appendChild(
    el("div", { className: "info-row" }, [
      el("span", { className: "info-row__icon", html: icon("clock", 18) }),
      el("div", {}, [
        el("span", { className: "info-row__label", text: "Horario" }),
        el(
          "div",
          {},
          Object.entries(DIAS).map(([key, label]) =>
            el("div", { className: `schedule-row${key === hoy ? " schedule-row--today" : ""}` }, [
              el("span", { className: "schedule-row__day", text: label }),
              el("span", { className: "schedule-row__hours", text: schedule[key] || "Cerrado" }),
            ])
          )
        ),
      ]),
    ])
  );

  body.appendChild(tarjeta);

  if (config.contact?.mapsUrl) {
    const comoLlegar = el("div", { className: "antojo-footer" }, [
      el("a", {
        className: "btn btn--map",
        attrs: { href: config.contact.mapsUrl, target: "_blank", rel: "noopener" },
        html: `${icon("compass", 18)}<span>Cómo llegar</span>`,
      }),
    ]);
    body.appendChild(comoLlegar);
  }

  container.appendChild(body);
}
