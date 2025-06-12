import React, { useState, useEffect } from "react";
import "./index.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../../api/config";

const getAuthHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const Purchase = () => {
  const [formData, setFormData] = useState({
    supplierName: "",
    supplierLocation: "",
    supplierCompany: "",
    date: "",
    time: "",
    productName: "",
    productQuantity: "",
    price: "",
    notes: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Session expired. Please log in.");
      window.location.href = "/login";
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.productName.trim()) {
      toast.error("Product name is required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/purchases`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          productQuantity: Number(formData.productQuantity), 
          price: Number(formData.price), 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          supplierName: "",
          supplierLocation: "",
          supplierCompany: "",
          date: "",
          time: "",
          productName: "",
          productQuantity: "",
          price: "",
          notes: "",
        });

        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        toast.error(
          data.message || "Failed to record purchase. Please try again."
        );
      }
    } catch (error) {
      console.error("Error submitting purchase:", error);
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: "Supplier Name", name: "supplierName", required: true },
    { label: "Supplier Location", name: "supplierLocation", required: true },
    { label: "Supplier Company", name: "supplierCompany" },
    { label: "Date", name: "date", type: "date", required: true },
    { label: "Time", name: "time", type: "time", required: true },
    { label: "Product Name", name: "productName", required: true },
    {
      label: "Product Quantity",
      name: "productQuantity",
      type: "number",
      min: 0,
      step: "0.001",
      required: true,
    },
    {
      label: "Price (₵)",
      name: "price",
      type: "number",
      min: 0,
      step: "0.01",
      required: true,
    },
    { label: "Additional Notes", name: "notes", type: "textarea" },
  ];

  return (
    <div className="purchase-container">
      <h2 className="purchase-title">New Purchase Record</h2>

      {submitSuccess && (
        <div className="success-message">Purchase recorded successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="purchase-form">
        {formFields.map(({ label, name, type = "text", ...props }) => (
          <div key={name} className="purchase-form-group">
            <label htmlFor={name} className="purchase-label">
              {label}
            </label>
            {type === "textarea" ? (
              <textarea
                id={name}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="purchase-input"
                rows="3"
                {...props}
              />
            ) : (
              <input
                id={name}
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="purchase-input"
                {...props}
              />
            )}
          </div>
        ))}

        <div className="purchase-button-container">
          <button
            type="submit"
            className="purchase-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Processing..." : "Record Purchase"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Purchase;
