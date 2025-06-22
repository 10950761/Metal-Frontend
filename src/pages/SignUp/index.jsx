import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";
import axios from "axios";
import API_BASE_URL from "../../api/config";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // State to hold form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/users/register`,
        formData
      );
      alert(res.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Sign up failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId="375498918262-8rslufij4lp2vdj55ig89kuc6d5ts78g.apps.googleusercontent.com">
      <div className="signup-wrapper">
        <div className="signup-left">
          <div className="brand-section">
            <h1 className="brand-title">
              Welcome to <span className="brand-name">Willin</span>
            </h1>
            <h2 className="brand-subtitle">Business Manager</h2>
            <div className="feature-highlights">
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <span>Sales & Purchase Analytics</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📈</div>
                <span>Revenue Tracking</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📦</div>
                <span>Inventory Management</span>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <span>Business Insights</span>
              </div>
            </div>
            <p className="brand-description">
              Streamline your business operations with comprehensive inventory tracking, 
              sales management, and powerful analytics - all in one platform.
            </p>
          </div>
        </div>

        <div className="signup-container">
          <div className="signup-right">
            <div className="signup-box">
              <div className="signup-header">
                <h2>Create Your Account</h2>
                <p>Join thousands of businesses managing their inventory efficiently</p>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="input-group">
                  <div className="password-container">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="form-input password-input"
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        className="eye-icon"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <FaEye
                        className="eye-icon"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>

                <div className="input-group">
                  <div className="password-container">
                    <input
                      name="confirmpassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm Password"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      required
                      className="form-input password-input"
                    />
                    {showPassword ? (
                      <FaEyeSlash
                        className="eye-icon"
                        onClick={() => setShowPassword(false)}
                      />
                    ) : (
                      <FaEye
                        className="eye-icon"
                        onClick={() => setShowPassword(true)}
                      />
                    )}
                  </div>
                </div>

                <button type="submit" className="signup-btn">
                  Create Account
                </button>

                <div className="divider">
                  <span>or continue with</span>
                </div>

                <div className="google-signup">
                  <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                      try {
                        const token = credentialResponse.credential;
                        console.log("Google token received:", token);

                        const response = await axios.post(
                          `${API_BASE_URL}/api/users/google-login`,
                          { token },
                          {
                            headers: {
                              "Content-Type": "application/json",
                              Accept: "application/json",
                            },
                            withCredentials: true,
                          }
                        );

                        console.log("Login response:", response.data);

                        if (response.data.success) {
                          localStorage.setItem(
                            "user",
                            JSON.stringify(response.data.user)
                          );
                          localStorage.setItem("token", response.data.token);
                          navigate("/dashboard");
                        } else {
                          throw new Error(response.data.message);
                        }
                      } catch (error) {
                        console.error("Login failed:", error);
                        alert(error.message || "Google login failed");
                      }
                    }}
                    onError={() => {
                      console.error("Google sign in failed");
                      alert("Could not initialize Google sign in");
                    }}
                  />
                </div>

                <p className="login-link">
                  Already have an account? <Link to="/login" className="link">Sign In</Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default SignUp;