//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
onSignIn();

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    if (profile.getId()) {
        signOut();
        location.href = 'index.html';
    }
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();

    auth2.signOut();
}


document.addEventListener("DOMContentLoaded", function (e) {

});