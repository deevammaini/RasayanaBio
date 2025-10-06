/**
 * Currency formatting utilities for Indian Rupees
 * Using proper Indian Rupee symbol and formatting
 */

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatPrice = (amount) => {
  // Format with Indian number system (lakhs, crores)
  // Force Indian Rupee symbol and formatting
  if (typeof amount !== 'number') {
    amount = parseFloat(amount) || 0;
  }
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPriceWithDecimals = (amount) => {
  return `₹${amount.toLocaleString('en-IN', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

export const formatPriceCompact = (amount) => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)}L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return formatPrice(amount);
};
