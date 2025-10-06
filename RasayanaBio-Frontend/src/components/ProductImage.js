import React from 'react';
import './ProductImage.css';

const ProductImage = ({ product, className = '', size = 'medium' }) => {
  // Map product names to actual image URLs
  const getProductImage = (productName) => {
  const imageMap = {
    'Female Vitality': '/images/female-vitality.jpg',
    'Male Vitality': '/images/male-vitality.jpg', 
    'Diabetes Care': '/images/diabetes-care.jpg',
    'Sleep Support': '/images/sleep-support.jpg',
    'Multivitamin Gummies': '/images/multiviman-gummies.jpg',
    'Hair Serum': '/images/hair-serum.jpg',
    'Joint Care Plus': '/images/joint-care.jpg',
    'Digestive Wellness': '/images/digestive-wellness.jpg',
    'Face Wash with Glutathione': '/images/face-wash-glutathione.jpg',
    'Liver Care': '/images/liver-care.jpg',
    'PCOS Care': '/images/pcos-care.jpg'
  };
    
    return imageMap[productName] || '/images/default-product.jpg';
  };

  // Fallback icon mapping
  const getProductIcon = (productName) => {
  const iconMap = {
    'Female Vitality': '🌸',
    'Male Vitality': '💪',
    'Diabetes Care': '🩺',
    'Sleep Support': '😴',
    'Multivitamin Gummies': '🍯',
    'Hair Serum': '💆‍♀️',
    'Joint Care Plus': '🦴',
    'Digestive Wellness': '🌿',
    'Face Wash with Glutathione': '🧴',
    'Liver Care': '🫀',
    'PCOS Care': '🌺'
  };
    
    return iconMap[productName] || '✨';
  };

  // Fallback gradient mapping
  const getProductGradient = (productName) => {
  const gradientMap = {
    'Female Vitality': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'Male Vitality': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'Diabetes Care': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'Sleep Support': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'Multivitamin Gummies': 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'Hair Serum': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'Joint Care Plus': 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
    'Digestive Wellness': 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    'Face Wash with Glutathione': 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)',
    'Liver Care': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'PCOS Care': 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  };
    
    return gradientMap[productName] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const imageUrl = getProductImage(product.name);
  const fallbackIcon = getProductIcon(product.name);
  const fallbackGradient = getProductGradient(product.name);

  return (
    <div className={`product-image-container ${className} ${size}`}>
      <div 
        className="product-image-placeholder"
        style={{ background: fallbackGradient }}
      >
        <img 
          src={imageUrl}
          alt={product.name}
          className="product-image"
          onError={(e) => {
            // If image fails to load, show icon fallback
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div className="product-icon-fallback" style={{ display: 'none' }}>
          <span className="product-icon">{fallbackIcon}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductImage;
