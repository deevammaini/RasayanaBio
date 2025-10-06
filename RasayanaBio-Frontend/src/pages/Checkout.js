import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import axios from 'axios';

import './Checkout.css';

const Checkout = () => {
  const { cart, cartSummary, clearCart, validateCoupon, removeCoupon, appliedCoupon } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    payment_method: 'card'
  });

  // Fetch available coupons on component mount
  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/coupons');
      if (response.data.success) {
        setAvailableCoupons(response.data.coupons);
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
        setCouponMessage(`Coupon applied! You saved ${formatPrice(result.coupon.discount_amount)}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        ...formData,
        applied_coupon_code: appliedCoupon?.code || null
      };
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      clearCart();
      navigate(`/orders/${response.data.order_id}`);
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Failed to create order. Please try again.');
    }

    setLoading(false);
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to checkout!</p>
            <button 
              className="btn-continue-shopping"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>
        
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2>Shipping Information</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  required
                  placeholder="Enter your phone number"
                />
              </div>
              <div className="form-group">
                <label>Shipping Address</label>
                <textarea
                  name="shipping_address"
                  value={formData.shipping_address}
                  onChange={handleChange}
                  required
                  rows="4"
                  placeholder="Enter your complete shipping address"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Billing Information</h2>
              <div className="form-group">
                <label>Billing Address</label>
                <textarea
                  name="billing_address"
                  value={formData.billing_address}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter your billing address (leave blank if same as shipping)"
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Payment Method</h2>
              <div className="form-group">
                <label>Payment Method</label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                  required
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-place-order"
              disabled={loading}
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </button>
          </form>

          <div className="order-summary">
            <h2>Order Summary</h2>
            
            {/* Available Coupons Section */}
            <div className="coupon-section">
              <h3>Available Coupons</h3>
              <div className="available-coupons">
                {availableCoupons.map(coupon => (
                  <div key={coupon.id} className="coupon-item">
                    <div className="coupon-code">{coupon.code}</div>
                    <div className="coupon-description">{coupon.description}</div>
                    <div className="coupon-discount">
                      {coupon.discount_type === 'percentage' 
                        ? `${coupon.discount_value}% off` 
                        : `${formatPrice(coupon.discount_value)} off`
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon Application Section */}
            <div className="coupon-section">
              <h3>Apply Coupon</h3>
              <div className="coupon-input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="coupon-input"
                  disabled={appliedCoupon}
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  disabled={couponLoading || !couponCode.trim() || appliedCoupon}
                  className="btn-apply-coupon"
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              
              {appliedCoupon && (
                <div className="applied-coupon">
                  <div className="coupon-info">
                    <span className="coupon-code">{appliedCoupon.code}</span>
                    <span className="coupon-description">{appliedCoupon.description}</span>
                    <span className="coupon-discount">
                      -{formatPrice(appliedCoupon.discount_amount)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="btn-remove-coupon"
                  >
                    Remove
                  </button>
                </div>
              )}
              
              {couponMessage && (
                <div className={`coupon-message ${couponMessage.includes('applied') ? 'success' : 'error'}`}>
                  {couponMessage}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="order-items">
              <h3>Items</h3>
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Pack: {item.pack_size} bottle{item.pack_size > 1 ? 's' : ''}</p>
                    <p>Unit Price: {formatPrice(item.unit_price)}</p>
                  </div>
                  <div className="item-total">
                    {formatPrice(item.unit_price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Total */}
            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>{formatPrice(cartSummary.subtotal)}</span>
              </div>
              
              {cartSummary.coupon_discount > 0 && (
                <div className="total-row discount">
                  <span>Coupon Discount:</span>
                  <span>-{formatPrice(cartSummary.coupon_discount)}</span>
                </div>
              )}
              
              <div className="total-row">
                <span>9% CGST:</span>
                <span>{formatPrice(cartSummary.cgst)}</span>
              </div>
              <div className="total-row">
                <span>9% SGST:</span>
                <span>{formatPrice(cartSummary.sgst)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <strong>Total:</strong>
                <strong>{formatPrice(cartSummary.total)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;