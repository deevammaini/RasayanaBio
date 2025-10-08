import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RazorpayPayment.css';

const RazorpayPayment = ({ amount, onSuccess, onError, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState({});
  const [banks, setBanks] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    loadPaymentMethods();
    loadBanks();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/razorpay/payment-methods');
      if (response.data.success) {
        setPaymentMethods(response.data.payment_methods);
      }
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const loadBanks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/razorpay/banks');
      if (response.data.success) {
        setBanks(response.data.banks);
      }
    } catch (error) {
      console.error('Error loading banks:', error);
    }
  };

  const createOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/razorpay/create-order',
        { amount: amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setOrderId(response.data.order.id);
        return response.data.order;
      }
    } catch (error) {
      console.error('Error creating order:', error);
      onError('Failed to create payment order');
    }
  };

  const verifyPayment = async (paymentData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:4000/api/razorpay/verify-payment',
        paymentData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        onSuccess(response.data.payment);
      } else {
        onError('Payment verification failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      onError('Payment verification failed');
    }
  };

  const openRazorpay = async () => {
    setLoading(true);
    
    try {
      const order = await createOrder();
      if (!order) return;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_your_key_id',
        amount: order.amount,
        currency: order.currency,
        name: 'RasayanaBio',
        description: 'Premium Herbal Supplements',
        order_id: order.id,
        handler: function (response) {
          verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        notes: {
          address: 'RasayanaBio Office'
        },
        theme: {
          color: '#2c5530'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            onClose();
          }
        },
        // Payment method specific options
        method: selectedMethod,
        bank: selectedBank
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Error opening Razorpay:', error);
      onError('Failed to open payment gateway');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setSelectedMethod(method);
    if (method !== 'netbanking') {
      setSelectedBank('');
    }
  };

  const handleBankSelect = (bankCode) => {
    setSelectedBank(bankCode);
  };

  return (
    <div className="razorpay-payment-modal">
      <div className="razorpay-payment-content">
        <div className="payment-header">
          <h3>Complete Your Payment</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="payment-amount">
          <span className="amount-label">Amount to Pay:</span>
          <span className="amount-value">₹{amount}</span>
        </div>

        <div className="payment-methods-section">
          <h4>Choose Payment Method</h4>
          <div className="payment-methods-grid">
            {Object.entries(paymentMethods).map(([key, method]) => (
              <div
                key={key}
                className={`payment-method-card ${selectedMethod === key ? 'selected' : ''}`}
                onClick={() => handlePaymentMethodSelect(key)}
              >
                <div className="method-icon">{method.icon}</div>
                <div className="method-info">
                  <h5>{method.name}</h5>
                  <p>{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedMethod === 'netbanking' && (
          <div className="bank-selection">
            <h4>Select Your Bank</h4>
            <div className="banks-grid">
              {banks.map((bank) => (
                <div
                  key={bank.code}
                  className={`bank-card ${selectedBank === bank.code ? 'selected' : ''}`}
                  onClick={() => handleBankSelect(bank.code)}
                >
                  <span className="bank-icon">{bank.icon}</span>
                  <span className="bank-name">{bank.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="payment-actions">
          <button
            className="pay-now-btn"
            onClick={openRazorpay}
            disabled={loading || !selectedMethod || (selectedMethod === 'netbanking' && !selectedBank)}
          >
            {loading ? 'Processing...' : `Pay ₹${amount}`}
          </button>
        </div>

        <div className="payment-security">
          <div className="security-badges">
            <span className="security-badge">🔒 Secure</span>
            <span className="security-badge">🛡️ Protected</span>
            <span className="security-badge">✅ Verified</span>
          </div>
          <p className="security-text">
            Your payment information is encrypted and secure. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
