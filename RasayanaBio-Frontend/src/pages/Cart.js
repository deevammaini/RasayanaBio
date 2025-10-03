// ============================================
// pages/Cart.js
// ============================================
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, cartTotal, updateCartItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1>Shopping Cart</h1>
        
        <div className="cart-content">
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-price">${item.product.price}</p>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="item-subtotal">
                  ${item.subtotal.toFixed(2)}
                </div>
                <button 
                  className="btn-remove" 
                  onClick={() => removeFromCart(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <strong>Total:</strong>
              <strong>${cartTotal.toFixed(2)}</strong>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn-continue">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
