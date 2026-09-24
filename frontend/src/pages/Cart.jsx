import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getCart,
    updateCartQuantity,
    removeFromCart
} from "../services/api";

function Cart() {

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // ===============================
    // LOAD CART
    // ===============================

    const loadCart = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await getCart();

            console.log("CART DATA:", response.data);

            setCart(response.data);

        } catch (error) {

            console.error(
                "Load cart error:",
                error
            );

            if (error.response?.status === 401) {

                setError(
                    "Please login to view your cart."
                );

            } else {

                setError(
                    "Unable to load cart."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // ===============================
    // LOAD CART WHEN PAGE OPENS
    // ===============================

    useEffect(() => {

        loadCart();

    }, []);


    // ===============================
    // INCREASE / DECREASE QUANTITY
    // ===============================

    const changeQuantity = async (
        productId,
        newQuantity
    ) => {

        console.log(
            "Product ID:",
            productId
        );

        console.log(
            "New Quantity:",
            newQuantity
        );


        // Quantity should never be less than 1
        if (newQuantity < 1) {
            return;
        }


        // =====================================
        // UPDATE UI IMMEDIATELY
        // =====================================

        setCart((currentCart) => {

            const updatedCart =
                currentCart.map((item) => {

                    if (
                        Number(item.product_id) ===
                        Number(productId)
                    ) {

                        return {
                            ...item,
                            quantity: Number(newQuantity)
                        };

                    }

                    return item;

                });


            console.log(
                "UPDATED CART:",
                updatedCart
            );


            return updatedCart;

        });


        // =====================================
        // UPDATE DATABASE
        // =====================================

        try {

            const response =
                await updateCartQuantity(
                    productId,
                    newQuantity
                );


            console.log(
                "UPDATE RESPONSE:",
                response
            );


        } catch (error) {

            console.error(
                "UPDATE ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );


            // =====================================
            // RESTORE DATABASE VALUE IF ERROR
            // =====================================

            await loadCart();

        }

    };


    // ===============================
    // REMOVE PRODUCT
    // ===============================

    const removeProduct = async (
        productId
    ) => {

        try {

            await removeFromCart(
                productId
            );

            await loadCart();

        } catch (error) {

            console.error(
                "Remove product error:",
                error
            );

        }

    };


    // ===============================
    // LOADING
    // ===============================

    if (loading) {

        return (

            <div className="section">

                <p className="message">
                    Loading cart...
                </p>

            </div>

        );

    }


    // ===============================
    // ERROR
    // ===============================

    if (error) {

        return (

            <div className="section">

                <p className="error">
                    {error}
                </p>

            </div>

        );

    }


    // ===============================
    // TOTAL
    // ===============================

    const total = cart.reduce(
        (sum, item) => {

            const price =
                Number(item.price) || 0;


            const discount =
                Number(item.discount) || 0;


            const finalPrice =
                price -
                (
                    price *
                    discount /
                    100
                );


            const quantity =
                Number(item.quantity) || 1;


            return sum +
                (
                    finalPrice *
                    quantity
                );

        },
        0
    );


    return (

        <div className="section">


            {/* =============================== */}
            {/* CART TITLE */}
            {/* =============================== */}

            <h1>
                Shopping Cart 🛒
            </h1>


            {/* =============================== */}
            {/* EMPTY CART */}
            {/* =============================== */}

            {cart.length === 0 ? (

                <div className="message">

                    <h2>
                        Your cart is empty
                    </h2>


                    <Link
                        to="/products"
                        className="checkout-button"
                    >
                        Continue Shopping
                    </Link>

                </div>

            ) : (

                <>


                    {/* =============================== */}
                    {/* CART PRODUCTS */}
                    {/* =============================== */}

                    <div className="cart-list">


                        {cart.map((item) => {


                            // =====================================
                            // PRICE
                            // =====================================

                            const price =
                                Number(item.price) || 0;


                            const discount =
                                Number(item.discount) || 0;


                            const finalPrice =
                                price -
                                (
                                    price *
                                    discount /
                                    100
                                );


                            // =====================================
                            // CURRENT QUANTITY
                            // =====================================

                            const quantity =
                                Number(item.quantity);


                            // =====================================
                            // ITEM TOTAL
                            // =====================================

                            const itemTotal =
                                finalPrice *
                                quantity;


                            console.log(
                                "RENDER ITEM:",
                                item.product_id,
                                "QUANTITY:",
                                item.quantity
                            );


                            return (

                                <div
                                    className="cart-item"
                                    key={item.product_id}
                                >


                                    {/* =============================== */}
                                    {/* IMAGE */}
                                    {/* =============================== */}

                                    <div className="cart-image">

                                        {item.image ? (

                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                onError={(e) => {

                                                    e.currentTarget.style.display =
                                                        "none";

                                                }}
                                            />

                                        ) : (

                                            <div className="no-image">
                                                No Image
                                            </div>

                                        )}

                                    </div>


                                    {/* =============================== */}
                                    {/* PRODUCT INFO */}
                                    {/* =============================== */}

                                    <div className="cart-info">


                                        {/* PRODUCT NAME */}

                                        <h2>
                                            {item.name}
                                        </h2>


                                        {/* =============================== */}
                                        {/* PRICE */}
                                        {/* =============================== */}

                                        <div className="price">

                                            <strong>
                                                ₹
                                                {finalPrice.toFixed(2)}
                                            </strong>


                                            {discount > 0 && (

                                                <span className="discount">

                                                    {discount.toFixed(2)}
                                                    % OFF

                                                </span>

                                            )}

                                        </div>


                                        {/* =============================== */}
                                        {/* QUANTITY */}
                                        {/* =============================== */}

                                        <div className="quantity">


                                            {/* DECREASE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeQuantity(
                                                        item.product_id,
                                                        quantity - 1
                                                    )
                                                }
                                                disabled={
                                                    quantity <= 1
                                                }
                                            >
                                                −
                                            </button>


                                            {/* CURRENT QUANTITY */}

                                            <span className="quantity-number">
                                                {quantity}
                                            </span>


                                            {/* INCREASE */}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeQuantity(
                                                        item.product_id,
                                                        quantity + 1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>


                                        {/* =============================== */}
                                        {/* ITEM TOTAL */}
                                        {/* =============================== */}

                                        <div className="item-total">

                                            ₹
                                            {itemTotal.toFixed(2)}

                                        </div>


                                        {/* =============================== */}
                                        {/* REMOVE */}
                                        {/* =============================== */}

                                        <button
                                            type="button"
                                            className="remove-button"
                                            onClick={() =>
                                                removeProduct(
                                                    item.product_id
                                                )
                                            }
                                        >
                                            🗑️ Remove
                                        </button>


                                    </div>

                                </div>

                            );

                        })}

                    </div>


                    {/* =============================== */}
                    {/* ORDER SUMMARY */}
                    {/* =============================== */}

                    <div className="cart-summary">


                        <h2>
                            Order Summary
                        </h2>


                        <p>

                            Items:

                            <strong>
                                {" "}
                                {cart.length}
                            </strong>

                        </p>


                        <p className="item-total">

                            Total:

                            ₹
                            {total.toFixed(2)}

                        </p>


                        {/* =============================== */}
                        {/* BUTTONS */}
                        {/* =============================== */}

                        <div
                            style={{
                                marginTop: "20px",
                                display: "flex",
                                gap: "10px",
                                justifyContent: "flex-end"
                            }}
                        >


                            <Link
                                to="/checkout"
                                className="checkout-button"
                            >
                                Proceed to Checkout
                            </Link>


                            <Link
                                to="/products"
                                className="back-button"
                            >
                                Continue Shopping
                            </Link>


                        </div>


                    </div>

                </>

            )}

        </div>

    );

}

export default Cart;