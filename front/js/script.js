// recupère les données de l'api et les ajoutes au document html
  fetch("http://localhost:3000/api/products")
    .then(function (res) {
      if (res.ok) {
        return res.json();
      }
    })
    .then(function (data) {
      let content = "";
      for (let i in data) {
        content +=
          `<a href="./product.html?id=${data[i]._id}">
          <article>
            <img src="${data[i].imageUrl}" alt="${data[i].altTxt}">
            <h3 class="iName">${data[i].name}</h3>
            <p class="iDescription">${data[i].description}</p>
          </article>
        </a>`
      };

      document.querySelector(".items").innerHTML = content;
    }).catch((error) => {
      alert("une erreur est survenue ! Veuillez contacter l'administrateur.");
    });
