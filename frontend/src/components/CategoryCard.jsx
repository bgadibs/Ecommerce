import { Link } from "react-router-dom";

function CategoryCard({ name, icon, category }) {
  return (
    <Link
      to={`/products?category=${encodeURIComponent(category)}`}
      className="category-card"
    >
      <div className="category-icon">{icon}</div>

      <h3>{name}</h3>

      <button>Shop Now</button>
    </Link>
  );
}

export default CategoryCard;