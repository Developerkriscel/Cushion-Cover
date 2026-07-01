import { Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api.js";
import { savePendingAction } from "../utils/pendingAction.js";

export default function LikeButton({ product, onChange, showCount = true }) {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  const initialLiked = useMemo(
    () => Boolean(user?._id && product?.likedBy?.some((id) => id === user._id || id?._id === user._id)),
    [product?.likedBy, user?._id]
  );
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(product?.likesCount || product?.likedBy?.length || 0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLiked(initialLiked);
    setLikesCount(product?.likesCount || product?.likedBy?.length || 0);
  }, [initialLiked, product?.likesCount, product?.likedBy]);

  const toggleLike = async () => {
    if (!user) {
      savePendingAction({ type: "addToWishlist", product });
      toast.info("Please Login to Like Products");
      navigate("/login", { state: { from: location.pathname } });
      return;
    }

    if (!product?.slug && !product?._id) return;

    const previousLiked = liked;
    const previousCount = likesCount;
    const nextLiked = !previousLiked;
    const nextCount = Math.max(0, previousCount + (nextLiked ? 1 : -1));

    setLiked(nextLiked);
    setLikesCount(nextCount);
    setLoading(true);

    try {
      const productKey = product.slug || product._id;
      const { data } = await api.post(`/products/${productKey}/like`);
      setLiked(data.liked);
      setLikesCount(data.likesCount);
      onChange?.({ liked: data.liked, likesCount: data.likesCount });
    } catch (error) {
      setLiked(previousLiked);
      setLikesCount(previousCount);
      toast.error(error.response?.data?.message || "Could Not Update Like");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`icon-button like-button ${liked ? "active" : ""}`}
      onClick={toggleLike}
      disabled={loading}
      aria-label={liked ? "Unlike Product" : "Like Product"}
      type="button"
    >
      <Heart size={18} fill={liked ? "currentColor" : "none"} />
      {showCount && <span>{likesCount}</span>}
    </button>
  );
}
