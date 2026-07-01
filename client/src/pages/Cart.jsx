import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { applyCoupon, mergeDuplicates } from "../features/cartSlice.js";
import CartItem from "../components/CartItem.jsx";
import { formatCurrency } from "../utils/format.js";

export default function Cart() {
  const dispatch = useDispatch();
  const { items, coupon } = useSelector((state) => state.cart);
  const user = useSelector((state) => state.auth.user);
  const [code, setCode] = useState("");
  const subtotal = items.reduce((sum, item) => sum + (item.discountPrice || item.price) * item.quantity, 0);
  const discount = coupon ? Math.round(subtotal * 0.1) : 0;
  const shipping = subtotal > 2500 || subtotal === 0 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax - discount;

  useEffect(() => {
    dispatch(mergeDuplicates());
  }, [dispatch]);

  return (
    <>
      <Helmet>
        <title>Cart | Elegant Home Decor</title>
      </Helmet>
      <section className="container page-layout">
        <div>
          <span className="eyebrow">Shopping Cart</span>
          <h1>Your Selected Pieces</h1>
          {items.length ? (
            <div className="cart-list">
              {items.map((item) => (
                <CartItem key={item.cartId} item={item} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              Your Cart Is Empty. <Link to="/products">Start Shopping</Link>
            </div>
          )}
        </div>
        <aside className="summary-card">
          <h2>Price Summary</h2>
          <form
            className="coupon-form"
            onSubmit={(event) => {
              event.preventDefault();
              if (code.trim()) dispatch(applyCoupon({ code: code.trim().toUpperCase() }));
            }}
          >
            <input placeholder="Coupon Code" value={code} onChange={(event) => setCode(event.target.value)} />
            <button className="button ghost">Apply</button>
          </form>
          <p><span>Subtotal</span><strong>{formatCurrency(subtotal)}</strong></p>
          <p><span>Coupon</span><strong>-{formatCurrency(discount)}</strong></p>
          <p><span>Tax</span><strong>{formatCurrency(tax)}</strong></p>
          <p><span>Shipping</span><strong>{shipping ? formatCurrency(shipping) : "Free"}</strong></p>
          <p className="total"><span>Total</span><strong>{formatCurrency(total)}</strong></p>
          {user ? (
            <Link className={`button primary full ${!items.length ? "disabled" : ""}`} to="/checkout">
              Proceed to Checkout
            </Link>
          ) : (
            <div className="checkout-choice">
              <Link
                className={`button primary full ${!items.length ? "disabled" : ""}`}
                to="/login"
                onClick={() => localStorage.setItem("redirectAfterLogin", "/checkout")}
              >
                Login / Sign Up
              </Link>
              <Link className={`button secondary full ${!items.length ? "disabled" : ""}`} to="/checkout/guest">
                Continue as Guest
              </Link>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
