import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/adminlogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/admin/login",
                form
            );

            const { token, admin } = response.data;

            if (admin.role !== "admin" && admin.role !== "superadmin") {
                setError("You do not have admin access.");
                return;
            }

            localStorage.setItem("adminToken", token);
            localStorage.setItem("admin", JSON.stringify(admin));

            if (admin.role === "superadmin") {
                navigate("/superadmin");
            } else {
                navigate("/admin");
            }
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">

            <div className="admin-login-card">

                <div className="login-logo">
                    B
                </div>

                <h1>BGadi</h1>

                <p className="login-subtitle">
                    Admin Portal
                </p>

                <h2>Admin Login</h2>

                <p className="login-description">
                    Sign in to manage your store.
                </p>

                {error && (
                    <div className="login-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Email Address</label>

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter admin email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        name="password"
                        placeholder="Enter password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Login as Admin"}
                    </button>

                </form>

                <div className="login-links">
                    <Link to="/superadmin/login">
                        Super Admin Login
                    </Link>

                    <Link to="/">
                        ← Back to Store
                    </Link>
                </div>

            </div>

        </div>
    );
}

export default AdminLogin;