import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import API_BASE_URL from "../../api/config";
import './index.css';

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const SalesAnalysis = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [analytics, setAnalytics] = useState({
    totalSales: 0,
    totalRevenue: 0,
    avgSaleValue: 0,
    uniqueCustomers: 0,
    topProduct: "",
    topCustomer: ""
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
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/sales`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setSales(data);
        calculateAnalytics(data);
      } else {
        setError("Failed to fetch sales data");
      }
    } catch (error) {
      console.error("Error fetching sales:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = (data) => {
    if (!data || data.length === 0) {
      setAnalytics({
        totalSales: 0,
        totalRevenue: 0,
        avgSaleValue: 0,
        uniqueCustomers: 0,
        topProduct: "N/A",
        topCustomer: "N/A"
      });
      return;
    }

    const totalRevenue = data.reduce((sum, sale) => sum + (Number(sale.price) * Number(sale.quantity)), 0);
    const uniqueCustomers = new Set(data.map(s => s.customerName)).size;
    
    // Find top product by revenue
    const productRevenue = {};
    data.forEach(s => {
      const revenue = Number(s.price) * Number(s.quantity);
      productRevenue[s.productName] = (productRevenue[s.productName] || 0) + revenue;
    });
    const topProduct = Object.keys(productRevenue).reduce((a, b) => productRevenue[a] > productRevenue[b] ? a : b, "N/A");
    
    // Find top customer by total revenue
    const customerRevenue = {};
    data.forEach(s => {
      const revenue = Number(s.price) * Number(s.quantity);
      customerRevenue[s.customerName] = (customerRevenue[s.customerName] || 0) + revenue;
    });
    const topCustomer = Object.keys(customerRevenue).reduce((a, b) => customerRevenue[a] > customerRevenue[b] ? a : b, "N/A");

    setAnalytics({
      totalSales: data.length,
      totalRevenue: totalRevenue,
      avgSaleValue: totalRevenue / data.length,
      uniqueCustomers: uniqueCustomers,
      topProduct: topProduct,
      topCustomer: topCustomer
    });
  };

  const filterSalesByDate = () => {
    if (!dateRange.startDate || !dateRange.endDate) return sales;
    
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      return saleDate >= start && saleDate <= end;
    });
  };

  const getMonthlyData = () => {
    const filteredSales = filterSalesByDate();
    const monthlyData = {};
    
    filteredSales.forEach(sale => {
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { month: monthKey, totalRevenue: 0, count: 0 };
      }
      
      const revenue = Number(sale.price) * Number(sale.quantity);
      monthlyData[monthKey].totalRevenue += revenue;
      monthlyData[monthKey].count += 1;
    });
    
    return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
  };

  const getCustomerData = () => {
    const filteredSales = filterSalesByDate();
    const customerData = {};
    
    filteredSales.forEach(sale => {
      const revenue = Number(sale.price) * Number(sale.quantity);
      if (!customerData[sale.customerName]) {
        customerData[sale.customerName] = { name: sale.customerName, revenue: 0, count: 0 };
      }
      
      customerData[sale.customerName].revenue += revenue;
      customerData[sale.customerName].count += 1;
    });
    
    return Object.values(customerData)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 6); // Top 6 customers
  };

  const getProductData = () => {
    const filteredSales = filterSalesByDate();
    const productData = {};
    
    filteredSales.forEach(sale => {
      const revenue = Number(sale.price) * Number(sale.quantity);
      if (!productData[sale.productName]) {
        productData[sale.productName] = { name: sale.productName, quantity: 0, revenue: 0 };
      }
      
      productData[sale.productName].quantity += Number(sale.quantity);
      productData[sale.productName].revenue += revenue;
    });
    
    return Object.values(productData)
      .sort((a, b) => b.revenue - a.revenue)
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
        <div className="loading-text">Loading sales analytics...</div>
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

  const filteredSales = filterSalesByDate();
  const monthlyData = getMonthlyData();
  const customerData = getCustomerData();
  const productData = getProductData();

  return (
    <div className="purchase-analytics-container">
      <div className="main-content">
        <h1 className="dashboard-title">Sales Analytics Overview</h1>
        
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
            <h3 className="metric-title">Total Sales</h3>
            <p className="metric-value">{filteredSales.length}</p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Total Revenue</h3>
            <p className="metric-value amount-value">
              ₵{filteredSales.reduce((sum, s) => sum + (Number(s.price) * Number(s.quantity)), 0).toLocaleString('en-US', {minimumFractionDigits: 2})}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Avg Sale Value</h3>
            <p className="metric-value avg-value">
              ₵{filteredSales.length > 0 ? (filteredSales.reduce((sum, s) => sum + (Number(s.price) * Number(s.quantity)), 0) / filteredSales.length).toLocaleString('en-US', {minimumFractionDigits: 2}) : '0.00'}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Unique Customers</h3>
            <p className="metric-value unique-value">
              {new Set(filteredSales.map(s => s.customerName)).size}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Top Product</h3>
            <p className="metric-text" title={analytics.topProduct}>
              {analytics.topProduct}
            </p>
          </div>
          <div className="metric-card">
            <h3 className="metric-title">Top Customer</h3>
            <p className="metric-text" title={analytics.topCustomer}>
              {analytics.topCustomer}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-grid">
          {/* Monthly Trends */}
          <div className="chart-container">
            <h3 className="chart-title">Monthly Sales Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'totalRevenue' ? `₵${value.toLocaleString()}` : value,
                  name === 'totalRevenue' ? 'Total Revenue' : 'Sales Count'
                ]} />
                <Legend />
                <Line type="monotone" dataKey="totalRevenue" stroke="#8884d8" name="Total Revenue" />
                <Line type="monotone" dataKey="count" stroke="#82ca9d" name="Sales Count" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Customers */}
          <div className="chart-container">
            <h3 className="chart-title">Top Customers by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={customerData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Revenue']} />
                <Bar dataKey="revenue" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Analysis */}
        <div className="charts-grid">
          {/* Top Products Bar Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Top Products by Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Revenue']} />
                <Bar dataKey="revenue" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Customer Distribution Pie Chart */}
          <div className="chart-container">
            <h3 className="chart-title">Customer Revenue Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`₵${value.toLocaleString()}`, 'Total Revenue']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Sales Table */}
        <div className="recent-purchases-container">
          <div className="purchases-header">
            <h3 className="purchases-title">Recent Sales</h3>
          </div>
          <div className="table-container">
            <table className="purchases-table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Date</th>
                  <th className="table-header-cell">Time</th>
                  <th className="table-header-cell">Customer</th>
                  <th className="table-header-cell">Product</th>
                  <th className="table-header-cell">Quantity</th>
                  <th className="table-header-cell">Unit Price</th>
                  <th className="table-header-cell">Total</th>
                  <th className="table-header-cell">Phone</th>
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredSales.slice(0, 10).map((sale, index) => (
                  <tr key={index} className="table-row">
                    <td className="table-cell">
                      {new Date(sale.date).toLocaleDateString()}
                    </td>
                    <td className="table-cell">
                      {sale.time}
                    </td>
                    <td className="table-cell">
                      {sale.customerName}
                    </td>
                    <td className="table-cell">
                      {sale.productName}
                    </td>
                    <td className="table-cell">
                      {sale.quantity}
                    </td>
                    <td className="table-cell amount-cell">
                      ₵{Number(sale.price).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="table-cell amount-cell">
                      ₵{(Number(sale.price) * Number(sale.quantity)).toLocaleString('en-US', {minimumFractionDigits: 2})}
                    </td>
                    <td className="table-cell">
                      {sale.customerNumber}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredSales.length === 0 && (
            <div className="no-purchases-message">
              No sales found for the selected date range.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesAnalysis;