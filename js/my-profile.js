//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    // Obtener inputs
    let nameField = document.getElementById('name');
    let surnameField = document.getElementById('surname');
    let usernameField = document.getElementById('username');
    let ageField = document.getElementById('age');
    let emailField = document.getElementById('email');
    let phoneField = document.getElementById('phone');
    let imageField;

    // Obtener variables del localStorage
    let userStr = localStorage.getItem('user');
    let user = JSON.parse(userStr);

    // function para rellenar inputs con info almacenada en localStorage
    function fillForm() {
        if (user) {
            if (user.name) {
                nameField.setAttribute('placeholder', user.name);
            }
            if (user.surname) {
                surnameField.setAttribute('placeholder', user.surname);
            }
            if (user.username) {
                usernameField.setAttribute('placeholder', user.username);
            }
            if (user.age) {
                ageField.setAttribute('placeholder', user.age);
            }
            if (user.email) {
                emailField.setAttribute('placeholder', user.email);
            }
            if (user.phone) {
                phoneField.setAttribute('placeholder', user.phone);
            }
        }
    }
    fillForm();

    // Drag and Drop para imagen
    document.querySelectorAll('.drop-zone_input').forEach(inputElement => {
        const dropZoneElement = inputElement.closest('.drop-zone');

        // Acciona "click" del input file, abre ventana de exploracion
        dropZoneElement.addEventListener('click', e => {
            inputElement.click();
        });

        // Al cargar archivo llama a funcion
        inputElement.addEventListener('change', e => {
            if (inputElement.files) {
                updateThumbnail(dropZoneElement, inputElement.files[0]);
            }
        });

        // Cambia estilo mientras drag
        dropZoneElement.addEventListener('dragover', e => {
            e.preventDefault();

            dropZoneElement.classList.add('drop-zone_over');
        });

        // Cuando dejamos el drag vuelve a cambiar estilo
        ['dragleave', 'dragend'].forEach(type => {
            dropZoneElement.addEventListener(type, e => {
                dropZoneElement.classList.remove('drop-zone_over');
            });
        });

        // Al drop llama a la funcion
        dropZoneElement.addEventListener('drop', e => {
            e.preventDefault();

            if (e.dataTransfer.files) {
                inputElement.files = e.dataTransfer.files;
                updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
            }

            dropZoneElement.classList.remove('drop-zone_over');
        });
    });

    // Funcion que muestra una vista previa del archivo
    function updateThumbnail(dropZoneElement, file) {
        let thumbnailElement = dropZoneElement.querySelector('.drop-zone_thumb');

        if (dropZoneElement.querySelector('.drop-zone_prompt')) {
            dropZoneElement.querySelector('.drop-zone_prompt').remove();
        }

        if (!thumbnailElement) {
            thumbnailElement = document.createElement('div');
            thumbnailElement.classList.add('drop-zone_thumb');
            dropZoneElement.appendChild(thumbnailElement);
        }



        // Mostrar thumbnail solo si archivo es imagen
        if (file.type.startsWith('image/')) {
            thumbnailElement.dataset.label = file.name;

            const reader = new FileReader();

            reader.readAsDataURL(file);
            reader.onload = () => {
                thumbnailElement.style.backgroundImage = `url('${reader.result}')`;
                imageField = reader.result;
            };
        } else {
            if (!dropZoneElement.querySelector('.drop-zone_prompt')) {
                let span = document.createElement('span');
                span.classList.add('drop-zone_prompt');
                dropZoneElement.appendChild(span);
                span.innerText = 'Suelta una imagen aquí o haz click para cargar';
            }
            if (thumbnailElement) {
                thumbnailElement.remove();
            }
        }
    }

    // Listener al presionar boton Editar
    let editBtn = document.getElementById('editBtn');
    let cancelBtn = document.getElementById('cancelBtn');
    let saveBtn = document.getElementById('saveBtn');
    editBtn.addEventListener('click', function (e) {
        e.preventDefault();

        // Funcion que activa los inputs
        function makeActive(input) {
            input.classList.remove('form-control-plaintext');
            input.removeAttribute('disabled');
            input.classList.add('form-control');
            let placeValue = input.getAttribute('placeholder');
            if (placeValue === 'Nombre' || placeValue === 'Apellido' || placeValue === 'Usuario'
                || placeValue === 'Edad' || placeValue === 'Email' || placeValue === 'Teléfono') {
                input.setAttribute('placeholder', placeValue);
            } else {
                input.setAttribute('value', placeValue);
            }
        }

        // Mostrar drag and drop zone y mover inputs
        let dropZone = document.querySelector('.move-right');
        let items = document.querySelector('.move-items');
        let itemsArr = Array.from(items.children);
        for (let item of itemsArr) {
            dropZone.insertAdjacentElement('beforeend', item);
        }
        dropZone.classList.remove('d-none');
        dropZone.classList.add('d-flex');
        dropZone.classList.add('flex-column');
        dropZone.classList.add('flex-md-row');
        makeActive(nameField);
        makeActive(surnameField);
        makeActive(usernameField);
        makeActive(ageField);
        makeActive(phoneField);

        // Ocultar boton Editar, mostrar Cancelar y Guardar
        editBtn.classList.add('d-none');
        cancelBtn.classList.remove('d-none');
        saveBtn.classList.remove('d-none');
    });

    // funcion para desactivar los inputs
    function makeHidden(input) {
        input.classList.remove('form-control');
        input.setAttribute('disabled', 'disabled');
        input.classList.add('form-control-plaintext');
        input.removeAttribute('value');
    }

    // Listener al presionar boton Cancelar
    cancelBtn.addEventListener('click', function (e) {
        e.preventDefault();

        document.getElementById('profileForm').reset();

        // Ocultar drag and drop zone y mover inputs
        let dropZone = document.querySelector('.move-right');
        let items = document.querySelector('.move-items');
        let itemsArr = Array.from(dropZone.querySelectorAll('.form-group'));
        for (let item of itemsArr) {
            items.insertAdjacentElement('beforeend', item);
        }
        dropZone.classList.remove('d-flex');
        dropZone.classList.add('d-none');
        makeHidden(nameField);
        makeHidden(surnameField);
        makeHidden(usernameField);
        makeHidden(ageField);
        makeHidden(phoneField);
        fillForm();

        editBtn.classList.remove('d-none');
        cancelBtn.classList.add('d-none');
        saveBtn.classList.add('d-none');
    });

    // Listener al presionar boton Guardar
    saveBtn.addEventListener('click', function (e) {
        e.preventDefault();

        let letterRegex = new RegExp('^[a-zA-Z]+$');
        let numberRegex = new RegExp('^[0-9]+$');

        if (!imageField == '') {
            user.img = imageField;
        }
        if (!nameField.value == '') {
            if (letterRegex.test(nameField.value)) {
                user.name = nameField.value;
            } else {
                let alert = document.getElementById('error');
                alert.style.opacity = '1';
                alert.style.display = 'block';
                alert.innerText = 'Debes ingresar unicamente las letras de tu nombre.';

                setTimeout(() => {
                    let fade = setInterval(() => {
                        if (alert.style.opacity > 0) {
                            alert.style.opacity -= 0.1;
                        } else {
                            clearInterval(fade);
                            alert.style.display = 'none';
                        }
                    }, 50);
                }, 2000);
            }
        }
        if (!surnameField.value == '') {
            if (letterRegex.test(surnameField.value)) {
                user.surname = surnameField.value;
            } else {
                let alert = document.getElementById('error');
                alert.style.opacity = '1';
                alert.style.display = 'block';
                alert.innerText = 'Debes ingresar unicamente las letras de tu apellido.';

                setTimeout(() => {
                    let fade = setInterval(() => {
                        if (alert.style.opacity > 0) {
                            alert.style.opacity -= 0.1;
                        } else {
                            clearInterval(fade);
                            alert.style.display = 'none';
                        }
                    }, 50);
                }, 2000);
            }
        }
        if (!username.value == '') {
            user.username = usernameField.value;
        }
        if (!ageField.value == '') {
            if (numberRegex.test(ageField.value)) {
                user.age = ageField.value;
            } else {
                let alert = document.getElementById('error');
                alert.style.opacity = '1';
                alert.style.display = 'block';
                alert.innerText = 'Debes ingresar unicamente tu edad.';

                setTimeout(() => {
                    let fade = setInterval(() => {
                        if (alert.style.opacity > 0) {
                            alert.style.opacity -= 0.1;
                        } else {
                            clearInterval(fade);
                            alert.style.display = 'none';
                        }
                    }, 50);
                }, 2000);
            }
        }
        if (!emailField.value == '') {
            user.email = emailField.value;
        }
        if (!phoneField.value == '') {
            if (numberRegex.test(phoneField.value)) {
                user.phone = phoneField.value;
            } else {
                let alert = document.getElementById('error');
                alert.style.opacity = '1';
                alert.style.display = 'block';
                alert.innerText = 'Debes ingresar unicamente tu telefono.';

                setTimeout(() => {
                    let fade = setInterval(() => {
                        if (alert.style.opacity > 0) {
                            alert.style.opacity -= 0.1;
                        } else {
                            clearInterval(fade);
                            alert.style.display = 'none';
                        }
                    }, 50);
                }, 2000);
            }
        }

        let userStrMod = JSON.stringify(user);
        localStorage.setItem('user', userStrMod);

        document.getElementById('profileForm').reset();

        // Ocultar drag and drop zone y mover inputs
        let dropZone = document.querySelector('.move-right');
        let items = document.querySelector('.move-items');
        let itemsArr = Array.from(dropZone.querySelectorAll('.form-group'));
        for (let item of itemsArr) {
            items.insertAdjacentElement('beforeend', item);
        }
        dropZone.classList.remove('d-flex');
        dropZone.classList.add('d-none');
        makeHidden(nameField);
        makeHidden(surnameField);
        makeHidden(usernameField);
        makeHidden(ageField);
        makeHidden(phoneField);
        fillForm();

        editBtn.classList.remove('d-none');
        cancelBtn.classList.add('d-none');
        saveBtn.classList.add('d-none');

        location.reload();
    });
});