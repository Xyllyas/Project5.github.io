const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const inputQuantity = document.getElementsByClassName("itemQuantity");
const deleteItem = document.getElementsByClassName("deleteItem");
var cart = JSON.parse(localStorage.getItem("myCart"))

// regarde si le panier est plein ou vide
if (cart != null) {
  var cartId = getCartId(cart);
} else {
  cartId = {};
}





// au refresh de la page vide le contenue du formulaire
var input = document.getElementsByTagName("input");
for (var i = 0; i < input.length; i++) {
  if (input[i].type === "text" || input[i].type === "email") {
    input[i].value = "";
  }
}
afficher(cartId, cart);

setInterval(() => {
  if (inputQuantity.length == Object.keys(cartId).length) {
    clearInterval();

    getTotalQuantity(totalQuantity, inputQuantity);
    getTotalPrice(totalPrice, inputQuantity);

    var arrayProduct = createArrayProduct();

    changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart);
    supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem);


    sendForm(arrayProduct);
  }
}, 1000);


// créer un objet contenant les id des produits
function getCartId(cart) {
  let nb = 0;
  let cartId = {};
  for (let i in Object.keys(cart)) {
    cartId[`${nb}`] = `${Object.values(cart)[i].id}`
    nb++;
  }
  return cartId
}

