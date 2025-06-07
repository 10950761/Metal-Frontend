import React, { useState, useMemo, useEffect } from "react";
import {
  Search,
  Download,
  Printer,
  TrendingUp,
  Package,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import "./index.css";
import axios from "axios";
import API_BASE_URL from "../../api/config";

const StockOverview = () => {
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };
    fetchInventory();
  }, []);


  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
  };

 const summaryStats = useMemo(() => {
  const totalItems = inventory.reduce(
    (sum, item) => sum + Math.max(item.quantity, 0), 
    0
  );
  const totalValue = inventory.reduce(
    (sum, item) => sum + Math.max(item.quantity, 0) * item.unitPrice,
    0
  );
  const lowStockItems = inventory.filter(
    (item) => item.quantity > 0 && item.quantity <= item.lowStockThreshold
  ).length;
  const outOfStockItems = inventory.filter((item) => item.quantity === 0).length;

  return { totalItems, totalValue, lowStockItems, outOfStockItems };
}, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesSupplier = supplierFilter
        ? item.supplier === supplierFilter
        : true;
      const matchesStock =
        stockFilter === "low"
          ? item.quantity <= item.lowStockThreshold && item.quantity > 0
          : stockFilter === "out"
          ? item.quantity === 0
          : true;
      return matchesSearch && matchesSupplier && matchesStock;
    });
  }, [inventory, searchTerm, supplierFilter, stockFilter]);

  return (
    <div className="stock-overview-container">
      {/* Header */}
      <div className="stock-header">
        <h1>Stock Overview</h1>
        <p>Monitor and manage your stock levels</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-container">
        <SummaryCard
          title="Total Items"
          value={summaryStats.totalItems}
          icon={<Package className="summary-icon blue" />}
        />
        <SummaryCard
          title="Total Value"
          value={`GHS ${summaryStats.totalValue.toLocaleString()}`}
          icon={<DollarSign className="summary-icon green" />}
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

      {/* Filters */}
      <div className="filters-container">
        <div className="search-filter">
          <div className="search-input-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="action-buttons">
        <button className="export-button">
          <Download className="button-icon" /> Export
        </button>
        <button className="print-button">
          <Printer className="button-icon" /> Print
        </button>
      </div>

      {/* Inventory Table */}
      {filteredInventory.length === 0 ? (
        <div className="empty-state">
          <p>
            {searchTerm
              ? "No matching products found"
              : "No inventory records available"}
          </p>
        </div>
      ) : (
        <div className="table-container">
          <table className="stock-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Supplier</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.productName}>
                  <td>{item.productName}</td>
                  <td>{item.purchase?.supplierCompany || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>
                    GHS{" "}
                    {item.unitPrice !== undefined && item.unitPrice !== null
                      ? item.unitPrice.toFixed(2)
                      : "0.00"}
                  </td>
                  <td>
                    GHS{" "}
                    {item.unitPrice && item.quantity
                      ? (item.unitPrice * item.quantity).toFixed(2)
                      : "0.00"}
                  </td>

                  <td>
                    {item.quantity === 0
                      ? "Out of Stock"
                      : item.quantity <= item.lowStockThreshold
                      ? "Low Stock"
                      : "In Stock"}
                  </td>
                  <td>
                    {item.lastUpdated ? formatDate(item.lastUpdated) : "N/A"}
                  </td>
                  <td>
                    <button className="edit-btn">Edit</button>
                    <button className="delete-btn">Delete</button>
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

export default StockOverview;
