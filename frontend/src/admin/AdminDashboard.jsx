import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        categories: 0,
        revenue: 0
    });

    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const API_URL = "http://localhost:5000/api";

    const getAuthConfig = () => {
        const token = localStorage.getItem("adminToken");

        return {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setErrorMessage("");

            const config = getAuthConfig();

            const [
                productsResponse,
                ordersResponse,
                usersResponse,
                categoriesResponse
            ] = await Promise.all([
                axios.get(`${API_URL}/products`, config),
                axios.get(`${API_URL}/orders`, config),
                axios.get(`${API_URL}/users`, config),
                axios.get(`${API_URL}/categories`, config)
            ]);

            const products = Array.isArray(productsResponse.data)
                ? productsResponse.data
                : productsResponse.data.products || [];

            const orders = Array.isArray(ordersResponse.data)
                ? ordersResponse.data
                : ordersResponse.data.orders || [];

            const users = Array.isArray(usersResponse.data)
                ? usersResponse.data
                : usersResponse.data.users || [];

            const categories = Array.isArray(categoriesResponse.data)
                ? categoriesResponse.data
                : categoriesResponse.data.categories || [];

            const totalRevenue = orders.reduce((total, order) => {
                const amount = Number(
                    order.total_amount ||
                    order.totalAmount ||
                    order.total ||
                    0
                );

                return total + amount;
            }, 0);

            const sortedOrders = [...orders]
                .sort((a, b) => {
                    const dateA = new Date(
                        a.created_at || a.createdAt || 0
                    );

                    const dateB = new Date(
                        b.created_at || b.createdAt || 0
                    );

                    return dateB - dateA;
                })
                .slice(0, 5);

            setStats({
                products: products.length,
                orders: orders.length,
                users: users.length,
                categories: categories.length,
                revenue: totalRevenue
            });

            setRecentOrders(sortedOrders);
        } catch (error) {
            console.error("Dashboard data error:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Unable to load dashboard data."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");
    };

    const formatCurrency = (amount) => {
        return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
    };

    const getOrderAmount = (order) => {
        return (
            order.total_amount ||
            order.totalAmount ||
            order.total ||
            0
        );
    };

    const getOrderStatus = (order) => {
        return order.status || "Pending";
    };

    const getStatusClass = (status) => {
        return String(status).toLowerCase().replace(/\s+/g, "-");
    };

    const getOrderId = (order) => {
        return order.id || order.order_id || "N/A";
    };

    return (
        <div className="admin-layout">

            {/* SIDEBAR */}

            <aside className="admin-sidebar">

                <div className="sidebar-logo">
                    <div className="logo-box">B</div>

                    <div>
                        <h2>BGadi</h2>
                        <span>ADMIN</span>
                    </div>
                </div>

                <div className="menu-heading">
                    MENU
                </div>

                <nav className="sidebar-menu">

                    <Link
                        to="/admin"
                        className="sidebar-item active"
                    >
                        <span>📊</span>
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/products"
                        className="sidebar-item"
                    >
                        <span>📦</span>
                        Products
                    </Link>

                    <Link
                        to="/admin/orders"
                        className="sidebar-item"
                    >
                        <span>🛒</span>
                        Orders
                    </Link>

                    <Link
                        to="/admin/categories"
                        className="sidebar-item"
                    >
                        <span>🏷️</span>
                        Categories
                    </Link>

                    <Link
                        to="/admin/users"
                        className="sidebar-item"
                    >
                        <span>👥</span>
                        Users
                    </Link>

                </nav>

                <div className="sidebar-footer">

                    <div className="admin-profile">
                        <div className="profile-icon">
                            👤
                        </div>

                        <div>
                            <strong>
                                {JSON.parse(
                                    localStorage.getItem("admin") || "{}"
                                ).name || "Administrator"}
                            </strong>

                            <small>
                                Store Admin
                            </small>
                        </div>
                    </div>

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >
                        🚪 Logout
                    </button>

                </div>

            </aside>

            {/* MAIN CONTENT */}

            <main className="admin-main">

                <div className="dashboard-header">

                    <div>
                        <p className="welcome-text">
                            ADMIN PANEL
                        </p>

                        <h1>
                            Dashboard
                        </h1>

                        <p className="dashboard-description">
                            Manage your BGadi store from one place.
                        </p>
                    </div>

                    <button
                        className="view-store-btn"
                        onClick={() => navigate("/")}
                    >
                        View Store →
                    </button>

                </div>

                {errorMessage && (
                    <div className="dashboard-error">
                        {errorMessage}
                    </div>
                )}

                {/* STATISTICS */}

                <div className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon blue">
                            📦
                        </div>

                        <div>
                            <span>Total Products</span>

                            <h2>
                                {loading ? "..." : stats.products}
                            </h2>

                            <small>
                                Products available
                            </small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon green">
                            🛒
                        </div>

                        <div>
                            <span>Total Orders</span>

                            <h2>
                                {loading ? "..." : stats.orders}
                            </h2>

                            <small>
                                Orders received
                            </small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon purple">
                            👥
                        </div>

                        <div>
                            <span>Total Users</span>

                            <h2>
                                {loading ? "..." : stats.users}
                            </h2>

                            <small>
                                Registered customers
                            </small>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orange">
                            ₹
                        </div>

                        <div>
                            <span>Total Revenue</span>

                            <h2>
                                {loading
                                    ? "..."
                                    : formatCurrency(stats.revenue)}
                            </h2>

                            <small>
                                Revenue from orders
                            </small>
                        </div>
                    </div>

                </div>

                {/* CONTENT GRID */}

                <div className="dashboard-grid">

                    {/* RECENT ORDERS */}

                    <section className="dashboard-card">

                        <div className="card-header">

                            <div>
                                <h2>Recent Orders</h2>
                                <p>Latest customer orders</p>
                            </div>

                            <Link to="/admin/orders">
                                View All
                            </Link>

                        </div>

                        <div className="orders-list">

                            {loading ? (
                                <p className="empty-message">
                                    Loading orders...
                                </p>
                            ) : recentOrders.length === 0 ? (
                                <p className="empty-message">
                                    No orders available.
                                </p>
                            ) : (
                                recentOrders.map((order) => (
                                    <div
                                        className="order-row"
                                        key={order.id || order.order_id}
                                    >

                                        <div className="order-product">

                                            <div className="order-icon">
                                                📦
                                            </div>

                                            <div>
                                                <strong>
                                                    Order #{getOrderId(order)}
                                                </strong>

                                                <span>
                                                    Customer ID:{" "}
                                                    {order.user_id ||
                                                        order.userId ||
                                                        "N/A"}
                                                </span>
                                            </div>

                                        </div>

                                        <span className="order-price">
                                            {formatCurrency(
                                                getOrderAmount(order)
                                            )}
                                        </span>

                                        <span
                                            className={`status ${getStatusClass(
                                                getOrderStatus(order)
                                            )}`}
                                        >
                                            {getOrderStatus(order)}
                                        </span>

                                    </div>
                                ))
                            )}

                        </div>

                    </section>

                    {/* QUICK ACTIONS */}

                    <section className="dashboard-card quick-card">

                        <div className="card-header">

                            <div>
                                <h2>Quick Actions</h2>
                                <p>Manage your store</p>
                            </div>

                        </div>

                        <div className="quick-actions">

                            <Link
                                to="/admin/products"
                                className="quick-action"
                            >
                                <span>📦</span>

                                <div>
                                    <strong>Products</strong>
                                    <small>
                                        Manage products
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                            <Link
                                to="/admin/categories"
                                className="quick-action"
                            >
                                <span>🏷️</span>

                                <div>
                                    <strong>Categories</strong>
                                    <small>
                                        Manage categories
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                            <Link
                                to="/admin/orders"
                                className="quick-action"
                            >
                                <span>🛒</span>

                                <div>
                                    <strong>Orders</strong>
                                    <small>
                                        View customer orders
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                            <Link
                                to="/admin/users"
                                className="quick-action"
                            >
                                <span>👥</span>

                                <div>
                                    <strong>Users</strong>
                                    <small>
                                        Manage customers
                                    </small>
                                </div>

                                <b>→</b>
                            </Link>

                        </div>

                    </section>

                </div>

                {/* STORE INFORMATION */}

                <div className="store-banner">

                    <div>
                        <span>BGADI STORE</span>

                        <h2>
                            Your store is ready to grow 🚀
                        </h2>

                        <p>
                            Manage products, orders and customers
                            from your admin panel.
                        </p>
                    </div>

                    <Link to="/products">
                        Browse Store →
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default AdminDashboard;