import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../services/api.js";
import OrderStatusBadge from "../components/OrderStatusBadge.jsx";
import { formatCurrency } from "../utils/format.js";

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ orderNumber: searchParams.get("orderId") || "", email: "" });
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setOrder(null);
    try {
      const { data } = await api.post("/orders/guest/track", form);
      setOrder(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could Not Track Guest Order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Track Order | Elegant Home Decor</title>
      </Helmet>
      <section className="container page-layout">
        <div className="dashboard-panel">
          <span className="eyebrow">Guest Order Tracking</span>
          <h1>Track Your Order</h1>
          <form className="dashboard-form" onSubmit={submit}>
            <input placeholder="Order ID" value={form.orderNumber} onChange={(event) => update("orderNumber", event.target.value)} required />
            <input type="email" placeholder="Email Address" value={form.email} onChange={(event) => update("email", event.target.value)} required />
            <button className="button primary" disabled={loading}>
              {loading ? "Tracking..." : "Track Order"}
            </button>
          </form>
        </div>
        <aside className="summary-card">
          <h2>Order Summary</h2>
          {order ? (
            <>
              <p><span>Order ID</span><strong>{order.orderNumber}</strong></p>
              <p><span>Status</span><OrderStatusBadge status={order.orderStatus} /></p>
              <p><span>Payment</span><strong>{order.paymentMethod}</strong></p>
              <p className="total"><span>Total</span><strong>{formatCurrency(order.totalPrice)}</strong></p>
            </>
          ) : (
            <div className="empty-state">Enter Your Order ID and Email Address.</div>
          )}
        </aside>
      </section>
    </>
  );
}
