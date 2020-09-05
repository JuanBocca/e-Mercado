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
        localStorage.setItem('id', profile.getId());
        localStorage.setItem('name', profile.getName());
        localStorage.setItem('img', profile.getImageUrl());
        localStorage.setItem('email', profile.getEmail());

        // Cerrar sesion Google
        signOut();

        location.href = 'index.html';

    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    if (localStorage.getItem('id')) {
        location.href = 'index.html';
    }

    let form = document.querySelector('.signin');
    form.addEventListener('submit', function () {
        let name = document.querySelector('#inputName').value;
        let email = document.querySelector('#inputEmail').value;
        localStorage.setItem('id', email);
        localStorage.setItem('name', name);
    });
});