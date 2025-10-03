import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    const result = await addToCart(product.id, quantity);
    if (result.success) {
      alert('Product added to cart!');
    }
  };

  if (loading) {
    return <div className="loading">Loading product...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="container">
        <div className="product-content">
          <div className="product-images">
            <div className="main-image">
              <img 
                src={product.image_url || '/placeholder.jpg'} 
                alt={product.name}
              />
            </div>
          </div>

          <div className="product-info">
            <div className="product-badges">
              {product.is_vegan && <span className="badge">🌿 Vegan</span>}
              {product.is_gmo_free && <span className="badge">❤️ GMO Free</span>}
              {product.is_gluten_free && <span className="badge">🌾 Gluten Free</span>}
            </div>

            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>

            <div className="rating">
              <span className="stars">⭐⭐⭐⭐⭐</span>
              <span className="rating-text">({product.review_count} reviews)</span>
            </div>

            <div className="price-section">
              {product.sale_price ? (
                <>
                  <span className="sale-price">${product.sale_price}</span>
                  <span className="original-price">${product.price}</span>
                </>
              ) : (
                <span className="current-price">${product.price}</span>
              )}
            </div>

            <p className="description">{product.description}</p>

            <div className="product-details">
              {product.ingredients && (
                <div className="detail-section">
                  <h3>Ingredients</h3>
                  <p>{product.ingredients}</p>
                </div>
              )}

              {product.benefits && (
                <div className="detail-section">
                  <h3>Benefits</h3>
                  <p>{product.benefits}</p>
                </div>
              )}

              {product.usage_instructions && (
                <div className="detail-section">
                  <h3>Usage Instructions</h3>
                  <p>{product.usage_instructions}</p>
                </div>
              )}
            </div>

            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>

              <button 
                className="btn-add-cart"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

            <div className="stock-info">
              {product.stock_quantity > 0 ? (
                <p className="in-stock">✅ In Stock ({product.stock_quantity} available)</p>
              ) : (
                <p className="out-of-stock">❌ Out of Stock</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
