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
function crearTamanios(producto) {
  const fila = el("div", { className: "tamanios" });
  TAMANIOS[producto.tamanios].forEach((t) => {
    const a = el("a", { className: "tamanio", href: urlWhatsapp(`Hola! Quiero pedir ${producto.nombre} ${t.nombre} (${t.precio}).`) }, [
      el("span", { className: "tamanio__nombre", text: t.nombre }),
      el("span", { className: "tamanio__precio", text: t.precio }),
    ]);
    abrirEnNuevaPestania(a);
    fila.append(a);
  });
  return fila;
}

function crearLista(titulo, items) {
  return el("div", {}, [
    el("h4", { text: titulo }),
    el("ul", { className: "chips" }, items.map((i) => el("li", { text: i }))),
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

  if (p.toppings) {
    tarjeta.append(el("div", { className: "listas" }, [crearLista("Toppings", p.toppings), crearLista("Salsas", p.salsas)]));
  }

  if (p.tamanios) tarjeta.append(crearTamanios(p));

  if (p.precio) {
    const a = el("a", { className: "boton boton--claro", href: urlWhatsapp("Hola! Quiero sumar bebidas a mi pedido.") }, [`Pedir bebida · ${p.precio}`]);
    abrirEnNuevaPestania(a);
    tarjeta.append(a);
  }
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
