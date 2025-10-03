import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="not-authenticated">
            <h2>Please log in to view your profile</h2>
            <Link to="/login" className="btn-primary">Login</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="container">
        <h1>My Profile</h1>
        
        <div className="profile-content">
          <div className="profile-info">
            <div className="profile-header">
              <div className="avatar">
                {user.first_name ? user.first_name.charAt(0) : user.email.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <h2>{user.first_name} {user.last_name}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="profile-actions">
              <Link to="/orders" className="profile-action">
                <span className="icon">📦</span>
                <div>
                  <h3>My Orders</h3>
                  <p>View order history</p>
                </div>
              </Link>

              <Link to="/cart" className="profile-action">
                <span className="icon">🛒</span>
                <div>
                  <h3>Shopping Cart</h3>
                  <p>View cart items</p>
                </div>
              </Link>

              <div className="profile-action" onClick={logout}>
                <span className="icon">🚪</span>
                <div>
                  <h3>Logout</h3>
                  <p>Sign out of your account</p>
                </div>
              </div>
            </div>
          </div>

          <div className="profile-stats">
            <h2>Account Information</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Member Since</h3>
                <p>January 2024</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p>0</p>
              </div>
              <div className="stat-card">
                <h3>Favorite Products</h3>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
