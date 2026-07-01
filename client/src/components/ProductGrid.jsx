import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (!products.length) return <div className="empty-state">No Products Matched Your Selection.</div>;
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
