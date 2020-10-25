// Variables globales
var subtotalArray = [];
var sum = 0;
var subtotalSum = 0;
var cost = 0;
var premiumCost = document.getElementById('premiumCost');
var expressCost = document.getElementById('expressCost');
var standardCost = document.getElementById('standardCost');

// Funcion para mostrar el carrito
function showCartList(array) {
    let htmlContentToAppend = "";

    // Recorrido por los elementos del array
    for (let i = 0; i < array.length; i++) {
        htmlContentToAppend += `
        <tr>
            <th class="align-middle"><span class="align-middle mr-3 deleteProduct" aria-hidden="true">&times;</span><img src="${array[i].src}" style="width: 40px">${array[i].name}</th>
            <td class="align-middle text-left">${array[i].currency} ${array[i].unitCost}</td>
            <td class="align-middle">
                <input class="form-control quantity" type="number" min="1" max="10" value="${array[i].count}" style="width: 100px">
            </td>`
            ;

        // Si la moneda es dolar calcula la conversión
        if (array[i].currency === "USD") {
            htmlContentToAppend += `
            <td class="align-middle text-right subtotal">UYU ${(array[i].unitCost * 40) * array[i].count}</td>
        </tr>`;
        } else {
            htmlContentToAppend += `
            <td class="align-middle text-right subtotal">${array[i].currency} ${array[i].unitCost * array[i].count}</td>
        </tr>
            `;
        }
    }
    document.getElementById('cart-list-container').innerHTML = htmlContentToAppend;

    // Llama a la funcion para actualizar el subtotal
    refreshSubtotal(array);
    // Llama a la funcion para calcular el costo envío
    calcShip();
    // Llama a la funcion para borrar productos
    deleteProduct(array);
}

// Funcion para actualizar el subtotal
function refreshSubtotal(array) {
    let quantityArray = document.getElementsByClassName('quantity');
    subtotalArray = document.getElementsByClassName('subtotal');
    // Recorre cada campo "Cantidad"
    for (let i = 0; i < quantityArray.length; i++) {
        let quantity = quantityArray[i];
        let subtotal = subtotalArray[i]

        // Listener ejecuta cada vez que cambia la cantidad
        quantity.addEventListener('change', function () {
            let value = quantity.value;
            // Actualizar el subtotal segun moneda
            if (array[i].currency === "USD") {
                var newSubtotal = `UYU ${(array[i].unitCost * 40) * value}`;
            } else {
                var newSubtotal = `${array[i].currency} ${array[i].unitCost * value}`;
            }
            // Actualizar subtotal
            subtotal.innerHTML = newSubtotal;
            // Actualiza el costo de envío
            calcShip();
        });
    }
}

// Funcion para calcular costo de envio
function calcShip() {
    let premiumContentToAppend = '';
    let expressContentToAppend = '';
    let standardContentToAppend = '';

    // Crear un array para los subtotales
    var num = [];
    for (subtotal of subtotalArray) {
        // Extraer solo el numero y agregarlo al array
        let matches = subtotal.textContent.match(/(\d+)/);
        num.push(parseInt(matches[0]));
    }
    // Sumar cada elemento del array
    num.forEach(function (cost) {
        sum += cost;
    });

    // Obtener el 15, 7 y 5%
    let totalPremium = (sum * 15) / 100;
    let totalExpress = (sum * 7) / 100;
    let totalStandard = (sum * 5) / 100;
    // PREMIUM
    // Mensajes siendo $100 el costo mínimo
    if (totalPremium === 0) {
        premiumContentToAppend += '';
    } else if (totalPremium <= 100) {
        premiumContentToAppend += '$ 100 - Valor mínimo';
    } else {
        premiumContentToAppend += `15% - $ ${totalPremium}`;
    }
    // EXPRESS
    // Mensajes siendo $100 el costo mínimo
    if (totalExpress === 0) {
        expressContentToAppend += '';
    } else if (totalExpress <= 100) {
        expressContentToAppend += '$ 100 - Valor mínimo';
    } else {
        expressContentToAppend += `7% - $ ${totalExpress}`;
    }
    // STANDARD
    // Mensajes siendo $100 el costo mínimo
    if (totalStandard === 0) {
        standardContentToAppend += '';
    } else if (totalStandard <= 100) {
        standardContentToAppend += '$ 100 - Valor mínimo';
    } else {
        standardContentToAppend += `5% - $ ${totalStandard}`;
    }
    // Guardar valor global de los subtotales
    subtotalSum = sum;
    // Reiniciar suma de subtotales y mostrar costo de envío
    sum = 0;

    let subtotalOutput = document.getElementById('subtotal');
    if (subtotalSum === 0) {
        subtotalOutput.innerHTML = '';
    } else {
        subtotalOutput.innerHTML = `$ ${subtotalSum}`;
    }

    premiumCost.innerHTML = premiumContentToAppend;
    expressCost.innerHTML = expressContentToAppend;
    standardCost.innerHTML = standardContentToAppend;
    refreshTotal(subtotalSum);
}

