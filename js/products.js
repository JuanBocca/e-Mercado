//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

const ORDER_ASC_BY_PRICE = "Mayor Precio";
const ORDER_DESC_BY_PRICE = "Menor Precio";
const ORDER_BY_SOLD_COUNT = "Vend.";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

// Funcion que ordena el listado de productos
function sortProducts(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE) {
        // Por precio ascendente
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return 1; }
            if (a.cost > b.cost) { return -1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        // Por precio descendente
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return 1; }
            if (a.cost < b.cost) { return -1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_SOLD_COUNT) {
        // Por relevancia
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// Funcion que muestra la lista de productos
function showProductsList() {

    let htmlContentToAppend = "";
    for (let i = 0; i < currentProductsArray.length; i++) {
        let product = currentProductsArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(product.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(product.cost) <= maxCount))) {

            // htmlContentToAppend += `
            // <a href="product-info.html" class="list-group-item list-group-item-action">
            //     <div class="row">
            //         <div class="col-3">
            //             <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
            //         </div>
            //         <div class="col">
            //             <div class="d-flex w-100 justify-content-between">
            //                 <h4 class="mb-1 name">`+ product.name + `</h4>
            //                 <div class="row d-flex flex-column">
            //                     <small class="text-muted">` + product.soldCount + ` vendidos</small>
            //                     <small class="text-muted">` + product.currency + ' ' + product.cost + `</small>
            //                 </div>
            //             </div>
            //             <p class="mb-1 description">` + product.description + `</p>
            //         </div>
            //     </div>
            // </a>
            // `

            htmlContentToAppend += `
            <a href="product-info.html" class="col-md-4 aProd">
                <div class="card mb-4">
                    <img src="` + product.imgSrc + `" alt="` + product.description + `" class="card-img-top">
                    <div class="card-body">
                        <p class="card-text">
                            <div class="d-inline-block mb-1">
                                <span class="h4 mb-1 name">`+ product.name + `</span>
                                <span class="h5"> - ` + product.currency + ' ' + product.cost + `</span>
                            </div>
                            <p class="mb-1 description">` + product.description + `</p>
                        </p>
                    </div>
                </div>
            </a>
            `
        }
    }
    document.getElementById("prod-list-container").innerHTML = htmlContentToAppend;

    // Filtrar por nombre o descripcion mientras escribe.
    let search = document.querySelector('#searchField');
    search.addEventListener('input', function () {
        let filter = search.value.toUpperCase();
        let output = document.querySelector('#prod-list-container');
        var prod = output.getElementsByTagName('a');

        // Recorrer todos los 'a'
        for (let i = 0; i < prod.length; i++) {
            let name = prod[i].querySelector('.name');
            let description = prod[i].querySelector('.description');
            let txtName = name.innerHTML;
            let txtDesc = description.innerHTML;

            // Si coincide la busqueda lo mantiene, sino lo oculta
            if (txtName.toUpperCase().indexOf(filter) > -1 || txtDesc.toUpperCase().indexOf(filter) > -1) {
                prod[i].style.display = "";
            } else {
                prod[i].style.display = "none";
            }
        }
    });
}

function sortAndShowProducts(sortCriteria, productsArray) {
    currentSortCriteria = sortCriteria;

    if (productsArray != undefined) {
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenadas
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_SOLD_COUNT);
    });

    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCount = undefined;
        maxCount = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
        //de productos por categoría.
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }

        showProductsList();
    });
});