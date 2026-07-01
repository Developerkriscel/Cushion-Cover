import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const getSuccessUrl = (returnUrl, orderId, paymentId) => {
  if (!returnUrl) return `/payment-success?orderId=${orderId}&paymentId=${paymentId}`;

  const url = new URL(returnUrl, window.location.origin);
  url.searchParams.set("paymentId", paymentId);
  return `${url.pathname}${url.search}`;
};

function StripePaymentForm({ amount, orderId, onSuccess, onError, returnUrl, clientSecret }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnUrl || `${window.location.origin}/payment-success?orderId=${orderId}`,
        },
      });

      if (confirmError) {
        await api.post("/payments/failure", {
          orderId,
          paymentId: confirmError.paymentIntent?.id,
          reason: confirmError.message
        }).catch(() => {});
        setError(confirmError.message || "Payment failed. Please try again.");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess?.(paymentIntent);
        navigate(getSuccessUrl(returnUrl, orderId, paymentIntent.id));
      } else if (paymentIntent?.status === "requires_action") {
        setError("Additional authentication required. Please complete the payment.");
      } else {
        setError("Payment could not be completed. Please try again.");
      }
    } catch (err) {
      await api.post("/payments/failure", { orderId }).catch(() => {});
      setError(err.response?.data?.message || "Unable to process payment right now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="stripe-checkout-form" onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="stripe-error">{error}</div>}
      <button
        className="button primary full"
        type="submit"
        disabled={!stripe || loading}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>
    </form>
  );
}

export default function StripeCheckoutForm({ amount, orderId, onSuccess, onError, returnUrl }) {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        console.log("[StripeCheckoutForm] Fetching clientSecret for order:", orderId, "amount:", amount);
        const { data } = await api.post("/payments/create-payment-intent", {
          amount,
          currency: "inr",
          orderId
        });
        console.log("[StripeCheckoutForm] API response:", data);
        console.log("[StripeCheckoutForm] clientSecret received:", data.clientSecret);
        setClientSecret(data.clientSecret);
      } catch (err) {
        console.error("[StripeCheckoutForm] Error fetching clientSecret:", err);
        setError(err.response?.data?.message || "Failed to initialize payment");
      }
    };
    fetchClientSecret();
  }, [amount, orderId]);

  if (!clientSecret) {
    return (
      <div className="stripe-checkout-form">
        <div className="stripe-loading">Loading payment form...</div>
        {error && <div className="stripe-error">{error}</div>}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm
        amount={amount}
        orderId={orderId}
        onSuccess={onSuccess}
        onError={onError}
        returnUrl={returnUrl}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}
