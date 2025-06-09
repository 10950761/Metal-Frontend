import React, { useState} from 'react';
import './index.css';
import API_BASE_URL from '../../api/config';

const Sales = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerNumber: '',
    date: '',
    time: '',
    productName: '',
    price: '',
    quantity: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = {
      ...formData,
      [name]: value
    };

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/api/sales`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,  
    },
    body: JSON.stringify(formData),
  });


      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess(true);
        setFormData({
          customerName: '',
          customerNumber: '',
          date: '',
          time: '',
          productName: '',
          price: '',
          quantity: '',
        });
        setTimeout(() => setSubmitSuccess(false), 3000);
      } else {
        alert(data.message || 'Failed to record sale. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting sale:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { label: 'Customer Name', name: 'customerName', required: true },
    { label: 'Customer Number', name: 'customerNumber', type: 'tel', required: true },
    { label: 'Date', name: 'date', type: 'date', required: true },
    { label: 'Time', name: 'time', type: 'time', required: true },
    { label: 'Metal Name', name: 'productName', required: true },
    { label: 'Price (GHS)', name: 'price', type: 'number', min: 0, step: "0.01", required: true },
    { label: 'Quantity', name: 'quantity', type: 'text', min: 0, step: "0.001", required: true },
  ];

  return (
    <div className="sales-container">
      <h2 className="sales-title">New Metal Sale</h2>

      {submitSuccess && (
        <div className="success-message">Sale recorded successfully!</div>
      )}

      <form onSubmit={handleSubmit} className="sales-form">
        {formFields.map(({ label, name, type = 'text', ...props }) => (
          <div key={name} className="sales-form-group">
            <label htmlFor={name} className="sales-label">{label}</label>
            <input
              id={name}
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="sales-input"
              {...props}
            />
          </div>
        ))}
        <div className="sales-button-container">
          <button type="submit" className="sales-button" disabled={isSubmitting}>
            {isSubmitting ? 'Processing...' : 'Submit Sale'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Sales;