import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

import AdminProducts from "./admin/AdminProducts";
import AdminOrders from "./admin/AdminOrders";
import AdminLogin from "./admin/AdminLogin";
import AdminCategories from "./admin/AdminCategories";
import AdminUsers from "./admin/AdminUsers";

import AdminRoute from "./components/AdminRoute";
import ProtectedRoute from "./components/ProtectedRoute";

import "./style.css";
import SuperAdminDashboard from "./superadmin/SuperAdminDashboard";
import SuperAdminProducts from "./superadmin/SuperAdminProducts";
import SuperAdminCategories from "./superadmin/SuperAdminCategories";
import SuperAdminOrders from "./superadmin/SuperAdminOrders";
import SuperAdminUsers from "./superadmin/SuperAdminUsers";
import SuperAdminManagement from "./superadmin/SuperAdminManagement";
import SuperAdminRoute from "./components/SuperAdminRoute";
import AdminDashboard from "./admin/AdminDashboard";
import SuperAdminLogin from "./superadmin/SuperAdminLogin";


// ================= CUSTOMER LAYOUT =================

function CustomerLayout({ children }) {
  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>

      <Footer />
    </>
  );
}


// ================= APP =================

function App() {
  return (
    <BrowserRouter>

      <Routes>
         



        {/* =========================================
            CUSTOMER PAGES
        ========================================= */}

        <Route
          path="/"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />

        <Route
          path="/home"
          element={
            <CustomerLayout>
              <Home />
            </CustomerLayout>
          }
        />

        <Route
          path="/products"
          element={
            <CustomerLayout>
              <Products />
            </CustomerLayout>
          }
        />

        <Route
          path="/products/:id"
          element={
            <CustomerLayout>
              <ProductDetails />
            </CustomerLayout>
          }
        />

        <Route
          path="/login"
          element={
            <CustomerLayout>
              <Login />
            </CustomerLayout>
          }
        />

        <Route
          path="/register"
          element={
            <CustomerLayout>
              <Register />
            </CustomerLayout>
          }
        />

        <Route
          path="/cart"
          element={
            <CustomerLayout>
              <Cart />
            </CustomerLayout>
          }
        />

        <Route
          path="/wishlist"
          element={
            <CustomerLayout>
              <Wishlist />
            </CustomerLayout>
          }
        />

        <Route
          path="/checkout"
          element={
            <CustomerLayout>
              <Checkout />
            </CustomerLayout>
          }
        />

        <Route
          path="/orders"
          element={
            <CustomerLayout>
              <Orders />
            </CustomerLayout>
          }
        />

        <Route
          path="/profile"
          element={
            <CustomerLayout>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </CustomerLayout>
          }
        />


        {/* =========================================
            ADMIN LOGIN
            NO NAVBAR
            NO FOOTER
        ========================================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />


        {/* =========================================
            ADMIN DASHBOARD
            NO NAVBAR
            NO FOOTER
        ========================================= */}

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          }
        />


        {/* =========================================
            ADMIN PRODUCTS
        ========================================= */}

        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />


        {/* =========================================
            ADMIN ORDERS
        ========================================= */}

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />


        {/* =========================================
            ADMIN CATEGORIES
        ========================================= */}

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          }
        />


        {/* =========================================
            ADMIN USERS
        ========================================= */}

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
         {/*=========================
        Super Admin
        ==========================*/}

        <Route
    path="/superadmin/login"
    element={<SuperAdminLogin/>}
/>
        <Route
          path="/superadmin"
          element={
            <SuperAdminRoute>
              <SuperAdminDashboard />
            </SuperAdminRoute>
          }
        />


        <Route
          path="/superadmin/products"
          element={
           <SuperAdminRoute>
            <SuperAdminProducts/>
           </SuperAdminRoute>
          }
        />


        <Route
          path="/superadmin/categories"
          element={
            <SuperAdminRoute>
              <SuperAdminCategories />
            </SuperAdminRoute>
          }
        />


        <Route
          path="/superadmin/orders"
          element={
            <SuperAdminRoute>
              <SuperAdminOrders />
            </SuperAdminRoute>
          }
        />


        <Route
          path="/superadmin/users"
          element={
            <SuperAdminRoute>
              <SuperAdminUsers />
            </SuperAdminRoute>
          }
        />

//==========================
        //  Super Admin
        //======================

        <Route
          path="/superadmin/admins"
          element={
            <SuperAdminRoute>
              <SuperAdminManagement />
            </SuperAdminRoute>
          }
        />

        {/* =========================================
            UNKNOWN URL
        ========================================= */}

        <Route
          path="*"
          element={<Navigate to="/home" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
