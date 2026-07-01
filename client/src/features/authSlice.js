import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../services/api.js";

const savedUser = JSON.parse(localStorage.getItem("ehd_user") || "null");

export const login = createAsyncThunk("auth/login", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("ehd_user", JSON.stringify(data));
    dispatch(mergeGuestCartToServer(data));
    return data;
  } catch (error) {
    console.error("Login request failed", {
      message: error.message,
      status: error.response?.status,
      endpoint: `${api.defaults.baseURL}/auth/login`,
      response: error.response?.data
    });
    return rejectWithValue(error.response?.data?.message || "Login Failed");
  }
});

export const register = createAsyncThunk("auth/register", async (payload, { rejectWithValue, dispatch }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("ehd_user", JSON.stringify(data));
    dispatch(mergeGuestCartToServer(data));
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Registration Failed");
  }
});

export const mergeGuestCartToServer = createAsyncThunk("auth/mergeGuestCartToServer", async (user, { rejectWithValue }) => {
  try {
    const guestCart = JSON.parse(localStorage.getItem("ehd_cart") || "[]");
    if (!guestCart.length) return;

    const items = guestCart.map((item) => ({
      product: item.productId || item._id || item.product,
      quantity: item.quantity,
      color: item.color,
      size: item.size,
      fabric: item.fabric
    }));

    await api.post("/cart/sync", { items });
    localStorage.removeItem("ehd_cart");
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to merge cart");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: { user: savedUser, loading: false, error: "" },
  reducers: {
    logout(state) {
      state.user = null;
      localStorage.removeItem("ehd_user");
    },
    setUser(state, action) {
      state.user = action.payload;
      localStorage.setItem("ehd_user", JSON.stringify(action.payload));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
