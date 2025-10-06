import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/currency';
import ProductImage from '../components/ProductImage';
import PackSelection from '../components/PackSelection';
import WhatsAppButton from '../components/WhatsAppButton';
import './ProductDetail.css';

const API_URL = 'http://localhost:5000/api';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPack, setSelectedPack] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error loading product:', error);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const handlePackChange = useCallback((packId) => {
    setSelectedPack(packId);
  }, []);

  const handleQuantityChange = useCallback((newQuantity) => {
    setQuantity(newQuantity);
  }, []);

  const handleAddToCart = useCallback(async () => {
    try {
      await addToCart(product.id, quantity);
      if (window.showNotification) {
        window.showNotification('Added to cart!', 'success');
      } else {
        alert('Added to cart!');
      }
    } catch (error) {
      if (window.showNotification) {
        window.showNotification('Error adding to cart', 'error');
      } else {
        alert('Error adding to cart');
      }
    }
  }, [addToCart, product?.id, quantity]);

  const handleBuyNow = useCallback(() => {
    // Navigate to checkout with selected product
    navigate('/checkout', { 
      state: { 
        product: product, 
        quantity: quantity, 
        pack: selectedPack 
      } 
    });
  }, [navigate, product, quantity, selectedPack]);

  const productFeatures = useMemo(() => {
    if (!product) return [];
    
    const features = [];
    if (product.name.toLowerCase().includes('male')) {
      features.push(
        'Promotes Vitality & Physical Strength',
        'Boost mood, focus, and overall sense of well-being',
        'Stress Resilience Support',
        'Enhance Stamina & Endurance',
        'Natural Testosterone Support',
        'Helps in weight management'
      );
    } else if (product.name.toLowerCase().includes('female')) {
      features.push(
        'Supports Hormonal Balance',
        'Enhances Energy & Vitality',
        'Promotes Overall Wellness',
        'Natural Ingredients',
        'Supports Reproductive Health',
        'Boosts Confidence'
      );
    } else if (product.name.toLowerCase().includes('diabetes')) {
      features.push(
        'Supports Healthy Blood Sugar',
        'Aids Glucose Metabolism',
        'Natural Diabetes Support',
        'Helps Manage Sugar Cravings',
        'Supports Pancreatic Function',
        'Promotes Overall Wellness'
      );
    } else if (product.name.toLowerCase().includes('sleep')) {
      features.push(
        'Promotes Restful Sleep',
        'Reduces Stress & Anxiety',
        'Supports Sleep Quality',
        'Natural Relaxation',
        'Calms the Mind',
        'Non-Habit Forming'
      );
    }
    return features;
  }, [product]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <div className="product-detail-grid">
          {/* Product Images */}
          <div className="product-images-section">
            <div className="main-image-container">
              <ProductImage 
                product={product} 
                className="main-product-image" 
                size="large"
              />
            </div>
            
            <div className="thumbnail-images">
              <div className="thumbnail-item active">
                <ProductImage 
                  product={product} 
                  className="thumbnail-image" 
                  size="card"
                />
              </div>
              <div className="thumbnail-item">
                <div className="thumbnail-placeholder">
                  <span>📋</span>
                  <span>Our Best Ingredients</span>
                </div>
              </div>
              <div className="thumbnail-item">
                <div className="thumbnail-placeholder">
                  <span>👨</span>
                  <span>Take 1-2 Tablets a Day</span>
                </div>
              </div>
              <div className="thumbnail-item">
                <ProductImage 
                  product={product} 
                  className="thumbnail-image" 
                  size="card"
                />
              </div>
              <div className="thumbnail-item">
                <div className="thumbnail-placeholder">
                  <span>📊</span>
                  <span>Product Information</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information */}
          <div className="product-info-section">
            <div className="product-badges">
              {product.is_vegan && <span className="badge vegan">🌿 Vegan</span>}
              {product.is_gmo_free && <span className="badge gmo-free">🧬 GMO Free</span>}
              {product.is_gluten_free && <span className="badge gluten-free">🌾 Gluten Free</span>}
            </div>

            <h1 className="product-title">{product.name}</h1>
            <p className="product-subtitle">60 veg capsules</p>

            <div className="rating-section">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <span className="rating-text">({product.review_count || 0} reviews)</span>
            </div>

            <div className="price-section">
              {product.sale_price ? (
                <>
                  <span className="sale-price">{formatPrice(product.sale_price)}</span>
                  <span className="original-price">{formatPrice(product.price)}</span>
                </>
              ) : (
                <span className="current-price">{formatPrice(product.price)}</span>
              )}
            </div>

            {/* Key Benefits */}
            <div className="benefits-section">
              <h3>Key Benefits</h3>
              <div className="benefits-grid">
                {productFeatures.slice(0, 4).map((feature, index) => (
                  <div key={index} className="benefit-card">
                    <div className="benefit-icon">
                      {index === 0 && '🧘'}
                      {index === 1 && '💪'}
                      {index === 2 && '❤️'}
                      {index === 3 && '🧠'}
                    </div>
                    <span className="benefit-text">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Product Description */}
            <div className="description-section">
              <h3>Product Description</h3>
              <p className="product-description">
                {product.description || `Nutra's Bounty ${product.name} is a meticulously crafted herbal blend designed to support your overall well-being. This potent formula combines ancient wisdom with modern science to deliver a comprehensive approach to health and vitality.`}
              </p>
            </div>

            {/* Pack Selection */}
            <PackSelection 
              product={product}
              onPackChange={handlePackChange}
              onQuantityChange={handleQuantityChange}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Product Features & Description */}
        <div className="product-details-section">
          <div className="features-description-grid">
            <div className="product-features">
              <h3>Product Feature</h3>
              <ul className="features-list">
                {productFeatures.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <span className="feature-icon">🌿</span>
                    <span className="feature-text">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="product-description-detail">
              <h3>Product Description</h3>
              <p>
                {product.description || `Nutra's Bounty ${product.name} is a meticulously crafted herbal blend designed to support your overall well-being. This potent formula combines ancient wisdom with modern science to deliver a comprehensive approach to health and vitality.`}
              </p>
            </div>
          </div>
        </div>
      </div>

      <WhatsAppButton />
    </div>
  );
};

export default ProductDetail;