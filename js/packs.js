let favoritosPacks =
    JSON.parse(localStorage.getItem("favoritos")) || [];

document.addEventListener("DOMContentLoaded", function () {
    iniciarProductosPacks();
    iniciarFavoritosPacks();
    iniciarFiltrosPacks();
    aplicarBusquedaNavbar();
});

// PRODUCTOS
function iniciarProductosPacks() {
    document.querySelectorAll("#gridPacks .producto-card")
        .forEach(function (producto) {

            const boton = Array.from(
                producto.querySelectorAll("button")
            ).find(function (boton) {
                return boton.querySelector(".bi-bag-plus");
            });

            if (!boton) return;

            boton.addEventListener("click", function () {
                const datos = obtenerDatosProducto(producto);
                if (!datos) return;

                agregarProducto(
                    datos.nombre,
                    datos.precio,
                    datos.imagen
                );

                mostrarConfirmacion(boton, "Agregado");
            });
        });
}

function obtenerDatosProducto(producto) {
    const nombre =
        producto.querySelector(".card-title")
            ?.textContent.trim();

    const precioData =
        Number(producto.dataset.precio);

    const precioTexto =
        producto.querySelector(".fs-5")
            ?.textContent || "";

    const precio =
        precioData ||
        parseInt(precioTexto.replace(/\D/g, ""), 10);

    const imagen =
        producto.querySelector("img")
            ?.getAttribute("src") || "";

    if (!nombre || isNaN(precio)) return null;

    return {
        nombre,
        precio,
        imagen
    };
}

// FAVORITOS
function iniciarFavoritosPacks() {
    document.querySelectorAll("#gridPacks .btn-favorito")
        .forEach(function (boton) {

            const producto =
                boton.closest(".producto-card");

            if (!producto) return;

            const datos =
                obtenerDatosProducto(producto);

            if (!datos) return;

            actualizarCorazon(
                boton,
                datos.nombre
            );

            boton.addEventListener("click", function () {
                alternarFavorito(datos);
                actualizarCorazon(
                    boton,
                    datos.nombre
                );
            });
        });
}

function alternarFavorito(producto) {
    const index = favoritosPacks.findIndex(function (favorito) {
        return favorito.nombre === producto.nombre;
    });

    if (index >= 0) {
        favoritosPacks.splice(index, 1);
    } else {
        favoritosPacks.push({
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
        });
    }

    guardarFavoritosPacks();
}

function guardarFavoritosPacks() {
    localStorage.setItem(
        "favoritos",
        JSON.stringify(favoritosPacks)
    );
}

function actualizarCorazon(boton, nombre) {
    const icono = boton.querySelector("i");

    const activo = favoritosPacks.some(function (producto) {
        return producto.nombre === nombre;
    });

    boton.classList.toggle("activo", activo);

    if (icono) {
        icono.className = activo
            ? "bi bi-heart-fill"
            : "bi bi-heart";
    }

    boton.setAttribute(
        "aria-label",
        activo
            ? `Quitar ${nombre} de favoritos`
            : `Agregar ${nombre} a favoritos`
    );
}

// FILTROS
function iniciarFiltrosPacks() {
    const grid = document.getElementById("gridPacks");
    if (!grid) return;

    const buscador =
        document.getElementById("buscadorPacks");

    const ordenar =
        document.getElementById("ordenarPacks");

    const limpiar =
        document.getElementById("limpiarFiltros");

    const minimo =
        document.getElementById("precioMinimo");

    const maximo =
        document.getElementById("precioMaximo");

    const rango =
        document.getElementById("rangoPrecio");

    if (buscador) {
        buscador.addEventListener(
            "input",
            aplicarFiltrosPacks
        );
    }

    if (ordenar) {
        ordenar.addEventListener(
            "change",
            ordenarPacks
        );
    }

    document.querySelectorAll(
        ".filtro-personaje, .filtro-disponibilidad"
    ).forEach(function (filtro) {
        filtro.addEventListener(
            "change",
            aplicarFiltrosPacks
        );
    });

    if (minimo) {
        minimo.addEventListener(
            "input",
            aplicarFiltrosPacks
        );
    }

    if (maximo) {
        maximo.addEventListener("input", function () {
            if (rango) {
                rango.value = maximo.value;
            }

            actualizarTextoPrecio();
            aplicarFiltrosPacks();
        });
    }

    if (rango) {
        rango.addEventListener("input", function () {
            if (maximo) {
                maximo.value = rango.value;
            }

            actualizarTextoPrecio();
            aplicarFiltrosPacks();
        });
    }

    if (limpiar) {
        limpiar.addEventListener(
            "click",
            limpiarFiltrosPacks
        );
    }

    actualizarTextoPrecio();
    aplicarFiltrosPacks();
}

