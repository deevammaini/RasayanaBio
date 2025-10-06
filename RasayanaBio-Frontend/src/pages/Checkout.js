import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { usePopup } from '../context/PopupContext';
import { formatPrice } from '../utils/currency';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const { cart, cartSummary, clearCart, validateCoupon, removeCoupon, appliedCoupon } = useCart();
  const { user } = useAuth();
  const { showError, showSuccess } = usePopup();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  
  // Form data
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: '', // No default selection
    paymentDetails: {}
  });

  // Payment method specific data
  const [paymentDetails, setPaymentDetails] = useState({
    upi: {
      method: '', // No default selection
      upiId: '',
      qrCode: null,
      qrGenerated: false
    },
    card: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    },
    wallet: {
      walletType: 'phonepe', // 'phonepe', 'paytm', 'gpay'
      walletId: ''
    }
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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Generate QR code when phone number is entered and UPI is selected
    if (name === 'phoneNumber' && value.trim() && formData.paymentMethod === 'upi') {
      generateQRCode(value.trim());
    }
  };

  // Generate unique QR code for payment
  const generateQRCode = (phoneNumber) => {
    if (!phoneNumber || !formData.paymentMethod) return;
    
    // Create unique payment data
    const paymentData = {
      merchantId: 'RASANAYABIO001',
      merchantName: 'RasayanaBio',
      amount: cartSummary.total,
      currency: 'INR',
      phoneNumber: phoneNumber,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      upiId: `upi://pay?pa=${phoneNumber}@paytm&pn=RasayanaBio&am=${cartSummary.total}&cu=INR&tn=Order Payment`
    };
    
    // Generate QR code data
    const qrData = JSON.stringify(paymentData);
    
    setPaymentDetails(prev => ({
      ...prev,
      upi: {
        ...prev.upi,
        qrCode: qrData,
        qrGenerated: true
      }
    }));
  };

  const handlePaymentMethodChange = (method) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: method
    }));
    
    // Generate QR code if UPI is selected and phone number exists
    if (method === 'upi' && formData.phoneNumber.trim()) {
      generateQRCode(formData.phoneNumber.trim());
    }
  };

  const handlePaymentDetailsChange = (method, field, value) => {
    setPaymentDetails(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }));
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

  const validateForm = () => {
    const errors = [];
    
    if (!formData.fullName.trim()) errors.push('Full name is required');
    if (!formData.phoneNumber.trim()) errors.push('Phone number is required');
    if (!formData.shippingAddress.trim()) errors.push('Shipping address is required');
    if (!formData.paymentMethod) errors.push('Please select a payment method');
    
    // Validate payment details based on method
    switch (formData.paymentMethod) {
      case 'upi':
        if (!paymentDetails.upi.method) {
          errors.push('Please select UPI payment method (QR or ID)');
        } else if (paymentDetails.upi.method === 'id' && !paymentDetails.upi.upiId.trim()) {
          errors.push('UPI ID is required');
        } else if (paymentDetails.upi.method === 'qr' && !paymentDetails.upi.qrGenerated) {
          errors.push('Please enter your phone number to generate QR code');
        }
        break;
      case 'card':
        if (!paymentDetails.card.cardNumber.trim()) errors.push('Card number is required');
        if (!paymentDetails.card.expiryDate.trim()) errors.push('Expiry date is required');
        if (!paymentDetails.card.cvv.trim()) errors.push('CVV is required');
        if (!paymentDetails.card.cardholderName.trim()) errors.push('Cardholder name is required');
        break;
      case 'wallet':
        if (!paymentDetails.wallet.walletId.trim()) errors.push('Wallet ID is required');
        break;
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      showError(errors.join(', '), 'Validation Error');
      return;
    }

    setLoading(true);

    try {
      // Prepare order data in the format expected by backend
      const orderData = {
        shipping_address: formData.shippingAddress,
        billing_address: formData.billingAddress || formData.shippingAddress,
        payment_method: formData.paymentMethod,
        payment_details: paymentDetails[formData.paymentMethod]
      };
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post('http://localhost:5000/api/orders', orderData);
      
      // Generate UPI payment link if UPI method is selected
      if (formData.paymentMethod === 'upi') {
        generateUPIPaymentLink(response.data.order_id, response.data.order_number);
      }
      
      showSuccess('Order placed successfully!', 'Order Confirmed');
      clearCart();
      
      // Redirect to order confirmation
      setTimeout(() => {
      navigate(`/orders/${response.data.order_id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error creating order:', error);
      showError('Failed to create order. Please try again.', 'Order Error');
    }

    setLoading(false);
  };

  // Generate UPI payment link via backend (for reliable deep links on mobile)
  const generateUPIPaymentLink = async (orderId, orderNumber) => {
    try {
      const upiId = paymentDetails.upi.upiId || formData.phoneNumber;
      const amount = cartSummary.total;

      const { data } = await axios.post('http://localhost:5000/api/payments/upi-link', {
        upi_id: upiId,
        amount,
        order_number: orderNumber,
        merchant_name: 'RasayanaBio'
      });

      if (!data.success) {
        showError('Could not generate UPI link. Please try again.', 'UPI Error');
        return;
      }

      // Prefer native upi:// link; fall back to intent for Android
      const upiLink = data.upi_link;
      const intentLink = data.intent_link;

      showSuccess(
        `UPI Payment Link Generated!\n\nAmount: ${formatPrice(amount)}\nOrder: ${orderNumber}\nUPI ID: ${upiId}\n\nClick OK to open UPI app`,
        'UPI Payment Link',
        () => {
          // Try opening UPI link; if blocked, open intent link
          const opened = window.open(upiLink, '_self');
          if (!opened || opened.closed || typeof opened.closed === 'undefined') {
            window.location.href = intentLink;
          }
        }
      );
    } catch (err) {
      showError('Could not generate UPI link. Please try again.', 'UPI Error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-header">
            <h1>Your cart is empty</h1>
            <p>Add some products to checkout!</p>
            <button 
              className="place-order-btn"
              onClick={() => navigate('/products')}
              style={{ maxWidth: '300px', margin: '0 auto' }}
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
        <div className="checkout-header">
          <h1>Secure Checkout</h1>
          <p>Complete your order with confidence</p>
        </div>
        
        <div className="checkout-content">
          {/* Left Side - Checkout Form */}
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="section-title">
                Personal Information
              </div>
              
              <div className="form-row">
              <div className="form-group">
                  <label className="form-label">Full Name *</label>
                <input
                  type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                  onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  required
                />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter your email address"
                />
              </div>

              {/* Address Information */}
              <div className="form-group">
                <label className="form-label">Shipping Address *</label>
                <textarea
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Enter your complete shipping address"
                  required
                />
            </div>

              <div className="form-group">
                <label className="form-label">Billing Address</label>
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  className="form-input form-textarea"
                  placeholder="Enter your billing address (leave blank if same as shipping)"
                />
              </div>

              {/* Payment Method */}
              <div className="payment-section">
                <div className="section-title">
                  Payment Method
                </div>
                
                <div className="payment-methods">
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="upi"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === 'upi'}
                      onChange={() => handlePaymentMethodChange('upi')}
                    />
                    <label htmlFor="upi" className="payment-method-label">
                      UPI Payment
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="card"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={() => handlePaymentMethodChange('card')}
                    />
                    <label htmlFor="card" className="payment-method-label">
                      Credit/Debit Card
                    </label>
                  </div>
                  
                  <div className="payment-method">
                    <input
                      type="radio"
                      id="wallet"
                      name="paymentMethod"
                      value="wallet"
                      checked={formData.paymentMethod === 'wallet'}
                      onChange={() => handlePaymentMethodChange('wallet')}
                    />
                    <label htmlFor="wallet" className="payment-method-label">
                      Digital Wallet
                    </label>
                  </div>
                </div>

                {!formData.paymentMethod && (
                  <div className="payment-method-required">
                    Please select a payment method to continue
                  </div>
                )}

                {/* Payment Details */}
                <div className={`payment-details ${formData.paymentMethod ? 'active' : ''}`}>
                  {formData.paymentMethod === 'upi' && (
                    <div>
                      <h4>UPI Payment Details</h4>
                      <div className="upi-form">
                        <div className="upi-options">
                          <div className="upi-option">
                            <input
                              type="radio"
                              id="qr"
                              name="upiMethod"
                              value="qr"
                              checked={paymentDetails.upi.method === 'qr'}
                              onChange={(e) => handlePaymentDetailsChange('upi', 'method', e.target.value)}
                            />
                            <label htmlFor="qr" className="upi-option-label">
                              Scan QR Code
                            </label>
                          </div>
                          <div className="upi-option">
                            <input
                              type="radio"
                              id="id"
                              name="upiMethod"
                              value="id"
                              checked={paymentDetails.upi.method === 'id'}
                              onChange={(e) => handlePaymentDetailsChange('upi', 'method', e.target.value)}
                            />
                            <label htmlFor="id" className="upi-option-label">
                              Enter UPI ID
                            </label>
              </div>
            </div>

                        {paymentDetails.upi.method === 'qr' && (
                          <div className="qr-code-section">
                            {paymentDetails.upi.qrGenerated ? (
                              <div className="qr-code-display">
                                <div className="qr-code-container">
                                  <div className="qr-code">
                                    {/* QR Code will be generated here */}
                                    <div className="qr-code-content">
                                      <div className="qr-pattern">
                                        <div className="qr-corner top-left"></div>
                                        <div className="qr-corner top-right"></div>
                                        <div className="qr-corner bottom-left"></div>
                                        <div className="qr-dots"></div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="qr-info">
                                    <p><strong>Amount:</strong> {formatPrice(cartSummary.total)}</p>
                                    <p><strong>Merchant:</strong> RasayanaBio</p>
                                    <p><strong>Transaction ID:</strong> {paymentDetails.upi.qrCode ? JSON.parse(paymentDetails.upi.qrCode).transactionId : 'N/A'}</p>
                                  </div>
                                </div>
                                <p className="qr-instruction">Scan this QR code with any UPI app to complete payment</p>
                              </div>
                            ) : (
                              <div className="qr-code-placeholder">
                                <div className="qr-placeholder-icon">📱</div>
                                <p>Enter your phone number above to generate QR code</p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {paymentDetails.upi.method === 'id' && (
              <div className="form-group">
                            <label className="form-label">UPI ID</label>
                            <input
                              type="text"
                              value={paymentDetails.upi.upiId}
                              onChange={(e) => handlePaymentDetailsChange('upi', 'upiId', e.target.value)}
                              className="form-input"
                              placeholder="Enter your UPI ID (e.g., 9876543210@paytm)"
                            />
                            {paymentDetails.upi.upiId && (
                              <button
                                type="button"
                                onClick={() => generateUPIPaymentLink(null, 'PREVIEW')}
                                className="generate-payment-link-btn"
                              >
                                Generate Payment Link
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'card' && (
                    <div>
                      <h4>Card Payment Details</h4>
                      <div className="card-form">
                        <div className="form-group">
                          <label className="form-label">Card Number</label>
                          <input
                            type="text"
                            value={paymentDetails.card.cardNumber}
                            onChange={(e) => handlePaymentDetailsChange('card', 'cardNumber', e.target.value)}
                            className="form-input"
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                          <div className="card-icons">
                            <div className="card-icon">💳</div>
                            <div className="card-icon">VISA</div>
                            <div className="card-icon">MC</div>
                          </div>
                        </div>
                        
                        <div className="card-row">
                          <div className="form-group">
                            <label className="form-label">Expiry Date</label>
                            <input
                              type="text"
                              value={paymentDetails.card.expiryDate}
                              onChange={(e) => handlePaymentDetailsChange('card', 'expiryDate', e.target.value)}
                              className="form-input"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">CVV</label>
                            <input
                              type="text"
                              value={paymentDetails.card.cvv}
                              onChange={(e) => handlePaymentDetailsChange('card', 'cvv', e.target.value)}
                              className="form-input"
                              placeholder="123"
                              maxLength="4"
                            />
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Cardholder Name</label>
                          <input
                            type="text"
                            value={paymentDetails.card.cardholderName}
                            onChange={(e) => handlePaymentDetailsChange('card', 'cardholderName', e.target.value)}
                            className="form-input"
                            placeholder="Name as it appears on card"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'wallet' && (
                    <div>
                      <h4>Digital Wallet Details</h4>
                      <div className="wallet-form">
                        <div className="wallet-options">
                          <div className="wallet-option">
                            <input
                              type="radio"
                              id="phonepe"
                              name="walletType"
                              value="phonepe"
                              checked={paymentDetails.wallet.walletType === 'phonepe'}
                              onChange={(e) => handlePaymentDetailsChange('wallet', 'walletType', e.target.value)}
                            />
                            <label htmlFor="phonepe" className="wallet-option-label">
                              <div className="wallet-icon">📱</div>
                              PhonePe
                            </label>
                          </div>
                          <div className="wallet-option">
                            <input
                              type="radio"
                              id="paytm"
                              name="walletType"
                              value="paytm"
                              checked={paymentDetails.wallet.walletType === 'paytm'}
                              onChange={(e) => handlePaymentDetailsChange('wallet', 'walletType', e.target.value)}
                            />
                            <label htmlFor="paytm" className="wallet-option-label">
                              <div className="wallet-icon">💰</div>
                              Paytm
                            </label>
                          </div>
                          <div className="wallet-option">
                            <input
                              type="radio"
                              id="gpay"
                              name="walletType"
                              value="gpay"
                              checked={paymentDetails.wallet.walletType === 'gpay'}
                              onChange={(e) => handlePaymentDetailsChange('wallet', 'walletType', e.target.value)}
                            />
                            <label htmlFor="gpay" className="wallet-option-label">
                              <div className="wallet-icon">G</div>
                              Google Pay
                            </label>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <label className="form-label">Wallet ID / Phone Number</label>
                          <input
                            type="text"
                            value={paymentDetails.wallet.walletId}
                            onChange={(e) => handlePaymentDetailsChange('wallet', 'walletId', e.target.value)}
                            className="form-input"
                            placeholder="Enter your wallet ID or phone number"
                          />
                        </div>
                      </div>
                    </div>
                  )}
              </div>
            </div>

            <button 
              type="submit" 
                className="place-order-btn"
              disabled={loading}
            >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Processing Payment...
                  </>
                ) : (
                  `Place Order - ${formatPrice(cartSummary.total)}`
                )}
            </button>
          </form>
          </div>

          {/* Right Side - Order Summary */}
          <div className="order-summary-section">
            <div className="order-summary-title">
              Order Summary
            </div>
            
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-image">
                    {item.product.name.charAt(0)}
                  </div>
                  <div className="item-details">
                    <div className="item-name">{item.product.name}</div>
                    <div className="item-meta">
                      Qty: {item.quantity} • Pack: {item.pack_size} bottle{item.pack_size !== '1' ? 's' : ''}
                    </div>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.subtotal)}
                    </div>
                  </div>
                ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span className="total-label">Subtotal</span>
                <span className="total-value">{formatPrice(cartSummary.subtotal)}</span>
              </div>
              
              {cartSummary.coupon_discount > 0 && (
                <div className="total-row">
                  <span className="total-label">Coupon Discount</span>
                  <span className="total-value discount-value">-{formatPrice(cartSummary.coupon_discount)}</span>
                </div>
              )}
              
              <div className="total-row">
                <span className="total-label">CGST (9%)</span>
                <span className="total-value tax-value">{formatPrice(cartSummary.cgst)}</span>
              </div>
              
              <div className="total-row">
                <span className="total-label">SGST (9%)</span>
                <span className="total-value tax-value">{formatPrice(cartSummary.sgst)}</span>
              </div>
              
              <div className="total-row">
                <span className="total-label">Shipping</span>
                <span className="total-value">Free</span>
              </div>
              
              <div className="total-row">
                <span className="total-label">Total</span>
                <span className="total-value">{formatPrice(cartSummary.total)}</span>
              </div>
            </div>

            {/* Coupon Section */}
            <div className="coupon-section">
              <div className="coupon-input-group">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="coupon-input"
                  placeholder="Enter coupon code"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="coupon-btn"
                  disabled={couponLoading}
                >
                  {couponLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
              
              {couponMessage && (
                <div className={couponMessage.includes('applied') ? 'success-message' : 'error-message'}>
                  {couponMessage}
                </div>
              )}
              
              {appliedCoupon && (
                <div className="applied-coupon">
                  <div>
                    <strong>{appliedCoupon.code}</strong>
                    <div>Saved {formatPrice(appliedCoupon.discount_amount)}</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="remove-coupon-btn"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Available Coupons */}
            {availableCoupons.length > 0 && (
              <div className="available-coupons">
                <div className="available-coupons-title">Available Coupons</div>
                {availableCoupons.map(coupon => (
                  <div
                    key={coupon.id}
                    className="coupon-card"
                    onClick={() => setCouponCode(coupon.code)}
                  >
                    <div className="coupon-code">{coupon.code}</div>
                    <div className="coupon-description">{coupon.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;