import { useEffect, useState } from "react";

import {
    getWishlist,
    removeFromWishlist,
    addToCart
} from "../services/api";


function Wishlist() {

    const [wishlist, setWishlist] = useState([]);


    // =========================
    // LOAD WISHLIST
    // =========================

    const loadWishlist = async () => {

        try {

            const response = await getWishlist();

            console.log(
                "Wishlist:",
                response.data
            );

            setWishlist(response.data);

        } catch (error) {

            console.error(
                "Unable to load wishlist:",
                error
            );

        }

    };


    useEffect(() => {

        loadWishlist();

    }, []);


    // =========================
    // REMOVE FROM WISHLIST
    // =========================

    const removeProduct = async (productId) => {

        try {

            await removeFromWishlist(productId);

            await loadWishlist();

        } catch (error) {

            console.error(
                "Remove wishlist error:",
                error
            );

        }

    };


    // =========================
    // MOVE TO CART
    // =========================

    const moveToCart = async (productId) => {

        try {

            await addToCart(productId, 1);

            window.dispatchEvent(new Event("cartUpdated"));

            await removeFromWishlist(productId);

            await loadWishlist();

            alert("Product moved to cart");

        } catch (error) {

            console.error(
                "Move to cart error:",
                error
            );

        }

    };


    // =========================
    // IMAGE URL
    // =========================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // External image
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        // Images inside public folder
        if (image.startsWith("/")) {
            return image;
        }

        return `/${image}`;

    };


    return (

        <div className="section wishlist-page">

            <h1>
                ❤️ My Wishlist
            </h1>


            {/* =========================
                EMPTY WISHLIST
            ========================= */}

            {wishlist.length === 0 ? (

                <div className="message">

                    Your wishlist is empty.

                </div>

            ) : (


                /* =========================
                   WISHLIST GRID
                ========================= */

                <div className="wishlist-grid">

                    {wishlist.map((item) => (

                        <div
                            className="wishlist-card"
                            key={item.id}
                        >


                            {/* =========================
                                PRODUCT IMAGE
                            ========================= */}

                            <div className="wishlist-image">

                                {item.image ? (

                                    <img
                                        src={getImageUrl(
                                            item.image
                                        )}
                                        alt={
                                            item.name ||
                                            "Product"
                                        }

                                        onError={(e) => {

                                            console.error(
                                                "Image not found:",
                                                item.image
                                            );

                                            e.target.style.display =
                                                "none";

                                        }}
                                    />

                                ) : (

                                    <div className="no-image">

                                        No Image

                                    </div>

                                )}

                            </div>


                            {/* =========================
                                PRODUCT INFORMATION
                            ========================= */}

                            <div className="wishlist-info">


                                {/* PRODUCT NAME */}

                                <h2>

                                    {item.name ||
                                        "Product Name"}

                                </h2>


                                {/* CATEGORY */}

                                {item.category && (

                                    <p className="wishlist-category">

                                        {item.category}

                                    </p>

                                )}


                                {/* PRICE */}

                                <p className="wishlist-price">

                                    ₹
                                    {Number(
                                        item.price || 0
                                    ).toFixed(2)}

                                </p>


                                {/* =========================
                                    BUTTONS
                                ========================= */}

                                <div className="wishlist-actions">


                                    {/* MOVE TO CART */}

                                    <button
                                        className="wishlist-cart-button"

                                        onClick={() =>
                                            moveToCart(
                                                item.product_id
                                            )
                                        }
                                    >

                                        🛒 Move to Cart

                                    </button>


                                    {/* REMOVE */}

                                    <button
                                        className="wishlist-remove-button"

                                        onClick={() =>
                                            removeProduct(
                                                item.product_id
                                            )
                                        }
                                    >

                                        ❌ Remove

                                    </button>


                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default Wishlist;