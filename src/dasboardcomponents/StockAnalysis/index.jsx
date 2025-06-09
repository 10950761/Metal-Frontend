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
      <div className="filters-container">
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

      <div className="action-buttons">
        <button className="export-button">
          <Download className="button-icon" /> Export
        </button>
        <button className="print-button">
          <Printer className="button-icon" /> Print
        </button>
        <button className="view-button" onClick={() => navigate("/dashboard/stock-charts")}>
          <View className="button-icon" /> Click to View Stock Analysis
        </button>
      </div>

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
                <th>Status</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.productName}>
                  <td>{item.productName}</td>
                  <td>{item.supplierCompany || "N/A"}</td>
                  <td>{item.quantity}</td>
                  <td>GHS {item.unitPrice?.toFixed(2) || "0.00"}</td>
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

export default StockAnalysis;
