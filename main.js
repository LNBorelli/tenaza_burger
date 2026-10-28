/* Lógica de la página. Depende de config.js y menu-data.js. */

/* ---------- Utilidades ---------- */
function el(tag, props = {}, hijos = []) {
  const nodo = document.createElement(tag);
  Object.entries(props).forEach(([k, v]) => {
    if (k === "className") nodo.className = v;
    else if (k === "text") nodo.textContent = v;
    else nodo.setAttribute(k, v);
  });
  [].concat(hijos).forEach((h) => h && nodo.append(h));
  return nodo;
}

function urlWhatsapp(mensaje) {
  return `https://wa.me/${CONFIG.whatsappNumero}?text=${encodeURIComponent(mensaje)}`;
}

function abrirEnNuevaPestania(a) {
  a.target = "_blank";
  a.rel = "noopener noreferrer";
}

/* ---------- Botones de WhatsApp fijos del HTML ---------- */
document.querySelectorAll("[data-whatsapp]").forEach((a) => {
  a.href = urlWhatsapp(a.dataset.mensaje || "Hola! Quiero hacer un pedido.");
  abrirEnNuevaPestania(a);
});

/* ---------- Menú: tarjetas ---------- */

/* Selección de "Armá tu hamburguesa". Vive fuera de las tarjetas para que
   no se pierda al cambiar de filtro (las tarjetas se vuelven a crear). */
const seleccionArma = { toppings: new Set(), salsas: new Set(), bebida: null };

/* Devuelve lo elegido respetando el orden del menú. */
function elegidos(producto, clave) {
  return producto[clave].filter((item) => seleccionArma[clave].has(item));
}

function mensajeArma(producto, tamanio) {
  const lista = (clave) => {
    const items = elegidos(producto, clave);
    return items.length ? items.map((i) => `- ${i}`).join("\n") : "- Sin elegir";
  };
  return [
    `Hola! Quiero armar mi hamburguesa *${tamanio.nombre}* (${tamanio.precio}).`,
    "",
    "*Toppings:*",
    lista("toppings"),
    "",
    "*Salsas:*",
    lista("salsas"),
    "",
    "*Bebida:*",
    seleccionArma.bebida ? `- ${seleccionArma.bebida} (${BEBIDAS.precio})` : "- Sin bebida",
    "",
    "Sale con papas.",
  ].join("\n");
}

function textoResumen(producto) {
  const t = elegidos(producto, "toppings");
  const s = elegidos(producto, "salsas");
  const bebida = seleccionArma.bebida;
  if (!t.length && !s.length && !bebida) return "Todavía no elegiste toppings, salsas ni bebida.";
  return `Tu elección: ${[...t, ...s].join(", ") || "sin toppings ni salsas"}. Bebida: ${bebida || "sin bebida"}.`;
}

/* mensajeDe(tamanio) arma el texto de WhatsApp. Si no se pasa, usa el mensaje simple. */
function crearTamanios(producto, mensajeDe) {
  const mensaje = mensajeDe || ((t) => `Hola! Quiero pedir ${producto.nombre} ${t.nombre} (${t.precio}).`);
  const fila = el("div", { className: "tamanios" });
  const enlaces = TAMANIOS[producto.tamanios].map((t) => {
    const a = el("a", { className: "tamanio" }, [
      el("span", { className: "tamanio__nombre", text: t.nombre }),
      el("span", { className: "tamanio__precio", text: t.precio }),
    ]);
    abrirEnNuevaPestania(a);
    fila.append(a);
    return { a, t };
  });
  /* Vuelve a calcular el enlace de cada botón (se usa cuando cambia la selección). */
  fila.actualizarEnlaces = () => enlaces.forEach(({ a, t }) => { a.href = urlWhatsapp(mensaje(t)); });
  fila.actualizarEnlaces();
  return fila;
}

function crearSelector(titulo, items, seleccion, alCambiar) {
  const botones = items.map((item) => {
    const b = el("button", { className: "chip", type: "button", "aria-pressed": String(seleccion.has(item)), text: item });
    b.addEventListener("click", () => {
      if (seleccion.has(item)) seleccion.delete(item); else seleccion.add(item);
      b.setAttribute("aria-pressed", String(seleccion.has(item)));
      alCambiar();
    });
    return el("li", {}, [b]);
  });
  return el("div", {}, [el("h4", { text: titulo }), el("ul", { className: "chips chips--elegir" }, botones)]);
}

/* Bebida opcional: una sola opción a la vez (radio nativo, funciona con teclado). */
function crearBebidas(alCambiar) {
  const items = ["", ...BEBIDAS.opciones].map((opcion) => {
    const input = el("input", { className: "opcion__input", type: "radio", name: "bebida", value: opcion });
    input.checked = (seleccionArma.bebida || "") === opcion;
    input.addEventListener("change", () => {
      seleccionArma.bebida = opcion || null;
      alCambiar();
    });
    return el("li", {}, [el("label", { className: "opcion" }, [input, el("span", { className: "chip", text: opcion || "Sin bebida" })])]);
  });
  return el("div", { className: "bebidas" }, [
    el("h4", { text: `Bebida (${BEBIDAS.precio})` }),
    el("ul", { className: "chips chips--elegir" }, items),
  ]);
}

