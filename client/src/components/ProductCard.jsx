import { ShoppingBag, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../features/cartSlice.js";
import LikeButton from "./LikeButton.jsx";
import { discountPercent, formatCurrency, getImage } from "../utils/format.js";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const discounted = product.discountPrice || product.price;

  const buyNow = () => {
    dispatch(
      addToCart({
        ...product,
        quantity: 1,
        cartId: `${product._id}-${Date.now()}`,
        color: product.colors?.[0],
        size: product.sizes?.[0],
        fabric: product.fabric
      })
    );
    toast.success("Added to Cart");
    navigate("/checkout");
  };

  return (
    <article className="product-card">
      <Link to={`/products/${product.slug}`} className="product-image">
        <img src={getImage(product)} alt={product.name} />
        <div className="badges">
          {product.bestSeller && <span>Best Seller</span>}
          {product.stock <= 8 && product.stock > 0 && <span>Low Stock</span>}
          {product.stock === 0 && <span>Out of Stock</span>}
        </div>
      </Link>
      <div className="product-body">
        <div className="rating">
          <Star size={15} fill="currentColor" />
          {product.ratings || 4.6} ({product.numReviews || 0})
        </div>
        <Link to={`/products/${product.slug}`}>
          <h3>{product.name}</h3>
        </Link>
        <p>{product.fabric}</p>
        <div className="price-row">
          <strong>{formatCurrency(discounted)}</strong>
          {product.discountPrice && <span>{formatCurrency(product.price)}</span>}
          {discountPercent(product.price, product.discountPrice) > 0 && <em>{discountPercent(product.price, product.discountPrice)}% Off</em>}
        </div>
        <div className="card-actions">
          <button className="button compact" onClick={buyNow} disabled={product.stock === 0}>
            <ShoppingBag size={17} />
            Buy
          </button>
          <LikeButton product={product} />
        </div>
      </div>
    </article>
  );
}
