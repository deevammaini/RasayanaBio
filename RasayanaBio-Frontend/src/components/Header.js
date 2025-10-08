// ============================================
// components/Header.js
// ============================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <div className="logo-icon">
              <svg viewBox="0 0 100 100" className="header-logo">
                {/* Gradient definition */}
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#4a7c59', stopOpacity:1}} />
                    <stop offset="50%" style={{stopColor:'#2c5530', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#1a3d1a', stopOpacity:1}} />
                  </linearGradient>
                  <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
                    <stop offset="100%" style={{stopColor:'#e8f5e8', stopOpacity:1}} />
                  </linearGradient>
                </defs>
                
                {/* Modern hexagonal background */}
                <polygon points="50,5 85,25 85,75 50,95 15,75 15,25" 
                         fill="url(#logoGradient)" 
                         stroke="#ffffff" 
                         stroke-width="2"/>
                
                {/* Central leaf design - more organic and natural */}
                <path d="M50 20 Q40 30 35 45 Q40 60 50 55 Q60 60 65 45 Q60 30 50 20" 
                      fill="url(#leafGradient)" 
                      stroke="#ffffff" 
                      stroke-width="1.5" 
                      stroke-linecap="round" 
                      stroke-linejoin="round"/>
                
                {/* Organic stem */}
                <path d="M50 25 Q48 35 50 45 Q52 55 50 65 Q48 75 50 80" 
                      stroke="#ffffff" 
                      stroke-width="2.5" 
                      stroke-linecap="round"/>
                
                {/* Leaf details - more natural curves */}
                <path d="M45 30 Q42 35 45 40 Q47 45 45 50" 
                      stroke="#ffffff" 
                      stroke-width="1.8" 
                      stroke-linecap="round" 
                      opacity="0.9"/>
                <path d="M55 30 Q58 35 55 40 Q53 45 55 50" 
                      stroke="#ffffff" 
                      stroke-width="1.8" 
                      stroke-linecap="round" 
                      opacity="0.9"/>
                
                {/* Natural accent elements */}
                <circle cx="30" cy="30" r="1.5" fill="#ffffff" opacity="0.6"/>
                <circle cx="70" cy="35" r="1.2" fill="#ffffff" opacity="0.6"/>
                <circle cx="25" cy="65" r="1.8" fill="#ffffff" opacity="0.6"/>
                <circle cx="75" cy="60" r="1.4" fill="#ffffff" opacity="0.6"/>
                
                {/* Inner geometric pattern */}
                <circle cx="50" cy="50" r="25" fill="none" stroke="#ffffff" stroke-width="0.8" opacity="0.3"/>
              </svg>
            </div>
            <div className="logo-text">
              <h1>RasayanaBio</h1>
              <p>Pure. Natural. Effective.</p>
            </div>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <div className="nav-dropdown">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                Shop By Category
                <span className="dropdown-arrow">▼</span>
              </Link>
              <div className="dropdown-content">
                <Link to="/products">All Products</Link>
                <Link to="/products?category=Health Supplements">Health Supplements</Link>
                <Link to="/products?category=Cosmetics">Cosmetics</Link>
                <Link to="/products?category=Honey">Honey</Link>
              </div>
            </div>
            <div className="nav-dropdown">
              <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
                Shop by Health Benefit
                <span className="dropdown-arrow">▼</span>
              </Link>
              <div className="dropdown-content">
                <Link to="/products?benefit=Immunity Booster">Immunity Booster</Link>
                <Link to="/products?benefit=Sleep Support">Sleep Support</Link>
                <Link to="/products?benefit=Stress and Anxiety">Stress and Anxiety</Link>
                <Link to="/products?benefit=Men's Health">Men's Health</Link>
                <Link to="/products?benefit=Women's Health">Women's Health</Link>
                <Link to="/products?benefit=Beauty & Radiance">Beauty & Radiance</Link>
                <Link to="/products?benefit=Healthy Ageing">Healthy Ageing</Link>
                <Link to="/products?benefit=Sports & Fitness">Sports & Fitness</Link>
              </div>
            </div>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
          </nav>

          <div className="header-actions">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile" className="icon-btn">👤</Link>
                <Link to="/orders" className="icon-btn">📦</Link>
                <button onClick={handleLogout} className="btn-logout">Logout</button>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-login">Login</Link>
                <Link to="/register" className="btn-register">Sign Up</Link>
              </>
            )}
            <Link to="/wishlist" className="wishlist-btn">
              ♥
              {wishlistCount > 0 && <span className="wishlist-badge">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="cart-btn">
              🛒
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </Link>
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
