// ============================================
// pages/Home.js
// ============================================
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?per_page=6');
      setFeaturedProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Natural Wellness, <span>Scientifically Proven</span></h1>
              <p>Premium Ayurvedic supplements crafted with 100% natural ingredients. FDA-approved facility. No synthetic additives.</p>
              <div className="hero-actions">
                <Link to="/products" className="btn-primary">Shop Now</Link>
                <Link to="/about" className="btn-secondary">Learn More</Link>
              </div>
              <div className="features">
                <div className="feature">🌿 100% Vegan</div>
                <div className="feature">🏆 FDA Approved</div>
                <div className="feature">❤️ No GMOs</div>
              </div>
            </div>
            <div className="hero-image">
              <img src="https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600" alt="Natural Products" />
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <p className="section-subtitle">Carefully formulated herbal supplements backed by science</p>
          
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center">
            <Link to="/products" className="btn-view-all">View All Products</Link>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>"Few months back, I started consuming this product and have seen notable differences in volume and texture of my hair."</p>
              <div className="author">
                <strong>Shreya Bhojane</strong>
                <span>Collagen Supplement</span>
              </div>
            </div>
            <div className="testimonial">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>"RasayanaBio Hair Serum effectively reduced my hair fall and promoted new growth. Highly recommend!"</p>
              <div className="author">
                <strong>Juhi Sharma</strong>
                <span>Hair Serum</span>
              </div>
            </div>
            <div className="testimonial">
              <div className="rating">⭐⭐⭐⭐⭐</div>
              <p>"This product has really helped me in boosting my metabolism. I see a noticeable difference in my energy levels."</p>
              <div className="author">
                <strong>Aakansha Gupta</strong>
                <span>Ashwagandha</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
