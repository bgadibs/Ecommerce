import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../services/api";

function ProductDetails() {

  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    getProductById(id)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });

  }, [id]);

  if (loading) {
    return (
      <div className="message">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="message">
        Product not found.
      </div>
    );
  }

  const finalPrice =
    product.price -
    (product.price * (product.discount || 0)) / 100;

  return (
    <div className="details">

      <div className="details-image">

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

      <div className="details-info">

        <h1>{product.name}</h1>

        <p>
          Brand: {product.brand || "ShopKart"}
        </p>

        <p>
          Category: {product.category_name}
        </p>

        <p>
          {product.description}
        </p>

        <h2>
          ₹{finalPrice.toFixed(2)}
        </h2>

        {product.discount > 0 && (
          <p>
            <del>
              ₹{Number(product.price).toFixed(2)}
            </del>

            {" "}

            <strong>
              {product.discount}% OFF
            </strong>
          </p>
        )}

        <p>
          Available Stock: {product.stock}
        </p>

        <button
          className="cart-button"
          disabled={product.stock <= 0}
        >
          🛒 Add to Cart
        </button>

        <br />

        <Link
          className="back-button"
          to="/products"
        >
          ← Back to Products
        </Link>

      </div>

    </div>
  );
}

export default ProductDetails;