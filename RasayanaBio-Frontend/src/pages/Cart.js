// ============================================
// pages/Cart.js
// ============================================
import React, { useState, useEffect } from 'react';
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
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [showCouponList, setShowCouponList] = useState(false);

  // Fetch available coupons on component mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/coupons');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableCoupons(data.coupons);
        }
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

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

  const handleCouponSelect = (couponCode) => {
    setCouponCode(couponCode);
    setShowCouponList(false);
  };

  const getCouponStatus = (coupon) => {
    const subtotal = cartSummary.subtotal;
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (coupon.min_order_amount > 0 && subtotal < coupon.min_order_amount) {
      return { status: 'invalid', message: `Minimum order ₹${coupon.min_order_amount}` };
    }
    if (coupon.min_quantity > 0 && totalQuantity < coupon.min_quantity) {
      return { status: 'invalid', message: `Minimum ${coupon.min_quantity} items` };
    }
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return { status: 'invalid', message: 'Usage limit reached' };
    }
    if (coupon.valid_until && new Date(coupon.valid_until) < new Date()) {
      return { status: 'invalid', message: 'Expired' };
    }
    return { status: 'valid', message: 'Available' };
  };

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="empty-cart">
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started!</p>
            <Link to="/products" className="btn-continue-shopping">Continue Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>Review your items and proceed to checkout</p>
        </div>
        
        <div className="cart-content">
          <div className="cart-items-section">
            <div className="cart-items-title">Your Items</div>
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-image">
                  <ProductImage 
                    product={item.product} 
                    className="cart-item-image" 
                    size="card"
                  />
                </div>
                <div className="item-details">
                  <div className="item-name">{item.product.name}</div>
                  <div className="pack-info">
                    <span className="pack-size">{item.pack_size} Bottle{item.pack_size !== '1' ? 's' : ''} Pack</span>
                    <span className="unit-price">{formatPrice(item.unit_price)} per pack</span>
                  </div>
                  <div className="item-quantity">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateCartItem(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="quantity-display">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateCartItem(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="pack-selector">
                    <button 
                      className={`pack-btn ${item.pack_size === '1' ? 'active' : ''}`}
                      onClick={() => handlePackChange(item.id, '1')}
                    >
                      1 Bottle
                    </button>
                    <button 
                      className={`pack-btn ${item.pack_size === '2' ? 'active' : ''}`}
                      onClick={() => handlePackChange(item.id, '2')}
                    >
                      2 Bottles
                    </button>
                    <button 
                      className={`pack-btn ${item.pack_size === '3' ? 'active' : ''}`}
                      onClick={() => handlePackChange(item.id, '3')}
                    >
                      3 Bottles
                    </button>
                  </div>
                </div>
                <div className="item-price">
                  {formatPrice(item.subtotal)}
                </div>
                <button 
                  className="remove-btn" 
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary-title">Order Summary</div>
            
            {/* Coupon Section */}
            <div className="coupon-section">
              {appliedCoupon ? (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <span className="coupon-code">{appliedCoupon.code}</span>
                    <span className="coupon-description">{appliedCoupon.description}</span>
                    <span className="coupon-discount">-{formatPrice(appliedCoupon.discount_amount)}</span>
                  </div>
                  <button className="remove-coupon-btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <div className="coupon-input-group">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyPress={(e) => e.key === 'Enter' && handleApplyCoupon()}
                      className="coupon-input"
                    />
                    <button 
                      className="coupon-btn" 
                      onClick={handleApplyCoupon}
                      disabled={couponLoading}
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                  
                  {/* Available Coupons List */}
                  <div className="available-coupons">
                    <button 
                      className="available-coupons-title"
                      onClick={() => setShowCouponList(!showCouponList)}
                    >
                      {showCouponList ? 'Hide Available Coupons' : 'Show Available Coupons'}
                    </button>
                    
                    {showCouponList && (
                      <div className="available-coupons-list">
                        {availableCoupons.map(coupon => {
                          const status = getCouponStatus(coupon);
                          return (
                            <div 
                              key={coupon.id} 
                              className={`coupon-card ${status.status}`}
                              onClick={() => status.status === 'valid' && handleCouponSelect(coupon.code)}
                            >
                              <div className="coupon-code">{coupon.code}</div>
                              <div className="coupon-description">{coupon.description}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </>
              )}
              {couponMessage && (
                <div className={`coupon-message ${appliedCoupon ? 'success' : 'error'}`}>
                  {couponMessage}
                </div>
              )}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span className="total-label">Subtotal:</span>
                <span className="total-value">{formatPrice(cartSummary.subtotal)}</span>
              </div>
              {cartSummary.coupon_discount > 0 && (
                <div className="total-row">
                  <span className="total-label">Coupon Discount:</span>
                  <span className="total-value discount-value">-{formatPrice(cartSummary.coupon_discount)}</span>
                </div>
              )}
              <div className="total-row">
                <span className="total-label">9% CGST:</span>
                <span className="total-value tax-value">{formatPrice(cartSummary.cgst)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">9% SGST:</span>
                <span className="total-value tax-value">{formatPrice(cartSummary.sgst)}</span>
              </div>
              <div className="total-row">
                <span className="total-label">Shipping:</span>
                <span className="total-value">Calculated at checkout</span>
              </div>
              <div className="total-row">
                <span className="total-label">Total:</span>
                <span className="total-value">{formatPrice(cartSummary.total)}</span>
              </div>
            </div>
            
            <div className="cart-actions">
              <Link to="/products" className="btn-continue-shopping">
                Continue Shopping
              </Link>
              <button className="btn-checkout" onClick={handleCheckout}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
