import React, { useState, useCallback, useMemo, useEffect } from 'react';
import axios from 'axios';
import { formatPrice } from '../utils/currency';
import './PackSelection.css';

const PackSelection = ({ product, onPackChange, onQuantityChange, onAddToCart, onBuyNow }) => {
  const [selectedPack, setSelectedPack] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [packData, setPackData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch pack data from backend
  useEffect(() => {
    const fetchPackData = async () => {
      if (!product?.id) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:4000/api/products/${product.id}/packs`);
        setPackData(response.data.packs);
      } catch (error) {
        console.error('Error fetching pack data:', error);
        // Fallback to default pack data
        setPackData([
          {
            pack_size: '1',
            bottles: 1,
            tablets: 60,
            duration: '1 Month',
            discount_percent: 0,
            original_price: product.sale_price || product.price,
            final_price: product.sale_price || product.price,
            savings: 0
          },
          {
            pack_size: '2',
            bottles: 2,
            tablets: 120,
            duration: '2 Months',
            discount_percent: 33,
            original_price: (product.sale_price || product.price) * 2,
            final_price: Math.round((product.sale_price || product.price) * 2 * 0.67),
            savings: Math.round((product.sale_price || product.price) * 2 * 0.33)
          },
          {
            pack_size: '3',
            bottles: 3,
            tablets: 180,
            duration: '3 Months',
            discount_percent: 40,
            original_price: (product.sale_price || product.price) * 3,
            final_price: Math.round((product.sale_price || product.price) * 3 * 0.60),
            savings: Math.round((product.sale_price || product.price) * 3 * 0.40)
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPackData();
  }, [product]);

  const handlePackSelect = useCallback((packId) => {
    setSelectedPack(packId);
    onPackChange(packId);
  }, [onPackChange]);

  const handleQuantityChange = useCallback((newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
      onQuantityChange(newQuantity);
    }
  }, [onQuantityChange]);

  if (loading || !packData) {
    return (
      <div className="pack-selection">
        <div className="loading">Loading pack options...</div>
      </div>
    );
  }

  return (
    <div className="pack-selection">
      <h3 className="pack-title">Pack:</h3>
      
      <div className="pack-options">
        {packData.map((pack) => (
          <div
            key={pack.pack_size}
            className={`pack-card ${selectedPack.toString() === pack.pack_size ? 'selected' : ''}`}
            onClick={() => handlePackSelect(parseInt(pack.pack_size))}
          >
            <div className="pack-badge">
              <span className="checkmark">✓</span>
              <span className="stars">⭐⭐</span>
            </div>
            
            <div className="pack-content">
              <h4 className="pack-name">{pack.bottles} Bottle{pack.bottles > 1 ? 's' : ''}</h4>
              <div className="pack-details">
                <span className="tablets">{pack.tablets} Tablets</span>
                <span className="months">{pack.duration}</span>
              </div>
              
              <div className="pack-pricing">
                <div className="current-price">{formatPrice(pack.final_price)}</div>
                <div className="original-price">{formatPrice(pack.original_price)}</div>
                <div className="savings">Save {formatPrice(pack.savings)}</div>
              </div>
              
              <div className="discount-badge">{pack.discount_percent}%</div>
            </div>
          </div>
        ))}
      </div>

      <div className="quantity-section">
        <label className="quantity-label">Quantity:</label>
        <div className="quantity-controls">
          <button 
            className="quantity-btn minus"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            —
          </button>
          <span className="quantity-value">{quantity}</span>
          <button 
            className="quantity-btn plus"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="btn-add-cart" onClick={onAddToCart}>
          ADD TO CART
        </button>
        <button className="btn-buy-now" onClick={onBuyNow}>
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default PackSelection;
