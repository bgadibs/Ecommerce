import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";


function Home() {

    // =================================
    // STATES
    // =================================

    const [showWelcome, setShowWelcome] = useState(true);

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =================================
    // WELCOME TIMER
    // =================================

    useEffect(() => {

        const timer = setTimeout(() => {

            setShowWelcome(false);

        }, 1000);

        return () => clearTimeout(timer);

    }, []);


    // =================================
    // LOAD PRODUCTS
    // =================================

    useEffect(() => {

        const loadProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await getProducts();

                console.log(
                    "Products:",
                    response.data
                );

                setProducts(response.data);

            } catch (error) {

                console.error(
                    "Unable to load products:",
                    error
                );

                setError(
                    "Unable to load products"
                );

            } finally {

                setLoading(false);

            }

        };

        loadProducts();

    }, []);


    // =================================
    // HOME PAGE
    // =================================

    return (

        <div className="home-page">


            {/* =================================
                WELCOME SECTION
            ================================= */}

            {showWelcome && (

                <section className="hero-section">

                    <div className="hero-content">

                        <span className="hero-small">
                            ✨ NEW COLLECTION 2026
                        </span>


                        <h1>

                            Welcome to

                            <span>
                                {" "}BGADI Shop
                            </span>

                        </h1>


                        <p>

                            Discover jewellery, men's fashion,
                            women's fashion and kids' collections
                            all in one place.

                        </p>


                        <Link
                            to="/products"
                            className="shop-now-button"
                        >

                            Shop Now →

                        </Link>

                    </div>

                </section>

            )}


            {/* =================================
                MAIN HOME CONTENT
            ================================= */}

            {!showWelcome && (

                <>


                    {/* =================================
                        HERO BANNER
                    ================================= */}

                    <section className="home-banner">

                        <div className="banner-content">

                            <span className="banner-label">
                                ✨ NEW COLLECTION
                            </span>


                            <h1>

                                Upgrade Your

                                <br />

                                <span>
                                    Style Today
                                </span>

                            </h1>


                            <p>

                                Fashion for everyone.
                                Discover our latest collection.

                            </p>


                            <Link
                                to="/products"
                                className="shop-now-button"
                            >

                                Shop Now →

                            </Link>

                        </div>


                        <div className="banner-decoration">

                            🛍️

                        </div>

                    </section>


                    {/* =================================
                        CATEGORY SECTION
                    ================================= */}

                    <section className="category-section">


                        <div className="section-heading">


                            <div>

                                <span>
                                    EXPLORE
                                </span>


                                <h2>
                                    Shop By Category
                                </h2>

                            </div>


                            <Link to="/products">

                                View All →

                            </Link>

                        </div>


                        <div className="category-container">


                            {/* JEWELLERY */}

                            <Link
                                to="/products?category=Jewellery"
                                className="category-card"
                            >

                                <div className="category-icon">

                                    💎

                                </div>


                                <h3>

                                    Jewellery

                                </h3>


                                <p>

                                    Elegant Collection

                                </p>

                            </Link>


                            {/* MEN */}

                            <Link
                                to="/products?category=Men's Clothing"
                                className="category-card"
                            >

                                <div className="category-icon">

                                    👔

                                </div>


                                <h3>

                                    Men's Fashion

                                </h3>


                                <p>

                                    Smart & Stylish

                                </p>

                            </Link>


                            {/* WOMEN */}

                            <Link
                                to="/products?category=Women's Clothing"
                                className="category-card"
                            >

                                <div className="category-icon">

                                    👗

                                </div>


                                <h3>

                                    Women's Fashion

                                </h3>


                                <p>

                                    Latest Trends

                                </p>

                            </Link>


                            {/* KIDS */}

                            <Link
                                to="/products?category=Kids Clothing"
                                className="category-card"
                            >

                                <div className="category-icon">

                                    👶

                                </div>


                                <h3>

                                    Kids Fashion

                                </h3>


                                <p>

                                    Cute & Comfortable

                                </p>

                            </Link>


                        </div>

                    </section>


                    {/* =================================
                        LATEST PRODUCTS
                    ================================= */}

                    <section className="home-products-section">


                        <div className="section-heading">


                            <div>

                                <span>
                                    OUR COLLECTION
                                </span>


                                <h2>
                                    Latest Products
                                </h2>

                            </div>


                            <Link to="/products">

                                View All →

                            </Link>

                        </div>


                        {/* =================================
                            LOADING
                        ================================= */}

                        {loading && (

                            <p className="message">

                                Loading products...

                            </p>

                        )}


                        {/* =================================
                            ERROR
                        ================================= */}

                        {!loading && error && (

                            <p className="error">

                                {error}

                            </p>

                        )}


                        {/* =================================
                            NO PRODUCTS
                        ================================= */}

                        {!loading &&
                            !error &&
                            products.length === 0 && (

                                <p className="message">

                                    No products available.

                                </p>

                            )}


                        {/* =================================
                            PRODUCTS
                        ================================= */}

                        {!loading &&
                            !error &&
                            products.length > 0 && (

                                <div className="home-product-grid">

                                    {products
                                        .slice(0, 8)
                                        .map((product) => (

                                            <ProductCard
                                                key={product.id}
                                                product={product}
                                            />

                                        ))}

                                </div>

                            )}

                    </section>


                    {/* =================================
                        WHY SHOP WITH US
                    ================================= */}

                    <section className="why-section">


                        <div className="why-heading">

                            <span>

                                WHY BGADI?

                            </span>


                            <h2>

                                Shopping Made Simple

                            </h2>

                        </div>


                        <div className="why-container">


                            {/* DELIVERY */}

                            <div className="why-card">

                                <div>
                                    🚚
                                </div>


                                <h3>

                                    Fast Delivery

                                </h3>


                                <p>

                                    Get your products delivered
                                    quickly and safely.

                                </p>

                            </div>


                            {/* SECURITY */}

                            <div className="why-card">

                                <div>
                                    🔒
                                </div>


                                <h3>

                                    Secure Shopping

                                </h3>


                                <p>

                                    Your information is protected
                                    with secure payments.

                                </p>

                            </div>


                            {/* PAYMENT */}

                            <div className="why-card">

                                <div>
                                    💳
                                </div>


                                <h3>

                                    Easy Payment

                                </h3>


                                <p>

                                    Simple and convenient
                                    payment options.

                                </p>

                            </div>


                            {/* RETURNS */}

                            <div className="why-card">

                                <div>
                                    ↩️
                                </div>


                                <h3>

                                    Easy Returns

                                </h3>


                                <p>

                                    Shop confidently with
                                    easy return options.

                                </p>

                            </div>


                        </div>

                    </section>


                </>

            )}

        </div>

    );

}


export default Home;