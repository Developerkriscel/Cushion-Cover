import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { login } from "../features/authSlice.js";
import ErrorMessage from "../components/ErrorMessage.jsx";
import PasswordInput from "../components/PasswordInput.jsx";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { loading, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    const result = await dispatch(login({ email: form.email, password: form.password }));
    console.log("[AdminLogin] login result:", result);
    if (result.error) {
      console.error("[AdminLogin] login error:", result.error);
      return;
    }

    const user = result.payload;
    console.log("[AdminLogin] user payload:", user);
    if (!user || user.role !== "admin") {
      console.error("[AdminLogin] user missing or not admin:", user);
      dispatch({ type: "auth/logout" });
      toast.error("Admin access required");
      return;
    }

    console.log("[AdminLogin] admin verified, navigating...");
    toast.success("Admin Login Successful");
    navigate("/admin", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Elegant Home Decor</title>
      </Helmet>
      <section className="auth-page admin-login-page">
        <div className="auth-image-panel" aria-hidden="true">
          <div>
            <span>Elegant Home Decor</span>
            <p>Admin Dashboard Access</p>
          </div>
        </div>
        <div className="auth-form-panel">
          <div className="auth-panel">
            <Link to="/" className="auth-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'inherit' }}>
              <img 
                src="https://res.cloudinary.com/djligggal/image/upload/v1782812327/ChatGPT_Image_Jun_30_2026_03_08_25_PM_drkks8.png" 
                alt="Elegant Home Decor" 
                style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
              />
              <span>Elegant</span> Home Decor
            </Link>
            <span className="eyebrow auth-kicker">Admin Portal</span>
            <h1>Admin Sign In</h1>
            <p className="auth-subtitle">Enter your credentials to access the admin dashboard</p>
            <ErrorMessage message={error} />
            <form onSubmit={submit}>
              <input type="email" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
              <PasswordInput placeholder="Password" value={form.password} onChange={(event) => update("password", event.target.value)} required />
              <button className="button primary full auth-submit" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
            <Link to="/" className="auth-continue">Back to Store</Link>
          </div>
        </div>
      </section>
    </>
  );
}