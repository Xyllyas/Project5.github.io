const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const inputQuantity = document.getElementsByClassName("itemQuantity");
const deleteItem = document.getElementsByClassName("deleteItem");
var cart = JSON.parse(localStorage.getItem("myCart"))



// au refresh de la page vide le contenue du formulaire
const input = document.getElementsByTagName("input");
for (let i = 0; i < input.length; i++) {
  if (input[i].type === "text" || input[i].type === "email") {
    input[i].value = "";
  }
}

// si le panier est vide créer un tableau vide
if (cart.length !== 0) {
  getFetch();
  var arrayProduct = createArrayProduct();
} else {
  getTotal(totalQuantity, totalPrice, inputQuantity);
  cartEmpty();
  document.querySelector(".cart__order").style.display = "none";
}


checkForm()
sendForm(arrayProduct)

function getFetch() {
  var content = "";
  cart.forEach(element => {
    fetch(`http://localhost:3000/api/products/${element.id}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        content +=
          `<article class="cart__item" data-id="${data._id}" data-color="${element.colors}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${element.colors}</p>
                    <p>${data.price}</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${element.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;

        document.querySelector("#cart__items").innerHTML = content;
      })
      .then(() => {
        getTotal(totalQuantity, totalPrice, inputQuantity);
        changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart);
        supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem);
      })
      .catch((err) => {
        alert(err);
      })
  })
}






// récupère la quantité total des produits et multiplie chaque prix correspondant et l'affiche 
function getTotal(quantity, prices, nbItem) {
  let quantité = 0;
  let quantitéTotal = 0;
  let totalPrice = [];
  let price = 0;
  let i = 0

  for (let item of nbItem) {
    let multiplication = 0;
    quantité = parseInt(item.value);
    quantitéTotal += parseInt(item.value);
    price = parseInt(document.querySelectorAll(".cart__item__content__description")[i].children[2].textContent);
    multiplication = quantité * price;
    totalPrice.push(multiplication);
    i++;
  }
  quantity.textContent = quantitéTotal;
  let sum = 0;
  totalPrice.forEach(item => {
    sum += item;
  })
  prices.textContent = sum;

}

// au changement de quantité met a jour la quantité, le prix et le local storage
function changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart) {
  for (const input of inputQuantity) {
    input.addEventListener('change', (e) => {

      getTotal(totalQuantity, totalPrice, inputQuantity);
      const closest = input.closest('article')
      let quantity = closest.getElementsByClassName("cart__item__content__settings__quantity")[0].children[1].value;
      let color = closest.dataset.color;
      let id = closest.dataset.id;

      cart.find(element => {
        if (color == element.colors && id == element.id) {

          if (quantity > 0 && quantity < 101) {
            element.quantity = quantity;
            localStorage.setItem("myCart", JSON.stringify(cart));
            errorQuantity(closest, true)
          } else {
            errorQuantity(closest, false)
          }
        }
      });
    })
  }
}

//previens l'utilisateur d'une mauvaise quantité
function errorQuantity(closest, check) {
  if (check == false) {
    var p = document.createElement('p');
    p.classList.add('error-quantity');
    closest.querySelector(".cart__item__content__settings__quantity").appendChild(p)
    p.textContent = "Veuillez saisir une valeur entre 1 et 100.";
  } else {
    if (document.querySelector('.error-quantity') != null) {
      closest.querySelector('.error-quantity').remove();
    }
  }
}

// supprime le produit de la page et du localstorage
function supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem) {
  for (const suppr of deleteItem) {
    suppr.addEventListener('click', (e) => {
      let color = suppr.closest('article').dataset.color;
      let id = suppr.closest('article').dataset.id;
      let divDesc = suppr.closest('article').children[1];
      suppr.closest('article').remove();

      let index = -1;
      cart.find(item => {
        if (color == item.colors && id == item.id) {
          index = cart.indexOf(item);

        }
      })
      if (index !== -1) {
        cart.splice(index, 1);
        localStorage.setItem("myCart", JSON.stringify(cart));
      }

      getTotal(totalQuantity, totalPrice, inputQuantity);
      arrayProduct = createArrayProduct();
      popUpSupprItem(divDesc);
      if (cart.length == 0) {
        document.querySelector(".cart__order").style.display = "none";
        cartEmpty();
      }
    })
  }
}
// message indiquant que le panier vide
function cartEmpty() {
  const contener = document.querySelector("#cart__items");
  const div = document.createElement("div");
  div.classList = "cart__item";
  div.style.fontSize = "30px";
  div.style.fontWeight = "600"
  div.textContent = "Votre panier est vide";
  contener.appendChild(div);
}

// vérifie le formulaire
function checkForm(arrayProduct) {
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
}
//verifie chaque input du formulaire avant envoie
function sendForm(arrayProduct) {
  const form = document.querySelector(".cart__order__form");
  document.getElementById("order").addEventListener('click', (e) => {
    e.preventDefault();
    let check = 0;
    let nbInput = form.length - 1;
    for (let i = 0; i < nbInput; i++) {
      if ((form.children[i].children[2].textContent == "" && form.children[i].children[1].value !== "")) {
        check++; // si l'input est bon ajoute 1 à check

        if (check == nbInput) {
          if (cart.length == 0) { // si le panier est vide previent l'utilisateur
            // let text = "Votre panier est vide.";
            // msgForm(text);
            alert("Le panier est vide")
            check = 0;
          } else {//si les 5 input sont bon et que le panier est plein utilise la fonction postFetch
            let text = "Votre commande a été pris en compte vous allez être redirigé";
            msgForm(text);
            postFetch(arrayProduct);

          }
        }
      }
      else {// si un des input est mal rempli averti l'utilisateur et arrete la boucle
        i = nbInput;
        let text = "Un ou plusieurs champs n'ont pas été correctement remplis.";
        msgForm(text);
      }
    }
  })
}
// message indiquant si le panier est vide ou si le formulaire est mal rempli
function msgForm(text) {
  const div = document.querySelector(".cart__order__form__submit");
  div.style.position = "relative"

  let msg = document.createElement("div");
  msg.style.minWidth = "200px";
  msg.style.borderRadius = "40px"
  msg.style.backgroundColor = "#2c3e50";
  msg.style.position = "absolute"
  msg.style.top = "120px"
  msg.style.padding = "15px";
  msg.textContent = text;
  msg.style.textAlign = "center";

  div.appendChild(msg);

  setTimeout(() => {
    msg.remove()
  }, 2000);
}

// créer le tableau de produit pour la post methode
function createArrayProduct() {
  let arrayProduct = [];
  cart.forEach(element => {
    arrayProduct.push(element.id);
  })
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
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
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
    overlay.remove();
    popUp.remove()
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
      alert(err)
    })
}