// Funcion para mostrar el total
function showTotal(e) {
    e.preventDefault();

    // Listener al seleccionar tipo de envío
    let input = document.getElementById('selectCost');
    input.addEventListener('click', function (e) {
        e.preventDefault();

        // Verificar el valor del tipo de envio seleccionado
        let radios = document.querySelectorAll('input[name="choosedShip"]');
        let selectedValue;
        for (radio of radios) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }

        let totalContainer = document.getElementById('totalCost');
        let output = document.getElementById('cost');
        // Mostrar resultado según envío seleccionado
        if (!selectedValue) {
            // No selecciona tipo de envío
            let alert = document.getElementById('error');
            alert.style.opacity = '1';
            alert.style.display = 'block';
            totalContainer.style.opacity = 0;
            totalContainer.style.display = 'none';

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
        } else if (selectedValue === '30') {
            // Selecciona envío standard
            let stringArray = standardCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            output.innerHTML = `
                <span id='subtotal-output'>Subtotal - $ ${subtotalSum}</span><br>
                <span id='ship-output'>Envío - $ ${cost}</span><br>
                <span id='total-output' class="font-weight-bold">Total - $ ${cost + subtotalSum}</span>
            `;

            totalContainer.style.opacity = 1;
            totalContainer.style.display = 'block';
        } else if (selectedValue === '20') {
            // Selecciona envío express
            let stringArray = expressCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            output.innerHTML = `
                <span id='subtotal-output'>Subtotal - $ ${subtotalSum}</span><br>
                <span id='ship-output'>Envío - $ ${cost}</span><br>
                <span id='total-output' class="font-weight-bold">Total - $ ${cost + subtotalSum}</span>
            `;

            totalContainer.style.opacity = 1;
            totalContainer.style.display = 'block';
        } else if (selectedValue === '10') {
            // Selecciona envío premium
            let stringArray = premiumCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            output.innerHTML = `
                <span id='subtotal-output'>Subtotal - $ ${subtotalSum}</span><br>
                <span id='ship-output'>Envío - $ ${cost}</span><br>
                <span id='total-output' class="font-weight-bold">Total - $ ${cost + subtotalSum}</span>
            `;

            totalContainer.style.opacity = 1;
            totalContainer.style.display = 'block';
        }
        selectMethod();
        submit();
    });
}

// Funcion para actualizar el total
function refreshTotal(sum) {
    let subOutput = document.getElementById('subtotal-output');
    let shipOutput = document.getElementById('ship-output');
    let totalOutput = document.getElementById('total-output');

    if (subOutput) {
        let subtotal = sum;
        let cost;
        // Verificar el valor del tipo de envio seleccionado
        let radios = document.querySelectorAll('input[name="choosedShip"]');
        let selectedValue;
        for (radio of radios) {
            if (radio.checked) {
                selectedValue = radio.value;
                break;
            }
        }
        if (selectedValue === '10') {
            let stringArray = premiumCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            subOutput.innerHTML = 'Subtotal - $ ' + subtotal;
            shipOutput.innerHTML = 'Envío - $ ' + cost;
            totalOutput.innerHTML = 'Total - $ ' + (cost + subtotal);
        } else if (selectedValue === '20') {
            let stringArray = expressCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            subOutput.innerHTML = 'Subtotal - $ ' + subtotal;
            shipOutput.innerHTML = 'Envío - $ ' + cost;
            totalOutput.innerHTML = 'Total - $ ' + (cost + subtotal);
        } else if (selectedValue === '30') {
            let stringArray = standardCost.textContent.split(' ').reverse();
            cost = parseInt(stringArray.find(Number));
            subOutput.innerHTML = 'Subtotal - $ ' + subtotal;
            shipOutput.innerHTML = 'Envío - $ ' + cost;
            totalOutput.innerHTML = 'Total - $ ' + (cost + subtotal);
        }
    }
}

