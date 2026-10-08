document.addEventListener("DOMContentLoaded", () => {

    // 1. Datos enriquecidos de pedidos con desglose de productos y dirección
    const pedidos = [
        {
            id: "#000123",
            fecha: "2026-09-21",
            fechaTexto: "21 de septiembre de 2026",
            estado: "En preparación",
            badgeClass: "bg-rosa",
            badgeIcon: "bi-clock",
            categoria: "Toy Story",
            titulo: "Pack decoración Toy Story",
            cantidadTotal: 1,
            precioNum: 19990,
            precio: "$19.990",
            imagen: "img/SETTOYSTORY2.webp",
            entrega: "Envío a domicilio",
            direccion: "Av. Las Lilas 458, Depto 302, Concepción",
            pago: "Tarjeta terminada en 4582",
            codigoSeguimiento: "ST-8894102-CL",
            subtotal: 16990,
            costoEnvio: 3000,
            total: 19990,
            productos: [
                {
                    titulo: "Pack decoración Toy Story Completo",
                    categoria: "Toy Story",
                    cantidad: 1,
                    precioUnitario: 16990,
                    imagen: "img/SETTOYSTORY2.webp"
                }
            ]
        },
        {
            id: "#000122",
            fecha: "2026-08-15",
            fechaTexto: "15 de agosto de 2026",
            estado: "En camino",
            badgeClass: "bg-warning text-dark",
            badgeIcon: "bi-truck",
            categoria: "Minecraft",
            titulo: "Set Cumpleaños Completo Minecraft",
            cantidadTotal: 2,
            precioNum: 24980,
            precio: "$24.980",
            imagen: "img/Minecraft.jpg",
            entrega: "Envío a domicilio",
            direccion: "Calle Los Robles 1230, Hualpén",
            pago: "Tarjeta terminada en 4582",
            codigoSeguimiento: "ST-7741239-CL",
            subtotal: 21980,
            costoEnvio: 3000,
            total: 24980,
            productos: [
                {
                    titulo: "Set Cumpleaños Completo Minecraft",
                    categoria: "Minecraft",
                    cantidad: 1,
                    precioUnitario: 19990,
                    imagen: "img/Minecraft.jpg"
                },
                {
                    titulo: "Set Globos Metalizados Minecraft x5",
                    categoria: "Globos",
                    cantidad: 1,
                    precioUnitario: 1990,
                    imagen: "img/Minecraft.jpg"
                }
            ]
        },
        {
            id: "#000121",
            fecha: "2026-07-10",
            fechaTexto: "10 de julio de 2026",
            estado: "Entregadas",
            badgeClass: "bg-success",
            badgeIcon: "bi-check-circle",
            categoria: "Bluey",
            titulo: "Set Cumpleaños Completo Bluey",
            cantidadTotal: 1,
            precioNum: 18990,
            precio: "$18.990",
            imagen: "img/Bluey.jpg",
            entrega: "Envío a domicilio",
            direccion: "Av. Roosevelt 520, Concepción",
            pago: "Transferencia bancaria",
            codigoSeguimiento: "ST-6523190-CL",
            subtotal: 18990,
            costoEnvio: 0,
            total: 18990,
            productos: [
                {
                    titulo: "Set Cumpleaños Completo Bluey",
                    categoria: "Bluey",
                    cantidad: 1,
                    precioUnitario: 18990,
                    imagen: "img/Bluey.jpg"
                }
            ]
        }
    ];

    const contenedor = document.getElementById("contenedorPedidos");
    const botonesFiltro = document.querySelectorAll("#grupoFiltros button");
    const selectOrden = document.getElementById("ordenarCompras");

    if (!contenedor) return;

    let filtroActual = "todas";
    let ordenActual = "recientes";

    function aplicarFiltrosYOrden() {
        let resultado = pedidos.filter(p => {
            if (filtroActual === "todas") return true;
            return p.estado.toLowerCase().trim() === filtroActual.toLowerCase().trim();
        });

        resultado.sort((a, b) => {
            if (ordenActual === "recientes") return new Date(b.fecha) - new Date(a.fecha);
            if (ordenActual === "antiguos") return new Date(a.fecha) - new Date(b.fecha);
            if (ordenActual === "precio-desc") return b.precioNum - a.precioNum;
            if (ordenActual === "precio-asc") return a.precioNum - b.precioNum;
            return 0;
        });

        if (resultado.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center py-5 my-4">
                    <i class="bi bi-box-seam fs-1 text-muted d-block mb-3"></i>
                    <h5 class="fw-bold text-secondary">No tienes compras en este estado ("${filtroActual}")</h5>
                    <p class="text-muted small mb-0">Cuando tengas compras con este estado, aparecerán aquí.</p>
                </div>
            `;
            return;
        }

        contenedor.innerHTML = resultado.map(pedido => `
            <article class="pedido py-4 border-bottom">

                <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                    <div>
                        <h5 class="fw-bold mb-1">Pedido ${pedido.id}</h5>
                        <p class="text-muted small mb-0">
                            <i class="bi bi-calendar3 me-1"></i>${pedido.fechaTexto}
                        </p>
                    </div>

                    <span class="badge rounded-pill ${pedido.badgeClass} px-3 py-2">
                        <i class="bi ${pedido.badgeIcon} me-1"></i>${pedido.estado}
                    </span>
                </div>

                <div class="row align-items-center g-3">
                    <div class="col-4 col-sm-auto">
                        <img src="${pedido.imagen}" alt="${pedido.titulo}" class="pedido-imagen rounded-3" style="max-width: 100px;">
                    </div>

                    <div class="col-8 col-sm">
                        <span class="text-rosa small fw-semibold">${pedido.categoria}</span>
                        <h6 class="fw-bold mt-1 mb-1">${pedido.titulo}</h6>
                        <p class="text-muted small mb-1">Cantidad: ${pedido.cantidadTotal}</p>
                        <strong>${pedido.precio}</strong>
                    </div>

                    <div class="col-12 col-md-auto">
                        <button type="button" class="btn btn-outline-dark" onclick="verDetallePedido('${pedido.id}')">
                            Ver detalle <i class="bi bi-chevron-right ms-1"></i>
                        </button>
                    </div>
                </div>

                <div class="row g-3 mt-4 pt-4 border-top">
                    <div class="col-md-4">
                        <small class="text-muted d-block mb-1">Entrega</small>
                        <span class="fw-semibold">
                            <i class="bi bi-truck me-1"></i>${pedido.entrega}
                        </span>
                    </div>

                    <div class="col-md-4">
                        <small class="text-muted d-block mb-1">Método de pago</small>
                        <span class="fw-semibold">
                            <i class="bi bi-credit-card me-1"></i>${pedido.pago}
                        </span>
                    </div>

                    <div class="col-md-4 text-md-end">
                        <small class="text-muted d-block mb-1">Total</small>
                        <strong class="fs-5">${pedido.precio}</strong>
                    </div>
                </div>

            </article>
        `).join("");
    }

    // 2. Función global para abrir el modal con la información detallada del pedido
    window.verDetallePedido = function (idPedido) {
        const pedido = pedidos.find(p => p.id === idPedido);
        if (!pedido) return;

        // Título y fecha
        document.getElementById("detalleId").textContent = pedido.id;
        document.getElementById("detalleFecha").textContent = pedido.fechaTexto;

        // Estado
        const badgeEstado = document.getElementById("detalleBadgeEstado");
        badgeEstado.className = `badge rounded-pill ${pedido.badgeClass} px-3 py-2 fs-6`;
        badgeEstado.innerHTML = `<i class="bi ${pedido.badgeIcon} me-1"></i>${pedido.estado}`;

        // Código de seguimiento
        const contenedorSeguimiento = document.getElementById("detalleSeguimiento");
        if (pedido.codigoSeguimiento) {
            contenedorSeguimiento.innerHTML = `<span class="d-block fw-semibold text-dark">N° de seguimiento</span><code>${pedido.codigoSeguimiento}</code>`;
        } else {
            contenedorSeguimiento.innerHTML = `<span class="fst-italic">Aún no asignado</span>`;
        }

        // Productos del pedido
        const listaProductos = document.getElementById("detalleListaProductos");
        listaProductos.innerHTML = pedido.productos.map(prod => `
            <div class="d-flex align-items-center gap-3 py-2 border-bottom">
                <img src="${prod.imagen}" alt="${prod.titulo}" class="rounded-3 object-fit-cover" width="60" height="60">
                <div class="flex-grow-1">
                    <h6 class="fw-bold mb-0 small">${prod.titulo}</h6>
                    <small class="text-muted">${prod.cantidad} x $${prod.precioUnitario.toLocaleString("es-CL")}</small>
                </div>
                <strong class="text-dark">$${(prod.cantidad * prod.precioUnitario).toLocaleString("es-CL")}</strong>
            </div>
        `).join("");

        // Dirección y pago
        document.getElementById("detalleDireccion").textContent = pedido.direccion;
        document.getElementById("detallePago").textContent = pedido.pago;

        // Subtotal, envío y total
        document.getElementById("detalleSubtotal").textContent = `$${pedido.subtotal.toLocaleString("es-CL")}`;
        document.getElementById("detalleEnvio").textContent = pedido.costoEnvio === 0 ? "Gratis" : `$${pedido.costoEnvio.toLocaleString("es-CL")}`;
        document.getElementById("detalleTotal").textContent = `$${pedido.total.toLocaleString("es-CL")}`;

        // Abrir el modal Bootstrap
        const modalElemento = document.getElementById("modalDetallePedido");
        const modalInstance = bootstrap.Modal.getOrCreateInstance(modalElemento);
        modalInstance.show();
    };

    // Filtros
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(b => {
                b.classList.remove("btn-dark");
                b.classList.add("btn-outline-secondary");
            });
            boton.classList.remove("btn-outline-secondary");
            boton.classList.add("btn-dark");

            filtroActual = boton.getAttribute("data-filtro") || "todas";
            aplicarFiltrosYOrden();
        });
    });

    if (selectOrden) {
        selectOrden.addEventListener("change", (e) => {
            ordenActual = e.target.value;
            aplicarFiltrosYOrden();
        });
    }

    aplicarFiltrosYOrden();
});