import React, { useEffect, useState } from "react";
import "./index.css";
import API_BASE_URL from "../../api/config";

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
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/sales`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch sales');
    }
    
    const data = await res.json();
    const nonDeletedSales = data.filter(sale => !sale.deleted);
    setSales(nonDeletedSales);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching sales:", error);
    setLoading(false);
  }
};

 const handleDelete = async (saleId) => {
  if (!window.confirm("Are you sure you want to delete this sale?")) return;

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/api/sales/${saleId}`, {  
      method: "PATCH", 
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        deleted: true,
        deletedAt: new Date().toISOString() 
      }),
    });

    if (response.ok) {
      setSales(prevSales => prevSales.filter(item => item._id !== saleId));
      alert("Sale deleted successfully.");
    } else {
      const errorData = await response.json(); 
      alert(errorData.message || "Failed to delete sale.");
    }
  } catch (error) {
    console.error("Soft delete error:", error);
    alert("An error occurred while deleting the sale.");
    fetchSales();
  }
};
  const handleEdit = (sale) => {
    setEditingSale({ ...sale });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_BASE_URL}/api/sales/${editingSale._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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

  const filteredSales = sales.filter(
    (sale) =>
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
          <p>
            {searchTerm ? "No matching sales found" : "No sales recorded yet"}
          </p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.map((sale) => (
                <tr
                  key={sale._id}
                  className={editingSale?._id === sale._id ? "editing-row" : ""}
                >
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
