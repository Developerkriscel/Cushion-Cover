import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/authSlice.js";
import TopBanner from "./TopBanner.jsx";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const user = useSelector((state) => state.auth.user);

  const search = (event) => {
    event.preventDefault();
    if (query.trim()) navigate(`/products?search=${encodeURIComponent(query.trim())}`);
    setOpen(false);
  };

  const requireLogin = (event, destination) => {
    if (user) return;
    event.preventDefault();
    localStorage.setItem("redirectAfterLogin", destination);
    navigate("/login", { state: { from: destination } });
  };

  return (
    <header className="site-header">
      <TopBanner />
      <nav className="navbar container">
        <Link to="/" className="brand" onClick={() => setOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="https://res.cloudinary.com/djligggal/image/upload/v1782812327/ChatGPT_Image_Jun_30_2026_03_08_25_PM_drkks8.png" 
            alt="Elegant Home Decor" 
            style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
          />
          <span>Elegant</span> Home Decor
        </Link>
        <button className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle Navigation">
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-menu ${open ? "open" : ""}`}>
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/products?category=table-covers">Table Covers</NavLink>
          <NavLink to="/products?category=cushion-covers">Cushions</NavLink>
          <NavLink to="/products?category=aprons">Aprons</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {user?.role === "admin" && <NavLink to="/admin">Admin Dashboard</NavLink>}
        </div>
        <form className="nav-search" onSubmit={search}>
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        </form>
        <div className="nav-actions">
          <Link className="icon-link" to="/dashboard" title="Account">
            <UserRound />
          </Link>
          <Link className="icon-link counter" to="/dashboard#wishlist" title="Wishlist" onClick={(event) => requireLogin(event, "/dashboard#wishlist")}>
            <Heart />
            {user && wishlistCount > 0 && <span>{wishlistCount}</span>}
          </Link>
          <Link className="icon-link counter" to="/cart" title="Cart">
            <ShoppingBag />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          {user ? (
            <button className="text-button" onClick={() => dispatch(logout())}>
              Logout
            </button>
          ) : (
            <Link className="text-button" to="/login">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
