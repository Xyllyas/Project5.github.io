const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");
const inputQuantity = document.getElementsByClassName("itemQuantity");
const deleteItem = document.getElementsByClassName("deleteItem");
var cart = JSON.parse(localStorage.getItem("myCart"))

if (cart != null) {
  var cart_id = getCartId(cart);
} else {
  cart_id = {};
}

var input = document.getElementsByTagName("input");
for (var i = 0; i < input.length; i++) {
  if (input[i].type === "text" || input[i].type === "email") {
    input[i].value = "";
  }
}
afficher(cart_id, cart);

setInterval(() => {
  if (inputQuantity.length == Object.keys(cart_id).length) {
    clearInterval();

    getTotalQuantity(totalQuantity, inputQuantity);
    getTotalPrice(totalPrice, inputQuantity);

    var arrayProduct = createArrayProduct();

    changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart);
    supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem);
    

    sendForm(arrayProduct);
  }
}, 1000);



function getCartId(cart) {
  let nb = 0;
  let cart_id = {};
  for (let i in Object.keys(cart)) {
    cart_id[`${nb}`] = `${Object.values(cart)[i].id}`
    nb++;
  }
  return cart_id
}


function afficher(cart_id, cart) {
  var content = "";
  var value = 0;
  for (let i in Object.keys(cart_id)) {
    fetch(`http://localhost:3000/api/products/${Object.values(cart_id)[i]}`)
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

function getTotalQuantity(total, nbItem) {
  let value = 0;
  for (let item of nbItem) {
    value += parseInt(item.value);
  }
  total.textContent = value;
  return value;
}

function getTotalPrice(total, nbItem) {
  const divDesc = document.querySelectorAll(".cart__item__content__description");
  let value = 0;
  let totalPrice = {};
  let i = 0;
  let nb = 0;

  for (let item of nbItem) {
    let quantity = 0;
    let price = 0;
    quantity += parseInt(item.value);
    price += parseInt(divDesc[i].children[2].textContent);
    totalPrice[nb] = quantity * price;
    i++;
    nb++;
  }

  value = (Object.values(totalPrice).reduce((prev, curr) => prev + curr, 0));
  total.textContent = value;
}

function changeInputQuantity(inputQuantity, totalQuantity, totalPrice, cart) {
  for (const input of inputQuantity) {
    input.addEventListener('input', () => {
      getTotalQuantity(totalQuantity, inputQuantity);
      getTotalPrice(totalPrice, inputQuantity);

      let color = input.closest('article').getElementsByClassName("cart__item__content__description")[0].children[1].textContent;
      let quantity = input.closest('article').getElementsByClassName("cart__item__content__settings__quantity")[0].children[1].value;

      for (i = 0; i < Object.values(cart).length; i++) {
        if (color == Object.values(cart)[i].colors) {
          Object.values(cart)[i].quantity = quantity;
          localStorage.setItem("myCart", JSON.stringify(cart));
        }
      }
    });
  };
}
function supprItem(totalQuantity, inputQuantity, totalPrice, cart, deleteItem){
      
  for (const suppr of deleteItem) {
    suppr.addEventListener('click', () => {
      let e = suppr.closest('article');
      let divDesc = e.getElementsByClassName("cart__item__content__description")[0];
      let color = divDesc.children[1].textContent;
      let quantity = document.getElementsByClassName("cart__item__content__settings__quantity")[0].children[1].value;
      e.parentElement.removeChild(e);

      for (i in cart) {
        if (color == cart[i].colors && quantity == cart[i].quantity) {
          delete cart[i];
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

function sendForm(arrayProduct) {
  let ok = 0;

  document.getElementById("firstName").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("firstNameErrorMsg").innerText = "";
    } else {
      document.getElementById("firstNameErrorMsg").innerText = "Invalide.";
    }
  });
  document.getElementById("lastName").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("lastNameErrorMsg").innerText = "";
    } else {
      ok = 0;
      document.getElementById("lastNameErrorMsg").innerText = "Invalide.";
    }
  });
  document.getElementById("address").addEventListener("input", (e) => {
    if (/^[^_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("addressErrorMsg").innerText = "";
    } else {
      document.getElementById("addressErrorMsg").innerText = "Invalide.";
    }
  });
  document.getElementById("city").addEventListener("input", (e) => {
    if (/^[^0-9_!¡?÷?¿\\+=@#$%ˆ&*(){}|~<>;:"[\]]{2,}$/.test(e.target.value)) {
      document.getElementById("cityErrorMsg").innerText = "";
    } else {
      document.getElementById("cityErrorMsg").innerText = "Invalide.";
    }
  });
  document.getElementById("email").addEventListener("input", (e) => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e.target.value)) {
      document.getElementById("emailErrorMsg").innerText = "";
    } else {
      document.getElementById("emailErrorMsg").innerText = "Invalide.";
    }
  });

  let check = 0;

  document.getElementById("order").addEventListener('click', (e) => {
    for (let i = 0; i < 5; i++) {
      if (document.querySelector(".cart__order__form").children[i].children[2].textContent == "" && document.querySelector(".cart__order__form").children[i].children[1].value != "") {

        check++;
        if (check == 5) {
          e.preventDefault();
          postFetch(arrayProduct);
        }
      } else {
        e.preventDefault();
        check = 0;
      }
    }
  });
}

function createArrayProduct() {
  const cartItems = document.querySelector("#cart__items").children;
  var arrayProduct = [];
  for (i = 0; i < cartItems.length; i++) {
    arrayProduct.push(cartItems[i].dataset.id);
  }
  return arrayProduct;
}

function popUpSupprItem(obj) {
  const overlay = document.createElement("div");
  overlay.setAttribute('id', 'overlay')
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.6)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "2";
  document.body.appendChild(overlay);

  const popUp = document.createElement("p");
  popUp.setAttribute('id', 'popUp')
  popUp.style.fontSize = "25px";
  popUp.textContent = `L'article ${obj.children[0].textContent} de couleur ${obj.children[1].textContent} a été supprimé. `;
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