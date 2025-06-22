import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./index.css";
import axios from "axios";
import API_BASE_URL from "../../api/config";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [, setUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_BASE_URL}/api/users/login`, formData);

      alert(res.data.message);

      localStorage.setItem("token", res.data.user.token);
      localStorage.setItem("username", res.data.user.username);
      localStorage.setItem("email", res.data.user.email);
      console.log("Stored email after normal login:", localStorage.getItem("email"));

      setUser(null);
      navigate("/dashboard");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId="375498918262-8rslufij4lp2vdj55ig89kuc6d5ts78g.apps.googleusercontent.com">
      <div className="login-wrapper">
        <div className="signup-wrapper">
          <div className="signup-left">
            <div className="brand-section">
              <h1 className="brand-title">
                Welcome back to <span className="brand-name">Willin</span>
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
                Continue managing your business operations with comprehensive inventory tracking, 
                sales management, and powerful analytics dashboard.
              </p>
            </div>
          </div>

          <div className="signup-container">
            <div className="signup-right">
              <div className="login-box">
                <div className="login-header">
                  <h2>Welcome Back</h2>
                  <p>Sign in to access your business dashboard</p>
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

                  <button type="submit" className="login-btn">
                    Sign In
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
                            const { user, token } = response.data;

                            localStorage.setItem("user", JSON.stringify(user));
                            localStorage.setItem("token", token);
                            localStorage.setItem("username", user.username);
                            localStorage.setItem("email", user.email);
                            console.log("Stored email after normal login:", localStorage.getItem("email"));

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

                  <p className="signup-link">
                    Don't have an account? <Link to="/signup" className="link">Create Account</Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;