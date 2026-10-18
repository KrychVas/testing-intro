let cart = [];

function getCart() {
  return cart;
}

function clearCart() {
  cart = [];
}

function addToCart(cartArg, product, quantity = 1) {
  const targetCart = Array.isArray(cartArg) ? cartArg : cart;
  
  if (quantity <= 0) {
    throw new RangeError('Quantity must be positive');
  }

  const maxStock = product.stock ?? Infinity;
  if (quantity > maxStock) {
    throw new RangeError('Quantity exceeds stock');
  }

  const existingItem = targetCart.find(item => item.id === product.id);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (newQuantity > maxStock) {
      throw new RangeError('Total quantity exceeds stock');
    }
    existingItem.quantity = newQuantity;
  } else {
    targetCart.push({
      ...product,
      quantity
    });
  }

  return targetCart;
}

function changeQuantity(cartArg, productId, quantity) {
  const targetCart = Array.isArray(cartArg) ? cartArg : cart;
  const item = targetCart.find(i => i.id === productId);
  if (!item) return targetCart;

  if (quantity <= 0) {
    throw new RangeError('Quantity must be positive');
  }

  const maxStock = item.stock ?? Infinity;
  if (quantity > maxStock) {
    throw new RangeError('Quantity exceeds stock');
  }

  item.quantity = quantity;
  return targetCart;
}

function removeFromCart(cartArg, productId) {
  const targetCart = Array.isArray(cartArg) ? cartArg : cart;
  const index = targetCart.findIndex(item => item.id === productId);
  if (index !== -1) {
    targetCart.splice(index, 1);
  }
  return targetCart;
}

function calculateCartSubtotal(cartArg) {
  const targetCart = Array.isArray(cartArg) ? cartArg : cart;
  return targetCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateOrderTotal(cartArg, promoCode) {
  const targetCart = Array.isArray(cartArg) ? cartArg : cart;
  const subtotal = calculateCartSubtotal(targetCart);
  let discount = 0;

  if (promoCode === 'SAVE10' && subtotal >= 20000) {
    discount = Math.round(subtotal * 0.1);
  }

  const discountedSubtotal = subtotal - discount;
  const delivery = subtotal > 0 && subtotal < 50000 ? 30000 : 0;
  const total = discountedSubtotal + delivery;

  return {
    subtotal,
    discount,
    delivery,
    total
  };
}

const cartApi = { 
  getCart,
  clearCart,
  addToCart, 
  changeQuantity, 
  removeFromCart, 
  calculateCartSubtotal, 
  calculateOrderTotal 
};

if (typeof module !== 'undefined') module.exports = cartApi;
if (typeof window !== 'undefined') window.cartApi = cartApi;