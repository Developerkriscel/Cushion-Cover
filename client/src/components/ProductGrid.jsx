import ProductCard from "./ProductCard.jsx";

export default function ProductGrid({ products }) {
  if (!products.length) return <div className="empty-state">No Products Matched Your Selection.</div>;
  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <div key={product._id} className="shop-product-wrap" style={{ animationDelay: `${i * 0.08}s` }}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
