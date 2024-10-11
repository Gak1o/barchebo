// Initialize the cart
let cart = [];

// Function to add product to cart
function addToCart(product) {
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
}

// Function to update the cart display
function updateCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let subtotal = 0;
  let tax = 0;
  let total = 0;

  cart.forEach((product) => {
    const productHTML = `
      <div class="cart__item">
        <img src="${product.image}" alt="${product.name}" />
        <div class="cart__item-info">
          <h3 class="cart__item-title">${product.name}</h3>
          <p class="cart__item-price">Ksh ${product.price}</p>
          <p class="cart__item-quantity">Quantity: ${product.quantity}</p>
          <button class="cart__item-remove" data-id="${product.id}">Remove</button>
        </div>
      </div>
    `;
    cartItems.insertAdjacentHTML('beforeend', productHTML);
    subtotal += product.price * product.quantity;
  });

  tax = subtotal * 0.16; // 16% tax
  total = subtotal + tax;

  document.getElementById('subtotal').textContent = `Ksh ${subtotal.toFixed(2)}`;
  document.getElementById('tax').textContent = `Ksh ${tax.toFixed(2)}`;
  document.getElementById('total').textContent = `Ksh ${total.toFixed(2)}`;

  // Add event listeners to remove products from cart
  const removeButtons = document.querySelectorAll('.cart__item-remove');
  removeButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
      const productId = e.target.dataset.id;
      const productIndex = cart.findIndex((item) => item.id === productId);
      if (productIndex !== -1) {
        cart.splice(productIndex, 1);
        updateCart();
      }
    });
  });

  // Add event listener to checkout button
  document.getElementById('checkout-btn').addEventListener('click', () => {
    checkout();
  });
}

// Function to checkout
function checkout() {
  // Send cart data to server for processing
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/checkout', true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(cart));

  // Clear cart
  cart = [];

  // Update cart display
  updateCart();

  // Show success message
  alert('Checkout successful!');
}

// Example product data
const products = [
    { id: 1, name: 'Product 1', price: 1000, image: 'assets/img/p1.jpg' },
    { id: 2, name: 'Product 2', price: 2000, image: 'assets/img/p2.jpg' },
    { id: 3, name: 'Product 3', price: 1500, image: 'assets/img/p3.jpg' }
  ];
  