import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

import {
  FaUser,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

import { MdEmail } from "react-icons/md";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await registerUser(form);

      setMessage(
        response.data.message || "Registration successful!"
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error(error);

      setMessage(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        {/* LEFT SIDE */}
        <div className="register-info">

          <div className="register-logo">
            🛍️
          </div>

          <h1>BGADI</h1>

          <h2>Welcome!</h2>

          <p>
            Create your account and start shopping
            your favorite products.
          </p>

          <div className="register-benefits">
            <div>✓ Easy and secure shopping</div>
            <div>✓ Track your orders</div>
            <div>✓ Save your favorite products</div>
            <div>✓ Fast checkout</div>
          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="register-form-container">

          <div className="register-header">

            <h2>Create Account</h2>

            <p>
              Fill in your details to create your account
            </p>

          </div>


          {message && (
            <div
              className={`register-message ${
                message.toLowerCase().includes("successful")
                  ? "success"
                  : "error"
              }`}
            >
              {message}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="register-input-group">

              <FaUser className="register-input-icon" />

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />

            </div>


            {/* EMAIL */}
            <div className="register-input-group">

              <MdEmail className="register-input-icon" />

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
            <div className="register-input-group">

              <FaLock className="register-input-icon" />

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
                minLength="6"
              />

              <button
                type="button"
                className="password-eye-button"
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


            {/* CONFIRM PASSWORD */}
            <div className="register-input-group">

              <FaLock className="register-input-icon" />

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                minLength="6"
              />

              <button
                type="button"
                className="password-eye-button"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>


            {/* PHONE */}
            <div className="register-input-group">

              <FaPhone className="register-input-icon" />

              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />

            </div>


            {/* ADDRESS */}
            <div className="register-input-group register-textarea-group">

              <FaMapMarkerAlt className="register-input-icon address-icon" />

              <textarea
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                rows="3"
              />

            </div>


            {/* BUTTON */}
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </button>

          </form>


          {/* LOGIN */}
          <p className="register-login-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;