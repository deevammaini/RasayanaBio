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
      const response = await fetch('http://localhost:5000/api/coupons');
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
                <>
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
                  
                  {/* Available Coupons List */}
                  <div className="available-coupons-section">
                    <button 
                      className="btn-show-coupons"
                      onClick={() => setShowCouponList(!showCouponList)}
                    >
                      {showCouponList ? 'Hide Available Coupons' : 'Show Available Coupons'}
                    </button>
                    
                    {showCouponList && (
                      <div className="available-coupons-list">
                        <h4>Available Coupons:</h4>
                        {availableCoupons.map(coupon => {
                          const status = getCouponStatus(coupon);
                          return (
                            <div 
                              key={coupon.id} 
                              className={`coupon-item ${status.status}`}
                              onClick={() => status.status === 'valid' && handleCouponSelect(coupon.code)}
                            >
                              <div className="coupon-item-header">
                                <span className="coupon-code">{coupon.code}</span>
                                <span className={`coupon-status ${status.status}`}>
                                  {status.message}
                                </span>
                              </div>
                              <div className="coupon-description">{coupon.description}</div>
                              <div className="coupon-discount">
                                {coupon.discount_type === 'percentage' 
                                  ? `${coupon.discount_value}% off` 
                                  : `₹${coupon.discount_value} off`
                                }
                                {coupon.min_order_amount > 0 && (
                                  <span className="coupon-condition">
                                    (Min order: ₹{coupon.min_order_amount})
                                  </span>
                                )}
                                {coupon.min_quantity > 0 && (
                                  <span className="coupon-condition">
                                    (Min {coupon.min_quantity} items)
                                  </span>
                                )}
                              </div>
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
