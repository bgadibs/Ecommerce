import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  getProducts,
  searchProducts,
} from "../services/api";

import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";


  // =====================================
  // LOAD PRODUCTS
  // =====================================

  useEffect(() => {
    const loadProducts = async () => {
      try {
        let response;

        if (search.trim() !== "") {
          response = await searchProducts(search);
        } else {
          response = await getProducts();
        }

        setProducts(response.data || []);
      } catch (error) {
        console.error(
          "Product loading error:",
          error
        );

        setProducts([]);
      }
    };

    loadProducts();
  }, [search]);


  // =====================================
  // CATEGORY + SEARCH FILTER
  // =====================================

  useEffect(() => {
    let result = [...products];

    // CATEGORY
    if (category.trim() !== "") {
      const categoryIds = {
        "jewellery": 1,
        "men's clothing": 2,
        "women's clothing": 3,
        "kids clothing": 4,
      };

      const selectedCategoryId =
        categoryIds[
          category.toLowerCase().trim()
        ];

      if (selectedCategoryId) {
        result = result.filter(
          (product) =>
            Number(product.category_id) ===
            selectedCategoryId
        );
      }
    }

    // SEARCH
    if (search.trim() !== "") {
      result = result.filter((product) =>
        product.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    setFilteredProducts(result);
  }, [products, category, search]);


  // =====================================
  // PAGE TITLE
  // =====================================

  let pageTitle = "All Products";

  if (category) {
    pageTitle = category;
  }

  if (search) {
    pageTitle = `Search results for "${search}"`;
  }


  // =====================================
  // RETURN
  // =====================================

  return (
    <div className="products-page">

      {/* =================================
          HEADER
      ================================= */}

      <div className="products-header">

        <h1>
          {pageTitle}
        </h1>

        {search && (
          <p>
            Showing products matching{" "}
            <strong>"{search}"</strong>
          </p>
        )}

        {category && !search && (
          <p>
            Category:{" "}
            <strong>{category}</strong>
          </p>
        )}

      </div>


      {/* =================================
          PRODUCT GRID
      ================================= */}

      <div className="products-grid">

        {filteredProducts.length > 0 ? (

          filteredProducts.map((product) => (

            <div
              className="product-grid-item"
              key={product.id}
            >
              <ProductCard
                product={product}
              />
            </div>

          ))

        ) : (

          <div className="no-products">

            <div className="no-products-box">

              <div className="no-products-icon">
                🛍️
              </div>

              <h3>
                No Products Found
              </h3>

              <p>
                Try searching for another
                product or category.
              </p>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Products;