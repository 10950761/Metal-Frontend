import React, { useEffect, useState } from "react";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEdit, FiTrash2, FiSave, FiX, FiSearch } from "react-icons/fi";
import API_BASE_URL from "../../api/config";

const RecentPurchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPurchase, setEditingPurchase] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

 useEffect(() => {
  fetchPurchases();
}, []);

const fetchPurchases = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE_URL}/api/purchases`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPurchases(data);
    setLoading(false);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    toast.error("Failed to load purchases");
    setLoading(false);
  }
};

const handleEdit = (purchase) => {
  setEditingPurchase({ ...purchase });
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this purchase?")) return;
  try {
    const token = localStorage.getItem("token");
    await fetch(`${API_BASE_URL}/api/purchases/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setPurchases(purchases.filter((p) => p._id !== id));
    toast.success("Purchase deleted successfully!");
  } catch (error) {
    console.error("Error deleting purchase:", error);
    toast.error("Failed to delete purchase");
  }
};

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");
    await fetch(
      `${API_BASE_URL}/api/purchases/${editingPurchase._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPurchase),
      }
    );
    toast.success("Purchase updated successfully!");
    setEditingPurchase(null);
    fetchPurchases();
  } catch (error) {
    console.error("Error updating purchase:", error);
    toast.error("Failed to update purchase");
  }
};

const handleChange = (e) => {
  const { name, value } = e.target;
  setEditingPurchase({ ...editingPurchase, [name]: value });
};

const filteredPurchases = purchases.filter(
  (purchase) =>
    purchase.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    purchase.supplierCompany.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="purchases-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="purchases-header">
        <h2 className="purchases-title">Recent Purchases</h2>
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search purchases..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading purchases...</p>
        </div>
      ) : filteredPurchases.length === 0 ? (
        <div className="empty-state">
          <p>{searchTerm ? "No matching purchases found" : "No purchases recorded yet"}</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="purchases-table">
            <thead>
              <tr>
                <th>Supplier</th>
                <th>Company</th>
                <th>Location</th>
                <th>Date</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Price (GHS)</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase._id} className={editingPurchase?._id === purchase._id ? "editing-row" : ""}>
                  {editingPurchase?._id === purchase._id ? (
                    <>
                      <td>
                        <input
                          name="supplierName"
                          value={editingPurchase.supplierName}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="supplierCompany"
                          value={editingPurchase.supplierCompany}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="supplierLocation"
                          value={editingPurchase.supplierLocation}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>{new Date(purchase.date).toLocaleDateString()}</td>
                      <td>
                        <input
                          name="productName"
                          value={editingPurchase.productName}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="productQuantity"
                          type="number"
                          value={editingPurchase.productQuantity}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="price"
                          type="number"
                          step="0.01"
                          value={editingPurchase.price}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td>
                        <input
                          name="notes"
                          value={editingPurchase.notes}
                          onChange={handleChange}
                          className="edit-input"
                        />
                      </td>
                      <td className="action-buttons">
                        <button onClick={handleUpdate} className="save-btn">
                          <FiSave /> Save
                        </button>
                        <button 
                          onClick={() => setEditingPurchase(null)} 
                          className="cancel-btn"
                        >
                          <FiX /> Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{purchase.supplierName}</td>
                      <td>{purchase.supplierCompany}</td>
                      <td>{purchase.supplierLocation}</td>
                      <td>{new Date(purchase.date).toLocaleDateString()}</td>
                      <td>{purchase.productName}</td>
                      <td>{purchase.productQuantity}</td>
                      <td>{parseFloat(purchase.price).toFixed(2)}</td>
                      <td className="notes-cell">{purchase.notes || "-"}</td>
                      <td className="action-buttons">
                        <button 
                          onClick={() => handleEdit(purchase)} 
                          className="edit-btn"
                        >
                          <FiEdit /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(purchase._id)} 
                          className="delete-btn"
                        >
                          <FiTrash2 /> Delete
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

export default RecentPurchases;