import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import API_BASE_URL from "../../api/config";
import './index.css';


const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const PurchaseAnalysis = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [analytics, setAnalytics] = useState({
    totalPurchases: 0,
    totalAmount: 0,
    avgPurchaseValue: 0,
    uniqueSuppliers: 0,
    topProduct: "",
    topSupplier: ""
  });

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Session expired. Please log in.");
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
      return;
    }
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/purchases`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setPurchases(data);
        calculateAnalytics(data);
      } else {
        setError("Failed to fetch purchase data");
      }
    } catch (error) {
      console.error("Error fetching purchases:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    if (!data || data.length === 0) {
      setAnalytics({
        totalPurchases: 0,
        totalAmount: 0,
        avgPurchaseValue: 0,
        uniqueSuppliers: 0,
        topProduct: "N/A",
        topSupplier: "N/A"
      });
      return;
    }

    const totalAmount = data.reduce((sum, purchase) => sum + Number(purchase.price), 0);
    const uniqueSuppliers = new Set(data.map(p => p.supplierName)).size;
    
    // Find top product by frequency
    const productCounts = {};
    data.forEach(p => {
      productCounts[p.productName] = (productCounts[p.productName] || 0) + 1;
    });
    const topProduct = Object.keys(productCounts).reduce((a, b) => productCounts[a] > productCounts[b] ? a : b, "N/A");
    
    // Find top supplier by total amount
    const supplierTotals = {};
    data.forEach(p => {
      supplierTotals[p.supplierName] = (supplierTotals[p.supplierName] || 0) + Number(p.price);
    });
    const topSupplier = Object.keys(supplierTotals).reduce((a, b) => supplierTotals[a] > supplierTotals[b] ? a : b, "N/A");

    setAnalytics({
      totalPurchases: data.length,
      totalAmount: totalAmount,
      avgPurchaseValue: totalAmount / data.length,
      uniqueSuppliers: uniqueSuppliers,
      topProduct: topProduct,
      topSupplier: topSupplier
    });
  };

  const filterPurchasesByDate = () => {
    if (!dateRange.startDate || !dateRange.endDate) return purchases;
    
    return purchases.filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return purchaseDate >= start && purchaseDate <= end;
    });
  };

  const getMonthlyData = () => {
    const filteredPurchases = filterPurchasesByDate();
    const monthlyData = {};
    
    filteredPurchases.forEach(purchase => {
      const date = new Date(purchase.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, totalAmount: 0, count: 0 };
      }
      
      monthlyData[monthKey].totalAmount += Number(purchase.price);
      monthlyData[monthKey].count += 1;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getSupplierData = () => {
    const filteredPurchases = filterPurchasesByDate();
    const supplierData = {};
    
    filteredPurchases.forEach(purchase => {
      if (!supplierData[purchase.supplierName]) {
        supplierData[purchase.supplierName] = { name: purchase.supplierName, amount: 0, count: 0 };
      }
      
      supplierData[purchase.supplierName].amount += Number(purchase.price);
      supplierData[purchase.supplierName].count += 1;
    });
    
    return Object.values(supplierData)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 suppliers
  };

  const getProductData = () => {
    const filteredPurchases = filterPurchasesByDate();
    const productData = {};
    
    filteredPurchases.forEach(purchase => {
      if (!productData[purchase.productName]) {
        productData[purchase.productName] = { name: purchase.productName, quantity: 0, amount: 0 };
      }
      
      productData[purchase.productName].quantity += Number(purchase.productQuantity);
      productData[purchase.productName].amount += Number(purchase.price);
    });
    
    return Object.values(productData)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 6); // Top 6 products
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearDateFilter = () => {
    setDateRange({ startDate: "", endDate: "" });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading purchase analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <div className="error-message">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredPurchases = filterPurchasesByDate();
  const monthlyData = getMonthlyData();
  const supplierData = getSupplierData();
  const productData = getProductData();

  return (
    <div className="purchase-analytics-container">
      <div className="main-content">
        <h1 className="dashboard-title">Purchase Analytics Overview</h1>
        
        {/* Date Range Filter */}
        <div className="filter-section">
          <h3 className="section-title">Filter by Date Range</h3>
          <div className="filter-controls">
            <div className="filter-input-group">
              <label className="filter-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={dateRange.startDate}
                onChange={handleDateRangeChange}
                className="date-input"
              />
            </div>
            <div className="filter-input-group">
              <label className="filter-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={dateRange.endDate}
                onChange={handleDateRangeChange}
                className="date-input"
              />
            </div>
            <button
              onClick={clearDateFilter}
              className="clear-filter-button"
            >
              Clear Filter
            </button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="metrics-grid">
          <div className="metric-card">
            <h3 className="metric-title">Total Purchases</h3>
            <p className="metric-value">{filteredPurchases.length}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Total Amount</h3>
            <p className="metric-value amount-value">
              ₵{filteredPurchases.reduce((sum, p) => sum + Number(p.price), 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Avg Purchase</h3>
            <p className="metric-value avg-value">
              ₵{filteredPurchases.length > 0 ? (filteredPurchases.reduce((sum, p) => sum + Number(p.price), 0) / filteredPurchases.length).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Unique Suppliers</h3>
            <p className="metric-value unique-value">
              {new Set(filteredPurchases.map(p => p.supplierName)).size}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Top Product</h3>
            <p className="metric-text" title={analytics.topProduct}>
              {analytics.topProduct}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Top Supplier</h3>
            <p className="metric-text" title={analytics.topSupplier}>
              {analytics.topSupplier}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Monthly Trends */}
          <div className="chart-container">
            <h3 className="chart-title">Monthly Purchase Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'totalAmount' ? `₵${value.toLocaleString()}` : value,
                  name === 'totalAmount' ? 'Total Amount' : 'Purchase Count'
                ]} />
                <Legend />
                <Line type="monotone" dataKey="totalAmount" stroke="#8884d8" name="Total Amount" />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Purchase Count" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Suppliers */}
          <div className="chart-container">
            <h3 className="chart-title">Top Suppliers by Amount</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplierData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Amount']} />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Analysis */}
        <div className="charts-grid">
          {/* Top Products Bar Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Top Products by Value</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Value']} />
                <Bar dataKey="amount" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Supplier Distribution Pie Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Supplier Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={supplierData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {supplierData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Amount']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Purchases Table */}
        <div className="recent-purchases-container">
          <div className="purchases-header">
            <h3 className="purchases-title">Recent Purchases</h3>
          </div>
          <div className="table-container">
            <table className="purchases-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Supplier</th>
                  <th className="table-header-cell">Product</th>
                  <th className="table-header-cell">Quantity</th>
                  <th className="table-header-cell">Price</th>
                  <th className="table-header-cell">Location</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredPurchases.slice(0, 10).map((purchase, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">
                      {new Date(purchase.date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      {purchase.supplierName}
                    </td>
                    <td className="table-cell">
                      {purchase.productName}
                    </td>
                    <td className="table-cell">
                      {purchase.productQuantity}
                    </td>
                    <td className="table-cell amount-cell">
                      ₵{Number(purchase.price).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="table-cell">
                      {purchase.supplierLocation}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredPurchases.length === 0 && (
            <div className="no-purchases-message">
              No purchases found for the selected date range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchaseAnalysis;