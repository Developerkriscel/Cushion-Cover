export const formatCurrency = (value = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(value);

export const getImage = (product) =>
  product?.images?.[0]?.url || "https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=900&q=80";

export const discountPercent = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};
