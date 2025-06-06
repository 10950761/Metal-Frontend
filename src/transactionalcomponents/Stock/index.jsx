import React, { useEffect, useState } from "react";
import axios from "axios";
import "./index.css"; 

const Stock = () => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("https://metal-backend-1.onrender.com/api/stock");
        setStock(res.data);
      } catch (err) {
        console.error("Stock fetch error:", err);
        setError("Failed to load stock data");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, []);

  return (
    <div className="stock-container">
      <div className="stock-header">
        <h1 className="stock-title">Stock Levels</h1>
        <div className="stock-summary">
          <span>Total Items: {stock.length}</span>
          <span>Total Quantity: {stock.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Loading stock data...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      ) : (
        <div className="table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((item) => (
                <tr key={item._id}>
                  <td data-label="Product">
                    <div className="product-info">
                      {item.productName}
                    </div>
                  </td>
                  <td data-label="Quantity">
                    <div className="quantity-display">
                      <span>{item.quantity}</span>
                      <div className="quantity-bar" style={{ width: `${Math.min(item.quantity, 100)}%` }}></div>
                    </div>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${
                      item.quantity > 2 ? 'in-stock' : 
                      item.quantity > 1 ? 'low-stock' : 'out-of-stock'
                    }`}>
                      {item.quantity > 2 ? 'In Stock' : 
                       item.quantity > 1 ? 'Low Stock' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Stock;