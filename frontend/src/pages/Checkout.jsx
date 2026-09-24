import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {

    const navigate = useNavigate();

    // =========================
    // FORM STATE
    // =========================

    const [form, setForm] = useState({
        address: "",
        city: "",
        state: "",
        pincode: "",
        payment_method: "cod"
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value
        });

    };

    // =========================
    // PLACE ORDER
    // =========================

    const handleOrder = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        // Check pincode
        if (!/^[0-9]{6}$/.test(form.pincode)) {

            setError("Please enter a valid 6-digit pincode");

            return;
        }

        try {

            setLoading(true);

            // Get login token
            const token = localStorage.getItem("token");

            if (!token) {

                setError("Please login before placing an order");

                setLoading(false);

                return;
            }

            // =========================
            // SEND ORDER TO BACKEND
            // =========================

            const response = await axios.post(
                "http://localhost:5000/api/orders",
                {
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    pincode: form.pincode,
                    payment_method: form.payment_method
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            console.log(
                "Order response:",
                response.data
            );

            setMessage("Order placed successfully! 🎉");

            // Go to orders page after 1 second
            setTimeout(() => {

                navigate("/orders");

            }, 1000);

        } catch (error) {

            console.error(
                "Place order error:",
                error
            );

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Failed to place order"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="checkout-page">

            <h1 className="checkout-title">
                Checkout 🛒
            </h1>


            <div className="checkout-container">


                {/* =================================
                    LEFT SIDE
                ================================= */}

                <form
                    className="checkout-form"
                    onSubmit={handleOrder}
                >

                    <h2>
                        Delivery Information
                    </h2>


                    {/* ADDRESS */}

                    <div className="checkout-field">

                        <label>
                            Delivery Address
                        </label>

                        <textarea
                            name="address"
                            placeholder="Enter your full address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        ></textarea>

                    </div>


                    {/* CITY + STATE */}

                    <div className="checkout-row">


                        <div className="checkout-field">

                            <label>
                                City
                            </label>

                            <input
                                type="text"
                                name="city"
                                placeholder="Enter city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div className="checkout-field">

                            <label>
                                State
                            </label>

                            <input
                                type="text"
                                name="state"
                                placeholder="Enter state"
                                value={form.state}
                                onChange={handleChange}
                                required
                            />

                        </div>

                    </div>


                    {/* PINCODE */}

                    <div className="checkout-field">

                        <label>
                            Pincode
                        </label>

                        <input
                            type="text"
                            name="pincode"
                            placeholder="Enter 6-digit pincode"
                            maxLength="6"
                            value={form.pincode}
                            onChange={(e) => {

                                const value =
                                    e.target.value.replace(/\D/g, "");

                                setForm({
                                    ...form,
                                    pincode: value
                                });

                            }}
                            required
                        />

                    </div>


                    {/* PAYMENT */}

                    <div className="payment-section">

                        <h3>
                            Payment Method
                        </h3>

                        <select
                            name="payment_method"
                            className="payment-select"
                            value={form.payment_method}
                            onChange={handleChange}
                            required
                        >

                            <option value="cod">
                                Cash on Delivery
                            </option>

                            <option value="online">
                                Online Payment
                            </option>

                        </select>

                    </div>


                    {/* ERROR */}

                    {error && (

                        <div className="checkout-error">
                            ❌ {error}
                        </div>

                    )}


                    {/* SUCCESS */}

                    {message && (

                        <div className="checkout-success">
                            ✅ {message}
                        </div>

                    )}


                    {/* PLACE ORDER */}

                    <button
                        type="submit"
                        className="place-order-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Placing Order..."
                            : "🛍️ Place Order"
                        }

                    </button>

                </form>


                {/* =================================
                    RIGHT SIDE
                ================================= */}

                <div className="checkout-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Items
                        </span>

                        <span>
                            1
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹2499.00
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <span>
                            Free
                        </span>

                    </div>


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <span>
                            ₹2499.00
                        </span>

                    </div>


                    <div className="checkout-security">

                        🔒 Secure Checkout

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Checkout;