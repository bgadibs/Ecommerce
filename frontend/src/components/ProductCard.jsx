import { Link } from "react-router-dom";
import {
    addToCart,
    addToWishlist
} from "../services/api";
function ProductCard({ product }) {

    const finalPrice =
        Number(product.price) -
        Number(product.price) *
        (Number(product.discount || 0) / 100);

    const handleCart = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {

            // Add product to cart
            await addToCart(product.id, 1);

            // Tell Navbar that cart has changed
            window.dispatchEvent(
                new Event("cartUpdated")
            );

            alert("Product added to cart");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to add product to cart"
            );
        }
    };

    const handleWishlist = async () => {

        const token =
            localStorage.getItem("token");

        if (!token) {
            alert("Please login first");
            return;
        }

        try {

            await addToWishlist(product.id);

            alert("Product added to wishlist");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                "Unable to add product to wishlist"
            );
        }
    };

    return (
        <div className="product-card">

            <div className="product-image">

                {product.image ? (

                    <img
                        src={product.image}
                        alt={product.name}
                    />

                ) : (

                    <div className="no-image">
                        No Image
                    </div>

                )}

            </div>

            <div className="product-info">

                <h3>
                    {product.name}
                </h3>

                <p className="brand">
                    {product.brand || "ShopKart"}
                </p>

                <div className="price">

                    <strong>
                        ₹{finalPrice.toFixed(2)}
                    </strong>

                    {product.discount > 0 && (

                        <span className="old-price">
                            ₹{Number(
                                product.price
                            ).toFixed(2)}
                        </span>

                    )}

                </div>

                {product.stock > 0 ? (

                    <span className="stock available">
                        In Stock
                    </span>

                ) : (

                    <span className="stock unavailable">
                        Out of Stock
                    </span>

                )}

                <Link
                    className="view-button"
                    to={`/products/${product.id}`}
                >
                    View Details
                </Link>

                <button
                    className="cart-button"
                    disabled={product.stock <= 0}
                    onClick={handleCart}
                >
                    🛒 Add to Cart
                </button>

                <button
                    className="wishlist-button"
                    onClick={handleWishlist}
                >
                    ❤️ Wishlist
                </button>

            </div>

        </div>
    );
}

export default ProductCard;