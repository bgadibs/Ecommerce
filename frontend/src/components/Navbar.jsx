import { useCallback, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  FiChevronDown,
  FiGrid,
  FiHome,
  FiHeart,
  FiLogOut,
  FiMapPin,
  FiMenu,
  FiPackage,
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiX
} from "react-icons/fi";
import { getCart } from "../services/api";
import "../css/navbar.css";

// =====================================
// SESSION HELPERS
// =====================================

// Login, Profile and the navbar fire this event whenever the session changes
const AUTH_EVENT = "authChanged";

const readSession = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return { loggedIn: false, user: null };
  }

  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return { loggedIn: true, user };
  } catch {
    return { loggedIn: true, user: null };
  }
};

const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event(AUTH_EVENT));
};

// Total quantity in the cart; 0 if logged out or on error
const fetchCartCount = async () => {
  if (!localStorage.getItem("token")) return 0;

  try {
    const response = await getCart();
    const cart = Array.isArray(response.data) ? response.data : [];

    return cart.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0
    );
  } catch (error) {
    // Expired or invalid token: log the user out quietly
    if (error.response?.status === 401) {
      clearSession();
    }
    return 0;
  }
};

const firstName = (user) =>
  user?.name ? user.name.trim().split(" ")[0] : "Account";

function Navbar() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const queryString = routerLocation.search;
  // Ignore a trailing slash so "/products/" matches "/products"
  const pathname = routerLocation.pathname.replace(/(.)\/+$/, "$1");

  const searchFromUrl = () =>
    pathname === "/products"
      ? new URLSearchParams(queryString).get("search") || ""
      : "";

  const [session, setSession] = useState(readSession);
  const [cartCount, setCartCount] = useState(0);
  const [search, setSearch] = useState(searchFromUrl);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  // Location
  const [location, setLocation] = useState(
    localStorage.getItem("location") || ""
  );
  const [address, setAddress] = useState(
    localStorage.getItem("address") || ""
  );
  const [pincode, setPincode] = useState(
    localStorage.getItem("pincode") || ""
  );
  const [showLocation, setShowLocation] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState("");

  const accountRef = useRef(null);
  const pinInputRef = useRef(null);

  // =====================================
  // ON EVERY ROUTE CHANGE:
  // re-read the session, sync the search box
  // with the URL, and close any open menus
  // =====================================

  const routeKey = pathname + queryString;
  const [prevRouteKey, setPrevRouteKey] = useState(routeKey);

  if (routeKey !== prevRouteKey) {
    setPrevRouteKey(routeKey);
    setSession(readSession());
    setSearch(searchFromUrl());
    setMenuOpen(false);
    setAccountOpen(false);
  }

  // Login/logout in this tab or another tab
  const refreshSession = useCallback(() => {
    setSession(readSession());
  }, []);

  useEffect(() => {
    window.addEventListener(AUTH_EVENT, refreshSession);
    window.addEventListener("storage", refreshSession);

    return () => {
      window.removeEventListener(AUTH_EVENT, refreshSession);
      window.removeEventListener("storage", refreshSession);
    };
  }, [refreshSession]);

  // =====================================
  // CART COUNT (only when logged in)
  // =====================================

  useEffect(() => {
    if (!session.loggedIn) return;

    let cancelled = false;

    fetchCartCount().then((count) => {
      if (!cancelled) setCartCount(count);
    });

    return () => {
      cancelled = true;
    };
  }, [session.loggedIn, pathname]);

  useEffect(() => {
    const handleCartUpdated = () => {
      fetchCartCount().then(setCartCount);
    };

    window.addEventListener("cartUpdated", handleCartUpdated);
    return () => window.removeEventListener("cartUpdated", handleCartUpdated);
  }, []);

  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {
    e.preventDefault();
    const value = search.trim();

    navigate(
      value ? `/products?search=${encodeURIComponent(value)}` : "/products"
    );
  };

  // =====================================
  // MENUS: close on Escape and on clicks
  // outside the account menu
  // =====================================

  useEffect(() => {
    if (!accountOpen) return;

    const handleClick = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [accountOpen]);

  const closeLocationPopup = useCallback(() => {
    setShowLocation(false);
    setLocationError("");
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      setAccountOpen(false);
      closeLocationPopup();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [closeLocationPopup]);

  // Stop the page scrolling behind the drawer or the popup
  useEffect(() => {
    document.body.style.overflow = menuOpen || showLocation ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, showLocation]);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    clearSession();
    setMenuOpen(false);
    setAccountOpen(false);
    navigate("/home");
  };

  // =====================================
  // LOCATION POPUP
  // =====================================

  const openLocationPopup = () => {
    // Start from the saved values, not leftover unsaved edits
    setPincode(localStorage.getItem("pincode") || "");
    setAddress(localStorage.getItem("address") || "");
    setLocationError("");
    setMenuOpen(false);
    setShowLocation(true);
  };

  useEffect(() => {
    if (showLocation) {
      pinInputRef.current?.focus();
    }
  }, [showLocation]);

  const handleSaveLocation = async () => {
    if (!/^[0-9]{6}$/.test(pincode)) {
      setLocationError("Enter a valid 6-digit PIN code.");
      return;
    }

    if (!address.trim()) {
      setLocationError("Enter your full address.");
      return;
    }

    try {
      setLocationLoading(true);
      setLocationError("");

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );

      if (!response.ok) {
        throw new Error(`PIN lookup failed: ${response.status}`);
      }

      const data = await response.json();
      const result = Array.isArray(data) ? data[0] : null;

      if (result?.Status !== "Success" || !result.PostOffice?.length) {
        setLocationError("No location found for this PIN code. Check it and try again.");
        return;
      }

      const postOffice = result.PostOffice[0];
      const newLocation = `${postOffice.Name}, ${postOffice.District} - ${pincode}`;

      setLocation(newLocation);
      localStorage.setItem("location", newLocation);
      localStorage.setItem("pincode", pincode);
      localStorage.setItem("address", address.trim());

      setShowLocation(false);
    } catch (error) {
      console.error("Location error:", error);
      setLocationError("Couldn't look up this PIN code. Check your connection and try again.");
    } finally {
      setLocationLoading(false);
    }
  };

  // =====================================
  // LINKS
  // =====================================

  const isHome = pathname === "/" || pathname === "/home";
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link is-active" : "nav-link";

  const locationButton = (extraClass) => (
    <button
      type="button"
      className={`nav-location ${extraClass}`}
      onClick={openLocationPopup}
    >
      <FiMapPin className="nav-location-icon" aria-hidden="true" />
      <span className="nav-location-text">
        <small>Delivering to</small>
        <strong>{location || "Set your location"}</strong>
      </span>
      <span className="nav-location-change">Change</span>
    </button>
  );

  // Never show a stale count after logging out
  const visibleCartCount = session.loggedIn ? cartCount : 0;

  const cartLabel =
    visibleCartCount > 0 ? `Cart, ${visibleCartCount} item${visibleCartCount === 1 ? "" : "s"}` : "Cart";

  return (
    <>
      <header className="nav">
        <div className="nav-bar">
          {/* Mobile menu toggle */}
          <button
            type="button"
            className="nav-icon-btn nav-menu-toggle"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="nav-drawer"
            onClick={() => setMenuOpen(true)}
          >
            <FiMenu aria-hidden="true" />
          </button>

          {/* Logo */}
          <Link to="/" className="nav-logo" aria-label="BGadi home">
            BG<span>adi</span>
          </Link>

          {locationButton("nav-location--desktop")}

          {/* Search */}
          <form className="nav-search" role="search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search sarees, kurtis, jewellery..."
              aria-label="Search products"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <FiSearch aria-hidden="true" />
            </button>
          </form>

          {/* Desktop links */}
          <nav className="nav-links" aria-label="Main">
            <NavLink
              to="/home"
              className={isHome ? "nav-link is-active" : "nav-link"}
            >
              Home
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              Products
            </NavLink>
          </nav>

          <div className="nav-actions">
            <NavLink
              to="/wishlist"
              aria-label="Wishlist"
              className={({ isActive }) =>
                `nav-icon-link nav-hide-mobile${isActive ? " is-active" : ""}`
              }
            >
              <FiHeart aria-hidden="true" />
              <span className="nav-icon-label">Wishlist</span>
            </NavLink>

            <NavLink
              to="/cart"
              aria-label={cartLabel}
              className={({ isActive }) =>
                `nav-icon-link${isActive ? " is-active" : ""}`
              }
            >
              <span className="nav-cart-icon">
                <FiShoppingCart aria-hidden="true" />
                {visibleCartCount > 0 && (
                  <span className="nav-cart-badge" aria-hidden="true">
                    {visibleCartCount > 99 ? "99+" : visibleCartCount}
                  </span>
                )}
              </span>
              <span className="nav-icon-label">Cart</span>
            </NavLink>

            {session.loggedIn ? (
              <div className="nav-account nav-hide-mobile" ref={accountRef}>
                <button
                  type="button"
                  className="nav-account-btn"
                  aria-haspopup="menu"
                  aria-expanded={accountOpen}
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <FiUser aria-hidden="true" />
                  <span>{firstName(session.user)}</span>
                  <FiChevronDown className="nav-chevron" aria-hidden="true" />
                </button>

                {accountOpen && (
                  <div className="nav-account-menu" role="menu">
                    <Link to="/profile" role="menuitem">
                      <FiUser aria-hidden="true" /> Profile
                    </Link>
                    <Link to="/orders" role="menuitem">
                      <FiPackage aria-hidden="true" /> My orders
                    </Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      <FiLogOut aria-hidden="true" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="nav-auth nav-hide-mobile">
                <Link to="/login" className="nav-btn nav-btn--ghost">
                  Log in
                </Link>
                <Link to="/register" className="nav-btn nav-btn--solid">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {locationButton("nav-location--mobile")}
      </header>

      {/* =====================================
          MOBILE DRAWER
      ===================================== */}

      <div
        className={`nav-drawer-backdrop${menuOpen ? " is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      <aside
        id="nav-drawer"
        className={`nav-drawer${menuOpen ? " is-open" : ""}`}
        aria-label="Menu"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="nav-drawer-head">
          <span className="nav-drawer-greeting">
            {session.loggedIn ? `Hi, ${firstName(session.user)}` : "Welcome"}
          </span>
          <button
            type="button"
            className="nav-icon-btn"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            <FiX aria-hidden="true" />
          </button>
        </div>

        {!session.loggedIn && (
          <div className="nav-drawer-auth">
            <Link to="/login" className="nav-btn nav-btn--ghost">
              Log in
            </Link>
            <Link to="/register" className="nav-btn nav-btn--solid">
              Register
            </Link>
          </div>
        )}

        <nav className="nav-drawer-links" aria-label="Mobile">
          <NavLink to="/home" className={isHome ? "is-active" : undefined}>
            <FiHome aria-hidden="true" /> Home
          </NavLink>
          <NavLink to="/products">
            <FiGrid aria-hidden="true" /> Products
          </NavLink>
          <NavLink to="/wishlist">
            <FiHeart aria-hidden="true" /> Wishlist
          </NavLink>
          <NavLink to="/cart">
            <FiShoppingCart aria-hidden="true" /> Cart
            {visibleCartCount > 0 && <span className="nav-drawer-count">{visibleCartCount}</span>}
          </NavLink>

          {session.loggedIn && (
            <>
              <NavLink to="/orders">
                <FiPackage aria-hidden="true" /> My orders
              </NavLink>
              <NavLink to="/profile">
                <FiUser aria-hidden="true" /> Profile
              </NavLink>
            </>
          )}
        </nav>

        {session.loggedIn && (
          <button type="button" className="nav-drawer-logout" onClick={handleLogout}>
            <FiLogOut aria-hidden="true" /> Log out
          </button>
        )}
      </aside>

      {/* =====================================
          LOCATION POPUP
      ===================================== */}

      {showLocation && (
        <div
          className="location-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeLocationPopup();
          }}
        >
          <div
            className="location-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="location-title"
          >
            <button
              type="button"
              className="close-location"
              aria-label="Close"
              onClick={closeLocationPopup}
            >
              <FiX aria-hidden="true" />
            </button>

            <h2 id="location-title">Change delivery location</h2>
            <p>Enter your PIN code and delivery address.</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveLocation();
              }}
            >
              <label htmlFor="location-pincode">PIN code</label>
              <input
                id="location-pincode"
                ref={pinInputRef}
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="6-digit PIN code"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              />

              <label htmlFor="location-address">Full address</label>
              <textarea
                id="location-address"
                rows="4"
                placeholder="House no., street, area, city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              {locationError && (
                <p className="location-error" role="alert">
                  {locationError}
                </p>
              )}

              <button
                type="submit"
                className="save-location"
                disabled={locationLoading}
              >
                {locationLoading ? "Finding..." : "Save address"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
