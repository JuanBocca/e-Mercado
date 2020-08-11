//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('Bienvenido.');
    });
}

function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();

    if (profile.getId()) {
        sessionStorage.setItem('id', profile.getId());
        sessionStorage.setItem('name', profile.getName());
        sessionStorage.setItem('img', profile.getImageUrl());
        sessionStorage.setItem('email', profile.getEmail());

        // Cerrar sesion Google
        signOut();

        location.href = 'index.html';

    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    if (sessionStorage.getItem('id')) {
        location.href = 'index.html';
    }

    let form = document.querySelector('.signin');
    form.addEventListener('submit', function () {
        let name = document.querySelector('#inputEmail').value;
        sessionStorage.setItem('id', name);
    });
});