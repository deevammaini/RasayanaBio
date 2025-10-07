// ============================================
// pages/Products.js
// ============================================
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [category, search, page]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      params.append('page', page);
      params.append('per_page', 12);

      const response = await axios.get(`http://localhost:4000/api/products?${params}`);
      setProducts(response.data.products);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1>Our Products</h1>
        
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchSubmit(e)}
            />
            <button onClick={handleSearchSubmit}>🔍</button>
          </div>

          <select 
            value={category} 
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="category-filter"
          >
            <option value="">All Categories</option>
            <option value="Ashwagandha">Ashwagandha</option>
            <option value="Shilajit">Shilajit</option>
            <option value="Female Wellness">Female Wellness</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Ayurvedic">Ayurvedic</option>
            <option value="Collagen">Collagen</option>
          </select>
        </div>

        {loading ? (
          <div className="loading">Loading products...</div>
        ) : (
          <>
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </button>
                <span>Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