function aplicarFiltrosPacks() {
    const columnas =
        document.querySelectorAll(
            "#gridPacks .producto-col"
        );

    if (!columnas.length) return;

    const buscador =
        document.getElementById("buscadorPacks");

    const minimoInput =
        document.getElementById("precioMinimo");

    const maximoInput =
        document.getElementById("precioMaximo");

    const texto =
        normalizarTexto(buscador?.value || "");

    const personajes = Array.from(
        document.querySelectorAll(
            ".filtro-personaje:checked"
        )
    ).map(function (filtro) {
        return normalizarTexto(filtro.value);
    });

    const disponibilidades = Array.from(
        document.querySelectorAll(
            ".filtro-disponibilidad:checked"
        )
    ).map(function (filtro) {
        return filtro.value;
    });

    const minimo =
        Number(minimoInput?.value) || 0;

    const maximo =
        maximoInput?.value === ""
            ? Infinity
            : Number(maximoInput.value);

    let visibles = 0;

    columnas.forEach(function (columna) {
        const producto =
            columna.querySelector(".producto-card");

        if (!producto) return;

        const personaje =
            normalizarTexto(
                producto.dataset.personaje || ""
            );

        const disponibilidad =
            producto.dataset.disponibilidad || "";

        const precio =
            Number(producto.dataset.precio) || 0;

        const nombre =
            normalizarTexto(
                producto.querySelector(".card-title")
                    ?.textContent || ""
            );

        const descripcion =
            normalizarTexto(
                producto.querySelector(".card-body p")
                    ?.textContent || ""
            );

        const contenido =
            `${personaje} ${nombre} ${descripcion}`;

        const coincideBusqueda =
            !texto ||
            contenido.includes(texto);

        const coincidePersonaje =
            !personajes.length ||
            personajes.includes(personaje);

        const coincideDisponibilidad =
            !disponibilidades.length ||
            disponibilidades.includes(disponibilidad);

        const coincidePrecio =
            precio >= minimo &&
            precio <= maximo;

        const mostrar =
            coincideBusqueda &&
            coincidePersonaje &&
            coincideDisponibilidad &&
            coincidePrecio;

        columna.classList.toggle(
            "d-none",
            !mostrar
        );

        if (mostrar) visibles++;
    });

    actualizarCantidadPacks(visibles);

    const sinResultados =
        document.getElementById("sinResultados");

    if (sinResultados) {
        sinResultados.classList.toggle(
            "d-none",
            visibles !== 0
        );
    }
}

// ORDENAR
function ordenarPacks() {
    const grid =
        document.getElementById("gridPacks");

    const select =
        document.getElementById("ordenarPacks");

    if (!grid || !select) return;

    const columnas = Array.from(
        grid.querySelectorAll(".producto-col")
    );

    columnas.sort(function (a, b) {
        const productoA =
            a.querySelector(".producto-card");

        const productoB =
            b.querySelector(".producto-card");

        const precioA =
            Number(productoA?.dataset.precio) || 0;

        const precioB =
            Number(productoB?.dataset.precio) || 0;

        const ordenA =
            Number(productoA?.dataset.orden) || 0;

        const ordenB =
            Number(productoB?.dataset.orden) || 0;

        const nombreA =
            productoA
                ?.querySelector(".card-title")
                ?.textContent.trim() || "";

        const nombreB =
            productoB
                ?.querySelector(".card-title")
                ?.textContent.trim() || "";

        switch (select.value) {
            case "precio-asc":
                return precioA - precioB;

            case "precio-desc":
                return precioB - precioA;

            case "nombre":
                return nombreA.localeCompare(
                    nombreB,
                    "es",
                    { sensitivity: "base" }
                );

            default:
                return ordenA - ordenB;
        }
    });

    columnas.forEach(function (columna) {
        grid.appendChild(columna);
    });
}

// LIMPIAR
function limpiarFiltrosPacks() {
    const buscador =
        document.getElementById("buscadorPacks");

    const minimo =
        document.getElementById("precioMinimo");

    const maximo =
        document.getElementById("precioMaximo");

    const rango =
        document.getElementById("rangoPrecio");

    const ordenar =
        document.getElementById("ordenarPacks");

    if (buscador) buscador.value = "";

    document.querySelectorAll(
        ".filtro-personaje, .filtro-disponibilidad"
    ).forEach(function (filtro) {
        filtro.checked = false;
    });

    if (minimo) minimo.value = 0;
    if (maximo) maximo.value = 19990;
    if (rango) rango.value = 19990;

    if (ordenar) {
        ordenar.value = "caracteristicas";
    }

    actualizarTextoPrecio();
    ordenarPacks();
    aplicarFiltrosPacks();
}

function actualizarCantidadPacks(cantidad) {
    const elemento =
        document.getElementById("cantidadPacks");

    if (!elemento) return;

    elemento.textContent =
        `${cantidad} ${cantidad === 1 ? "pack" : "packs"}`;
}

function actualizarTextoPrecio() {
    const maximo =
        document.getElementById("precioMaximo");

    const rango =
        document.getElementById("rangoPrecio");

    const texto =
        document.getElementById("precioRangoTexto");

    if (!texto) return;

    const precio =
        Number(maximo?.value || rango?.value || 19990);

    texto.textContent =
        "$" + precio.toLocaleString("es-CL");
}

// BÚSQUEDA DESDE NAVBAR
function aplicarBusquedaNavbar() {
    const busqueda =
        localStorage.getItem("busquedaProducto");

    if (!busqueda) return;

    const buscador =
        document.getElementById("buscadorPacks");

    if (buscador) {
        buscador.value = busqueda;
        aplicarFiltrosPacks();
    }

    localStorage.removeItem("busquedaProducto");
}