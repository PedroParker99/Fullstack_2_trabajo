let favoritos =
    JSON.parse(localStorage.getItem("favoritos")) || [];

document.addEventListener("DOMContentLoaded", function () {
    mostrarFavoritos();
    iniciarAgregarTodosFavoritos();
});

// MOSTRAR FAVORITOS
function mostrarFavoritos() {
    const contenedor =
        document.getElementById("listaFavoritos");

    if (!contenedor) return;

    favoritos =
        JSON.parse(localStorage.getItem("favoritos")) || [];

    const cantidad =
        document.getElementById("cantidadFavoritos");

    const sinFavoritos =
        document.getElementById("sinFavoritos");

    const botonTodos =
        document.getElementById("agregarTodosCarrito");

    if (cantidad) {
        cantidad.textContent =
            `${favoritos.length} ${
                favoritos.length === 1
                    ? "producto guardado"
                    : "productos guardados"
            }`;
    }

    if (!favoritos.length) {
        contenedor.innerHTML = "";

        if (sinFavoritos) {
            sinFavoritos.classList.remove("d-none");
        }

        if (botonTodos) {
            botonTodos.disabled = true;
        }

        return;
    }

    if (sinFavoritos) {
        sinFavoritos.classList.add("d-none");
    }

    if (botonTodos) {
        botonTodos.disabled = false;
    }

    contenedor.innerHTML =
        favoritos.map(function (producto, index) {
            return `
                <div class="col">
                    <article class="card producto-card h-100 border-0 shadow-sm">

                        <div class="producto-imagen">

                            <img
                                src="${producto.imagen}"
                                class="card-img-top"
                                alt="${producto.nombre}">

                            <span class="badge bg-rosa producto-badge">
                                Pack cumpleaños
                            </span>

                            <button
                                type="button"
                                class="btn btn-light rounded-circle btn-favorito activo shadow-sm"
                                onclick="eliminarFavorito(${index})"
                                aria-label="Quitar ${producto.nombre} de favoritos">

                                <i class="bi bi-heart-fill"></i>
                            </button>

                        </div>

                        <div class="card-body d-flex flex-column p-4">

                            <h5 class="card-title fw-bold">
                                ${producto.nombre}
                            </h5>

                            <div class="mt-auto">

                                <p class="text-success small mb-2">
                                    <i class="bi bi-check-circle-fill me-1"></i>
                                    En existencia
                                </p>

                                <p class="fs-5 fw-bold mb-3">
                                    $${producto.precio.toLocaleString("es-CL")}
                                </p>

                                <button
                                    type="button"
                                    class="btn btn-rosa w-100"
                                    onclick="agregarFavoritoAlCarrito(${index})">

                                    <i class="bi bi-bag-plus me-2"></i>
                                    Añadir al carrito
                                </button>

                            </div>

                        </div>
                    </article>
                </div>
            `;
        }).join("");
}

// ELIMINAR FAVORITO
function eliminarFavorito(index) {
    if (!favoritos[index]) return;

    favoritos.splice(index, 1);

    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritos)
    );

    mostrarFavoritos();
}

// AÑADIR UNO AL CARRITO
function agregarFavoritoAlCarrito(index) {
    const producto = favoritos[index];
    if (!producto) return;

    agregarProducto(
        producto.nombre,
        producto.precio,
        producto.imagen
    );
}

// AÑADIR TODOS
function iniciarAgregarTodosFavoritos() {
    const boton =
        document.getElementById("agregarTodosCarrito");

    if (!boton) return;

    boton.addEventListener("click", function () {
        favoritos =
            JSON.parse(localStorage.getItem("favoritos")) || [];

        if (!favoritos.length) return;

        favoritos.forEach(function (producto) {
            agregarProducto(
                producto.nombre,
                producto.precio,
                producto.imagen
            );
        });

        mostrarConfirmacion(
            boton,
            "Todos agregados"
        );

        const offcanvas =
            document.getElementById("offcanvasCarrito");

        if (
            offcanvas &&
            typeof bootstrap !== "undefined"
        ) {
            bootstrap.Offcanvas
                .getOrCreateInstance(offcanvas)
                .show();
        }
    });
}

window.eliminarFavorito = eliminarFavorito;
window.agregarFavoritoAlCarrito =
    agregarFavoritoAlCarrito;