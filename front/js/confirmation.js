const orderId = document.getElementById("orderId");
const url = (new URL(document.location)).searchParams;;
const id = url.get('id');
// utiliser search param

orderId.textContent = id;

localStorage.clear()
