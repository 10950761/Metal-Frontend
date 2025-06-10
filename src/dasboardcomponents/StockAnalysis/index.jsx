// src/pages/StockAnalysis.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Download, Printer, View } from "lucide-react";
import axios from "axios";
import API_BASE_URL from "../../api/config";
import "./index.css";

const StockAnalysis = () => {
  const [inventory, setInventory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        console.log("First item data:", response.data[0]);
        setInventory(response.data);
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };
    fetchInventory();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "N/A" : date.toISOString().split("T")[0];
  };

  return (
    <div className="stock-analysis-container">
      {/* Header Section */}
      <div className="stock-analysis-header">
        <h1 className="page-title">Stock Analysis</h1>
        
        {/* Search and Filters Section */}
        <div className="filters-section">
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
          
          <div className="filters-row">
            <select
              value={supplierFilter}
              onChange={(e) => setSupplierFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Suppliers</option>
              {/* Add supplier options based on your data */}
            </select>
            
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="filter-select"
            >
              <option value="">All Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button className="action-btn export-btn">
          <Download className="btn-icon" />
          <span className="btn-text">Export</span>
        </button>
        <button className="action-btn print-btn">
          <Printer className="btn-icon" />
          <span className="btn-text">Print</span>
        </button>
        <button 
          className="action-btn view-btn" 
          onClick={() => navigate("/dashboard/stock-charts")}
        >
          <View className="btn-icon" />
          <span className="btn-text">View Charts</span>
        </button>
      </div>

      {/* Results Section */}
      <div className="results-section">
        {filteredInventory.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No Results Found</h3>
            <p>
              {searchTerm
                ? "No matching products found for your search"
                : "No inventory records available"}
            </p>
          </div>
        ) : (
          <>
            <div className="results-header">
              <p className="results-count">
                Showing {filteredInventory.length} product{filteredInventory.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            {/* Desktop Table View */}
            <div className="table-container desktop-table">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Supplier</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, index) => (
                    <tr key={`${item.productName}-${index}`}>
                      <td className="product-cell">
                        <span className="product-name">{item.productName}</span>
                      </td>
                      <td>{item.supplierCompany || "N/A"}</td>
                      <td className="quantity-cell">{item.quantity}</td>
                      <td className="price-cell">GHS {item.unitPrice?.toFixed(2) || "0.00"}</td>
                      <td>
                        <span className={`status-badge ${
                          item.quantity === 0
                            ? "out-of-stock"
                            : item.quantity <= item.lowStockThreshold
                            ? "low-stock"
                            : "in-stock"
                        }`}>
                          {item.quantity === 0
                            ? "Out of Stock"
                            : item.quantity <= item.lowStockThreshold
                            ? "Low Stock"
                            : "In Stock"}
                        </span>
                      </td>
                      <td className="date-cell">
                        {item.lastUpdated ? formatDate(item.lastUpdated) : "N/A"}
                      </td>
                      <td className="actions-cell">
                        <button className="table-btn edit-btn">Edit</button>
                        <button className="table-btn delete-btn">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-cards">
              {filteredInventory.map((item, index) => (
                <div key={`mobile-${item.productName}-${index}`} className="product-card">
                  <div className="card-header">
                    <h3 className="card-title">{item.productName}</h3>
                    <span className={`status-badge ${
                      item.quantity === 0
                        ? "out-of-stock"
                        : item.quantity <= item.lowStockThreshold
                        ? "low-stock"
                        : "in-stock"
                    }`}>
                      {item.quantity === 0
                        ? "Out of Stock"
                        : item.quantity <= item.lowStockThreshold
                        ? "Low Stock"
                        : "In Stock"}
                    </span>
                  </div>
                  
                  <div className="card-content">
                    <div className="card-row">
                      <span className="card-label">Supplier:</span>
                      <span className="card-value">{item.supplierCompany || "N/A"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Quantity:</span>
                      <span className="card-value">{item.quantity}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Unit Price:</span>
                      <span className="card-value">GHS {item.unitPrice?.toFixed(2) || "0.00"}</span>
                    </div>
                    <div className="card-row">
                      <span className="card-label">Last Updated:</span>
                      <span className="card-value">
                        {item.lastUpdated ? formatDate(item.lastUpdated) : "N/A"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="card-actions">
                    <button className="card-btn edit-btn">Edit</button>
                    <button className="card-btn delete-btn">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockAnalysis;