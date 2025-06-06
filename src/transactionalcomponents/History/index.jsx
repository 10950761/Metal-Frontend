import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const History = () => {
  return (
    <div className="view-history-container">
      <div className="history-box">
        <div className="history-header">
          <h2 className="history-heading">Transaction History</h2>
          <p className="history-subheading">View your past business transactions</p>
        </div>
        
        <div className="history-buttons">
          <Link to="/dashboard/sales-history" className="button-link">
            <button className="sales-button">
              <span className="button-icon">💰</span>
              <span className="button-text">Sales History</span>
              <span className="button-arrow">→</span>
            </button>
          </Link>

          <Link to="/dashboard/purchase-history" className="button-link">
            <button className="purchase-button">
              <span className="button-icon">🛒</span>
              <span className="button-text">Purchase History</span>
              <span className="button-arrow">→</span>
            </button>
          </Link>
        </div>
        
        <div className="history-footer">
          <p>Need help? <a href="/support" className="help-link">Contact support</a></p>
        </div>
      </div>
    </div>
  );
};

export default History;