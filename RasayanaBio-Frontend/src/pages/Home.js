// ============================================
// src/pages/Home.js - Redesigned Home Page inspired by RasayanaBio.com
// ============================================
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import CategoriesSection from '../components/CategoriesSection';
import WhatsAppButton from '../components/WhatsAppButton';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:4000/api/products');
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const featuredProducts = useMemo(() => {
    return products.slice(0, 4);
  }, [products]);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="botanical-pattern"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-text">
                <p className="sanskrit-text-small">सर्वे भवन्तु सुखिनः,</p>
                <h1 className="sanskrit-text-large">सर्वे सन्तु निरामयाः</h1>
                <p className="english-translation">May all be happy, may all be free from disease</p>
                <div className="hero-actions">
                  <Link to="/products" className="btn-primary">View More</Link>
                </div>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-image">
                <div className="product-bottle">
                  <div className="bottle-gradient"></div>
                </div>
                <div className="floating-elements">
                  <div className="floating-leaf leaf-1">🍃</div>
                  <div className="floating-leaf leaf-2">🌿</div>
                  <div className="floating-leaf leaf-3">🍃</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="whatsapp-button">
          <div className="whatsapp-icon">📱</div>
          <span>WhatsApp us</span>
        </div>
      </section>

      {/* Wealth is Health Section */}
      <section className="wealth-health-section">
        <div className="container">
          <div className="wealth-content">
            <div className="wealth-text">
              <h2 className="wealth-title">
                The greatest<br />
                <span className="wealth-highlight">Wealth Is</span><br />
                Health
              </h2>
              <Link to="/products" className="btn-secondary">View More</Link>
            </div>
            <div className="wealth-image">
              <div className="health-icon">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* Beauty Section */}
      <section className="beauty-section">
        <div className="container">
          <div className="beauty-content">
            <div className="beauty-text">
              <h2 className="beauty-title">
                From<br />
                <span className="beauty-highlight">Youthful Promise</span><br />
                to Ageless Beauty
              </h2>
              <div className="beauty-features">
                <div className="feature-item">
                  <span className="feature-icon">✨</span>
                  <span className="feature-text">High Potency Collagen</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✅</span>
                  <span className="feature-text">No side effects</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">💫</span>
                  <span className="feature-text">Radiant Results</span>
                </div>
              </div>
              <Link to="/products" className="btn-primary">View More</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <span className="section-subtitle">-Categories-</span>
            <h2 className="section-title">Shop By Categories</h2>
          </div>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🛡️</div>
              <h3>Immunity Booster</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">😴</div>
              <h3>Sleep Support</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">🧘</div>
              <h3>Stress and Anxiety</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">💪</div>
              <h3>Men's Health</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">🌸</div>
              <h3>Women's Health</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">✨</div>
              <h3>Beauty & Radiance</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">🌱</div>
              <h3>Healthy Ageing</h3>
            </div>
            <div className="category-card">
              <div className="category-icon">🏃</div>
              <h3>Sports & Fitness</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Scientific Integrity Section */}
      <section className="scientific-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Scientific Integrity</h2>
            <p className="section-subtitle">Quality assurance and research-driven innovation</p>
          </div>
          <div className="scientific-grid">
            <div className="scientific-card">
              <div className="card-icon">🔬</div>
              <h3>Ingredient Research</h3>
              <p>Research and testing in-house with transparent documentation and findings</p>
            </div>
            <div className="scientific-card">
              <div className="card-icon">🛡️</div>
              <h3>Quality Assurance</h3>
              <p>No synthetic additives or shortcuts with verified sourcing</p>
            </div>
            <div className="scientific-card">
              <div className="card-icon">💡</div>
              <h3>Research-Driven Innovation</h3>
              <p>Clinically tested and standardized formulations by Scientific Experts</p>
            </div>
            <div className="scientific-card">
              <div className="card-icon">📱</div>
              <h3>Consumer Transparency</h3>
              <p>QR codes for detailed product info with educational content</p>
            </div>
          </div>
        </div>
      </section>

      {/* Power of Nature Section */}
      <section className="nature-section">
        <div className="container">
          <div className="nature-content">
            <h2 className="nature-title">Power of Nature</h2>
            <p className="nature-description">
              Our products are made entirely from natural components. We keep our formulas basic since we are primarily concerned with your health.
            </p>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="best-sellers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Best Sellers Products</h2>
            <p className="section-subtitle">Our most popular health supplements</p>
          </div>
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">Error loading products: {error}</div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          <div className="section-footer">
            <Link to="/products" className="btn-outline">View More</Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="about-title">Welcome to Health Care Nutrition</h2>
              <p className="about-description">
                For creating affordable and efficacious products, RasayanaBio is here with premium formulations. 
                In the year 2021, Dr Monisha and Dr Raman, a sibling duo, came up with an idea and, after a lot 
                of brainstorming, launched a herbal brand with two official names in the year 2023: "RasayanaBio" 
                and "Nutra's Bounty".
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <span className="feature-icon">🏭</span>
                  <span className="feature-text">FDA-approved facility</span>
                </div>
                <div className="about-feature">
                  <span className="feature-icon">🌱</span>
                  <span className="feature-text">100% vegan products</span>
                </div>
                <div className="about-feature">
                  <span className="feature-icon">🧪</span>
                  <span className="feature-text">Thorough testing process</span>
                </div>
              </div>
              <Link to="/about" className="btn-primary">Read More</Link>
            </div>
            <div className="about-image">
              <div className="about-icon">🌿</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Why choose us?</h2>
            <p className="section-subtitle">Est. 2021 - Committed to your health</p>
          </div>
          <div className="why-choose-grid">
            <div className="why-card">
              <div className="card-icon">⭐</div>
              <h3>Commitment to Quality</h3>
              <p>Our topmost priority is quality. We source ayurvedic/natural herbs from various regions and subject them to thorough testing.</p>
            </div>
            <div className="why-card">
              <div className="card-icon">🔬</div>
              <h3>Embraced by Science</h3>
              <p>Our products have no side effects, just pure herbs helping you embrace a lifestyle rooted in scientific excellence.</p>
            </div>
            <div className="why-card">
              <div className="card-icon">🔍</div>
              <h3>Transparent Practices</h3>
              <p>Transparency is key to building trust. We commit to mentioning ingredients with detailed information.</p>
            </div>
            <div className="why-card">
              <div className="card-icon">😊</div>
              <h3>Customer Satisfaction</h3>
              <p>Your satisfaction is our primary objective. Our products contain no artificial or synthetic additives.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">What People Say</h2>
            <p className="section-subtitle">Client Testimonials</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"I never tried supplements as I never found any quality product that is vegetarian. RasayanaBio Ashwagandha are veg capsules and have better results so far."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Charu Chadha</div>
                <div className="author-role">Customer</div>
                <div className="rating">⭐⭐⭐⭐☆</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"It is a good product for keeping UTI health in control. Additionally, my menstrual cycle became regular after consuming it regularly for a few months."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Saloni Sharma</div>
                <div className="author-role">Customer</div>
                <div className="rating">⭐⭐⭐⭐☆</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"RasayanaBio Hair Serum's natural blend of herbal extracts effectively reduced my hair fall and promoted new growth. The formula nourishes both hair and scalp."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Juhi Sharma</div>
                <div className="author-role">Customer</div>
                <div className="rating">⭐⭐⭐⭐☆</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Get Exclusive Access & 10% Off</h2>
            <p className="newsletter-subtitle">When you sign up for our newsletter!</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" className="newsletter-input" />
              <button className="btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  );
};

export default Home;