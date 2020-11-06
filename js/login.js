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
        let user = {
            id: profile.getId(),
            name: '',
            surname: '',
            username: profile.getName(),
            age: '',
            email: profile.getEmail(),
            phone: '',
            img: profile.getImageUrl()
        };
        let userStr = JSON.stringify(user);
        
        // Controlar si el usuario se vuelve a conectar
        if (localStorage.getItem('user')) {
            let userStrOld = localStorage.getItem('user');
            let userOld = JSON.parse(userStrOld);
            if (profile.getEmail() == userOld.email) {
                localStorage.setItem('session', true);
                
                // Cerrar sesion Google
                signOut();

                location.href = 'index.html';
            } else {
                localStorage.setItem('user', userStr);
                localStorage.setItem('session', true);

                // Cerrar sesion Google
                signOut();

                location.href = 'index.html';
            }
        } else {
            localStorage.setItem('user', userStr);
            localStorage.setItem('session', true);

            // Cerrar sesion Google
            signOut();

            location.href = 'index.html';
        }
    }
}

document.addEventListener("DOMContentLoaded", function (e) {
    if (localStorage.getItem('session')) {
        location.href = 'index.html';
    }

    let form = document.querySelector('.signin');
    form.addEventListener('submit', function () {
        let username = document.querySelector('#inputName').value;
        let email = document.querySelector('#inputEmail').value;

        let user = {
            id: Math.floor(Math.random()),
            name: '',
            surname: '',
            username: username,
            age: '',
            email: email,
            phone: '',
            img: ''
        };
        let userStr = JSON.stringify(user);

        // Controlar si el usuario se vuelve a conectar
        if (localStorage.getItem('user')) {
            let userStrOld = localStorage.getItem('user');
            let userOld = JSON.parse(userStrOld);
            if (user.email == userOld.email) {
                localStorage.setItem('session', true);
                
                // Cerrar sesion Google
                signOut();

                location.href = 'index.html';
            } else {
                localStorage.setItem('user', userStr);
                localStorage.setItem('session', true);

                // Cerrar sesion Google
                signOut();

                location.href = 'index.html';
            }
        } else {
            localStorage.setItem('user', userStr);
            localStorage.setItem('session', true);

            // Cerrar sesion Google
            signOut();

            location.href = 'index.html';
        }
    });
});