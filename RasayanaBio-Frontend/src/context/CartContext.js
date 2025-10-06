// ============================================
// context/CartContext.js - Cart Context
// ============================================
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    coupon_discount: 0,
    discounted_subtotal: 0,
    cgst: 0,
    sgst: 0,
    total_tax: 0,
    total: 0,
    applied_coupon: null
  });
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [sessionId] = useState(() => {
    let id = localStorage.getItem('sessionId');
    if (!id) {
      id = 'guest-' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('sessionId', id);
    }
    return id;
  });

  const fetchCart = async () => {
    try {
      const headers = { 'Session-Id': sessionId };
      if (appliedCoupon) {
        headers['Coupon-Code'] = appliedCoupon.code;
      }
      
      const response = await axios.get('http://localhost:5000/api/cart', { headers });
      setCart(response.data.items || []);
      setCartSummary({
        subtotal: response.data.subtotal || 0,
        coupon_discount: response.data.coupon_discount || 0,
        discounted_subtotal: response.data.discounted_subtotal || 0,
        cgst: response.data.cgst || 0,
        sgst: response.data.sgst || 0,
        total_tax: response.data.total_tax || 0,
        total: response.data.total || 0,
        applied_coupon: response.data.applied_coupon || null
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [appliedCoupon]);

  const validateCoupon = async (code) => {
    try {
      const response = await axios.post('http://localhost:5000/api/coupons/validate', {
        code: code,
        subtotal: cartSummary.subtotal
      });
      
      if (response.data.valid) {
        setAppliedCoupon(response.data.coupon);
        return { success: true, coupon: response.data.coupon };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to validate coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const addToCart = async (productId, quantity = 1, packSize = '1') => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', 
        { product_id: productId, quantity, pack_size: packSize },
        { headers: { 'Session-Id': sessionId } }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity, packSize = null) => {
    try {
      const updateData = {};
      if (quantity !== null && quantity !== undefined) {
        updateData.quantity = quantity;
      }
      if (packSize !== null && packSize !== undefined) {
        updateData.pack_size = packSize;
      }
      
      await axios.put(`http://localhost:5000/api/cart/update/${itemId}`, 
        updateData,
        { headers: { 'Session-Id': sessionId } }
      );
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`, {
        headers: { 'Session-Id': sessionId }
      });
      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const clearCart = () => {
    setCart([]);
    setCartSummary({
      subtotal: 0,
      cgst: 0,
      sgst: 0,
      total_tax: 0,
      total: 0
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    cartSummary,
    cartTotal: cartSummary.total, // For backward compatibility
    cartCount,
    appliedCoupon,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart,
    validateCoupon,
    removeCoupon
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
