import React, { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, AreaChart, Area
} from 'recharts';
import './index.css'; 
import API_BASE_URL from "../../api/config";


const RevenueSummary = () => {
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

  const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesRes, purchasesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/sales`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/api/purchases`, { headers: getAuthHeaders() }),
        ]);

        if (!salesRes.ok || !purchasesRes.ok) throw new Error('API fetch failed');

        const [salesData, purchasesData] = await Promise.all([
          salesRes.json(), purchasesRes.json()
        ]);

        setSales(salesData);
        setPurchases(purchasesData);
      } catch (err) {
        setError("Failed to load sales or purchases.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filterDataByDate = (data) => {
    if (!dateRange.startDate || !dateRange.endDate) return data;

    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  };

  const revenueSummary = (() => {
    const filteredSales = filterDataByDate(sales);
    const filteredPurchases = filterDataByDate(purchases);

    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.price, 0);
    const totalCosts = filteredPurchases.reduce((sum, purchase) => sum + purchase.price, 0);
    const grossProfit = totalRevenue - totalCosts;
    const profitMargin = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      totalRevenue,
      totalCosts,
      grossProfit,
      profitMargin,
      totalSales: filteredSales.length,
      totalPurchases: filteredPurchases.length
    };
  })();

  const monthlyComparison = (() => {
    const filteredSales = filterDataByDate(sales);
    const filteredPurchases = filterDataByDate(purchases);
    const data = {};

    filteredSales.forEach(({ date, price }) => {
      const key = date.slice(0, 7); 
      if (!data[key]) data[key] = { month: key, revenue: 0, costs: 0, profit: 0 };
      data[key].revenue += price ;
    });

    filteredPurchases.forEach(({ date, price }) => {
      const key = date.slice(0, 7);
      if (!data[key]) data[key] = { month: key, revenue: 0, costs: 0, profit: 0 };
      data[key].costs += price;
    });

    Object.keys(data).forEach(k => {
      data[k].profit = data[k].revenue - data[k].costs;
    });

    return Object.values(data).sort((a, b) => a.month.localeCompare(b.month));
  })();

  const topCustomers = (() => {
    const customers = {};
    filterDataByDate(sales).forEach(sale => {
      const rev = sale.price;
      customers[sale.customerName] = (customers[sale.customerName] || 0) + rev;
    });

    return Object.entries(customers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  })();

  const topSuppliers = (() => {
    const suppliers = {};
    filterDataByDate(purchases).forEach(p => {
      suppliers[p.supplierName] = (suppliers[p.supplierName] || 0) + p.price;
    });

    return Object.entries(suppliers)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  })();

  const handleDateChange = e => {
    const { name, value } = e.target;
    setDateRange(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="loading">Loading revenue summary...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="revenue-summary-container">
      <h1 className="summary-title">Revenue Summary</h1>

      <div className="filter-date">
        <label>
          Start Date:
          <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateChange} />
        </label>
        <label>
          End Date:
          <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateChange} />
        </label>
        <button onClick={() => setDateRange({ startDate: "", endDate: "" })}>Clear</button>
      </div>

      <div className="summary-metrics">
        <div className="card">Total Revenue: ₵{revenueSummary.totalRevenue.toFixed(2)}</div>
        <div className="card">Total Costs: ₵{revenueSummary.totalCosts.toFixed(2)}</div>
        <div className="card">Profit: ₵{revenueSummary.grossProfit.toFixed(2)}</div>
        <div className="card">Margin: {revenueSummary.profitMargin.toFixed(1)}%</div>
        <div className="card">Sales: {revenueSummary.totalSales}</div>
        <div className="card">Purchases: {revenueSummary.totalPurchases}</div>
      </div>

      <div className="charts">
        <div className="chart">
          <h2>Monthly Revenue vs Costs</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area dataKey="revenue" stroke="#10B981" fill="#10B981" />
              <Area dataKey="costs" stroke="#EF4444" fill="#EF4444" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Monthly Profit</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="profit" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Top Customers</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topCustomers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Top Suppliers</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSuppliers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart">
          <h2>Revenue Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Revenue', value: revenueSummary.totalRevenue },
                  { name: 'Costs', value: revenueSummary.totalCosts }
                ]}
                cx="50%" cy="50%" outerRadius={100}
                label={({ name, value }) => `${name}: ₵${value.toFixed(0)}`}
                dataKey="value"
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RevenueSummary;