// ajoute à la page tous les produits contenue dans le localStorage
function afficher(cartId, cart) {
  var content = "";
  for (let i in Object.keys(cartId)) {
    fetch(`http://localhost:3000/api/products/${Object.values(cartId)[i]}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        content +=
          `<article class="cart__item" data-id="${data._id}" data-color="${Object.values(cart)[i].colors}">
                    <div class="cart__item__img">
                      <img src="${data.imageUrl}" alt="${data.altTxt}">
                    </div>
                    <div class="cart__item__content">
                      <div class="cart__item__content__description">
                        <h2>${data.name}</h2>
                        <p>${Object.values(cart)[i].colors}</p>
                        <p>${data.price}</p>
                      </div>
                      <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                          <p>Qté : </p>
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${Object.values(cart)[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                          <p class="deleteItem">Supprimer</p>
                        </div>
                      </div>
                    </div>
                  </article>`;

        document.querySelector("#cart__items").innerHTML = content;

      })
      .catch((err) => {
        console.log("erreur :" + err);
      })
  }
}

// récupère la quantité total des produits
function getTotalQuantity(total, nbItem) {
  let value = 0;
  for (let item of nbItem) {
    value += parseInt(item.value);
  }
  total.textContent = value;
  return value;
}

// ajoute le prix total de la quantité de chaque produit
function getTotalPrice(total, nbItem) {
  let value = 0;
  let totalPrice = {};
  let i = 0;
  let nb = 0;

  for (let item of nbItem) {
    let quantity = 0;
    let price = 0;
    quantity += parseInt(item.value);
    price += parseInt(document.querySelectorAll(".cart__item__content__description")[i].children[2].textContent);
    totalPrice[nb] = quantity * price;
    i++;
    nb++;
  }
  total.textContent = (Object.values(totalPrice).reduce((prev, curr) => prev + curr, 0));
}

// au changement de quantité met a jour la quantité, le prix et le local storage
function changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart) {
  for (const input of inputQuantity) {
    input.addEventListener('input', () => {
      getTotalQuantity(totalQuantity, inputQuantity);
      getTotalPrice(totalPrice, inputQuantity);

      let quantity = input.closest('article').getElementsByClassName("cart__item__content__settings__quantity")[0].children[1].value;
      let color = input.closest('article').dataset.color;
      let id = input.closest('article').dataset.id;

      for (i = 0; i < Object.values(cart).length; i++) {
        if (color == Object.values(cart)[i].colors && id == Object.values(cart)[i].id) {
          Object.values(cart)[i].quantity = quantity;
          localStorage.setItem("myCart", JSON.stringify(cart));
        }
      }
    });
  };
}

// supprime le produit de la page et du localstorage
function supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem) {
  for (const suppr of deleteItem) {
    suppr.addEventListener('click', () => {
      let color = suppr.closest('article').dataset.color;
      let id = suppr.closest('article').dataset.id;

      var divDesc = suppr.closest('article').children[1];

      suppr.closest('article').remove();
      for (var i = 0; i < Object.keys(cart).length; i++) {
        if (color == Object.values(cart)[i].colors && id == Object.values(cart)[i].id) {
          delete cart[Object.keys(cart)[i]];
          localStorage.setItem("myCart", JSON.stringify(cart));
        }
      }

      getTotalQuantity(totalQuantity, inputQuantity);
      getTotalPrice(totalPrice, inputQuantity);
      createArrayProduct();
      popUpSupprItem(divDesc);


    })
  }
}

// vérifie le formulaire
function sendForm(arrayProduct) {
  document.getElementById("firstName").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("firstNameErrorMsg").innerText = "";
    } else {
      document.getElementById("firstNameErrorMsg").innerText = "Prénom invalide.";
    }
  });
  document.getElementById("lastName").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("lastNameErrorMsg").innerText = "";
    } else {
      document.getElementById("lastNameErrorMsg").innerText = "Nom invalide.";
    }
  });
  document.getElementById("address").addEventListener("input", (e) => {
    if (/^[^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("addressErrorMsg").innerText = "";
    } else {
      document.getElementById("addressErrorMsg").innerText = "Adresse nvalide.";
    }
  });
  document.getElementById("city").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("cityErrorMsg").innerText = "";
    } else {
      document.getElementById("cityErrorMsg").innerText = "Ville invalide.";
    }
  });
  document.getElementById("email").addEventListener("input", (e) => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)) {
      document.getElementById("emailErrorMsg").innerText = "";
    } else {
      document.getElementById("emailErrorMsg").innerText = "Email invalide.";
    }
  });
  // check permet de vérifié chaque input du formulaire 
  let check = 0;

  document.getElementById("order").addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      if (document.querySelector(".cart__order__form").children[i].children[2].textContent == "" && document.querySelector(".cart__order__form").children[i].children[1].value != "") {
        check++; // si l'input est bon ajoute 1 à check
        if (check == 5) { //si les 5 input sont bon utilise la fonction postFetch
          e.preventDefault();
          postFetch(arrayProduct);
        }
      } else { // sinon reinitialise a 0
        e.preventDefault();
        check = 0;
      }
    }
  });
}

// créer le tableau de produit pour la post methode
function createArrayProduct() {
  const cartItems = document.querySelector("#cart__items").children;
  var arrayProduct = [];
  for (i = 0; i < cartItems.length; i++) {
    arrayProduct.push(cartItems[i].dataset.id);
  }
  return arrayProduct;
}

// popUp a la suppression d'un item
function popUpSupprItem(obj) {
  const overlay = document.createElement("div");
  overlay.setAttribute('id', 'overlay')
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "2";
  document.body.appendChild(overlay);

  const popUp = document.createElement("p");
  popUp.setAttribute('id', 'popUp')
  popUp.style.fontSize = "25px";
  popUp.textContent = `L'article ${obj.children[0].children[0].textContent} de couleur ${obj.children[0].children[1].textContent} a été supprimé. `;
  popUp.style.color = "#fff";
  popUp.style.padding = "40px";
  popUp.style.fontWeight = "700";
  popUp.style.background = "#3498db";
  popUp.style.borderRadius = "25px"
  overlay.appendChild(popUp);

  setTimeout(() => {
    overlay.style.display = "none";
    popUp.style.display = "none";
  }, 2000);
}

// post les produit dans l'API
function postFetch(arrayProduct) {
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    headers: {
      'Accept': "application/json",
      'Content-type': "application/json"
    },
    body: JSON.stringify({
      contact: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value
      },
      products: arrayProduct
    })
  })
    .then((res) => {
      if (res.ok) {
        return res.json();
      }
    })
    .then((value) => {
      location.assign(`confirmation.html?id=${value.orderId}`)
    })
    .catch((err) => {
      console.log(err);
    })
}