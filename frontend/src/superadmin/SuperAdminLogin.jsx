import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/superadminlogin.css";

function SuperAdminLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("superadmin@gmail.com");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Please enter email and password");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/auth/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Invalid email or password");
                return;
            }

            // Make sure this is a SUPER ADMIN
            if (data.admin.role !== "superadmin") {
                setError("You are not authorized as Super Admin");
                return;
            }

            localStorage.setItem("adminToken", data.token);
            localStorage.setItem(
                "admin",
                JSON.stringify(data.admin)
            );

            // Go to Super Admin dashboard
            navigate("/superadmin");

        } catch (error) {
            console.error("Super Admin login error:", error);
            setError("Unable to connect to server");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="super-login-page">

            <div className="super-login-container">

                {/* LEFT SIDE */}
                <div className="super-login-left">

                    <div className="brand-logo">
                        <div className="brand-letter">
                            B
                        </div>

                        <div>
                            <h1>BGadi</h1>
                            <p>ADMIN PANEL</p>
                        </div>
                    </div>

                    <div className="left-content">

                        <div className="shield-icon">
                            🛡️
                        </div>

                        <h2>
                            Super Admin Portal
                        </h2>

                        <p>
                            Manage your entire BGadi e-commerce
                            platform from one secure dashboard.
                        </p>

                        <div className="security-list">

                            <div>
                                <span>✓</span>
                                Full system access
                            </div>

                            <div>
                                <span>✓</span>
                                Manage administrators
                            </div>

                            <div>
                                <span>✓</span>
                                Manage products and orders
                            </div>

                            <div>
                                <span>✓</span>
                                Monitor store activity
                            </div>

                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}
                <div className="super-login-right">

                    <div className="login-card">

                        <div className="login-icon">
                            🛡️
                        </div>

                        <h2>
                            Super Admin Login
                        </h2>

                        <p className="login-subtitle">
                            Sign in to access the administration panel
                        </p>


                        {error && (
                            <div className="login-error">
                                ⚠️ {error}
                            </div>
                        )}


                        <form onSubmit={handleLogin}>

                            <div className="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="Enter your email"
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                />

                            </div>


                            <button
                                type="submit"
                                className="super-login-btn"
                                disabled={loading}
                            >

                                {loading
                                    ? "Signing in..."
                                    : "Login as Super Admin"
                                }

                            </button>

                        </form>


                        <div className="back-store">

                            <button
                                type="button"
                                onClick={() => navigate("/")}
                            >
                                ← Back to Store
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default SuperAdminLogin;