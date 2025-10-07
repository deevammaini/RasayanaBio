// ============================================
// src/pages/Wishlist.js
// ============================================
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';
import ProductImage from '../components/ProductImage';
import './Wishlist.css';

const Wishlist = () => {
  const { 
    wishlistItems, 
    removeFromWishlist, 
    isInWishlist, 
    syncWishlistWithBackend,
    loading 
  } = useWishlist();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      syncWishlistWithBackend();
    }
  }, [isAuthenticated, syncWishlistWithBackend]);

  const handleRemoveFromWishlist = async (productId) => {
    await removeFromWishlist(productId);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="container">
          <div className="loading">Loading wishlist...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="container">
        <div className="wishlist-header">
          <h1 className="wishlist-title">My Wishlist</h1>
          <p className="wishlist-subtitle">
            {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-icon">💝</div>
            <h2>Your wishlist is empty</h2>
            <p>Start adding products you love to your wishlist!</p>
            <Link to="/products" className="btn-primary">
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistItems.map((item) => (
              <div key={item.id} className="wishlist-item">
                <div className="wishlist-item-image">
                  <ProductImage 
                    product={item} 
                    className="product-image" 
                    size="card"
                  />
                  <button
                    className="remove-wishlist-btn"
                    onClick={() => handleRemoveFromWishlist(item.id)}
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    ♥
                  </button>
                </div>
                
                <div className="wishlist-item-content">
                  <h3 className="wishlist-item-title">
                    <Link to={`/products/${item.id}`}>
                      {item.name}
                    </Link>
                  </h3>
                  
                  <div className="wishlist-item-price">
                    {item.sale_price ? (
                      <>
                        <span className="current-price">
                          {formatPrice(item.sale_price)}
                        </span>
                        <span className="original-price">
                          {formatPrice(item.price)}
                        </span>
                      </>
                    ) : (
                      <span className="current-price">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>
                  
                  <div className="wishlist-item-category">
                    {item.category}
                  </div>
                  
                  <div className="wishlist-item-actions">
                    <Link 
                      to={`/products/${item.id}`} 
                      className="btn-view-product"
                    >
                      View Product
                    </Link>
                    <Link 
                      to={`/products/${item.id}`} 
                      className="btn-add-to-cart"
                    >
                      Add to Cart
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
