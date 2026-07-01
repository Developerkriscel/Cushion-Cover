import { createSlice } from "@reduxjs/toolkit";

const getProductId = (item) => item.productId || item._id || item.product?._id || item.product;
const normalize = (value) => String(value || "").trim();
const getCartKey = (item) =>
  [getProductId(item), normalize(item.color), normalize(item.size), normalize(item.fabric)].join("|");

const mergeCartItems = (items = []) => {
  const merged = [];
  items.forEach((item) => {
    const found = merged.find((entry) => getCartKey(entry) === getCartKey(item));
    if (found) {
      found.quantity = Number(found.quantity || 1) + Number(item.quantity || 1);
    } else {
      merged.push({
        ...item,
        productId: getProductId(item),
        quantity: Math.max(1, Number(item.quantity || 1)),
        cartId: item.cartId || `${getCartKey(item)}-${Date.now()}-${merged.length}`
      });
    }
  });
  return merged;
};

const initialItems = mergeCartItems(JSON.parse(localStorage.getItem("ehd_cart") || "[]"));

const persist = (items) => localStorage.setItem("ehd_cart", JSON.stringify(items));
persist(initialItems);

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: initialItems, coupon: null },
  reducers: {
    addToCart(state, action) {
      const item = {
        ...action.payload,
        productId: getProductId(action.payload),
        quantity: Math.max(1, Number(action.payload.quantity || 1))
      };
      const found = state.items.find((entry) => getCartKey(entry) === getCartKey(item));
      if (found) found.quantity += item.quantity;
      else {
        state.items.push({
          ...item,
          cartId: item.cartId || `${getCartKey(item)}-${Date.now()}`
        });
      }
      state.items = mergeCartItems(state.items);
      persist(state.items);
    },
    mergeDuplicates(state) {
      state.items = mergeCartItems(state.items);
      persist(state.items);
    },
    updateQuantity(state, action) {
      const item = state.items.find((entry) => entry.cartId === action.payload.cartId);
      if (item) item.quantity = Math.max(1, action.payload.quantity);
      persist(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((entry) => entry.cartId !== action.payload);
      persist(state.items);
    },
    clearCart(state) {
      state.items = [];
      state.coupon = null;
      persist(state.items);
    },
    applyCoupon(state, action) {
      state.coupon = action.payload;
    }
  }
});

export const { addToCart, mergeDuplicates, updateQuantity, removeFromCart, clearCart, applyCoupon } = cartSlice.actions;
export default cartSlice.reducer;
