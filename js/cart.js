// Variables globales
var subtotalArray = [];
var sum = 0;
var subtotalSum = 0;
var shipCost = document.getElementById('shipCost');

// Funcion para mostrar el carrito
function showCartList(array) {
    let htmlContentToAppend = "";

    // Recorrido por los elementos del array
    for (let i = 0; i < array.length; i++) {
        htmlContentToAppend += `
        <tr>
            <th class="align-middle"><img src="${array[i].src}" style="width: 40px">${array[i].name}</th>
            <td class="align-middle text-left">${array[i].currency} ${array[i].unitCost}</td>
            <td class="align-middle">
                <input class="form-control quantity" type="number" min="1" max="10" value="${array[i].count}" style="width: 100px">
            </td>`;

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
    let htmlContentToAppend = '';

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

    // Obtener el 10%
    let total = (sum * 10) / 100;
    // Mensajes siendo $100 el costo mínimo
    if (total <= 100) {
        htmlContentToAppend += '$ 100 - Valor mínimo';
    } else {
        htmlContentToAppend += `10% - $ ${total}`;
    }

    // Guardar valor global de los subtotales
    subtotalSum = sum;
    // Reiniciar suma de subtotales y mostrar costo de envío
    sum = 0;
    shipCost.innerHTML = htmlContentToAppend;
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
            let stringArray = shipCost.textContent.split(' ').reverse();
            let cost = parseInt(stringArray.find(Number));
            output.innerHTML = 'UYU - $' + (cost + subtotalSum);

            totalContainer.style.opacity = 1;
            totalContainer.style.display = 'block';
        } else {
            // Selecciona envio sin costo
            output.innerHTML = 'UYU - $' + subtotalSum;

            totalContainer.style.opacity = 1;
            totalContainer.style.display = 'block';
        }
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
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