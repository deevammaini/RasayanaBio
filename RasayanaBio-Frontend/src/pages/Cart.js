// ============================================
// pages/Cart.js
// ============================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import ProductImage from '../components/ProductImage';
import './Cart.css';

const Cart = () => {
  const { cart, cartSummary, updateCartItem, removeFromCart, validateCoupon, removeCoupon, appliedCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handlePackChange = (itemId, newPackSize) => {
    updateCartItem(itemId, null, newPackSize);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponMessage('Please enter a coupon code');
      return;
    }

    setCouponLoading(true);
    setCouponMessage('');

    try {
      const result = await validateCoupon(couponCode.trim());
      if (result.success) {
        setCouponMessage(`Coupon applied! You saved ₹${result.coupon.discount_amount}`);
        setCouponCode('');
      } else {
        setCouponMessage(result.message);
      }
    } catch (error) {
      setCouponMessage('Error applying coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponMessage('');
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
                <ProductImage 
                  product={item.product} 
                  className="cart-item-image" 
                  size="card"
                />
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <div className="pack-info">
                    <span className="pack-size">{item.pack_size} Bottle{item.pack_size !== '1' ? 's' : ''} Pack</span>
                    <span className="unit-price">{formatPrice(item.unit_price)} per pack</span>
                  </div>
                </div>
                <div className="item-quantity">
                  <button onClick={() => updateCartItem(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateCartItem(item.id, item.quantity + 1)}>+</button>
                </div>
                <div className="pack-selector">
                  <select 
                    value={item.pack_size} 
                    onChange={(e) => handlePackChange(item.id, e.target.value)}
                    className="pack-dropdown"
                  >
                    <option value="1">1 Bottle</option>
                    <option value="2">2 Bottles</option>
                    <option value="3">3 Bottles</option>
                  </select>
                </div>
                <div className="item-subtotal">
                  {formatPrice(item.subtotal)}
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
            
            {/* Coupon Section */}
            <div className="coupon-section">
              <h3>Coupon Code</h3>
              {appliedCoupon ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <span className="coupon-code">{appliedCoupon.code}</span>
                    <span className="coupon-description">{appliedCoupon.description}</span>
                    <span className="coupon-discount">-{formatPrice(appliedCoupon.discount_amount)}</span>
                  </div>
                  <button className="btn-remove-coupon" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                  />
                  <button 
                    className="btn-apply-coupon" 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
              )}
              {couponMessage && (
                <div className={`coupon-message ${appliedCoupon ? 'success' : 'error'}`}>
                  {couponMessage}
                </div>
              )}
            </div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{formatPrice(cartSummary.subtotal)}</span>
            </div>
            {cartSummary.coupon_discount > 0 && (
              <div className="summary-row discount">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(cartSummary.coupon_discount)}</span>
              </div>
            )}
            <div className="summary-row">
              <span>9% CGST:</span>
              <span>{formatPrice(cartSummary.cgst)}</span>
            </div>
            <div className="summary-row">
              <span>9% SGST:</span>
              <span>{formatPrice(cartSummary.sgst)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="summary-row total">
              <strong>Total:</strong>
              <strong>{formatPrice(cartSummary.total)}</strong>
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
