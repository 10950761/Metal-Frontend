import React, { useEffect, useState } from 'react';
import './index.css';
import API_BASE_URL from '../../api/config';

const PurchaseHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all'); 
  const isDeleted = (item) => item.deleted === true;

  useEffect(() => {
  const fetchHistory = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/api/purchases?history=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await response.json();
    setHistory(data);
  } catch (error) {
    console.error('Error fetching purchase history:', error);
    alert('Failed to load purchase history.');
  } finally {
    setLoading(false);
  }
};
  fetchHistory();
}, []);


  const isOlderThanThreeDays = (dateStr) => {
    const recordDate = new Date(dateStr);
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    return recordDate < threeDaysAgo;
  };
const handleDeleteOld = async () => {
  if (!window.confirm('Are you sure you want to permanently delete records older than 3 days?')) return;

  setDeleting(true);
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${API_BASE_URL}/api/purchases/old`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      setHistory(prev => prev.filter(item => 
        !item.deleted || new Date(item.deletedAt) >= threeDaysAgo
      ));
      alert('Old records deleted successfully.');
    } else {
      alert('Failed to delete old records.');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    alert('Error deleting records.');
  } finally {
    setDeleting(false);
  }
};

  const filteredHistory = history.filter(item => {
    if (filter === 'recent') return !isOlderThanThreeDays(item.date);
    if (filter === 'old') return isOlderThanThreeDays(item.date);
    return true;
  });

  return (
    <div className="purchase-history-container">
      <div className="history-header">
        <h1 className="history-title">Purchase History</h1>
        
        <div className="history-controls">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All Records
            </button>
            <button 
              className={`filter-tab ${filter === 'recent' ? 'active' : ''}`}
              onClick={() => setFilter('recent')}
            >
              Recent (≤3 days)
            </button>
            <button 
              className={`filter-tab ${filter === 'old' ? 'active' : ''}`}
              onClick={() => setFilter('old')}
            >
              Older ({'>'} 3 days)
            </button>
          </div>
          
          <button 
            className="delete-button"
            onClick={handleDeleteOld}
            disabled={deleting || filteredHistory.length === 0}
          >
            {deleting ? (
              <span className="button-loading">
                <span className="spinner"></span>
                Deleting...
              </span>
            ) : (
              'Delete History'
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading purchase history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-state">
          <p>No purchase records found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Supplier</th>
                <th>Product</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Notes</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, index) => (
                <tr 
                  key={index} 
                  className={isOlderThanThreeDays(item.date) ? 'old-record' : ''}
                >
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.time}</td>
                  <td>{item.supplierName}</td>
                  <td>{item.productName}</td>
                  <td>{item.productQuantity}</td>
                  <td>${parseFloat(item.price).toFixed(2)}</td>
                  <td className="notes-cell">{item.notes || '-'}</td>
                  <td>{isDeleted(item) ? "Deleted" : "Active"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;