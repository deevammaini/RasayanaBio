import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <span className="logo-icon">🌿</span>
              <div>
                <h3>RasayanaBio</h3>
                <p>Pure. Natural. Effective.</p>
              </div>
            </div>
            <p className="footer-description">
              Premium Ayurvedic supplements crafted with 100% natural ingredients. 
              FDA-approved facility. No synthetic additives.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Categories</h4>
            <ul>
              <li><Link to="/products?category=Ashwagandha">Ashwagandha</Link></li>
              <li><Link to="/products?category=Shilajit">Shilajit</Link></li>
              <li><Link to="/products?category=Female Wellness">Female Wellness</Link></li>
              <li><Link to="/products?category=Hair Care">Hair Care</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📧 info@rasayanabio.com</p>
              <p>📞 +91 98765 43210</p>
              <p>📍 Mumbai, India</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 RasayanaBio. All rights reserved.</p>
          <div className="footer-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
