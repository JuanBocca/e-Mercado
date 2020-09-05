var product = {};

function showImagesGallery(array) {

    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

function showFeedback(array) {
    let htmlContentToAppend = "";

    for (let i = 0; i < array.length; i++) {
        let feed = array[i];
        let user = feed.user;
        let comment = feed.description;
        let date = feed.dateTime;

        htmlContentToAppend += `
        <div class="list-group-item list-group-item-action">
            <div class="d-flex w-100 justify-content-between">
                <div class="flex-column">
                    <h5 class="mb-3"><b>` + user + `</b> dice:</h5>
                    <span class="ml-3">"` + comment + `"</span>
                </div>
                <div class="row d-flex">
                    <small class="text-muted">` + date + `</small>
                </div>
            </div>
            <div class="mt-3 d-flex justify-content-center star-container"> 
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
                <span class="fa fa-star"></span>
            </div>
        </div>
        `

        document.getElementById('comments').innerHTML = htmlContentToAppend;
    }
    let starCont = document.getElementsByClassName('star-container');
    fillStars(array, starCont);
}

function fillStars(array, starCont) {
    for (let i = 0; i < starCont.length; i++) {
        let rate = array[i].score;

        for (let check = 0; check < rate; check++) {
            let star = starCont[i].children;
            star[check].classList.add('checked');
        }
    }
}

function showRelatedProducts(array) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            let products = resultObj.data;
            let htmlContentToAppend = '';
            let relatedContainer = document.getElementById('relatedProducts');

            for (let i = 0; i < array.length; i++) {
                let related = array[i];

                htmlContentToAppend += `
                <div class='card mx-1' style='width: 18rem;'>
                        <img class='card-img-top' src='${products[related].imgSrc}' alt=''>
                        <div class='card-body'>
                            <h5 class='card-title'>${products[related].name}</h5>
                            <p class='card-text'>${products[related].description}</p>
                            <a href="#">Ver</a>
                        </div>
                    </div>
                `
            }
            relatedContainer.innerHTML = htmlContentToAppend;
        }
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCT_INFO_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;

            let productNameHTML = document.getElementById("productName");
            let productDescriptionHTML = document.getElementById("productDescription");
            let productSoldCountHTML = document.getElementById("productSoldCount");
            let productCostHTML = document.getElementById("productCost");

            productNameHTML.innerHTML = product.name;
            productDescriptionHTML.innerHTML = product.description;
            productSoldCountHTML.innerHTML = product.soldCount;
            productCostHTML.innerHTML = product.currency + ' ' + product.cost;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
            showRelatedProducts(product.relatedProducts);
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            showFeedback(resultObj.data);

            let form = document.getElementById('leaveCommentForm');
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                let rate = document.getElementById('formRate').value;
                let message = document.getElementById('formMessage').value;
                let name = document.getElementById('formName').value;
                let tzoffset = (new Date()).getTimezoneOffset() * 60000;
                let date = (new Date(Date.now() - tzoffset)).toISOString().substr(0, 19).replace('T', ' ');

                let comment = {
                    'score': rate,
                    'description': message,
                    'user': name,
                    'dateTime': date
                };
                resultObj.data.push(comment);
                showFeedback(resultObj.data);
            });
        }
    });

    // Formulario para dejar comentarios
    var nameHTML = document.getElementById('formName');
    var name = localStorage.getItem('name');

    nameHTML.setAttribute('value', name);
});