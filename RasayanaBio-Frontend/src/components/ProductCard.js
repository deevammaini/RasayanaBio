// ============================================
// src/components/ProductCard.js - Modern React Product Card
// ============================================
import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { usePopup } from '../context/PopupContext';
import { formatPrice } from '../utils/currency';
import ProductImage from './ProductImage';
import './ProductCard.css';

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showSuccess, showError } = usePopup();

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    try {
      await addToCart(product.id);
      showSuccess('Added to cart!', 'Success');
    } catch (error) {
      showError('Error adding to cart', 'Error');
    }
  }, [addToCart, product.id, showSuccess, showError]);

  const handleToggleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await toggleWishlist(product);
      const isInWishlistNow = isInWishlist(product.id);
      if (isInWishlistNow) {
        showSuccess('Removed from wishlist!', 'Success');
      } else {
        showSuccess('Added to wishlist!', 'Success');
      }
    } catch (error) {
      showError('Error updating wishlist', 'Error');
    }
  }, [toggleWishlist, product, isInWishlist, showSuccess, showError]);

  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      {product.sale_price && (
        <div className="sale-badge" aria-label="On Sale">
          Sale
        </div>
      )}
      
      <button
        className={`wishlist-btn ${isInWishlist(product.id) ? 'active' : ''}`}
        onClick={handleToggleWishlist}
        aria-label={`${isInWishlist(product.id) ? 'Remove from' : 'Add to'} wishlist`}
      >
        {isInWishlist(product.id) ? '♥' : '♡'}
      </button>
      
      <Link to={`/products/${product.id}`} className="product-link" aria-label={`View ${product.name} details`}>
        <ProductImage 
          product={product} 
          className="product-card-image" 
          size="card"
        />
        
        <header className="product-header">
          <h3 className="product-card-title">{product.name}</h3>
        </header>
        
        <div className="product-card-price" role="text" aria-label={`Price: ${formatPrice(product.sale_price || product.price)}`}>
          {product.sale_price ? (
            <>
              <div className="price-original">
                <span className="strikethrough" aria-label={`Original price: ${formatPrice(product.price)}`}>
                  {formatPrice(product.price)}
                </span>
                <span className="original-text">
                  Original price was: {formatPrice(product.price)}.
                </span>
              </div>
              <div className="price-current">
                <span className="current-price" aria-label={`Current price: ${formatPrice(product.sale_price)}`}>
                  {formatPrice(product.sale_price)}
                </span>
                <span className="current-text">
                  Current price is: {formatPrice(product.sale_price)}.
                </span>
              </div>
            </>
          ) : (
            <div className="price-current">
              <span className="current-price">{formatPrice(product.price)}</span>
            </div>
          )}
        </div>

        <div className="rating-section" aria-label="Product rating">
          <div className="stars" role="img" aria-label="5 star rating">⭐⭐⭐⭐⭐</div>
          <span className="rating-text">
            Rated <strong>0</strong> out of 5
          </span>
        </div>
      </Link>
      
      <footer className="product-actions">
        <button 
          onClick={handleAddToCart} 
          className="btn-add-cart"
          aria-label={`Add ${product.name} to cart`}
        >
          Add to cart
        </button>
        <Link 
          to={`/products/${product.id}`} 
          className="btn-buy-now"
          aria-label={`Buy ${product.name} now`}
        >
          Buy Now
        </Link>
      </footer>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
