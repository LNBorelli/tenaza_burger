/* Datos del menú, copiados de las imágenes del negocio.
   Para cambiar un precio o un nombre, editá solo este archivo. */
const MENU = [
  {
    categoria: "casa",
    nombre: "Clásica",
    descripcion: "Carne smash (110gr), salsa mil islas, cheddar, lechuga y tomate.",
    imagen: "img/burgers/clasica.jpg",
    alt: "Hamburguesa Clásica con lechuga, tomate y cheddar",
    tamanios: "casa",
  },
  {
    categoria: "casa",
    nombre: "La 419",
    descripcion: "Carne smash (110gr), mayo casera, cheddar y mermelada de bacon.",
    imagen: "img/burgers/la-419.jpg",
    alt: "Hamburguesa La 419 con bacon y cheddar",
    tamanios: "casa",
  },
  {
    categoria: "casa",
    nombre: "Walter's",
    descripcion: "Carne smash (110gr), mayo de ajo, cheddar, huevo, panceta y cebolla crispy.",
    imagen: "img/burgers/walters.jpg",
    alt: "Hamburguesa Walter's con huevo, panceta y cebolla crispy",
    tamanios: "casa",
  },
  {
    categoria: "casa",
    nombre: "La Big",
    descripcion: "Carne smash (110gr), salsa guacamole, cheddar y pimientos salteados.",
    imagen: "img/burgers/la-big.jpg",
    alt: "Hamburguesa La Big con cheddar y pimientos salteados",
    tamanios: "casa",
  },
  {
    categoria: "casa",
    nombre: "Las Tenaza",
    variantes: [
      { nombre: "Tenaza cheddar", descripcion: "carne smash (110gr), mayo casera, cheddar y blend de hongos." },
      { nombre: "Tenaza queso azul", descripcion: "carne smash (110gr), mayo berenjena, queso azul y blend de hongos." },
    ],
    imagen: "img/burgers/las-tenaza.jpg",
    alt: "Las dos hamburguesas Tenaza: cheddar y queso azul, con blend de hongos",
    tamanios: "casa",
  },
  {
    categoria: "arma",
    nombre: "Armá tu hamburguesa",
    descripcion: "Marcá los toppings, las salsas y la bebida que quieras y tocá un tamaño: se abre WhatsApp con tu pedido armado. Sale con papas.",
    tamanios: "arma",
    toppings: ["Queso Cheddar", "Queso Tybo", "Queso azul", "Bacon", "Huevo a la plancha", "Lechuga",
               "Tomate", "Cebolla caramelizada", "Cebolla crispy", "Pimientos salteados", "Hongos salteados"],
    salsas: ["Mayo casera", "Mayo de berenjenas", "Blend de champiñones", "Salsa guacamole",
             "Mermelada de bacon", "Mil Islas", "Mostaza", "Ketchup"],
  },
];

/* Bebida opcional dentro de "Armá tu hamburguesa". */
const BEBIDAS = {
  precio: "$ 2.000",
  opciones: ["Pepsi Black", "Pepsi", "7UP"],
};

/* Precios tal cual figuran en cada imagen de menú. */
const TAMANIOS = {
  casa: [
    { nombre: "Simple", precio: "$ 13.500" },
    { nombre: "Doble", precio: "$ 15.500" },
    { nombre: "Triple", precio: "$ 17.000" },
  ],
  arma: [
    { nombre: "Simple", precio: "$ 15.000" },
    { nombre: "Doble", precio: "$ 17.500" },
    { nombre: "Triple", precio: "$ 19.500" },
  ],
};

const CATEGORIAS = [
  { id: "todo", nombre: "Todo" },
  { id: "casa", nombre: "De la casa" },
  { id: "arma", nombre: "Armá la tuya" },
];
