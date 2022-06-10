const url = (new URL(document.location)).searchParams;;
const id = url.get('id');
console.log(id);
const itemImg = document.querySelector(".item__img");
const title = document.querySelector("#title");
const price = document.querySelector("#price");
const description = document.querySelector("#description");
const colors = document.querySelector("#colors");
const quantity = document.querySelector("#quantity");

var myCart = getStorage();
getFetch(id, itemImg, title, price, description, colors);

document
    .getElementById("addToCart")
    .addEventListener("click", function (event) {
        addToCart(myCart, id, colors, quantity);
    })

//  Récupère le local storage 
function getStorage() {
    var myCart = [];
    if (JSON.parse(localStorage.getItem("myCart")) !== null) {
        myCart = JSON.parse(localStorage.getItem("myCart"));
        return myCart;
    } else {
        return myCart;
    }
}

// Met à jours la page avec le produit correspondant
function getFetch(id, itemImg, title, price, description, colors) {
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((res) => {
            if (res.ok) {
                return res.json();
            }
        })
        .then((data) => {
            itemImg.innerHTML = `<img src="${data.imageUrl}" alt="${data.altTxt}">`;
            title.textContent = data.name;
            price.textContent = data.price;
            description.innerText = data.description;

            for (i of data.colors) {
                var option = document.createElement("option");
                option.value = i;
                option.text = i;
                colors.add(option);
            }
        })
        .catch((err) => {
            console.log("erreur :" + err);
        })
}
// ajoute l'article au panier
function addToCart(myCart, id, colors, quantity) {
    var text = "";
    if (colors.value == "") {
        text = "Veuillez choisir une couleur.";
        msgAddToCart(text);
    } else if (quantity.value == 0 || quantity.value > 100 || quantity.value < 0) {
        text = "Veuillez saisir une valleur comprise entre 1 et 100.";
        quantity.value = 0;
        msgAddToCart(text);
    } else {

        let objet = {}
        if (myCart.length == 0) {
            objet = {
                colors: colors.value,
                id: id,
                quantity: quantity.valueAsNumber
            }
            myCart.push(objet)
            localStorage.setItem("myCart", JSON.stringify(myCart))
            console.log("0");
        } else {
            myCart.find(object => {
                if (object.colors === colors.value && object.id === id) {
                    object.quantity += quantity.valueAsNumber;
                    localStorage.setItem("myCart", JSON.stringify(myCart))
                }
            });
            let color = myCart.some(el => el.colors === colors.value);
            let objectId = myCart.some(el => el.id === id)
            if ((color == false && objectId == true) || (color == true && objectId == false)|| (color == false && objectId == false)) {
                
                objet = {
                    colors: colors.value,
                    id: id,
                    quantity: quantity.valueAsNumber
                }
                myCart.push(objet);
                localStorage.setItem("myCart", JSON.stringify(myCart));
                console.log("2");
            }
        }
        text = "Votre article à bien été ajouté au panier";
        msgAddToCart(text);
        return myCart;
    }
}





// informe l'utilisateur que son produit aété ajouté au panier
function msgAddToCart(text) {
    const button = document.querySelector(".item__content__addButton");
    let msg = document.createElement("div");
    msg.style.minWidth = "200px";
    msg.style.backgroundColor = "#2c3e50";
    msg.style.position = "absolute";
    msg.style.top = "100px";
    msg.style.padding = "30px";
    msg.style.borderRadius = "40px";
    msg.textContent = text;
    button.style.position = "relative";
    button.appendChild(msg);

    setTimeout(() => {
        msg.style.display = "none";
    }, 2000)
}




