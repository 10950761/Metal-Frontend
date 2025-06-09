// src/pages/StockCharts.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../api/config";
import "./index.css";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  Legend,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#d0ed57"];

const StockCharts = () => {
  const [stockData, setStockData] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/stock`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const transformedData = response.data.map((item) => ({
          name: item.productName,
          quantity: item.quantity,
        }));
        setStockData(transformedData);
      } catch (error) {
        console.error("Error fetching stock:", error);
      }
    };

    fetchStock();
  }, []);

  return (
    <div className="charts-container">
      <h2>Stock Visualization</h2>

      {/* Bar Chart */}
      <div className="chart-section">
        <h3>Bar Chart - Product Quantity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      <div className="chart-section">
        <h3>Line Chart - Product Quantity</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="quantity" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart */}
      <div className="chart-section">
        <h3>Pie Chart - Product Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={stockData}
              dataKey="quantity"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {stockData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StockCharts;
;
