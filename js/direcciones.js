document.addEventListener("DOMContentLoaded", function () {
    const CLAVE = "direcciones";
    const lista = document.getElementById("listaDirecciones");
    const contador = document.getElementById("cantidadDirecciones");
    const formulario = document.getElementById("formDireccion");
    const modalElemento = document.getElementById("modalDireccion");
    const tituloModal = document.getElementById("tituloModalDireccion");
    const mensaje = document.getElementById("mensajeDireccion");

    const campos = {
        nombre: document.getElementById("direccionNombre"),
        destinatario: document.getElementById("direccionDestinatario"),
        calle: document.getElementById("direccionCalle"),
        detalle: document.getElementById("direccionDetalle"),
        comuna: document.getElementById("direccionComuna"),
        ciudad: document.getElementById("direccionCiudad"),
        region: document.getElementById("direccionRegion"),
        pais: document.getElementById("direccionPais"),
        telefono: document.getElementById("direccionTelefono"),
        principal: document.getElementById("direccionPrincipal")
    };

    if (!lista || !formulario || !modalElemento) {
        console.error("No se encontraron los elementos necesarios para administrar direcciones.");
        return;
    }

    let direcciones = cargarDirecciones();
    let indiceEditando = null;

    // Iniciar
    document.querySelectorAll(".btn-nueva-direccion").forEach(function (boton) {
        boton.addEventListener("click", prepararNuevaDireccion);
    });

    formulario.addEventListener("submit", guardarFormulario);

    lista.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");
        if (!boton) return;

        const indice = Number(boton.dataset.index);
        const accion = boton.dataset.accion;

        if (accion === "editar") editarDireccion(indice);
        if (accion === "principal") cambiarPrincipal(indice);
        if (accion === "eliminar") eliminarDireccion(indice);
    });

    mostrarDirecciones();

    // Cargar
    function cargarDirecciones() {
        try {
            const datos = JSON.parse(localStorage.getItem(CLAVE));
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            return [];
        }
    }

    // Guardar
    function guardarDirecciones() {
        localStorage.setItem(CLAVE, JSON.stringify(direcciones));
    }

    // Preparar nueva dirección
    function prepararNuevaDireccion() {
        indiceEditando = null;
        formulario.reset();

        campos.pais.value = "Chile";
        campos.principal.checked = false;

        if (tituloModal) tituloModal.textContent = "Agregar dirección";

        limpiarMensaje();
    }

    // Guardar formulario
    function guardarFormulario(evento) {
        evento.preventDefault();

        const direccion = {
            id: indiceEditando !== null
                ? direcciones[indiceEditando].id
                : Date.now(),
            nombre: campos.nombre.value.trim(),
            destinatario: campos.destinatario.value.trim(),
            calle: campos.calle.value.trim(),
            detalle: campos.detalle.value.trim(),
            comuna: campos.comuna.value.trim(),
            ciudad: campos.ciudad.value.trim(),
            region: campos.region.value.trim(),
            pais: campos.pais.value.trim(),
            telefono: campos.telefono.value.trim(),
            principal: campos.principal.checked
        };

        if (
            !direccion.nombre ||
            !direccion.destinatario ||
            !direccion.calle ||
            !direccion.comuna ||
            !direccion.ciudad ||
            !direccion.region ||
            !direccion.pais ||
            !direccion.telefono
        ) {
            mostrarMensaje("Completa todos los campos obligatorios.", "danger");
            return;
        }

        // Solo una dirección puede ser principal
        if (direccion.principal) {
            direcciones.forEach(function (item) {
                item.principal = false;
            });
        }

        const esNueva = indiceEditando === null;

        if (esNueva) {
            direcciones.push(direccion);
        } else {
            direcciones[indiceEditando] = direccion;
        }

        guardarDirecciones();
        mostrarDirecciones();

        mostrarMensaje(
            esNueva
                ? "Dirección agregada correctamente."
                : "Dirección actualizada correctamente.",
            "success"
        );

        indiceEditando = null;

        setTimeout(function () {
            cerrarModal();
        }, 500);
    }

    // Editar
    function editarDireccion(indice) {
        const direccion = direcciones[indice];
        if (!direccion) return;

        indiceEditando = indice;

        campos.nombre.value = direccion.nombre || "";
        campos.destinatario.value = direccion.destinatario || "";
        campos.calle.value = direccion.calle || "";
        campos.detalle.value = direccion.detalle || "";
        campos.comuna.value = direccion.comuna || "";
        campos.ciudad.value = direccion.ciudad || "";
        campos.region.value = direccion.region || "";
        campos.pais.value = direccion.pais || "Chile";
        campos.telefono.value = direccion.telefono || "";
        campos.principal.checked = Boolean(direccion.principal);

        if (tituloModal) tituloModal.textContent = "Editar dirección";

        limpiarMensaje();
        abrirModal();
    }

    // Marcar o desmarcar principal
    function cambiarPrincipal(indice) {
        const direccion = direcciones[indice];
        if (!direccion) return;

        if (direccion.principal) {
            direccion.principal = false;
        } else {
            direcciones.forEach(function (item) {
                item.principal = false;
            });

            direccion.principal = true;
        }

        guardarDirecciones();
        mostrarDirecciones();
    }

    // Eliminar
    function eliminarDireccion(indice) {
        const direccion = direcciones[indice];
        if (!direccion) return;

        const confirmar = confirm(
            `¿Quieres eliminar la dirección "${direccion.nombre}"?`
        );

        if (!confirmar) return;

        direcciones.splice(indice, 1);

        guardarDirecciones();
        mostrarDirecciones();
    }

    // Mostrar direcciones
    function mostrarDirecciones() {
        actualizarContador();

        if (!direcciones.length) {
            lista.innerHTML = `
                <div class="text-center py-5">
                    <div class="direccion-icono mx-auto mb-3">
                        <i class="bi bi-geo-alt"></i>
                    </div>
                    <h5 class="fw-bold">No tienes direcciones guardadas</h5>
                    <p class="text-muted mb-0">
                        Agrega una dirección para utilizarla en tus pedidos.
                    </p>
                </div>
            `;
            return;
        }

        lista.innerHTML = direcciones.map(function (direccion, indice) {
            return `
                <article class="direccion-item py-4 border-bottom">
                    <div class="row g-3 align-items-start">

                        <div class="col-auto">
                            <div class="direccion-icono">
                                <i class="bi ${obtenerIcono(direccion.nombre)}"></i>
                            </div>
                        </div>

                        <div class="col">
                            <div class="d-flex flex-wrap align-items-center gap-2 mb-1">
                                <h5 class="fw-bold mb-0">
                                    ${escapar(direccion.nombre)}
                                </h5>

                                ${direccion.principal ? `
                                    <span class="badge badge-principal rounded-pill">
                                        <i class="bi bi-star-fill me-1"></i>
                                        Principal
                                    </span>
                                ` : ""}
                            </div>

                            <small class="text-muted d-block mb-3">
                                ${direccion.principal
                                    ? "Dirección principal de entrega"
                                    : "Dirección alternativa"}
                            </small>

                            <h6 class="fw-bold mb-2">
                                ${escapar(direccion.destinatario)}
                            </h6>

                            <p class="mb-1">
                                ${escapar(direccion.calle)}
                            </p>

                            ${direccion.detalle ? `
                                <p class="mb-1">
                                    ${escapar(direccion.detalle)}
                                </p>
                            ` : ""}

                            <p class="text-muted mb-1">
                                ${escapar(direccion.comuna || "")}${direccion.comuna ? ", " : ""}${escapar(direccion.ciudad)}
                            </p>

                            <p class="text-muted mb-1">
                                ${escapar(direccion.region)}
                            </p>

                            <p class="text-muted mb-3">
                                ${escapar(direccion.pais)}
                            </p>

                            <small class="text-muted">
                                <i class="bi bi-telephone me-2"></i>
                                ${escapar(direccion.telefono)}
                            </small>
                        </div>

                        <div class="col-auto">
                            <div class="dropdown">

                                <button type="button"
                                    class="btn btn-light border"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    aria-label="Opciones">
                                    <i class="bi bi-three-dots"></i>
                                </button>

                                <ul class="dropdown-menu dropdown-menu-end shadow-sm">

                                    <li>
                                        <button type="button"
                                            class="dropdown-item"
                                            data-accion="editar"
                                            data-index="${indice}">
                                            <i class="bi bi-pencil me-2"></i>
                                            Editar
                                        </button>
                                    </li>

                                    <li>
                                        <button type="button"
                                            class="dropdown-item"
                                            data-accion="principal"
                                            data-index="${indice}">
                                            <i class="bi ${direccion.principal
                                                ? "bi-star"
                                                : "bi-star-fill"} me-2"></i>
                                            ${direccion.principal
                                                ? "Desmarcar como principal"
                                                : "Marcar como principal"}
                                        </button>
                                    </li>

                                    <li>
                                        <hr class="dropdown-divider">
                                    </li>

                                    <li>
                                        <button type="button"
                                            class="dropdown-item text-danger"
                                            data-accion="eliminar"
                                            data-index="${indice}">
                                            <i class="bi bi-trash me-2"></i>
                                            Eliminar
                                        </button>
                                    </li>

                                </ul>
                            </div>
                        </div>

                    </div>
                </article>
            `;
        }).join("");
    }

    // Contador
    function actualizarContador() {
        if (!contador) return;

        const total = direcciones.length;

        if (total === 0) {
            contador.textContent = "No tienes direcciones guardadas.";
        } else if (total === 1) {
            contador.textContent = "Tienes 1 dirección guardada.";
        } else {
            contador.textContent = `Tienes ${total} direcciones guardadas.`;
        }
    }

    // Abrir modal
    function abrirModal() {
        if (typeof bootstrap === "undefined") {
            console.error("Bootstrap no está cargado.");
            return;
        }

        bootstrap.Modal.getOrCreateInstance(modalElemento).show();
    }

    // Cerrar modal
    function cerrarModal() {
        if (typeof bootstrap !== "undefined") {
            bootstrap.Modal.getOrCreateInstance(modalElemento).hide();
        }

        formulario.reset();
        campos.pais.value = "Chile";
        campos.principal.checked = false;
        indiceEditando = null;
    }

    // Mensajes
    function mostrarMensaje(texto, tipo) {
        if (!mensaje) return;

        mensaje.textContent = texto;
        mensaje.className = `text-${tipo} text-center mt-3 mb-0`;
    }

    function limpiarMensaje() {
        if (!mensaje) return;

        mensaje.textContent = "";
        mensaje.className = "text-center mt-3 mb-0";
    }

    // Icono según nombre
    function obtenerIcono(nombre) {
        const texto = String(nombre).toLowerCase();

        if (texto.includes("trabajo")) return "bi-building";
        if (texto.includes("oficina")) return "bi-building";
        if (texto.includes("casa")) return "bi-house";

        return "bi-geo-alt";
    }

    // Evitar insertar HTML
    function escapar(texto) {
        return String(texto ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});