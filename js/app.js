// ==========================================
// EXPERIENCIA INÉS — app.js
// Único punto de entrada. Su responsabilidad es
// EXCLUSIVAMENTE: cargar datos, registrar pantallas
// e iniciar el router. No contiene lógica de interfaz.
// ==========================================

"use strict";

import { cargarDatos } from "./core/loader.js";
import { setDatos, getConfig } from "./core/store.js";
import { initRouter } from "./core/router.js";
import { montarNavbar } from "./components/navbar.js";

import { renderHero } from "./screens/hero.js";
import { renderAntojo } from "./screens/antojo.js";
import { renderMenuCategorias } from "./screens/menu-categorias.js";
import { renderCategoriaDetalle } from "./screens/categoria-detalle.js";
import { renderProductoDetalle } from "./screens/producto-detalle.js";
import { renderResultadoAntojo } from "./screens/resultado-antojo.js";
import { renderPromociones } from "./screens/promociones.js";
import { renderUbicacion } from "./screens/ubicacion.js";
import { renderContacto } from "./screens/contacto.js";

const PANTALLAS = {
  hero: renderHero,
  antojo: renderAntojo,
  menu: renderMenuCategorias,
  categoria: renderCategoriaDetalle,
  producto: renderProductoDetalle,
  "resultado-antojo": renderResultadoAntojo,
  promociones: renderPromociones,
  ubicacion: renderUbicacion,
  contacto: renderContacto,
};

async function iniciar() {
  const datos = await cargarDatos();
  setDatos(datos);

  const screenStack = document.getElementById("screen-stack");
  const navbarEl = document.getElementById("navbar");

  initRouter(screenStack, PANTALLAS, "hero");
  montarNavbar(navbarEl, getConfig().nav || []);
}

window.addEventListener("DOMContentLoaded", iniciar);
