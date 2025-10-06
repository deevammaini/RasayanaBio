// Simple test to verify currency formatting
import React from 'react';
import { formatPrice } from '../utils/currency';

const TestCurrency = () => {
  return (
    <div style={{ padding: '20px', fontSize: '18px' }}>
      <h2>Currency Test:</h2>
      <p>1199 → {formatPrice(1199)}</p>
      <p>840 → {formatPrice(840)}</p>
      <p>1099 → {formatPrice(1099)}</p>
      <p>800 → {formatPrice(800)}</p>
    </div>
  );
};

export default TestCurrency;
