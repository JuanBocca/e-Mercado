const CATEGORIES_URL = "https://japdevdep.github.io/ecommerce-api/category/all.json";
const PUBLISH_PRODUCT_URL = "https://japdevdep.github.io/ecommerce-api/product/publish.json";
const CATEGORY_INFO_URL = "https://japdevdep.github.io/ecommerce-api/category/1234.json";
const PRODUCTS_URL = "https://japdevdep.github.io/ecommerce-api/product/all.json";
const PRODUCT_INFO_URL = "https://japdevdep.github.io/ecommerce-api/product/5678.json";
const PRODUCT_INFO_COMMENTS_URL = "https://japdevdep.github.io/ecommerce-api/product/5678-comments.json";
const CART_INFO_URL = "https://japdevdep.github.io/ecommerce-api/cart/987.json";
const CART_BUY_URL = "https://japdevdep.github.io/ecommerce-api/cart/buy.json";

var showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

var hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

var getJSONData = function (url) {
  var result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function () {

  // Ejecuta en todas las paginas (menos login.html)
  let currentURL = document.location.href;
  if (!currentURL.includes('login.html')) {
    let userName = document.querySelector('#userName');
    let picContainer = document.querySelector('#profilePic');

    // Verifica si no existe datos de usuario
    if (!localStorage.getItem('id')) {
      // Agregar link al li
      let dropdown = document.getElementsByClassName('dropdown');
      let li = dropdown[0].parentNode;
      let a = document.createElement('a');
      li.appendChild(a);

      // Eliminar dropdown e imagen
      li.removeChild(dropdown[0]);
      picContainer.parentNode.removeChild(picContainer);

      // Agregar datos al link
      a.classList.add('nav-link', 'py-2', 'd-md-inline-block');
      a.setAttribute('href', 'login.html');
      a.innerText = 'Iniciar Sesión';
    } else {
      // Si existen datos de usuario

      // Muestra el nombre de usuario
      let name = localStorage.getItem('name');
      userName.innerHTML = 'Hola, ' + name + '!';

      // Ademas verifica si tiene imagen o no
      let img = localStorage.getItem('img');
      if (img) {
        picContainer.setAttribute('src', img);
      } else {
        picContainer.parentNode.removeChild(picContainer);
      }

      // Listener boton cerrar sesión
      let logOutBtn = document.querySelector('#logOut');
      logOutBtn.addEventListener('click', function () {
        localStorage.clear();
        location.href = 'index.html';
      });
    }
  }
});