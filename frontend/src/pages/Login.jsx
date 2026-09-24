import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../css/login.css";

import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const response = await loginUser(form);

      // Save token if your backend returns one
      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      // Save user information if returned
      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      }

      setMessage(
        response.data.message || "Login successful!"
      );

      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Invalid email or password"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-info">

          <div className="login-logo">
            🛍️
          </div>

          <h1>BGADI</h1>

          <h2>Welcome Back!</h2>

          <p>
            Login to your account and continue
            shopping your favorite products.
          </p>

          <div className="login-benefits">

            <div>✓ Discover amazing products</div>

            <div>✓ Manage your orders</div>

            <div>✓ Save your favorite products</div>

            <div>✓ Secure and easy checkout</div>

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="login-form-container">

          <div className="login-header">

            <h2>Login</h2>

            <p>
              Enter your account details to continue
            </p>

          </div>


          {message && (
            <div
              className={`login-message ${
                message.toLowerCase().includes("success")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* EMAIL */}
            <div className="login-input-group">

              <MdEmail className="login-input-icon" />

              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* PASSWORD */}
            <div className="login-input-group">

              <FaLock className="login-input-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="login-eye-button"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>


            {/* FORGOT PASSWORD */}
            <div className="login-options">

              <label className="remember-me">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

              <Link
                to="/forgot-password"
                className="forgot-password"
              >
                Forgot Password?
              </Link>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          {/* REGISTER */}
          <p className="login-register-text">

            Don't have an account?

            <Link to="/register">
              Create Account
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;