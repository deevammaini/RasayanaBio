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
              <div className="brand-icon">
                <svg viewBox="0 0 120 120" className="lotus-icon">
                  {/* Background watermark circle */}
                  <circle cx="60" cy="60" r="55" fill="none" stroke="#2c5530" stroke-width="0.5" opacity="0.5"/>
                  
                  {/* Outer lotus petals - 6 petals */}
                  <path d="M60 10 Q45 20 40 35 Q45 50 60 45 Q75 50 80 35 Q75 20 60 10" fill="#2c5530" opacity="0.3"/>
                  <path d="M60 10 Q75 20 80 35 Q75 50 60 45 Q45 50 40 35 Q45 20 60 10" fill="#2c5530" opacity="0.2"/>
                  
                  {/* Middle lotus petals */}
                  <path d="M60 20 Q50 25 45 35 Q50 45 60 40 Q70 45 75 35 Q70 25 60 20" fill="#2c5530" opacity="0.6"/>
                  <path d="M60 20 Q70 25 75 35 Q70 45 60 40 Q50 45 45 35 Q50 25 60 20" fill="#2c5530" opacity="0.4"/>
                  
                  {/* Inner lotus petals */}
                  <path d="M60 30 Q55 32 52 37 Q55 42 60 40 Q65 42 68 37 Q65 32 60 30" fill="#2c5530" opacity="0.8"/>
                  
                  {/* Human figure - elegant S curve */}
                  <path d="M60 35 Q55 45 60 55 Q65 65 60 75 Q55 85 60 95" stroke="#2c5530" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                  
                  {/* Head */}
                  <circle cx="60" cy="35" r="3.5" fill="#2c5530"/>
                  
                  {/* Arms - graceful curves */}
                  <path d="M60 45 Q50 40 60 35" stroke="#2c5530" stroke-width="2" fill="none" stroke-linecap="round"/>
                  <path d="M60 45 Q70 40 60 35" stroke="#2c5530" stroke-width="2" fill="none" stroke-linecap="round"/>
                  
                  {/* Visible watermarks */}
                  <circle cx="20" cy="20" r="2" fill="#2c5530" opacity="0.5"/>
                  <circle cx="100" cy="30" r="1.5" fill="#2c5530" opacity="0.5"/>
                  <circle cx="15" cy="80" r="1" fill="#2c5530" opacity="0.5"/>
                  <circle cx="105" cy="90" r="2.5" fill="#2c5530" opacity="0.5"/>
                  <circle cx="30" cy="100" r="1.5" fill="#2c5530" opacity="0.5"/>
                  <circle cx="90" cy="15" r="1" fill="#2c5530" opacity="0.5"/>
                  
                  {/* Additional watermark circles */}
                  <circle cx="10" cy="50" r="1.5" fill="#2c5530" opacity="0.5"/>
                  <circle cx="110" cy="60" r="2" fill="#2c5530" opacity="0.5"/>
                  <circle cx="50" cy="10" r="1" fill="#2c5530" opacity="0.5"/>
                  <circle cx="70" cy="110" r="1.5" fill="#2c5530" opacity="0.5"/>
                  
                  {/* Decorative elements */}
                  <path d="M25 25 Q30 30 25 35" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M95 25 Q90 30 95 35" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M25 85 Q30 90 25 95" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M95 85 Q90 90 95 95" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  
                  {/* Additional decorative lines */}
                  <path d="M10 30 Q15 35 10 40" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M110 70 Q105 75 110 80" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M30 10 Q35 15 30 20" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                  <path d="M90 100 Q85 105 90 110" stroke="#2c5530" stroke-width="0.5" fill="none" opacity="0.5"/>
                </svg>
              </div>
              <div className="hero-text">
                <p className="sanskrit-text-small">सर्वे भवन्तु सुखिनः,</p>
                <h1 className="sanskrit-text-large">सर्वे सन्तु निरामयाः</h1>
                <p className="english-translation">May all be happy, may all be free from disease</p>
              </div>
            </div>
            <div className="hero-right">
              <div className="capsule-container">
                <div className="green-capsule">
                  <div className="capsule-gradient"></div>
                </div>
                <div className="vines-flowers">
                  <div className="vine vine-1"></div>
                  <div className="vine vine-2"></div>
                  <div className="flower flower-1">🌸</div>
                  <div className="flower flower-2">🌸</div>
                  <div className="flower flower-3">🌸</div>
                </div>
              </div>
            </div>
          </div>
          <div className="carousel-nav">
            <button className="carousel-arrow carousel-prev">‹</button>
            <button className="carousel-arrow carousel-next">›</button>
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
            <h2 className="section-title">Shop By Categories</h2>
            <p className="section-subtitle">Discover our range of health supplements</p>
          </div>
          <CategoriesSection />
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