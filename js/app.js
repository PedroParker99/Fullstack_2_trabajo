/* =====================================================
   VILLA DEL GLOBO - APP.JS
   Navbar + Carrito + Buscador + Login
===================================================== */


/* =====================================================
   CARRITO
===================================================== */

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];


/* =====================================================
   INICIAR APLICACIÓN
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    cargarNavbar();

});


/* =====================================================
   CARGAR NAVBAR.HTML
===================================================== */

function cargarNavbar() {

    const contenedorNavbar = document.getElementById("navbar");

    // Si la página no tiene #navbar, no hacemos nada
    if (!contenedorNavbar) {
        iniciarApp();
        return;
    }


    fetch("navbar.html")

        .then(function (respuesta) {

            if (!respuesta.ok) {
                throw new Error("No se pudo cargar navbar.html");
            }

            return respuesta.text();

        })

        .then(function (html) {

            contenedorNavbar.innerHTML = html;

            // IMPORTANTE:
            // El navbar ya existe, por lo tanto
            // ahora podemos activar sus funciones.
            iniciarApp();

        })

        .catch(function (error) {

            console.error("Error cargando navbar.html:", error);

        });

}


/* =====================================================
   INICIAR FUNCIONES
===================================================== */

function iniciarApp() {

    actualizarCarrito();

    activarCarrito();

    activarProductos();

    activarBuscador();

    activarLogin();

}


/* =====================================================
   GUARDAR CARRITO
===================================================== */

function guardarCarrito() {

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

}


/* =====================================================
   ACTUALIZAR CONTADOR DEL CARRITO
===================================================== */

function actualizarCarrito() {

    const contador = document.getElementById("cart-count");

    if (!contador) {
        return;
    }


    const cantidadTotal = carrito.reduce(
        function (total, producto) {

            return total + producto.cantidad;

        },
        0
    );


    contador.textContent = cantidadTotal;

}


/* =====================================================
   ACTIVAR BOTONES "AÑADIR AL CARRITO"
===================================================== */

function activarProductos() {

    const productos =
        document.querySelectorAll(".producto-card");


    productos.forEach(function (card) {

        // Busca SOLO el botón de carrito
        // dentro de esta tarjeta
        const boton =
            card.querySelector(".btn-rosa");


        if (!boton) {
            return;
        }


        boton.addEventListener("click", function () {

            const nombreElemento =
                card.querySelector(".card-title");


            const precioElemento =
                card.querySelector(".fs-5");


            const imagenElemento =
                card.querySelector("img");


            if (!nombreElemento || !precioElemento) {
                return;
            }


            const nombre =
                nombreElemento.textContent.trim();


            const precioTexto =
                precioElemento.textContent.trim();


            const precio =
                parseInt(
                    precioTexto.replace(/\D/g, ""),
                    10
                );


            const imagen =
                imagenElemento
                    ? imagenElemento.getAttribute("src")
                    : "";


            if (!nombre || isNaN(precio)) {
                return;
            }


            agregarAlCarrito(
                nombre,
                precio,
                imagen
            );

        });

    });

}


/* =====================================================
   AGREGAR PRODUCTO AL CARRITO
===================================================== */

function agregarAlCarrito(
    nombre,
    precio,
    imagen
) {

    const productoExistente =
        carrito.find(function (producto) {

            return producto.nombre === nombre;

        });


    if (productoExistente) {

        productoExistente.cantidad++;

    } else {

        carrito.push({

            nombre: nombre,

            precio: precio,

            imagen: imagen,

            cantidad: 1

        });

    }


    guardarCarrito();

    actualizarCarrito();

    mostrarCarrito();


    // Mensaje visual
    mostrarMensajeCarrito();

}


/* =====================================================
   ACTIVAR OFFCANVAS DEL CARRITO
===================================================== */

function activarCarrito() {

    const offcanvas =
        document.getElementById("offcanvasCarrito");


    if (!offcanvas) {
        return;
    }


    offcanvas.addEventListener(
        "show.bs.offcanvas",
        function () {

            mostrarCarrito();

        }
    );

}


/* =====================================================
   MOSTRAR PRODUCTOS DEL CARRITO
===================================================== */

function mostrarCarrito() {

    const contenedor =
        document.getElementById("carritoProductos");


    if (!contenedor) {
        return;
    }


    contenedor.innerHTML = "";


    /* -------------------------
       CARRITO VACÍO
    ------------------------- */

    if (carrito.length === 0) {

        contenedor.innerHTML = `

            <div class="text-center py-5">

                <i class="bi bi-bag fs-1 text-muted"></i>

                <p class="mt-3 text-muted mb-0">
                    Tu carrito está vacío
                </p>

            </div>

        `;


        actualizarTotal();

        return;

    }


    /* -------------------------
       PRODUCTOS
    ------------------------- */

    carrito.forEach(function (producto, index) {

        const subtotal =
            producto.precio * producto.cantidad;


        contenedor.innerHTML += `

            <div class="d-flex gap-3
                        border-bottom py-3">

                <!-- Imagen -->

                <img
                    src="${producto.imagen}"
                    width="70"
                    height="70"
                    class="rounded object-fit-cover"
                    alt="${producto.nombre}">


                <!-- Información -->

                <div class="flex-grow-1">

                    <h6 class="mb-1">
                        ${producto.nombre}
                    </h6>


                    <p class="small mb-2 text-muted">

                        $${producto.precio.toLocaleString("es-CL")}

                    </p>


                    <!-- Cantidad -->

                    <div class="d-flex
                                align-items-center
                                gap-2">


                        <!-- Restar -->

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="cambiarCantidad(${index}, -1)">

                            −

                        </button>


                        <!-- Cantidad -->

                        <span class="fw-semibold">

                            ${producto.cantidad}

                        </span>


                        <!-- Sumar -->

                        <button
                            type="button"
                            class="btn btn-sm btn-outline-secondary"
                            onclick="cambiarCantidad(${index}, 1)">

                            +

                        </button>


                        <!-- Eliminar -->

                        <button
                            type="button"
                            class="btn btn-sm text-danger ms-auto"
                            onclick="eliminarProducto(${index})"
                            aria-label="Eliminar producto">

                            <i class="bi bi-trash"></i>

                        </button>

                    </div>


                    <!-- Subtotal -->

                    <small class="text-muted d-block mt-2">

                        Subtotal:
                        $${subtotal.toLocaleString("es-CL")}

                    </small>

                </div>

            </div>

        `;

    });


    actualizarTotal();

}


