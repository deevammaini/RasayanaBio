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
              <svg viewBox="0 0 120 120" className="header-logo">
                {/* Background watermark circle */}
                <circle cx="60" cy="60" r="55" fill="none" stroke="#2c5530" stroke-width="0.3" opacity="0.5"/>
                
                {/* Outer lotus petals - 6 petals */}
                <path d="M60 10 Q45 20 40 35 Q45 50 60 45 Q75 50 80 35 Q75 20 60 10" fill="#2c5530" opacity="0.3"/>
                <path d="M60 10 Q75 20 80 35 Q75 50 60 45 Q45 50 40 35 Q45 20 60 10" fill="#2c5530" opacity="0.2"/>
                
                {/* Middle lotus petals */}
                <path d="M60 20 Q50 25 45 35 Q50 45 60 40 Q70 45 75 35 Q70 25 60 20" fill="#2c5530" opacity="0.6"/>
                <path d="M60 20 Q70 25 75 35 Q70 45 60 40 Q50 45 45 35 Q50 25 60 20" fill="#2c5530" opacity="0.4"/>
                
                {/* Inner lotus petals */}
                <path d="M60 30 Q55 32 52 37 Q55 42 60 40 Q65 42 68 37 Q65 32 60 30" fill="#2c5530" opacity="0.8"/>
                
                {/* Human figure - elegant S curve */}
                <path d="M60 35 Q55 45 60 55 Q65 65 60 75 Q55 85 60 95" stroke="#2c5530" stroke-width="2" fill="none" stroke-linecap="round"/>
                
                {/* Head */}
                <circle cx="60" cy="35" r="3" fill="#2c5530"/>
                
                {/* Arms - graceful curves */}
                <path d="M60 45 Q50 40 60 35" stroke="#2c5530" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                <path d="M60 45 Q70 40 60 35" stroke="#2c5530" stroke-width="1.5" fill="none" stroke-linecap="round"/>
                
                {/* Visible watermarks */}
                <circle cx="20" cy="20" r="1.5" fill="#2c5530" opacity="0.5"/>
                <circle cx="100" cy="30" r="1" fill="#2c5530" opacity="0.5"/>
                <circle cx="15" cy="80" r="0.8" fill="#2c5530" opacity="0.5"/>
                <circle cx="105" cy="90" r="2" fill="#2c5530" opacity="0.5"/>
                <circle cx="30" cy="100" r="1" fill="#2c5530" opacity="0.5"/>
                <circle cx="90" cy="15" r="0.8" fill="#2c5530" opacity="0.5"/>
                
                {/* Additional watermark circles */}
                <circle cx="10" cy="50" r="1" fill="#2c5530" opacity="0.5"/>
                <circle cx="110" cy="60" r="1.5" fill="#2c5530" opacity="0.5"/>
                <circle cx="50" cy="10" r="0.8" fill="#2c5530" opacity="0.5"/>
                <circle cx="70" cy="110" r="1" fill="#2c5530" opacity="0.5"/>
                
                {/* Decorative elements */}
                <path d="M25 25 Q30 30 25 35" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M95 25 Q90 30 95 35" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M25 85 Q30 90 25 95" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M95 85 Q90 90 95 95" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                
                {/* Additional decorative lines */}
                <path d="M10 30 Q15 35 10 40" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M110 70 Q105 75 110 80" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M30 10 Q35 15 30 20" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
                <path d="M90 100 Q85 105 90 110" stroke="#2c5530" stroke-width="0.3" fill="none" opacity="0.5"/>
              </svg>
            </div>
            <div>
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
