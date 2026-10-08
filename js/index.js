// ==========================================
//  LÓGICA DE PRODUCTOS Y FAVORITOS
// ==========================================

let favoritosIndex = JSON.parse(localStorage.getItem("favoritos")) || [];

document.addEventListener("DOMContentLoaded", function () {
    iniciarProductosIndex();
    iniciarFavoritosIndex();
});

// 1. GESTIÓN DE PRODUCTOS Y CARRITO
function iniciarProductosIndex() {
    document.querySelectorAll(".producto-card").forEach(function (producto) {
        // Localiza el botón de agregar al carrito por su icono o clase
        const boton = Array.from(producto.querySelectorAll("button")).find(function (btn) {
            return btn.querySelector(".bi-bag-plus") || btn.classList.contains("btn-agregar-carrito");
        });

        if (!boton) return;

        boton.addEventListener("click", function () {
            const datos = obtenerDatosProductoIndex(producto);
            if (!datos) return;

            // Agrega al carrito global en localStorage (definido en app.js)
            if (typeof agregarProducto === "function") {
                agregarProducto(datos.nombre, datos.precio, datos.imagen);
            }

            // Muestra mensaje temporal de confirmación (definido en app.js)
            if (typeof mostrarConfirmacion === "function") {
                mostrarConfirmacion(boton, "Agregado");
            }
        });
    });
}

// 2. EXTRAER DATOS DEL PRODUCTO
function obtenerDatosProductoIndex(producto) {
    const nombre = producto.querySelector(".card-title")?.textContent.trim();

    // Lee el precio desde dataset (data-precio) o parsea el texto numérico
    const precioData = Number(producto.dataset.precio);
    const precioTexto = producto.querySelector(".fs-5, .fw-bold, .text-danger")?.textContent || "";
    const precio = precioData || parseInt(precioTexto.replace(/\D/g, ""), 10);

    const imagen = producto.querySelector("img")?.getAttribute("src") || "";

    if (!nombre || isNaN(precio)) return null;

    return {
        nombre,
        precio,
        imagen
    };
}

// 3. GESTIÓN DE FAVORITOS
function iniciarFavoritosIndex() {
    document.querySelectorAll(".producto-card .btn-favorito").forEach(function (boton) {
        const producto = boton.closest(".producto-card");
        if (!producto) return;

        const datos = obtenerDatosProductoIndex(producto);
        if (!datos) return;

        actualizarCorazonIndex(boton, datos.nombre);

        boton.addEventListener("click", function () {
            alternarFavoritoIndex(datos);
            actualizarCorazonIndex(boton, datos.nombre);
        });
    });
}

function alternarFavoritoIndex(producto) {
    favoritosIndex = JSON.parse(localStorage.getItem("favoritos")) || [];

    const index = favoritosIndex.findIndex(function (fav) {
        return fav.nombre === producto.nombre;
    });

    if (index >= 0) {
        favoritosIndex.splice(index, 1);
    } else {
        favoritosIndex.push({
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        });
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritosIndex));
}

function actualizarCorazonIndex(boton, nombre) {
    favoritosIndex = JSON.parse(localStorage.getItem("favoritos")) || [];
    const icono = boton.querySelector("i");

    const activo = favoritosIndex.some(function (fav) {
        return fav.nombre === nombre;
    });

    boton.classList.toggle("activo", activo);

    if (icono) {
        icono.className = activo ? "bi bi-heart-fill" : "bi bi-heart";
    }

    boton.setAttribute(
        "aria-label",
        activo ? `Quitar ${nombre} de favoritos` : `Agregar ${nombre} a favoritos`
    );
}