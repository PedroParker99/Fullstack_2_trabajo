let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

document.addEventListener("DOMContentLoaded", function () {
    iniciarBuscadorGlobal();
    iniciarCarrito();
    iniciarLogin();
    actualizarMenuUsuario();
    iniciarCerrarSesion();
});

// BUSCADOR GLOBAL
function iniciarBuscadorGlobal() {
    const formulario = document.getElementById("formBuscador");
    const buscador = document.getElementById("buscador");

    if (!formulario || !buscador) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const texto = buscador.value.trim();
        if (!texto) return;

        localStorage.setItem("busquedaProducto", texto);
        window.location.href = "packs.html";
    });
}

// CARRITO
function iniciarCarrito() {
    actualizarContadorCarrito();
    mostrarCarrito();
}

function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarProducto(nombre, precio, imagen) {
    const existente = carrito.find(function (producto) {
        return producto.nombre === nombre;
    });

    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push({
            nombre,
            precio,
            imagen,
            cantidad: 1
        });
    }

    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function actualizarContadorCarrito() {
    const contador = document.getElementById("cart-count");
    if (!contador) return;

    const cantidad = carrito.reduce(function (total, producto) {
        return total + producto.cantidad;
    }, 0);

    contador.textContent = cantidad;
}

function mostrarCarrito() {
    const contenedor = document.getElementById("carritoProductos");
    if (!contenedor) return;

    if (!carrito.length) {
        contenedor.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-bag fs-1 text-muted"></i>
                <p class="text-muted mt-3 mb-0">Tu carrito está vacío</p>
            </div>
        `;

        actualizarTotal();
        return;
    }

    contenedor.innerHTML = carrito.map(function (producto, index) {
        const subtotal = producto.precio * producto.cantidad;

        return `
            <div class="d-flex gap-3 border-bottom py-3">
                <img
                    src="${producto.imagen}"
                    alt="${producto.nombre}"
                    width="70"
                    height="70"
                    class="rounded object-fit-cover">

                <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">${producto.nombre}</h6>

                    <p class="small text-muted mb-2">
                        $${producto.precio.toLocaleString("es-CL")}
                    </p>

                    <div class="d-flex align-items-center gap-2">
                        <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="cambiarCantidad(${index}, -1)">
                            −
                        </button>

                        <span class="fw-semibold">
                            ${producto.cantidad}
                        </span>

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="cambiarCantidad(${index}, 1)">
                            +
                        </button>

                        <button
                            type="button"
                            class="btn btn-sm text-danger ms-auto"
                            onclick="eliminarProducto(${index})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>

                    <small class="text-muted d-block mt-2">
                        Subtotal: $${subtotal.toLocaleString("es-CL")}
                    </small>
                </div>
            </div>
        `;
    }).join("");

    actualizarTotal();
}

function cambiarCantidad(index, cambio) {
    if (!carrito[index]) return;

    carrito[index].cantidad += cambio;

    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function eliminarProducto(index) {
    if (!carrito[index]) return;

    carrito.splice(index, 1);

    guardarCarrito();
    actualizarContadorCarrito();
    mostrarCarrito();
}

function actualizarTotal() {
    const totalElemento = document.getElementById("carritoTotal");
    if (!totalElemento) return;

    const total = carrito.reduce(function (suma, producto) {
        return suma + producto.precio * producto.cantidad;
    }, 0);

    totalElemento.textContent =
        "$" + total.toLocaleString("es-CL");
}

window.agregarProducto = agregarProducto;
window.cambiarCantidad = cambiarCantidad;
window.eliminarProducto = eliminarProducto;

// LOGIN
function iniciarLogin() {
    const formulario = document.getElementById("formLogin");
    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const correo =
            document.getElementById("correoLogin")?.value.trim();

        const password =
            document.getElementById("passwordLogin")?.value.trim();

        const mensaje =
            document.getElementById("mensajeLogin");

        if (!correo || !password) {
            mostrarMensajeLogin(
                mensaje,
                "Completa todos los campos.",
                false
            );
            return;
        }

        let tipo = "usuario";

        if (
            correo === "admin@villadelglobo.cl" &&
            password === "admin123"
        ) {
            tipo = "admin";
        }

        let datosUsuario =
            JSON.parse(localStorage.getItem("datosUsuario")) || {};

        if (tipo === "usuario") {
            datosUsuario.correo = correo;

            if (!datosUsuario.nombre) datosUsuario.nombre = "Usuario";
            if (!datosUsuario.apellido) datosUsuario.apellido = "";
            if (!datosUsuario.telefono) datosUsuario.telefono = "";

            localStorage.setItem(
                "datosUsuario",
                JSON.stringify(datosUsuario)
            );
        }

        const usuario = {
            correo,
            tipo,
            sesionActiva: true
        };

        localStorage.setItem(
            "usuario",
            JSON.stringify(usuario)
        );

        mostrarMensajeLogin(
            mensaje,
            "Sesión iniciada correctamente.",
            true
        );

        setTimeout(function () {
            if (tipo === "admin") {
                window.location.href = "perfilAdmin.html";
            } else {
                window.location.href = "perfilUsuario.html";
            }
        }, 500);
    });
}

function mostrarMensajeLogin(elemento, texto, correcto) {
    if (!elemento) return;

    elemento.textContent = texto;

    elemento.className = correcto
        ? "text-success text-center mt-3 mb-0"
        : "text-danger text-center mt-3 mb-0";
}

// SESIÓN
function obtenerUsuario() {
    return JSON.parse(localStorage.getItem("usuario")) || null;
}

function sesionUsuarioActiva() {
    const usuario = obtenerUsuario();

    return Boolean(
        usuario &&
        usuario.sesionActiva &&
        usuario.tipo === "usuario"
    );
}

function sesionAdminActiva() {
    const usuario = obtenerUsuario();

    return Boolean(
        usuario &&
        usuario.sesionActiva &&
        usuario.tipo === "admin"
    );
}

function actualizarMenuUsuario() {
    const menu = document.getElementById("menuUsuario");
    if (!menu) return;

    const usuario = obtenerUsuario();

    if (!usuario || !usuario.sesionActiva) return;

    const perfil =
        usuario.tipo === "admin"
            ? "perfilAdmin.html"
            : "perfilUsuario.html";

    menu.innerHTML = `
        <li>
            <div class="px-2 py-2">
                <p class="small text-muted mb-1">
                    Sesión iniciada como
                </p>

                <p class="fw-semibold mb-0">
                    ${usuario.correo}
                </p>
            </div>
        </li>

        <li>
            <hr class="dropdown-divider">
        </li>

        <li>
            <a
                href="${perfil}"
                class="dropdown-item rounded py-2">
                <i class="bi bi-person me-2"></i>
                Mi perfil
            </a>
        </li>

        ${
            usuario.tipo === "usuario"
                ? `
                    <li>
                        <a
                            href="usuarioFavoritos.html"
                            class="dropdown-item rounded py-2">
                            <i class="bi bi-heart me-2"></i>
                            Mis favoritos
                        </a>
                    </li>

                    <li>
                        <a
                            href="usuarioCompras.html"
                            class="dropdown-item rounded py-2">
                            <i class="bi bi-box-seam me-2"></i>
                            Mis compras
                        </a>
                    </li>
                `
                : ""
        }

        <li>
            <hr class="dropdown-divider">
        </li>

        <li>
            <button
                type="button"
                class="dropdown-item rounded py-2 text-danger"
                onclick="cerrarSesion()">
                <i class="bi bi-box-arrow-right me-2"></i>
                Cerrar sesión
            </button>
        </li>
    `;
}

function iniciarCerrarSesion() {
    const boton = document.getElementById("cerrarSesion");
    if (!boton) return;

    boton.addEventListener("click", function (evento) {
        evento.preventDefault();
        cerrarSesion();
    });
}

function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "index.html";
}

window.obtenerUsuario = obtenerUsuario;
window.sesionUsuarioActiva = sesionUsuarioActiva;
window.sesionAdminActiva = sesionAdminActiva;
window.cerrarSesion = cerrarSesion;

// UTILIDADES
function normalizarTexto(texto) {
    return String(texto)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();
}

function mostrarConfirmacion(boton, texto) {
    if (!boton) return;

    const original = boton.innerHTML;

    boton.innerHTML =
        `<i class="bi bi-check-lg me-2"></i>${texto}`;

    boton.disabled = true;

    setTimeout(function () {
        boton.innerHTML = original;
        boton.disabled = false;
    }, 1000);
}

window.normalizarTexto = normalizarTexto;
window.mostrarConfirmacion = mostrarConfirmacion;