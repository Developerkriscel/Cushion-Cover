import { Helmet } from "react-helmet-async";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  return (
    <>
      <Helmet>
        <title>Order Confirmed | Elegant Home Decor</title>
      </Helmet>
      <section className="container success-page">
        <CheckCircle2 />
        <span className="eyebrow">Payment Success</span>
        <h1>Your Order Is Confirmed</h1>
        <p>Order ID: {params.get("orderId") || "EHD-ORDER"}</p>
        <p>Payment ID: {params.get("paymentId") || "Processing"}</p>
        {params.get("guest") === "true" && <p>Track This Order With Your Order ID and Email Address.</p>}
        <p>Estimated Delivery: 4-7 Business Days</p>
        <Link className="button primary" to="/products">
          Continue Shopping
        </Link>
        {params.get("guest") === "true" && (
          <Link className="button secondary" to={`/track-order?orderId=${params.get("orderId") || ""}`}>
            Track Order
          </Link>
        )}
      </section>
    </>
  );
}
