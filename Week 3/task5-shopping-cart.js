// Task 5: Shopping Cart Calculation
class ShoppingCart {
  calculateTotal(products) {
    // Calculate subtotal
    const subtotal = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Apply 10% discount if over $100
    const discountedTotal = subtotal > 100 ? subtotal * 0.9 : subtotal;

    // Apply 8% sales tax
    const finalTotal = discountedTotal * 1.08;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discountApplied: subtotal > 100,
      discountAmount:
        subtotal > 100 ? Math.round(subtotal * 0.1 * 100) / 100 : 0,
      afterDiscount: Math.round(discountedTotal * 100) / 100,
      tax: Math.round(discountedTotal * 0.08 * 100) / 100,
      total: Math.round(finalTotal * 100) / 100,
    };
  }
}

// Test the shopping cart
console.log("5. Shopping Cart:");
const cart = new ShoppingCart();
const products = [
  { price: 25.99, quantity: 2 },
  { price: 15.5, quantity: 3 },
  { price: 8.75, quantity: 1 },
];
console.log(cart.calculateTotal(products));
