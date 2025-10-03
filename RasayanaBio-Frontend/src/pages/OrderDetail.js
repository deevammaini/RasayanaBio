import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrder();
    }
  }, [id, isAuthenticated]);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
      setOrder(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching order:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'shipped': return '#007bff';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="not-authenticated">
            <h2>Please log in to view order details</h2>
            <Link to="/login" className="btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="error">
            <h2>Order not found</h2>
            <Link to="/orders" className="btn-primary">Back to Orders</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <div className="container">
        <div className="order-header">
          <h1>Order Details</h1>
          <Link to="/orders" className="btn-back">← Back to Orders</Link>
        </div>

        <div className="order-detail-content">
          <div className="order-info">
            <div className="info-card">
              <h2>Order Information</h2>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Order Number:</span>
                  <span className="value">#{order.order_number}</span>
                </div>
                <div className="info-item">
                  <span className="label">Order Date:</span>
                  <span className="value">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Status:</span>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Status:</span>
                  <span className={`payment-status ${order.payment_status}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Method:</span>
                  <span className="value">{order.payment_method}</span>
                </div>
                <div className="info-item">
                  <span className="label">Total Amount:</span>
                  <span className="value total">${order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Shipping Address</h2>
              <p className="address">{order.shipping_address}</p>
            </div>

            {order.billing_address && order.billing_address !== order.shipping_address && (
              <div className="info-card">
                <h2>Billing Address</h2>
                <p className="address">{order.billing_address}</p>
              </div>
            )}
          </div>

          <div className="order-items">
            <h2>Order Items</h2>
            <div className="items-list">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <img 
                    src={item.product.image_url || '/placeholder.jpg'} 
                    alt={item.product.name}
                  />
                  <div className="item-details">
                    <h3>{item.product.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ${item.price}</p>
                  </div>
                  <div className="item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
