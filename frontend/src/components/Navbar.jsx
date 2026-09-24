import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../services/api";
import "../css/navbar.css";

function Navbar() {

  const [search, setSearch] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // =====================================
  // LOCATION STATES
  // =====================================

  const [location, setLocation] = useState(
    localStorage.getItem("location") || "Select Location"
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


  const navigate = useNavigate();


  // =====================================
  // LOAD CART COUNT
  // =====================================

  const loadCartCount = async () => {

    try {

      const response = await getCart();

      const cart = Array.isArray(response.data)
        ? response.data
        : [];

      const count = cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );

      setCartCount(count);

    } catch (error) {

      console.error(
        "Failed to load cart count:",
        error
      );

      setCartCount(0);

    }

  };


  // =====================================
  // LISTEN FOR CART UPDATES
  // =====================================

  useEffect(() => {

    loadCartCount();

    const handleCartUpdated = () => {
      loadCartCount();
    };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdated
    );

    return () => {

      window.removeEventListener(
        "cartUpdated",
        handleCartUpdated
      );

    };

  }, []);


  // =====================================
  // SEARCH
  // =====================================

  const handleSearch = (e) => {

    e.preventDefault();

    const value = search.trim();

    if (value === "") {

      navigate("/products");

      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(value)}`
    );

  };


  // =====================================
  // OPEN LOCATION POPUP
  // =====================================

  const openLocationPopup = () => {

    setLocationError("");
    setShowLocation(true);

  };


  // =====================================
  // CLOSE LOCATION POPUP
  // =====================================

  const closeLocationPopup = () => {

    setShowLocation(false);
    setLocationError("");

  };


  // =====================================
  // SAVE LOCATION
  // =====================================

  const handleSaveLocation = async () => {

    // Check PIN

    if (!/^[0-9]{6}$/.test(pincode)) {

      setLocationError(
        "Please enter a valid 6-digit PIN code"
      );

      return;
    }


    // Check address

    if (!address.trim()) {

      setLocationError(
        "Please enter your full address"
      );

      return;
    }


    try {

      setLocationLoading(true);
      setLocationError("");


      // PIN CODE API

      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );


      const data = await response.json();


      // Check PIN response

      if (
        data[0].Status !== "Success" ||
        !data[0].PostOffice
      ) {

        setLocationError(
          "Location not found. Please check your PIN code."
        );

        return;
      }


      // Get first post office

      const postOffice =
        data[0].PostOffice[0];


      // Create location

      const newLocation =
        `${postOffice.Name}, ${postOffice.District} - ${pincode}`;


      // Update state

      setLocation(newLocation);


      // Save location

      localStorage.setItem(
        "location",
        newLocation
      );


      localStorage.setItem(
        "pincode",
        pincode
      );


      localStorage.setItem(
        "address",
        address
      );


      // Close popup

      setShowLocation(false);

    } catch (error) {

      console.error(
        "Location error:",
        error
      );

      setLocationError(
        "Unable to find location. Please try again."
      );

    } finally {

      setLocationLoading(false);

    }

  };


  return (

    <>

      {/* =====================================
          NAVBAR
      ===================================== */}

      <nav className="navbar">


        {/* =====================================
            LOGO
        ===================================== */}

        <div className="logo">

          <Link to="/">

            <span className="logo-b">
              B
            </span>

            <span className="logo-g">
              G
            </span>

            <span className="logo-adi">
              adi
            </span>

          </Link>

        </div>


        {/* =====================================
            LOCATION
        ===================================== */}

        <div className="navbar-location">

          <div className="navbar-location-icon">
            📍
          </div>


          <div className="navbar-location-details">

            <small>
              Delivering to
            </small>

            <strong>
              {location}
            </strong>

          </div>


          <button
            type="button"
            className="navbar-change-location"
            onClick={openLocationPopup}
          >
            Change
          </button>

        </div>


        {/* =====================================
            SEARCH
        ===================================== */}

        <form
          className="search"
          onSubmit={handleSearch}
        >

          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />


          <button type="submit">
            🔍
          </button>

        </form>


        {/* =====================================
            NAVIGATION LINKS
        ===================================== */}

        <div className="nav-links">


          <Link to="/home">
            Home
          </Link>


          <Link to="/products">
            Products
          </Link>


          <Link to="/login">
            Login
          </Link>


          <Link to="/register">
            Register
          </Link>


          {/* CART */}

          <Link
            to="/cart"
            className="cart-link"
          >

            🛒 Cart

            {cartCount > 0 && (

              <span className="cart-badge">
                {cartCount}
              </span>

            )}

          </Link>


          {/* WISHLIST */}

          <Link to="/wishlist">
            ❤️ Wishlist
          </Link>


          {/* PROFILE */}

          <Link to="/profile">
            👤 Profile
          </Link>


        </div>

      </nav>


      {/* =====================================
          LOCATION POPUP
      ===================================== */}

      {showLocation && (

        <div className="location-overlay">

          <div className="location-modal">


            {/* CLOSE */}

            <button
              type="button"
              className="close-location"
              onClick={closeLocationPopup}
            >
              ✕
            </button>


            {/* TITLE */}

            <h2>
              📍 Change Location
            </h2>


            <p>
              Enter your PIN code and
              delivery address
            </p>


            {/* PIN CODE */}

            <label>
              PIN Code
            </label>


            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit PIN code"
              value={pincode}
              onChange={(e) => {

                const value =
                  e.target.value.replace(
                    /\D/g,
                    ""
                  );

                setPincode(value);

              }}
            />


            {/* ADDRESS */}

            <label>
              Full Address
            </label>


            <textarea
              rows="4"
              placeholder="House No, Street, Area, City"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
            />


            {/* ERROR */}

            {locationError && (

              <p className="location-error">
                {locationError}
              </p>

            )}


            {/* SAVE */}

            <button
              type="button"
              className="save-location"
              onClick={handleSaveLocation}
              disabled={locationLoading}
            >

              {locationLoading
                ? "Finding..."
                : "Save Address"}

            </button>

          </div>

        </div>

      )}

    </>

  );

}

export default Navbar;