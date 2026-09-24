
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/superadmin.css";

function SuperAdminDashboard() {

    const navigate = useNavigate();

    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        admins: 0
    });

    const [loading, setLoading] = useState(true);

    // ==========================================
    // LOAD DASHBOARD STATS
    // ==========================================

    useEffect(() => {

        const loadStats = async () => {

            try {

                const response = await axios.get(
                    "http://localhost:5000/api/dashboard/stats"
                );

                setStats(response.data);

            } catch (error) {

                console.error(
                    "Dashboard stats error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        loadStats();

    }, []);


    // ==========================================
    // LOGOUT
    // ==========================================

    const handleLogout = () => {

        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");

        navigate("/admin/login");

    };


    return (

        <div className="admin-layout">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <aside className="admin-sidebar">


                {/* BRAND */}

                <div className="admin-brand">

                    <div className="brand-logo">
                        B
                    </div>

                    <div>
                        <h2>
                            BGadi
                        </h2>

                        <span>
                            Super Admin
                        </span>
                    </div>

                </div>


                {/* MAIN MENU */}

                <div className="sidebar-title">
                    MAIN MENU
                </div>


                <nav className="sidebar-menu">

                    <Link
                        to="/superadmin"
                        className="active"
                    >
                        <span>
                            📊
                        </span>

                        Dashboard
                    </Link>


                    <Link to="/superadmin/products">

                        <span>
                            📦
                        </span>

                        Products

                    </Link>


                    <Link to="/superadmin/categories">

                        <span>
                            🏷️
                        </span>

                        Categories

                    </Link>


                    <Link to="/superadmin/orders">

                        <span>
                            🛒
                        </span>

                        Orders

                    </Link>


                    <Link to="/superadmin/users">

                        <span>
                            👥
                        </span>

                        Users

                    </Link>

                </nav>


                {/* MANAGEMENT */}

                <div className="sidebar-title">
                    MANAGEMENT
                </div>


                <nav className="sidebar-menu">

                    <Link to="/superadmin/admins">

                        <span>
                            🛡️
                        </span>

                        Admin Management

                    </Link>

                </nav>


                {/* SETTINGS */}

                <div className="sidebar-title">
                    SETTINGS
                </div>


                <nav className="sidebar-menu">

                    <Link to="/superadmin/settings">

                        <span>
                            ⚙️
                        </span>

                        Settings

                    </Link>

                </nav>


                {/* LOGOUT */}

                <div className="sidebar-bottom">

                    <button
                        className="logout-btn"
                        onClick={handleLogout}
                    >

                        <span>
                            🚪
                        </span>

                        Logout

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="admin-main">


                {/* =================================================
                    TOP BAR
                ================================================= */}

                <header className="admin-topbar">


                    <div className="topbar-left">

                        <button
                            className="menu-toggle"
                        >
                            ☰
                        </button>

                        <div className="page-name">

                            Super Admin Dashboard

                        </div>

                    </div>


                    <div className="topbar-right">


                        <button className="notification-btn">

                            🔔

                        </button>


                        <div className="admin-user">


                            <div className="user-avatar">

                                SA

                            </div>


                            <div className="user-details">

                                <strong>
                                    Super Admin
                                </strong>

                                <span>
                                    Full Access
                                </span>

                            </div>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    CONTENT
                ================================================= */}

                <section className="admin-content">


                    {/* PAGE HEADING */}

                    <div className="content-heading">

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back! Here's what's happening
                            with your store today.
                        </p>

                    </div>


                    {/* =================================================
                        STAT CARDS
                    ================================================= */}

                    <div className="stat-grid">


                        {/* PRODUCTS */}

                        <div className="stat-card">

                            <div className="stat-icon blue">

                                📦

                            </div>

                            <div className="stat-info">

                                <span>
                                    Total Products
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : stats.products}
                                </h2>

                                <small className="positive">
                                    Products in store
                                </small>

                            </div>

                        </div>


                        {/* ORDERS */}

                        <div className="stat-card">

                            <div className="stat-icon green">

                                🛒

                            </div>

                            <div className="stat-info">

                                <span>
                                    Total Orders
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : stats.orders}
                                </h2>

                                <small className="positive">
                                    Customer orders
                                </small>

                            </div>

                        </div>


                        {/* USERS */}

                        <div className="stat-card">

                            <div className="stat-icon purple">

                                👥

                            </div>

                            <div className="stat-info">

                                <span>
                                    Total Users
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : stats.users}
                                </h2>

                                <small className="positive">
                                    Registered customers
                                </small>

                            </div>

                        </div>


                        {/* ADMINS */}

                        <div className="stat-card">

                            <div className="stat-icon orange">

                                🛡️

                            </div>

                            <div className="stat-info">

                                <span>
                                    Total Admins
                                </span>

                                <h2>
                                    {loading
                                        ? "..."
                                        : stats.admins}
                                </h2>

                                <small>
                                    Active administrators
                                </small>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        LOWER DASHBOARD
                    ================================================= */}

                    <div className="dashboard-grid">


                        {/* =================================================
                            RECENT ORDERS
                        ================================================= */}

                        <section className="dashboard-card">


                            <div className="card-header">

                                <div>

                                    <h3>
                                        Recent Orders
                                    </h3>

                                    <p>
                                        Latest customer orders
                                    </p>

                                </div>


                                <Link to="/superadmin/orders">

                                    View All

                                </Link>

                            </div>


                            <div className="table-wrapper">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Order
                                            </th>

                                            <th>
                                                Customer
                                            </th>

                                            <th>
                                                Amount
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>


                                        <tr>

                                            <td>
                                                #BG1001
                                            </td>

                                            <td>
                                                Rahul
                                            </td>

                                            <td>
                                                ₹2,500
                                            </td>

                                            <td>

                                                <span className="badge success">
                                                    Paid
                                                </span>

                                            </td>

                                            <td>

                                                <Link
                                                    to="/superadmin/orders"
                                                    className="view-btn"
                                                >
                                                    View
                                                </Link>

                                            </td>

                                        </tr>


                                        <tr>

                                            <td>
                                                #BG1002
                                            </td>

                                            <td>
                                                Priya
                                            </td>

                                            <td>
                                                ₹1,200
                                            </td>

                                            <td>

                                                <span className="badge warning">
                                                    Pending
                                                </span>

                                            </td>

                                            <td>

                                                <Link
                                                    to="/superadmin/orders"
                                                    className="view-btn"
                                                >
                                                    View
                                                </Link>

                                            </td>

                                        </tr>


                                        <tr>

                                            <td>
                                                #BG1003
                                            </td>

                                            <td>
                                                Arjun
                                            </td>

                                            <td>
                                                ₹3,800
                                            </td>

                                            <td>

                                                <span className="badge success">
                                                    Paid
                                                </span>

                                            </td>

                                            <td>

                                                <Link
                                                    to="/superadmin/orders"
                                                    className="view-btn"
                                                >
                                                    View
                                                </Link>

                                            </td>

                                        </tr>


                                    </tbody>

                                </table>

                            </div>

                        </section>


                        {/* =================================================
                            QUICK ACTIONS
                        ================================================= */}

                        <section className="dashboard-card">


                            <div className="card-header">

                                <div>

                                    <h3>
                                        Quick Actions
                                    </h3>

                                    <p>
                                        Manage your store
                                    </p>

                                </div>

                            </div>


                            <div className="quick-actions">


                                <Link to="/superadmin/products">

                                    <span>
                                        📦
                                    </span>

                                    <div>

                                        <strong>
                                            Products
                                        </strong>

                                        <small>
                                            Add and manage products
                                        </small>

                                    </div>

                                </Link>


                                <Link to="/superadmin/categories">

                                    <span>
                                        🏷️
                                    </span>

                                    <div>

                                        <strong>
                                            Categories
                                        </strong>

                                        <small>
                                            Manage categories
                                        </small>

                                    </div>

                                </Link>


                                <Link to="/superadmin/orders">

                                    <span>
                                        🛒
                                    </span>

                                    <div>

                                        <strong>
                                            Orders
                                        </strong>

                                        <small>
                                            View and update orders
                                        </small>

                                    </div>

                                </Link>


                                <Link to="/superadmin/users">

                                    <span>
                                        👥
                                    </span>

                                    <div>

                                        <strong>
                                            Users
                                        </strong>

                                        <small>
                                            Manage registered users
                                        </small>

                                    </div>

                                </Link>


                                <Link to="/superadmin/admins">

                                    <span>
                                        🛡️
                                    </span>

                                    <div>

                                        <strong>
                                            Admin Management
                                        </strong>

                                        <small>
                                            Add and manage admins
                                        </small>

                                    </div>

                                </Link>

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        QUICK MANAGEMENT
                    ================================================= */}

                    <div className="quick-management-section">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Quick Management
                                </h2>

                                <p>
                                    Manage your e-commerce platform
                                </p>

                            </div>

                        </div>


                        <div className="management-grid">


                            <Link
                                to="/superadmin/products"
                                className="management-card"
                            >

                                <div className="management-icon blue">
                                    📦
                                </div>

                                <div>

                                    <h3>
                                        Products
                                    </h3>

                                    <p>
                                        Add, edit and delete products
                                    </p>

                                </div>

                                <span className="arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/superadmin/categories"
                                className="management-card"
                            >

                                <div className="management-icon yellow">
                                    🏷️
                                </div>

                                <div>

                                    <h3>
                                        Categories
                                    </h3>

                                    <p>
                                        Manage product categories
                                    </p>

                                </div>

                                <span className="arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/superadmin/orders"
                                className="management-card"
                            >

                                <div className="management-icon green">
                                    🛒
                                </div>

                                <div>

                                    <h3>
                                        Orders
                                    </h3>

                                    <p>
                                        View and update orders
                                    </p>

                                </div>

                                <span className="arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/superadmin/users"
                                className="management-card"
                            >

                                <div className="management-icon purple">
                                    👥
                                </div>

                                <div>

                                    <h3>
                                        Users
                                    </h3>

                                    <p>
                                        Manage registered users
                                    </p>

                                </div>

                                <span className="arrow">
                                    →
                                </span>

                            </Link>


                            <Link
                                to="/superadmin/admins"
                                className="management-card"
                            >

                                <div className="management-icon orange">
                                    🛡️
                                </div>

                                <div>

                                    <h3>
                                        Admin Management
                                    </h3>

                                    <p>
                                        Add, edit and remove admins
                                    </p>

                                </div>

                                <span className="arrow">
                                    →
                                </span>

                            </Link>


                        </div>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default SuperAdminDashboard;