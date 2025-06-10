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
            <h1 style={{ color: "white", fontSize: "2rem" }}>
              Welcome to Metal Tools Pro Shop
            </h1>
            <br />
            <p
              style={{
                color: "white",
                fontSize: "1.2rem",
                fontStyle: "italic",
                marginTop: "0.5rem",
              }}
            >
              Join us to explore the world of metal tools with advanced tools
              and a vibrant community.
            </p>
          </div>

          <div className="signup-container">
            <div className="signup-right">
              <div className="login-box">
                <h2>Login to Your Account</h2>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />

                  <div className="password-container">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={handleChange}
                      required
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

                  <button type="submit">Login</button>

                  <div className="google-signup">
                    <GoogleLogin
                      onSuccess={async (credentialResponse) => {
                        try {
                          console.log(
                            "Google credential response:",
                            credentialResponse
                          );
                          const token = credentialResponse.credential;

                          // Debug: Log the API call details
                          console.log(
                            "Making request to:",
                            `${API_BASE_URL}/api/users/google-login`
                          );
                          console.log("With token:", token);

                          const res = await axios.post(
                            `${API_BASE_URL}/api/users/google-login`,
                            { token },
                            {
                              headers: {
                                "Content-Type": "application/json",
                              },
                            }
                          );

                          console.log("Google login response:", res.data);

                          localStorage.setItem(
                            "user",
                            JSON.stringify(res.data.user)
                          );
                          localStorage.setItem("token", res.data.token);
                          navigate("/dashboard");
                        } catch (error) {
                          console.error("Full error object:", error);
                          console.error("Error response:", error.response);
                          alert(
                            error.response?.data?.message ||
                              error.response?.data?.error ||
                              error.message ||
                              "Google login failed"
                          );
                        }
                      }}
                      onError={() => {
                        console.error("Google login component error");
                        alert("Failed to initialize Google login");
                      }}
                    />
                  </div>

                  <p className="extra-links">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
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
