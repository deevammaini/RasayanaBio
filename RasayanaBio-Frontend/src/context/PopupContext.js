// ============================================
// src/context/PopupContext.js - Popup Context
// ============================================
import React, { createContext, useState, useContext } from 'react';
import Popup from '../components/Popup';

const PopupContext = createContext();

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

export const PopupProvider = ({ children }) => {
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'success',
    showCloseButton: true,
    autoClose: true,
    autoCloseDelay: 3000,
    onOkClick: null
  });

  const showPopup = ({
    title = 'Notification',
    message,
    type = 'success',
    showCloseButton = true,
    autoClose = true,
    autoCloseDelay = 3000,
    onOkClick = null
  }) => {
    setPopup({
      isOpen: true,
      title,
      message,
      type,
      showCloseButton,
      autoClose,
      autoCloseDelay,
      onOkClick
    });
  };

  const hidePopup = () => {
    setPopup(prev => ({ ...prev, isOpen: false }));
  };

  // Convenience methods for different popup types
  const showSuccess = (message, title = 'Success', onOkClick = null) => {
    showPopup({ title, message, type: 'success', onOkClick });
  };

  const showError = (message, title = 'Error') => {
    showPopup({ title, message, type: 'error', autoClose: false });
  };

  const showWarning = (message, title = 'Warning') => {
    showPopup({ title, message, type: 'warning' });
  };

  const showInfo = (message, title = 'Information') => {
    showPopup({ title, message, type: 'info' });
  };

  const value = {
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };

  return (
    <PopupContext.Provider value={value}>
      {children}
      <Popup
        isOpen={popup.isOpen}
        onClose={hidePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
        showCloseButton={popup.showCloseButton}
        autoClose={popup.autoClose}
        autoCloseDelay={popup.autoCloseDelay}
        onOkClick={popup.onOkClick}
      />
    </PopupContext.Provider>
  );
};