/* =====================================================
   ACTUALIZAR TOTAL
===================================================== */

function actualizarTotal() {

    const elementoTotal =
        document.getElementById("carritoTotal");


    if (!elementoTotal) {
        return;
    }


    const total =
        carrito.reduce(
            function (suma, producto) {

                return suma +
                    producto.precio *
                    producto.cantidad;

            },
            0
        );


    elementoTotal.textContent =
        "$" + total.toLocaleString("es-CL");

}


/* =====================================================
   CAMBIAR CANTIDAD
===================================================== */

function cambiarCantidad(
    index,
    cambio
) {

    if (!carrito[index]) {
        return;
    }


    carrito[index].cantidad += cambio;


    // Si llega a 0, se elimina
    if (carrito[index].cantidad <= 0) {

        carrito.splice(index, 1);

    }


    guardarCarrito();

    actualizarCarrito();

    mostrarCarrito();

}


/* =====================================================
   ELIMINAR PRODUCTO
===================================================== */

function eliminarProducto(index) {

    if (!carrito[index]) {
        return;
    }


    carrito.splice(index, 1);


    guardarCarrito();

    actualizarCarrito();

    mostrarCarrito();

}


/* =====================================================
   HACER FUNCIONES DISPONIBLES EN HTML
===================================================== */

window.cambiarCantidad =
    cambiarCantidad;


window.eliminarProducto =
    eliminarProducto;


/* =====================================================
   BUSCADOR
===================================================== */

function activarBuscador() {

    const buscador =
        document.getElementById("buscador");


    if (!buscador) {
        return;
    }


    buscador.addEventListener(
        "input",
        function () {

            const texto =
                buscador.value
                    .toLowerCase()
                    .trim();


            const productos =
                document.querySelectorAll(
                    ".producto-card"
                );


            productos.forEach(function (producto) {

                const nombre =
                    producto.querySelector(
                        ".card-title"
                    );


                if (!nombre) {
                    return;
                }


                const nombreProducto =
                    nombre.textContent
                        .toLowerCase()
                        .trim();


                const columna =
                    producto.closest(".col");


                if (!columna) {
                    return;
                }


                if (
                    nombreProducto.includes(texto)
                ) {

                    columna.style.display = "";

                } else {

                    columna.style.display = "none";

                }

            });

        }
    );

}


/* =====================================================
   LOGIN
===================================================== */

function activarLogin() {

    const formulario =
        document.getElementById("formLogin");


    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        function (evento) {

            evento.preventDefault();


            const correoElemento =
                document.getElementById(
                    "correoLogin"
                );


            const passwordElemento =
                document.getElementById(
                    "passwordLogin"
                );


            const mensaje =
                document.getElementById(
                    "mensajeLogin"
                );


            if (!correoElemento || !passwordElemento) {
                return;
            }


            const correo =
                correoElemento.value.trim();


            const password =
                passwordElemento.value.trim();


            /* -------------------------
               VALIDAR
            ------------------------- */

            if (!correo || !password) {

                mostrarMensajeLogin(
                    mensaje,
                    "Completa todos los campos.",
                    "danger"
                );

                return;

            }


            /* -------------------------
               GUARDAR USUARIO
            ------------------------- */

            const usuario = {

                correo: correo

            };


            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );


            /* -------------------------
               MENSAJE
            ------------------------- */

            mostrarMensajeLogin(
                mensaje,
                "Sesión iniciada correctamente.",
                "success"
            );


            /* -------------------------
               CERRAR MODAL
            ------------------------- */

            setTimeout(function () {

                const modalElemento =
                    document.getElementById(
                        "modalLogin"
                    );


                if (modalElemento) {

                    const modal =
                        bootstrap.Modal.getInstance(
                            modalElemento
                        );


                    if (modal) {
                        modal.hide();
                    }

                }

            }, 800);

        }
    );

}


/* =====================================================
   MOSTRAR MENSAJE LOGIN
===================================================== */

function mostrarMensajeLogin(
    elemento,
    mensaje,
    tipo
) {

    if (!elemento) {
        return;
    }


    elemento.textContent = mensaje;


    elemento.className =
        "text-" +
        tipo +
        " text-center mt-3";

}


/* =====================================================
   MENSAJE AL AGREGAR PRODUCTO
===================================================== */

function mostrarMensajeCarrito() {

    // Si Bootstrap no está disponible,
    // simplemente no mostramos el mensaje.
    if (typeof bootstrap === "undefined") {
        return;
    }


    const offcanvasElemento =
        document.getElementById(
            "offcanvasCarrito"
        );


    if (!offcanvasElemento) {
        return;
    }


    // Abrimos automáticamente el carrito
    const offcanvas =
        bootstrap.Offcanvas.getOrCreateInstance(
            offcanvasElemento
        );


    offcanvas.show();

}