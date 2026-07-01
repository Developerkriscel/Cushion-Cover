import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../features/authSlice.js";
import api from "../services/api.js";

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("ehd_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function ProtectedAdminRoute() {
  const reduxUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const location = useLocation();

  const user = reduxUser || getUserFromStorage();

  useEffect(() => {
    if (user && !reduxUser) {
      console.log("[ProtectedAdminRoute] hydrating redux from localStorage");
      dispatch(setUser(user));
    }
  }, [user, reduxUser, dispatch]);

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    console.log("[ProtectedAdminRoute] no admin user, redirecting to login");
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }

  useEffect(() => {
    let cancelled = false;
    async function backgroundVerify() {
      try {
        console.log("[ProtectedAdminRoute] background verify call");
        const res = await api.get("/auth/admin/verify");
        console.log("[ProtectedAdminRoute] background verify ok:", res.data);
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401) {
          console.warn("[ProtectedAdminRoute] background verify 401, logging out");
          dispatch(logout());
        } else {
          console.warn("[ProtectedAdminRoute] background verify failed (non-401):", err.response?.data || err.message);
        }
      }
    }
    backgroundVerify();
    return () => { cancelled = true; };
  }, [dispatch]);

  return <Outlet />;
}