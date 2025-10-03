import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shipping_address: '',
    billing_address: '',
    payment_method: 'card'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/orders', formData);
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
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.product.image_url || '/placeholder.jpg'} alt={item.product.name} />
                  <div className="item-details">
                    <h4>{item.product.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.product.price}</p>
                  </div>
                  <div className="item-total">
                    ${item.subtotal.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final">
                <strong>Total:</strong>
                <strong>${cartTotal.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
