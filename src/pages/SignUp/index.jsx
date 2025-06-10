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
            Join us to explore the world of metal tools with advanced tools and
            a vibrant community.
          </p>
        </div>

        <div className="signup-container">
          <div className="signup-right">
            <div className="signup-box">
              <h2>Create Account</h2>
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

                <div className="password-container">
                  <input
                    name="confirmpassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmpassword}
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

                <button type="submit">Sign Up</button>

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

                <p className="extra-links">
                  Already have an account? <Link to="/login">Login</Link>
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
