import React, { useEffect, useState } from "react";
import "./index.css";
import API_BASE_URL from "../../api/config";

const SalesHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/sales?history=true`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Error fetching sales history:", error);
        alert("Failed to load sales history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

  const isDeleted = (item) => item.deleted === true;
  const isDeletedOld = (item) =>
    item.deleted &&
    new Date(item.deletedAt) < new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const isDeletedRecent = (item) =>
    item.deleted &&
    new Date(item.deletedAt) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

  const filteredHistory = history.filter((item) => {
    if (filter === "all") return true;
    if (filter === "recent") {
      return !isDeleted(item) || isDeletedRecent(item);
    }
    if (filter === "old") {
      return isDeletedOld(item);
    }
    return true;
  });

  const oldDeletedSalesCount = history.filter(isDeletedOld).length;

  const handleDeleteOld = async () => {
    if (oldDeletedSalesCount === 0) {
      alert("No old deleted sales to delete permanently.");
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to permanently delete sales deleted over 3 days ago?"
      )
    )
      return;

    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/sales/old`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setHistory((prev) => prev.filter((item) => !isDeletedOld(item)));
        alert("Old deleted sales permanently removed.");
      } else {
        alert("Failed to delete old sales.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error deleting sales.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="sales-history-container">
      <div className="history-header">
        <h1 className="history-title">Sales History</h1>
        <div className="history-controls">
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              All Records
            </button>
            <button
              className={`filter-tab ${filter === "recent" ? "active" : ""}`}
              onClick={() => setFilter("recent")}
            >
              Recent (≤3 days)
            </button>
            <button
              className={`filter-tab ${filter === "old" ? "active" : ""}`}
              onClick={() => setFilter("old")}
            >
              Older (&gt;3 days)
            </button>
          </div>

          <button
            className="delete-button"
            onClick={handleDeleteOld}
            disabled={deleting}
          >
            {deleting ? (
              <span className="button-loading">
                <span className="spinner"></span> Deleting...
              </span>
            ) : (
              "Delete Old History"
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading sales history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="empty-state">
          <p>No sales records found</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Customer</th>
                <th>Contact</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Unit Price (GHS)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((item, idx) => (
                <tr
                  key={idx}
                  className={isDeletedOld(item) ? "old-record" : ""}
                >
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{item.time}</td>
                  <td>{item.customerName}</td>
                  <td>{item.customerNumber}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>{parseFloat(item.price).toFixed(2)}</td>
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

export default SalesHistory;
