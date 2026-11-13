const products = [
{
id: 1,
title: "Геометрическая панель",
price: 4900,
desc: "Абстрактная композиция из массива дуба, ручная глубокая резьба, обработка экологичным маслом.",
image: "https://images.unsplash.com/photo-1618345674843-d498c1ad6f82?w=1200&q=80",
thumb: "https://images.unsplash.com/photo-1618345674843-d498c1ad6f82?w=400&q=80",
},
{
id: 2,
title: "Резная карта мира",
price: 12500,
desc: "Деревянная карта мира в стиле лофт с глубокорельефной резьбой для гостиной.",
image: "https://images.unsplash.com/photo-1544966580-5221f0e4d8e5?w=1200&q=80",
thumb: "https://images.unsplash.com/photo-1544966580-5221f0e4d8e5?w=400&q=80",
},
{
id: 3,
title: "Панно из ореха",
price: 8300,
desc: "Настенное панно с рельефным узором из массива ореха, ручная шлифовка.",
image: "https://images.unsplash.com/photo-1626566369019-cfda01da1e27?w=1200&q=80",
thumb: "https://images.unsplash.com/photo-1626566369019-cfda01da1e27?w=400&q=80",
},
{
id: 4,
title: "Полка с резьбой",
price: 5700,
desc: "Минималистичная полка для книг и сувениров из массива ясеня с узорной резьбой.",
image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80",
thumb: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80",
}
];

let cart = [];
const grid = document.getElementById("products-grid");
const cartCount = document.querySelector(".cart-count");

function renderProducts(filter = null) {
const items = filter ? products.filter(p => p.title.toLowerCase().includes(filter)) : products;
grid.innerHTML = items.map(p => `
<div class="product-card">
<img src="${p.thumb}" data-full="${p.image}" alt="${p.title}" loading="lazy">
<div class="info">
<h3>${p.title}</h3>
<p>${p.desc}</p>
<div class="price">${p.price.toLocaleString("ru-RU")} ₽</div>
<button class="add-to-cart" data-id="${p.id}">В корзину</button>
</div>
</div>
`).join("");

grid.querySelectorAll(".add-to-cart").forEach(btn => {
btn.addEventListener("click", e => addToCart(Number(btn.dataset.id), e));
});

grid.querySelectorAll(".product-card img[data-full]").forEach(img => {
img.addEventListener("click", () => open3DViewer(img.dataset.full, img.alt));
});
}

function addToCart(id, e) {
const product = products.find(p => p.id === id);
cart.push(product);
cartCount.textContent = cart.length;
cartCount.classList.remove("cartPulse");
void cartCount.offsetWidth;
cartCount.classList.add("cartPulse");

const btn = e.currentTarget;
const card = btn.closest(".product-card");
const originalImg = card.querySelector("img");
const rect = originalImg.getBoundingClientRect();
const cartRect = btn.getBoundingClientRect();

const flyingImg = originalImg.cloneNode(true);
flyingImg.className = "flying-img";
flyingImg.style.left = rect.left + "px";
flyingImg.style.top = rect.top + "px";
flyingImg.style.width = rect.width + "px";
flyingImg.style.height = rect.height + "px";
flyingImg.style.transition = "none";
document.body.appendChild(flyingImg);

requestAnimationFrame(() => {
const targetX = cartRect.left + cartRect.width / 2 - rect.left - rect.width / 2;
const targetY = cartRect.top + cartRect.height / 2 - rect.top - rect.height / 2;
flyingImg.style.transition = "all 0.7s cubic-bezier(0.23, 1, 0.32, 1)";
flyingImg.style.transform = `translate(${targetX}px, ${targetY}px) scale(0.25)`;
flyingImg.style.opacity = "0";
});

setTimeout(() => flyingImg.remove(), 700);
}

function open3DViewer(fullImageUrl, title) {
const existing = document.querySelector(".modal");
if (existing) existing.remove();

const modal = document.createElement("div");
modal.className = "modal";
modal.innerHTML = `
<button class="close">&times;</button>
<h2>${title}</h2>
<div class="viewport3d">
<div class="stage3d" id="stage3d">
<img src="${fullImageUrl}" alt="${title}" loading="lazy">
</div>
</div>
<button id="close-3d-alt">Закрыть</button>
`;
document.body.appendChild(modal);

const stage = document.getElementById("stage3d");
let rotX = -15;
let rotY = 25;
let isDragging = false;
let startX, startY;

function apply() {
stage.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

apply();

stage.addEventListener("mousedown", e => {
isDragging = true;
startX = e.clientX;
startY = e.clientY;
stage.style.cursor = "grabbing";
});

window.addEventListener("mousemove", e => {
if (!isDragging) return;
const dx = e.clientX - startX;
const dy = e.clientY - startY;
rotY += dx * 0.5;
rotX -= dy * 0.5;
startX = e.clientX;
startY = e.clientY;
apply();
});

window.addEventListener("mouseup", () => {
isDragging = false;
stage.style.cursor = "grab";
});

document.querySelector(".close").addEventListener("click", () => {
window.removeEventListener("mousemove", null);
window.removeEventListener("mouseup", null);
modal.remove();
});

document.getElementById("close-3d-alt").addEventListener("click", () => {
modal.remove();
});
}

renderProducts();

const filterInput = document.getElementById("filter-search");
if (filterInput) {
filterInput.addEventListener("input", e => renderProducts(e.target.value));
}

const checkoutForm = document.getElementById("checkout-form");
if (checkoutForm) {
checkoutForm.addEventListener("submit", async e => {
e.preventDefault();
const btn = checkoutForm.querySelector("button");
btn.disabled = true;
btn.textContent = "Оформляем заказ...";
try {
const total = cart.reduce((s, p) => s + p.price, 0);
const response = await fetch("https://api.rollypay.example/v1/checkout", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
amount: total,
currency: "RUB",
description: "WoodyArt заказ",
customer: {
name: checkoutForm.name.value,
email: checkoutForm.email.value,
phone: checkoutForm.phone.value
},
items: cart.map(p => ({ name: p.title, price: p.price, quantity: 1 })),
return_url: window.location.origin + "/success.html",
cancel_url: window.location.origin
})
});
const data = await response.json();
if (data.payment_url) {
window.location.href = data.payment_url;
} else {
alert(data.error || "Ошибка платёжа");
}
} catch (err) {
alert("Ошибка сети");
} finally {
btn.disabled = false;
btn.textContent = "Оплатить через RollyPay";
}
});
}

function openCheckout() {
document.getElementById("checkout").classList.add("open");
}

function closeCheckout() {
document.getElementById("checkout").classList.remove("open");
}

const closeBtn = document.getElementById("checkout-close");
if (closeBtn) closeBtn.addEventListener("click", closeCheckout);