// Funcion para filtrar los datos ingresados en los input
function setInputFilter(textbox, inputFilter) {
    ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            } else {
                this.value = "";
            }
        });
    });
}
let number = document.getElementById('numero');
let cardNumInput = document.getElementById('cardNum');
let cardOwnerInput = document.getElementById('cardOwner');
let cardDateInput = document.getElementById('cardDate');
let cardCodeInput = document.getElementById('cardCode');
let bankNumInput = document.getElementById('accountNum');
setInputFilter(number, function (value) {
    return /^$|[\d]+$/.test(value);
});
setInputFilter(cardNumInput, function (value) {
    return /^$|[\d\s]+$/.test(value);
});
setInputFilter(cardOwnerInput, function (value) {
    return /^[a-zA-Z ]*$/.test(value);
});
setInputFilter(cardDateInput, function (value) {
    return /^[0-9/]*$/.test(value);
});
setInputFilter(cardCodeInput, function (value) {
    return /^[0-9]*$/.test(value);
});
setInputFilter(bankNumInput, function (value) {
    return /^[0-9]*$/.test(value);
});
// Añadir un espacio cada 4 numeros
cardNumInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/(\d{4})(\d+)/g, '$1 $2');
});
// Añadir - para dividir fecha
cardDateInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/(\d{2})(\d+)/g, '$1/$2');
});

// Funcion para mostrar los inputs del tipo de pago seleccionado
function selectMethod() {
    document.querySelectorAll('input[name="payment"]').forEach((radio) => {
        radio.addEventListener("change", function (event) {
            let checked = event.target.value;

            let card = document.getElementById('cardForm');
            let bank = document.getElementById('bankForm');
            if (checked === '1') {
                card.style.display = 'block';
                bank.style.display = 'none';
                cardCodeInput.setAttribute('required', 'required');
                cardDateInput.setAttribute('required', 'required');
                cardNumInput.setAttribute('required', 'required');
                cardOwnerInput.setAttribute('required', 'required');
                bankNumInput.removeAttribute('required');
            } else if (checked === '2') {
                bank.style.display = 'block';
                card.style.display = 'none';
                bankNumInput.setAttribute('required', 'required');
                cardDateInput.removeAttribute('required');
                cardCodeInput.removeAttribute('required');
                cardNumInput.removeAttribute('required');
                cardOwnerInput.removeAttribute('required');
            }
        });
    });
}

// Funcion que gestiona el mensaje de submit
function submit() {
    let form = document.getElementById('checkoutForm');
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        mensaje();
        form.reset();
    });
}

// Fetch que trae mensaje al finalizar compra
function mensaje() {
    let msj;
    getJSONData(CART_BUY_URL).then(result => {
        if (result.status === "ok") {
            console.log(result.data.msg);
            msj = result.data.msg
        }
        alert(msj);
        location.reload();
    });
}

// Funcion para borrar productos
function deleteProduct(array) {
    var items = Array.from(document.getElementsByClassName('deleteProduct'));
    for (let i = 0; i < array.length; i++) {
        items[i].addEventListener('click', function () {
            array.splice([i], 1);
            showCartList(array);
        });
    }
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    // https://raw.githubusercontent.com/Marcos170393/products-cart-info/main/json
    // https://japdevdep.github.io/ecommerce-api/cart/654.json
    // CART_INFO_URL
    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function (resultObj) {
        if (resultObj.status === "ok") {
            // Mostrar productos del carrito
            showCartList(resultObj.data.articles);
            // Mostrar el costo total
            showTotal(e);
        }
    });
});