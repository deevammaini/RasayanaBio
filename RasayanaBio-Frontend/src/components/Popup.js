// ============================================
// src/components/Popup.js - Custom React Popup Component
// ============================================
import React, { useEffect } from 'react';
import './Popup.css';

const Popup = ({ 
  isOpen, 
  onClose, 
  title = "Notification", 
  message, 
  type = "success", 
  showCloseButton = true,
  autoClose = true,
  autoCloseDelay = 3000 
}) => {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when popup is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when popup is closed
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '✓';
    }
  };

  return (
    <div className="popup-backdrop" onClick={handleBackdropClick}>
      <div className={`popup-container popup-${type}`}>
        <div className="popup-header">
          <div className="popup-icon">
            {getIcon()}
          </div>
          <h3 className="popup-title">{title}</h3>
          {showCloseButton && (
            <button 
              className="popup-close-btn" 
              onClick={onClose}
              aria-label="Close popup"
            >
              ×
            </button>
          )}
        </div>
        <div className="popup-content">
          <p className="popup-message">{message}</p>
        </div>
        <div className="popup-footer">
          <button 
            className="popup-ok-btn" 
            onClick={onClose}
            autoFocus
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
