import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api.js";
import { removeFromCart, updateQuantity } from "../features/cartSlice.js";
import { addToWishlist } from "../features/wishlistSlice.js";
import { formatCurrency, getImage } from "../utils/format.js";

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const productTarget = item.slug || item.product?.slug || item.productId || item._id || item.product?._id || item.product;
  const productPath = `/products/${productTarget}`;
  const productId = item.productId || item.product?._id || item._id || item.product;
  const cartItemId = item.cartItemId || item.itemId || (item.product ? item._id : null);
  const quantity = Math.max(1, Number(item.quantity || 1));

  const persistQuantity = async (nextQuantity) => {
    dispatch(updateQuantity({ cartId: item.cartId, quantity: nextQuantity }));
    if (user && cartItemId) {
      try {
        await api.put(`/cart/${cartItemId}`, { quantity: nextQuantity });
      } catch (error) {
        toast.error(error.response?.data?.message || "Could Not Update Cart");
      }
    }
  };

  const decrease = () => {
    if (quantity <= 1) return;
    persistQuantity(quantity - 1);
  };

  const increase = () => {
    persistQuantity(quantity + 1);
  };

  const remove = async () => {
    dispatch(removeFromCart(item.cartId));
    if (user && cartItemId) {
      try {
        await api.delete(`/cart/${cartItemId}`);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could Not Remove Cart Item");
      }
    }
  };

  const moveToWishlist = async () => {
    if (!user) {
      toast.info("Login to Save Items to Wishlist");
      return;
    }

    try {
      dispatch(addToWishlist({ ...item, _id: productId }));
      await api.post(`/wishlist/${productId}`);
      await remove();
      toast.success("Moved to Wishlist");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could Not Move to Wishlist");
    }
  };

  return (
    <div className="cart-item">
      <Link className="cart-item-image" to={productPath}>
        <img src={getImage(item)} alt={item.name} />
      </Link>
      <div>
        <Link to={productPath}>
          <h3>{item.name}</h3>
        </Link>
        <p>{[item.color, item.size, item.fabric].filter(Boolean).join(" / ")}</p>
        <strong>{formatCurrency(item.discountPrice || item.price)}</strong>
      </div>
      <div className="cart-quantity-stepper" aria-label="Quantity">
        <button type="button" onClick={decrease} disabled={quantity <= 1} aria-label="Decrease Quantity">
          <Minus size={15} />
        </button>
        <span>{quantity}</span>
        <button type="button" onClick={increase} aria-label="Increase Quantity">
          <Plus size={15} />
        </button>
      </div>
      <div className="cart-item-actions">
        <button className="text-button move-wishlist" type="button" onClick={moveToWishlist}>
          <Heart size={16} />
          Move to Wishlist
        </button>
        <button className="icon-button" onClick={remove} aria-label="Remove Item">
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
