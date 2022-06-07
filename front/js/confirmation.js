    const orderId = document.getElementById("orderId");
    const localisation = window.location.search;
    const id = localisation.substring(4);

    orderId.textContent = id;

    localStorage.clear()
