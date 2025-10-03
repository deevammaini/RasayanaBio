// ============================================
// components/ProductCard.js
// ============================================
import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const result = await addToCart(product.id);
    if (result.success) {
      alert('Product added to cart!');
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <div className="product-image">
          <img src={product.image_url || '/placeholder.jpg'} alt={product.name} />
          {product.sale_price && <span className="sale-badge">Sale</span>}
        </div>
        <div className="product-info">
          <div className="product-category">
            {product.is_vegan && <span className="badge">🌿 Vegan</span>}
            <span className="category">{product.category}</span>
          </div>
          <h3>{product.name}</h3>
          <p className="description">{product.short_description}</p>
          <div className="product-footer">
            <div className="price">
              {product.sale_price ? (
                <>
                  <span className="sale-price">${product.sale_price}</span>
                  <span className="original-price">${product.price}</span>
                </>
              ) : (
                <span className="current-price">${product.price}</span>
              )}
            </div>
            <button onClick={handleAddToCart} className="btn-add-cart">
              Add to Cart
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
