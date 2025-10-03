// ============================================
// components/Header.js
// ============================================
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { cartCount } = useCart();
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
            <span className="logo-icon">🌿</span>
            <div>
              <h1>RasayanaBio</h1>
              <p>Pure. Natural. Effective.</p>
            </div>
          </Link>

          <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>Products</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
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
