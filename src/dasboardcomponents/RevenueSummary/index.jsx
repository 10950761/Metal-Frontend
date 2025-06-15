import React, { useEffect, useState } from "react";
import "./index.css";

const RevenueSummary = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedRevenue, setAnimatedRevenue] = useState(0);

  // Simulate API data loading
  useEffect(() => {
    // Simulate API call delay
    setTimeout(() => {
      setTotalRevenue(847350);
      setMonthlyRevenue({
        "January": 65000,
        "February": 72000,
        "March": 68000,
        "April": 78000,
        "May": 85000,
        "June": 92000,
        "July": 88000,
        "August": 95000,
        "September": 102000,
        "October": 98000,
        "November": 108000,
        "December": 115000
      });
      setTopProducts([
        { name: "Steel Fabrication", revenue: 324580 },
        { name: "Aluminum Works", revenue: 198450 },
        { name: "Welding Services", revenue: 156780 },
        { name: "Custom Orders", revenue: 89340 },
        { name: "Maintenance", revenue: 78200 }
      ]);
      setRecentSales([
        { productName: "Steel Beam Structure", total: 15500, date: "2024-12-10" },
        { productName: "Aluminum Window Frames", total: 8200, date: "2024-12-09" },
        { productName: "Welding Repairs", total: 3400, date: "2024-12-08" },
        { productName: "Custom Gate", total: 12000, date: "2024-12-07" },
        { productName: "Steel Railings", total: 6800, date: "2024-12-06" },
        { productName: "Aluminum Doors", total: 9500, date: "2024-12-05" },
        { productName: "Equipment Maintenance", total: 2200, date: "2024-12-04" }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Animate total revenue counter
  useEffect(() => {
    if (totalRevenue > 0) {
      const duration = 2000;
      const steps = 60;
      const increment = totalRevenue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= totalRevenue) {
          current = totalRevenue;
          clearInterval(timer);
        }
        setAnimatedRevenue(Math.floor(current));
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [totalRevenue]);

  const getMonthlyChange = (month, index, monthlyData) => {
    if (index === 0) return null;
    const currentMonth = monthlyData[Object.keys(monthlyData)[index]];
    const previousMonth = monthlyData[Object.keys(monthlyData)[index - 1]];
    const change = ((currentMonth - previousMonth) / previousMonth) * 100;
    return change;
  };

  const formatCurrency = (amount) => {
    return `GH₵ ${amount.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading revenue data...</p>
      </div>
    );
  }

  return (
    <div className="revenue-summary">
      <div className="container">
        {/* Header */}
        <div className="header">
          <h2>📈 Revenue Summary</h2>
          <p>MetalShop Pro - Financial Overview</p>
        </div>

        {/* Total Revenue Highlight */}
        <div className="total-revenue-card">
          <h3>Total Revenue</h3>
          <div className="revenue-amount">
            {formatCurrency(animatedRevenue)}
          </div>
          <div className="growth-indicator">
            ↗ +18.5% from last year
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid">
          {/* Monthly Revenue */}
          <div className="monthly-section">
            <h3>📅 Monthly Revenue</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {Object.entries(monthlyRevenue).map(([month, amount], index) => {
                const change = getMonthlyChange(month, index, monthlyRevenue);
                return (
                  <div key={month} className="month-row">
                    <div>
                      <strong>{month}</strong>
                    </div>
                    <div>
                      <div>{formatCurrency(amount)}</div>
                      {change !== null && (
                        <div className={`change ${change >= 0 ? 'up' : 'down'}`}>
                          {change >= 0 ? '↗' : '↘'} {Math.abs(change).toFixed(1)}%
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Products */}
          <div className="top-products">
            <h3>🏆 Top Products</h3>
            <div>
              {topProducts.map((product, index) => {
                const percentage = ((product.revenue / totalRevenue) * 100).toFixed(1);
                
                return (
                  <div key={index} className="product-row">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div className="product-rank">
                        {index + 1}
                      </div>
                      <div className="product-info">
                        <div><strong>{product.name}</strong></div>
                        <div style={{ fontSize: '14px', color: '#666' }}>{percentage}% of total</div>
                      </div>
                    </div>
                    <div>
                      <strong>{formatCurrency(product.revenue)}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Sales */}
        <div className="recent-sales">
          <h3>💰 Recent Sales</h3>
          <div className="sales-grid">
            {recentSales.slice(0, 6).map((sale, index) => (
              <div key={index} className="sale-card">
                <div className="sale-header">
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>
                    {sale.productName}
                  </h4>
                  <span className="sale-badge">New</span>
                </div>
                <div className="sale-body">
                  <span>{formatCurrency(sale.total)}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {new Date(sale.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {recentSales.length > 6 && (
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <button style={{
                padding: '12px 24px',
                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}>
                View All Sales
              </button>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="quick-stats">
          <div className="stat-box">
            <div style={{ color: '#2563eb' }}>1,247</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Total Puchase</div>
          </div>
          <div className="stat-box">
            <div style={{ color: '#7c3aed' }}>GH₵ 679</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Average Puchase</div>
          </div>
          <div className="stat-box">
            <div style={{ color: '#16a34a' }}>94.5%</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Success Rate</div>
          </div>
          <div className="stat-box">
            <div style={{ color: '#ea580c' }}>156</div>
            <div style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Active Cutomer</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;