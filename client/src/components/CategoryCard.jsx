import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link className="category-card" to={`/products?category=${category.slug}`}>
      <img src={category.image} alt={category.name} />
      <div>
        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>
    </Link>
  );
}
