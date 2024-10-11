// Cart class to handle all cart-related operations
class ShoppingCart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.init();
  }

  init() {
    this.addEventListeners();
    this.updateCartCounter();

    // If we're on the cart page, display the cart items
    if (window.location.pathname.includes('cart.html')) {
      this.displayCartItems();
    }
  }

  addEventListeners() {
    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.action__btn.cart__btn').forEach(button => {
      button.addEventListener('click', (e) => this.addToCart(e));
    });
  }

  addToCart(event) {
    const productElement = event.target.closest('.product__item');
    const productData = this.extractProductData(productElement);
    
    const existingItemIndex = this.cart.findIndex(item => item.name === productData.name);
    
    if (existingItemIndex !== -1) {
      this.cart[existingItemIndex].quantity += 1;
    } else {
      this.cart.push({
        ...productData,
        quantity: 1
      });
    }
    
    this.saveCart();
    this.updateCartCounter();
    this.showAddedToCartMessage(productData.name);
  }

  extractProductData(productElement) {
    const name = productElement.querySelector('.product__title').textContent;
    const priceText = productElement.querySelector('.new__price').textContent;
    const price = parseFloat(priceText.replace('Ksh', '').trim());
    const category = productElement.querySelector('.product__category').textContent;
    const imgElement = productElement.querySelector('.product__img.default');
    const img = imgElement ? imgElement.src : '';

    return { name, price, category, img };
  }

  updateCartCounter() {
    const counter = document.querySelector('.cart__counter');
    if (counter) {
      const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      counter.textContent = totalItems;
    }
  }

  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  displayCartItems() {
    const cartContainer = document.querySelector('.cart__container');
    if (!cartContainer) return;

    cartContainer.innerHTML = '';

    if (this.cart.length === 0) {
      cartContainer.innerHTML = '<p class="cart__empty">Your cart is empty</p>';
      this.updateCartSummary(0);
      return;
    }

    let totalPrice = 0;

    this.cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      const cartItemElement = this.createCartItemElement(item, index);
      cartContainer.appendChild(cartItemElement);
    });

    this.updateCartSummary(totalPrice);
  }

  createCartItemElement(item, index) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart__item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}" class="cart__item-img">
      <div class="cart__item-details">
        <h4 class="cart__item-name">${item.name}</h4>
        <p class="cart__item-price">Ksh ${item.price}</p>
        <div class="cart__item-quantity">
          <button class="quantity-btn minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-btn plus" data-index="${index}">+</button>
        </div>
        <button class="remove-btn" data-index="${index}">Remove</button>
      </div>
      <div class="cart__item-subtotal">
        <p>Subtotal: Ksh ${item.price * item.quantity}</p>
      </div>
    `;

    // Add event listeners for quantity buttons and remove button
    cartItem.querySelector('.minus').addEventListener('click', () => this.updateQuantity(index, -1));
    cartItem.querySelector('.plus').addEventListener('click', () => this.updateQuantity(index, 1));
    cartItem.querySelector('.remove-btn').addEventListener('click', () => this.removeItem(index));

    return cartItem;
  }

  updateCartSummary(totalPrice) {
    const totalElement = document.querySelector('.cart__total');
    if (totalElement) {
      totalElement.textContent = `Total: Ksh ${totalPrice}`;
    }
  }

  updateQuantity(index, change) {
    const item = this.cart[index];
    const newQuantity = item.quantity + change;
    
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    } else {
      this.removeItem(index);
      return;
    }
    
    this.saveCart();
    this.displayCartItems();
  }

  removeItem(index) {
    this.cart.splice(index, 1);
    this.saveCart();
    this.updateCartCounter();
    this.displayCartItems();
  }

  showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.classList.add('added-to-cart-message');
    message.textContent = `${productName} added to cart`;
    document.body.appendChild(message);
    
    setTimeout(() => {
      message.remove();
    }, 2000);
  }
}

// Initialize the shopping cart
const cart = new ShoppingCart();