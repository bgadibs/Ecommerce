
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaBoxOpen,
  FaHeart,
  FaShoppingCart,
  FaLock,
  FaSignOutAlt,
  FaEdit,
} from "react-icons/fa";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);

        setUser({
          name: parsedUser.name || "",
          email: parsedUser.email || "",
          phone: parsedUser.phone || "",
        });
      } catch (error) {
        console.log("User data error:", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChanged"));

    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* SIDEBAR */}
        <aside className="profile-sidebar">

          <div className="profile-sidebar-header">
            <div className="profile-avatar">
              <FaUser />
            </div>

            <h3>My Account</h3>
            <p>Welcome back!</p>
          </div>

          <nav className="profile-menu">

            <Link to="/profile" className="profile-menu-item active">
              <FaUser />
              <span>My Profile</span>
            </Link>

            <Link to="/orders" className="profile-menu-item">
              <FaBoxOpen />
              <span>My Orders</span>
            </Link>

            <Link to="/wishlist" className="profile-menu-item">
              <FaHeart />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className="profile-menu-item">
              <FaShoppingCart />
              <span>My Cart</span>
            </Link>

            <Link to="/change-password" className="profile-menu-item">
              <FaLock />
              <span>Change Password</span>
            </Link>

            <button
              className="profile-menu-item logout-item"
              onClick={handleLogout}
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>

          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="profile-content">

          <div className="profile-content-header">
            <div>
              <h2>My Profile</h2>
              <p>Manage your personal information</p>
            </div>

            <button
              className="edit-profile-btn"
              onClick={() => navigate("/edit-profile")}
            >
              <FaEdit />
              Edit Profile
            </button>
          </div>

          {/* PROFILE CARD */}
          <div className="profile-card">

            <div className="profile-card-title">
              <h3>Personal Information</h3>
            </div>

            <div className="profile-details">

              <div className="profile-field">
                <label>Full Name</label>
                <div className="profile-value">
                  {user.name || "Not available"}
                </div>
              </div>

              <div className="profile-field">
                <label>Email Address</label>
                <div className="profile-value">
                  {user.email || "Not available"}
                </div>
              </div>

              <div className="profile-field">
                <label>Phone Number</label>
                <div className="profile-value">
                  {user.phone || "Not available"}
                </div>
              </div>

            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="account-summary">

            <div className="summary-card">
              <div className="summary-icon">
                <FaBoxOpen />
              </div>

              <div>
                <h4>My Orders</h4>
                <p>View your orders</p>
              </div>

              <Link to="/orders">View</Link>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FaHeart />
              </div>

              <div>
                <h4>Wishlist</h4>
                <p>Saved products</p>
              </div>

              <Link to="/wishlist">View</Link>
            </div>

            <div className="summary-card">
              <div className="summary-icon">
                <FaShoppingCart />
              </div>

              <div>
                <h4>My Cart</h4>
                <p>Shopping cart</p>
              </div>

              <Link to="/cart">View</Link>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

export default Profile;
