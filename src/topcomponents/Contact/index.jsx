import React, { useState } from 'react';
import { Phone, MapPin, Mail, Globe, Send, MessageCircle, User, FileText } from 'lucide-react';
import './index.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const subject = encodeURIComponent(formData.subject || 'Contact from Website');
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    window.location.href = `mailto:tawiahgodfred59@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-container">
        <div className="contact-header">
          <h1>Contact The Developer</h1>
          <h2>Do You Have Any Questions?</h2>
          <p>I AM AT YOUR SERVICES</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">

            {/* PHONE CARD */}
            <div className="contact-card">
              <div className="card-icon blue">
                <Phone className="icon" />
              </div>
              <div>
                <h3>Call Me On</h3>
                <a href="tel:+233500005065">+233500005065</a>
              </div>
            </div>

            {/* LOCATION CARD */}
            <div className="contact-card">
              <div className="card-icon green">
                <MapPin className="icon" />
              </div>
              <div>
                <h3>Locate Me</h3>
                <p>Accra or Koforidua</p>
              </div>
            </div>

            {/* EMAIL CARD */}
            <div className="contact-card">
              <div className="card-icon purple">
                <Mail className="icon" />
              </div>
              <div>
                <h3>Email Me</h3>
                <a href="mailto:tawiahgodfred59@gmail.com">tawiahgodfred59@gmail.com</a>
              </div>
            </div>

            {/* WEBSITE CARD */}
            <div className="contact-card">
              <div className="card-icon orange">
                <Globe className="icon" />
              </div>
              <div>
                <h3>Website</h3>
                <a href="https://godfredtportflioone.netlify.app" target="_blank" rel="noopener noreferrer">
                  Click Here to Visit My Website
                </a>
              </div>
            </div>

            {/* EMAIL HIGHLIGHT */}
            <div className="highlight-box">
              <Mail className="highlight-icon" />
              <h3>SEND ME EMAIL</h3>
              <p>I AM VERY RESPONSIVE TO EMAIL</p>
            </div>
          </div>

          {/* CONTACT FORM */}
          <div className="form-box">
            <div className="form-header">
              <MessageCircle className="form-icon" />
              <h2>Send A Message</h2>
            </div>

            <form onSubmit={handleSubmit} className="form-body">
              <div>
                <label>
                  <User className="inline-icon" /> Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label>
                  <Mail className="inline-icon" /> Your Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label>
                  <FileText className="inline-icon" /> Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label>
                  <MessageCircle className="inline-icon" /> Your Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Tell me about your question..."
                ></textarea>
              </div>

              <button type="submit">Send Message</button>

              <div className="form-note">
                I typically respond within 24 hours. Looking forward to hearing from you!
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
