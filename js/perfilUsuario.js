document.addEventListener("DOMContentLoaded", function () {
    protegerPerfilUsuario();
    cargarPerfilUsuario();
    iniciarFormularioPerfil();
});

// PROTEGER PERFIL
function protegerPerfilUsuario() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (
        !usuario ||
        !usuario.sesionActiva ||
        usuario.tipo !== "usuario"
    ) {
        window.location.href = "index.html";
    }
}

// CARGAR DATOS
function cargarPerfilUsuario() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    let datos =
        JSON.parse(localStorage.getItem("datosUsuario"));

    if (!datos) {
        datos = {
            nombre: "Usuario",
            apellido: "",
            correo: usuario.correo || "",
            telefono: ""
        };

        guardarDatosUsuario(datos);
    }

    colocarTexto("nombreBienvenida", datos.nombre);
    colocarTexto("perfilNombre", datos.nombre);
    colocarTexto("perfilApellido", datos.apellido);
    colocarTexto("perfilCorreo", datos.correo);
    colocarTexto(
        "perfilTelefono",
        datos.telefono || "No registrado"
    );

    cargarFormulario(datos);
}

function colocarTexto(id, texto) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = texto;
    }
}

// FORMULARIO
function cargarFormulario(datos) {
    colocarValor("editarNombre", datos.nombre);
    colocarValor("editarApellido", datos.apellido);
    colocarValor("editarCorreo", datos.correo);
    colocarValor("editarTelefono", datos.telefono);
}

function colocarValor(id, valor) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.value = valor || "";
    }
}

function iniciarFormularioPerfil() {
    const formulario =
        document.getElementById("formEditarPerfil");

    if (!formulario) return;

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nombre =
            document.getElementById("editarNombre")
                ?.value.trim();

        const apellido =
            document.getElementById("editarApellido")
                ?.value.trim();

        const correo =
            document.getElementById("editarCorreo")
                ?.value.trim();

        const telefono =
            document.getElementById("editarTelefono")
                ?.value.trim();

        if (!nombre || !correo) {
            mostrarMensajePerfil(
                "Nombre y correo son obligatorios.",
                false
            );
            return;
        }

        const datos = {
            nombre,
            apellido,
            correo,
            telefono
        };

        guardarDatosUsuario(datos);
        actualizarCorreoSesion(correo);
        cargarPerfilUsuario();

        mostrarMensajePerfil(
            "Información actualizada correctamente.",
            true
        );

        setTimeout(function () {
            const modal =
                document.getElementById("modalEditarPerfil");

            if (
                modal &&
                typeof bootstrap !== "undefined"
            ) {
                bootstrap.Modal
                    .getOrCreateInstance(modal)
                    .hide();
            }
        }, 700);
    });
}

function guardarDatosUsuario(datos) {
    localStorage.setItem(
        "datosUsuario",
        JSON.stringify(datos)
    );
}

function actualizarCorreoSesion(correo) {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    usuario.correo = correo;

    localStorage.setItem(
        "usuario",
        JSON.stringify(usuario)
    );
}

function mostrarMensajePerfil(texto, correcto) {
    const mensaje =
        document.getElementById("mensajePerfil");

    if (!mensaje) return;

    mensaje.textContent = texto;

    mensaje.className = correcto
        ? "text-success text-center mt-3"
        : "text-danger text-center mt-3";
}