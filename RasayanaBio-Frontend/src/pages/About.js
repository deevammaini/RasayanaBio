import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="hero-section">
          <h1>About RasayanaBio</h1>
          <p className="hero-subtitle">
            Pioneering the future of natural wellness through ancient wisdom and modern science
          </p>
        </div>

        <div className="about-content">
          <section className="story-section">
            <div className="content-grid">
              <div className="text-content">
                <h2>Our Story</h2>
                <p>
                  Founded with a vision to bridge the gap between traditional Ayurvedic wisdom and modern scientific research, 
                  RasayanaBio has been at the forefront of natural wellness solutions. Our journey began with a simple belief: 
                  that nature holds the key to optimal health and vitality.
                </p>
                <p>
                  Today, we combine centuries-old Ayurvedic knowledge with cutting-edge research to create premium supplements 
                  that deliver real results. Every product in our range is carefully formulated using only the finest natural 
                  ingredients, sourced from trusted suppliers who share our commitment to quality and sustainability.
                </p>
              </div>
              <div className="image-content">
                <img 
                  src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600" 
                  alt="Natural ingredients" 
                />
              </div>
            </div>
          </section>

          <section className="values-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <div className="value-icon">🌿</div>
                <h3>100% Natural</h3>
                <p>We use only pure, natural ingredients without any synthetic additives or harmful chemicals.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🔬</div>
                <h3>Science-Backed</h3>
                <p>Our formulations are supported by scientific research and traditional Ayurvedic knowledge.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🏆</div>
                <h3>Quality Assured</h3>
                <p>Manufactured in FDA-approved facilities with strict quality control measures.</p>
              </div>
              <div className="value-card">
                <div className="value-icon">🌍</div>
                <h3>Sustainable</h3>
                <p>Committed to sustainable practices and environmental responsibility.</p>
              </div>
            </div>
          </section>

          <section className="mission-section">
            <div className="content-grid reverse">
              <div className="text-content">
                <h2>Our Mission</h2>
                <p>
                  To empower individuals on their wellness journey by providing access to premium, natural supplements 
                  that enhance health, vitality, and overall well-being. We believe that everyone deserves access to 
                  high-quality, scientifically-backed natural health solutions.
                </p>
                <p>
                  Our commitment extends beyond just selling products. We're dedicated to educating our customers about 
                  the benefits of natural wellness and supporting them every step of their health journey.
                </p>
              </div>
              <div className="image-content">
                <img 
                  src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600" 
                  alt="Wellness journey" 
                />
              </div>
            </div>
          </section>

          <section className="team-section">
            <h2>Why Choose RasayanaBio?</h2>
            <div className="features-grid">
              <div className="feature-item">
                <h3>Premium Ingredients</h3>
                <p>Sourced from the finest suppliers worldwide, ensuring the highest quality and potency.</p>
              </div>
              <div className="feature-item">
                <h3>Expert Formulation</h3>
                <p>Developed by Ayurvedic experts and nutritionists with decades of experience.</p>
              </div>
              <div className="feature-item">
                <h3>Third-Party Testing</h3>
                <p>All products undergo rigorous third-party testing for purity and potency.</p>
              </div>
              <div className="feature-item">
                <h3>Customer Support</h3>
                <p>Dedicated customer service team to support your wellness journey.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
