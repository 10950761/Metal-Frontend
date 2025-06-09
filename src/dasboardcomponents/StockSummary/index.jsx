import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ChartBarStacked, TrendingUp, AlertTriangle } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../api/config";
import "./index.css";

const StockSummary = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

const summaryStats = useMemo(() => {
  let totalQuantity = 0;
  let totalValue = 0;
  let lowStockItems = 0;
  let outOfStockItems = 0;

  inventory.forEach((item) => {
    const quantity = Math.max(item.quantity || 0, 0);
    const unitPrice = item.unitPrice || 0;

    totalQuantity += quantity;
    totalValue += quantity * unitPrice;

    if (quantity === 0) {
      outOfStockItems++;
    } else if (quantity <= (item.lowStockThreshold || 10)) {
      lowStockItems++;
    }
  });

  return {
    totalItems: inventory.length, 
    totalQuantity,
    totalValue,
    lowStockItems,
    outOfStockItems,
  };
}, [inventory]);

useEffect(() => {
  const fetchInventory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/stock`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Fetched Stock:", response.data);
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching stock:", error.response?.data || error.message);
      setError("Failed to load stock data");
    } finally {
      setLoading(false);
    }
  };
  fetchInventory();
}, []);

if (loading) {
  return <p>Loading stock summary...</p>;
}

if (error) {
  return (
    <div className="error-message">
      <p>{error}</p>
      <button onClick={() => window.location.reload()}>Retry</button>
    </div>
  );
}
  return (
    <div className="stock-overview-container">
      <div className="stock-header">
        <h1>Stock Overview</h1>
        <p>Monitor and manage your stock levels</p>
      </div>

      <div className="summary-cards-container">
        <SummaryCard
          title="Total Items"
          value={summaryStats.totalItems}
          icon={<Package className="summary-icon blue" />}
        />
        <SummaryCard
          title="Total Quantity"
          value={summaryStats.totalQuantity.toFixed(2)} 
          icon={<ChartBarStacked className="summary-icon green" />}
        />
        <SummaryCard
          title="Low Stock"
          value={summaryStats.lowStockItems}
          icon={<TrendingUp className="summary-icon yellow" />}
          color="yellow"
        />
        <SummaryCard
          title="Out of Stock"
          value={summaryStats.outOfStockItems}
          icon={<AlertTriangle className="summary-icon red" />}
          color="red"
        />
      </div>

      <button
        className="view-analysis-btn"
        onClick={() => navigate("/dashboard/stock-analysis")}
      >
        View Stock Analysis
      </button>
    </div>
  );
};

const SummaryCard = ({ title, value, icon, color = "blue" }) => (
  <div className={`summary-card ${color}`}>
    <div className="card-content">
      <div>
        <p className="card-title">{title}</p>
        <p className="card-value">{value}</p>
      </div>
      <div className="card-icon">{icon}</div>
    </div>
  </div>
);

export default StockSummary;