function crearTarjeta(p) {
  const tarjeta = el("article", { className: `tarjeta tarjeta--${p.categoria}` });

  if (p.imagen) {
    tarjeta.append(el("img", { className: "tarjeta__img", src: p.imagen, alt: p.alt, loading: "lazy", width: "270", height: "170" }));
  }
  tarjeta.append(el("h3", { text: p.nombre }));

  if (p.descripcion) tarjeta.append(el("p", { text: p.descripcion }));

  if (p.variantes) {
    tarjeta.append(el("ul", { className: "variantes" }, p.variantes.map((v) =>
      el("li", {}, [el("strong", { text: v.nombre + ": " }), v.descripcion])
    )));
  }

  const fila = p.tamanios ? crearTamanios(p, p.toppings ? (t) => mensajeArma(p, t) : undefined) : null;

  if (p.toppings) {
    const resumen = el("p", { className: "resumen", "aria-live": "polite" });
    const actualizar = () => {
      resumen.textContent = textoResumen(p);
      fila.actualizarEnlaces();
    };
    const borrar = el("button", { className: "enlace-boton", type: "button", text: "Borrar selección" });
    borrar.addEventListener("click", () => {
      seleccionArma.toppings.clear();
      seleccionArma.salsas.clear();
      seleccionArma.bebida = null;
      tarjeta.querySelectorAll(".chip[aria-pressed]").forEach((c) => c.setAttribute("aria-pressed", "false"));
      tarjeta.querySelector('.opcion__input[value=""]').checked = true;
      actualizar();
    });
    tarjeta.append(
      el("div", { className: "listas" }, [
        crearSelector("Toppings", p.toppings, seleccionArma.toppings, actualizar),
        crearSelector("Salsas", p.salsas, seleccionArma.salsas, actualizar),
      ]),
      crearBebidas(actualizar),
      resumen,
      borrar,
      el("h4", { className: "pedir-titulo", text: "Elegí el tamaño y pedí por WhatsApp" })
    );
    actualizar();
  }

  if (fila) tarjeta.append(fila);

  return tarjeta;
}

/* ---------- Menú: filtros ---------- */
const grilla = document.getElementById("grilla-menu");
const contenedorFiltros = document.getElementById("filtros");

function mostrarCategoria(id) {
  grilla.replaceChildren(...MENU.filter((p) => id === "todo" || p.categoria === id).map(crearTarjeta));
  contenedorFiltros.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.id === id)));
}

CATEGORIAS.forEach((c) => {
  const b = el("button", { className: "filtro", type: "button", "data-id": c.id, text: c.nombre });
  b.addEventListener("click", () => mostrarCategoria(c.id));
  contenedorFiltros.append(b);
});
mostrarCategoria("todo");

/* ---------- Contacto: datos reales o marcador "[Completar]" ---------- */
function dato(etiqueta, valor, enlace) {
  let contenido;
  if (!valor) {
    contenido = el("span", { className: "pendiente", text: `[Completar: ${etiqueta.toLowerCase()}]` });
  } else if (enlace) {
    contenido = el("a", { href: enlace, text: valor });
    abrirEnNuevaPestania(contenido);
  } else {
    contenido = document.createTextNode(valor);
  }
  return [el("dt", { text: etiqueta }), el("dd", {}, [contenido])];
}

document.getElementById("datos-contacto").append(
  ...dato("Teléfono", CONFIG.telefono),
  ...dato("Dirección", CONFIG.direccion),
  ...dato("Horarios", CONFIG.horarios),
  ...dato("Instagram", CONFIG.instagramUsuario, CONFIG.instagram)
);

/* ---------- Pie de página ---------- */
const pieRedes = document.getElementById("pie-redes");
if (CONFIG.instagram && CONFIG.instagramUsuario) {
  const a = el("a", { href: CONFIG.instagram, text: `Instagram ${CONFIG.instagramUsuario}` });
  abrirEnNuevaPestania(a);
  pieRedes.append(a);
} else {
  pieRedes.append(el("span", { className: "pendiente", text: "[Completar: redes sociales]" }));
}
document.getElementById("anio").textContent = new Date().getFullYear();

/* ---------- Menú móvil ---------- */
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function cerrarNav() {
  nav.classList.remove("nav--abierto");
  burger.setAttribute("aria-expanded", "false");
  burger.setAttribute("aria-label", "Abrir menú de navegación");
}

burger.addEventListener("click", () => {
  const abierto = nav.classList.toggle("nav--abierto");
  burger.setAttribute("aria-expanded", String(abierto));
  burger.setAttribute("aria-label", abierto ? "Cerrar menú de navegación" : "Abrir menú de navegación");
});
nav.addEventListener("click", (e) => { if (e.target.closest("a")) cerrarNav(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarNav(); });
