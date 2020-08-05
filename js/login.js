//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('Sesion cerrada.');
        });
    }

    if (profile.getId() !== 'undefined') {
        window.location.href = 'index.html';
        // Cerrar sesion Google
        signOut();
    }
}

document.addEventListener("DOMContentLoaded", function (e) {

});