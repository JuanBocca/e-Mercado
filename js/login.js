//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
onSignIn();

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    if (profile.getId()) {
        location.href = 'index.html';
    }
}
document.addEventListener("DOMContentLoaded", function (e) {

});