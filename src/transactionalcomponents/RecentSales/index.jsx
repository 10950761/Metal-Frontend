import React, { useEffect, useState } from "react";
import "./index.css";

const RecentSales = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sales");
      const data = await res.json();
      setSales(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sales:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;
    try {
      await fetch(`http://localhost:5000/api/sales/${id}`, {
        method: "DELETE",
      });
      setSales(sales.filter((sale) => sale._id !== id));
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  const handleEdit = (sale) => {
    setEditingSale({ ...sale });
  };

  const handleUpdate = async () => {
    try {
      await fetch(`https://metal-backend-1.onrender.com/api/sales/${editingSale._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSale),
      });
      setEditingSale(null);
      fetchSales();
    } catch (error) {
      console.error("Error updating sale:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingSale({ ...editingSale, [name]: value });
  };

  const filteredSales = sales.filter(sale =>
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="recent-sales-container">
      <div className="sales-header">
        <h2 className="sales-title">Recent Sales</h2>
        <div className="sales-controls">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search sales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading sales data...</p>
        </div>
      ) : filteredSales.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? "No matching sales found" : "No sales recorded yet"}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="sales-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Product</th>
                <th>Price (GHS)</th>
                <th>Qty</th>
                <th>Total (GHS)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr key={sale._id} className={editingSale?._id === sale._id ? "editing-row" : ""}>
                  {editingSale?._id === sale._id ? (
                    <>
                      <td>
                        <input
                          name="customerName"
                          value={editingSale.customerName}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="customerNumber"
                          value={editingSale.customerNumber}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>
                        <input
                          name="productName"
                          value={editingSale.productName}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="price"
                          type="number"
                          value={editingSale.price}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="quantity"
                          type="number"
                          value={editingSale.quantity}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        {(editingSale.price * editingSale.quantity).toFixed(2)}
                      </td>
                      <td className="action-buttons">
                        <button onClick={handleUpdate} className="save-btn">
                          Save
                        </button>
                        <button 
                          onClick={() => setEditingSale(null)} 
                          className="cancel-btn"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{sale.customerName}</td>
                      <td>{sale.customerNumber}</td>
                      <td>{new Date(sale.date).toLocaleDateString()}</td>
                      <td>{sale.productName}</td>
                      <td>{parseFloat(sale.price).toFixed(2)}</td>
                      <td>{sale.quantity}</td>
                      <td>{parseFloat(sale.totalPrice).toFixed(2)}</td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => handleEdit(sale)} 
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(sale._id)} 
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecentSales;