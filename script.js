// массив товаров
const products = [
    { id: 1, name: "Моти", price: 1500, image: "images/moti.png" },
    { id: 2, name: "Кукисы", price: 1200, image: "images/cookie.png" },
    { id: 3, name: "Муссовый торт", price: 4000, image: "images/moose.png" },
    { id: 4, name: "Бисквитный торт", price: 2500, image: "images/cake.png" },
    { id: 5, name: "Синнабон", price: 400, image: "images/buns.png" },
    { id: 6, name: "Капкейк", price: 180, image: "images/cupcake.png" },
    { id: 7, name: "Шоколад", price: 600, image: "images/choco.png" },
];

// хранение данных корзины
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function renderCatalog() {
    const container = document.getElementById('products-list');
    container.innerHTML = '';

    products.forEach(product => {
        const itemInCart = cart.find(item => item.id === product.id);
        const quantity = itemInCart ? itemInCart.quantity : 0;

        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;

        const buttonHTML = quantity === 0 
            ? `<button class="btn-add">Добавить в корзину</button>`
            : `<div class="quantity-control">
                   <button class="btn-minus">−</button>
                   <span class="quantity-value">${quantity}</span>
                   <button class="btn-plus">+</button>
               </div>`;

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">${product.price} ₽</p>
            ${buttonHTML}
        `;
        
        container.appendChild(card);
    });
}

// взаимодействие с кнопками
document.getElementById('products-list').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return; 
    const id = Number(card.dataset.id);

    if (e.target.classList.contains('btn-add')) {
        addToCart(id);
    } else if (e.target.classList.contains('btn-minus')) {
        changeQuantity(id, -1);
    } else if (e.target.classList.contains('btn-plus')) {
        changeQuantity(id, 1);
    }
});

function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    saveAndRender();
}

// +- товара
function changeQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;

    item.quantity += delta;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
    }
    saveAndRender();
}

// рендеринг корзины
function saveAndRender() {
    localStorage.setItem('cart', JSON.stringify(cart));
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalCount;
    renderCatalog();
    renderCartPanel();
}

function renderCartPanel() {
    const container = document.getElementById('cart-items');
    const totalElement = document.getElementById('cart-total');
    
    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Корзина пуста 🍰</p>';
        totalElement.textContent = '0';
        return;
    }

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <strong>${item.name}</strong><br>
                <small>${item.price} ₽ x ${item.quantity} = ${itemTotal} ₽</small>
            </div>
            <button class="btn-delete" data-id="${item.id}">✕</button>
        `;
        container.appendChild(div);
    });

    totalElement.textContent = totalPrice;
}

document.getElementById('cart-items').addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-delete')) {
        const id = Number(e.target.dataset.id);
        cart = cart.filter(item => item.id !== id);
        saveAndRender();
    }
});

const cartPanel = document.getElementById('cart-panel');
const orderForm = document.getElementById('order-form');

document.getElementById('cart-btn').addEventListener('click', () => {
    cartPanel.classList.remove('hidden');
});

document.getElementById('close-cart-btn').addEventListener('click', () => {
    cartPanel.classList.add('hidden');
});

document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Ваша корзина пуста!');
        return;
    }
    cartPanel.classList.add('hidden');
    orderForm.classList.remove('hidden');
});

document.getElementById('close-form-btn').addEventListener('click', () => {
    orderForm.classList.add('hidden');
});

// заказ
document.getElementById('order-form-element').addEventListener('submit', (e) => {
    e.preventDefault();

    alert('Заказ создан!');

    cart = [];
    saveAndRender(); 
    e.target.reset();
    orderForm.classList.add('hidden'); 
});

renderCatalog();
saveAndRender();