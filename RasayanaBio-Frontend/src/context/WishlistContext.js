// ============================================
// src/context/WishlistContext.js
// ============================================
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlistItems(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        localStorage.removeItem('wishlist');
      }
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = useCallback(async (product) => {
    try {
      setLoading(true);
      setError(null);

      // Check if product is already in wishlist
      const existingItem = wishlistItems.find(item => item.id === product.id);
      if (existingItem) {
        return; // Already in wishlist
      }

      // Add to wishlist
      const newItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        image_url: product.image_url,
        category: product.category,
        addedAt: new Date().toISOString()
      };

      setWishlistItems(prev => [...prev, newItem]);

      // If user is authenticated, sync with backend
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.post('http://localhost:4000/api/wishlist/add', {
            product_id: product.id
          }, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error syncing wishlist with backend:', error);
          // Continue with local storage even if backend fails
        }
      }

    } catch (error) {
      console.error('Error adding to wishlist:', error);
      setError('Failed to add to wishlist');
    } finally {
      setLoading(false);
    }
  }, [wishlistItems]);

  const removeFromWishlist = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);

      setWishlistItems(prev => prev.filter(item => item.id !== productId));

      // If user is authenticated, sync with backend
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await axios.delete(`http://localhost:4000/api/wishlist/remove/${productId}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        } catch (error) {
          console.error('Error syncing wishlist removal with backend:', error);
          // Continue with local storage even if backend fails
        }
      }

    } catch (error) {
      console.error('Error removing from wishlist:', error);
      setError('Failed to remove from wishlist');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleWishlist = useCallback(async (product) => {
    const isInWishlist = wishlistItems.some(item => item.id === product.id);
    
    if (isInWishlist) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product);
    }
  }, [wishlistItems, addToWishlist, removeFromWishlist]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const clearWishlist = useCallback(() => {
    setWishlistItems([]);
    localStorage.removeItem('wishlist');
  }, []);

  const syncWishlistWithBackend = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:4000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setWishlistItems(response.data.wishlist || []);
      }
    } catch (error) {
      console.error('Error syncing wishlist with backend:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist,
    syncWishlistWithBackend
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
