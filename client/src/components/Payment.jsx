import { useMemo, useState } from "react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

const cardOptions = {
  hidePostalCode: true,
  style: {
    base: {
      color: "#2f2a24",
      fontFamily: "Inter, system-ui, sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#71685d"
      }
    },
    invalid: {
      color: "#9c352d"
    }
  }
};

function PaymentForm({ orderId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!orderId) {
      setError("Order ID Is Required Before Payment.");
      return;
    }

    if (!stripe || !elements) {
      setError("Stripe Is Still Loading. Please Try Again.");
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card Input Is Not Ready.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/payments/stripe/intent", { orderId });
      const result = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElement
          }
        },
        {
          handleActions: false
        }
      );

      if (result.error) {
        await api.post("/payments/failure", {
          orderId,
          paymentId: result.error.payment_intent?.id,
          reason: result.error.message
        });
        setError(result.error.message || "Payment Failed. Please Try Again.");
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        navigate(`/payment-success?orderId=${orderId}&paymentId=${result.paymentIntent.id}`);
        return;
      }

      setError("Payment Could Not Be Completed. Please Try Again.");
    } catch (err) {
      await api.post("/payments/failure", { orderId }).catch(() => {});
      setError(err.response?.data?.message || "Unable to Process Payment Right Now.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <label>
        Card Details
        <div className="stripe-card-field">
          <CardElement options={cardOptions} />
        </div>
      </label>
      {error && <div className="error-message">{error}</div>}
      <button className="button primary full" type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay Securely With Stripe"}
      </button>
    </form>
  );
}

export default function Payment({ orderId }) {
  const options = useMemo(
    () => ({
      appearance: {
        theme: "stripe",
        variables: {
          colorPrimary: "#a86445",
          colorText: "#2f2a24",
          borderRadius: "8px"
        }
      },
      link: { enabled: false }
    }),
    []
  );

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm orderId={orderId} />
    </Elements>
  );
}
