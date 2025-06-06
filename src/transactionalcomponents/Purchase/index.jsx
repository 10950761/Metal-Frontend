// Purchase.js
import React, { useState } from 'react';
import './index.css';

const Purchase = () => {
  const [formData, setFormData] = useState({
    supplierName: '',
    supplierLocation: '',
    supplierCompany: '',
    date: '',
    time: '',
    productName: '',
    productQuantity: '',
    price: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://metal-backend-1.onrender.com/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          supplierName: '',
          supplierLocation: '',
          supplierCompany: '',
          date: '',
          time: '',
          productName: '',
          productQuantity: '',
          price: '',
          notes: ''
        });
        
        // Hide success message after 3 seconds
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to record purchase. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting purchase:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: 'Supplier Name', name: 'supplierName', required: true },
    { label: 'Supplier Location', name: 'supplierLocation', required: true },
    { label: 'Supplier Company', name: 'supplierCompany' },
    { label: 'Date', name: 'date', type: 'date', required: true },
    { label: 'Time', name: 'time', type: 'time', required: true },
    { label: 'Product Name', name: 'productName', required: true },
    { label: 'Product Quantity', name: 'productQuantity', type: 'number', min: 0, step: "0.001", required: true },
    { label: 'Price (GHS)', name: 'price', type: 'number', min: 0, step: "0.01", required: true },
    { label: 'Additional Notes', name: 'notes', type: 'textarea' },
  ];

  return (
    <div className="purchase-container">
      <h2 className="purchase-title">New Purchase Record</h2>
      
      {submitSuccess && (
        <div className="success-message">
          Purchase recorded successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="purchase-form">
        {formFields.map(({ label, name, type = 'text', ...props }) => (
          <div key={name} className="purchase-form-group">
            <label htmlFor={name} className="purchase-label">
              {label}
            </label>
            {type === 'textarea' ? (
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
            {isSubmitting ? 'Processing...' : 'Record Purchase'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Purchase;