// ============================================
// src/components/CategoriesSection.js - Modern Categories Component
// ============================================
import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import './CategoriesSection.css';

const CategoriesSection = memo(() => {
  const categories = [
    {
      id: 'immunity-booster',
      name: 'Immunity Booster',
      icon: '🛡️',
      color: '#f97316',
      gradient: 'linear-gradient(135deg, #fed7aa, #f97316)',
      link: '/products?category=Immunity'
    },
    {
      id: 'sleep-support',
      name: 'Sleep Support',
      icon: '😴',
      color: '#22c55e',
      gradient: 'linear-gradient(135deg, #bbf7d0, #22c55e)',
      link: '/products?category=Sleep'
    },
    {
      id: 'stress-anxiety',
      name: 'Stress and Anxiety',
      icon: '🧘',
      color: '#06b6d4',
      gradient: 'linear-gradient(135deg, #a5f3fc, #06b6d4)',
      link: '/products?category=Stress'
    },
    {
      id: 'mens-health',
      name: 'Men\'s Health',
      icon: '💪',
      color: '#3b82f6',
      gradient: 'linear-gradient(135deg, #dbeafe, #3b82f6)',
      link: '/products?category=Men\'s Health'
    },
    {
      id: 'womens-health',
      name: 'Women\'s Health',
      icon: '🌸',
      color: '#ec4899',
      gradient: 'linear-gradient(135deg, #fce7f3, #ec4899)',
      link: '/products?category=Women\'s Health'
    },
    {
      id: 'beauty-radiance',
      name: 'Beauty & Radiance',
      icon: '✨',
      color: '#a855f7',
      gradient: 'linear-gradient(135deg, #e9d5ff, #a855f7)',
      link: '/products?category=Beauty'
    },
    {
      id: 'healthy-aging',
      name: 'Healthy Aging',
      icon: '🌿',
      color: '#d97706',
      gradient: 'linear-gradient(135deg, #fed7aa, #d97706)',
      link: '/products?category=Aging'
    },
    {
      id: 'sports-fitness',
      name: 'Sports & Fitness',
      icon: '🏃',
      color: '#ef4444',
      gradient: 'linear-gradient(135deg, #fecaca, #ef4444)',
      link: '/products?category=Fitness'
    }
  ];

  return (
    <section className="categories-section" aria-labelledby="categories-heading">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">-Categories-</span>
          <h2 id="categories-heading">Shop By Categories</h2>
        </div>
        
        <div className="categories-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="category-card"
              style={{ '--category-color': category.color }}
              aria-label={`Browse ${category.name} products`}
            >
              <div 
                className="category-icon"
                style={{ background: category.gradient }}
                aria-hidden="true"
              >
                <span className="category-emoji" role="img" aria-label={category.name}>
                  {category.icon}
                </span>
                <div className="category-leaves">
                  <span className="leaf leaf-1">🍃</span>
                  <span className="leaf leaf-2">🍃</span>
                </div>
              </div>
              <h3 className="category-name">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

CategoriesSection.displayName = 'CategoriesSection';

export default CategoriesSection;
