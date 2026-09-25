document.addEventListener("DOMContentLoaded", function () {
    protegerPerfilAdmin();
    cargarDatosAdmin();
});

// PROTEGER ADMIN
function protegerPerfilAdmin() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (
        !usuario ||
        !usuario.sesionActiva ||
        usuario.tipo !== "admin"
    ) {
        window.location.href = "index.html";
    }
}

// DATOS DEL ADMIN
function cargarDatosAdmin() {
    const usuario =
        JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    const correo =
        document.getElementById("correoAdmin");

    if (correo) {
        correo.textContent = usuario.correo;
    }
}