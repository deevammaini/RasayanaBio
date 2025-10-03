// ============================================
// context/CartContext.js - Cart Context
// ============================================
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
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
      const response = await axios.get('http://localhost:5000/api/cart', {
        headers: { 'Session-Id': sessionId }
      });
      setCart(response.data.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await axios.post('http://localhost:5000/api/cart/add', 
        { product_id: productId, quantity },
        { headers: { 'Session-Id': sessionId } }
      );
      await fetchCart();
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to add to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      await axios.put(`http://localhost:5000/api/cart/update/${itemId}`, 
        { quantity },
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
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    cart,
    cartTotal,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
