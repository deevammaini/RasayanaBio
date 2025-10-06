// ============================================
// src/components/PopupDemo.js - Demo Component for Popup
// ============================================
import React from 'react';
import { usePopup } from '../context/PopupContext';

const PopupDemo = () => {
  const { showSuccess, showError, showWarning, showInfo } = usePopup();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Popup Demo</h2>
      <p>Click the buttons below to test different popup types:</p>
      
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button 
          onClick={() => showSuccess('Product added to cart successfully!', 'Success')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#10b981', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Show Success Popup
        </button>
        
        <button 
          onClick={() => showError('Failed to add product to cart. Please try again.', 'Error')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Show Error Popup
        </button>
        
        <button 
          onClick={() => showWarning('This product is running low on stock.', 'Warning')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#f59e0b', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Show Warning Popup
        </button>
        
        <button 
          onClick={() => showInfo('Free shipping on orders over ₹1000!', 'Information')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Show Info Popup
        </button>
      </div>
    </div>
  );
};

export default PopupDemo;
