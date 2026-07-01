import { CreditCard, MapPin } from "lucide-react";

export default function CheckoutForm({ form, setForm, paymentMethods = ["Razorpay", "Stripe", "COD"] }) {
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="checkout-form">
      <h2>
        <MapPin size={20} />
        Shipping Address
      </h2>
      <div className="form-grid">
        <input placeholder="Full Name" value={form.fullName} onChange={(event) => update("fullName", event.target.value)} />
        <input placeholder="Phone" value={form.phone} onChange={(event) => update("phone", event.target.value)} />
        <input placeholder="Address Line 1" value={form.addressLine1} onChange={(event) => update("addressLine1", event.target.value)} />
        <input placeholder="Address Line 2" value={form.addressLine2} onChange={(event) => update("addressLine2", event.target.value)} />
        <input placeholder="City" value={form.city} onChange={(event) => update("city", event.target.value)} />
        <input placeholder="State" value={form.state} onChange={(event) => update("state", event.target.value)} />
        <input placeholder="Postal Code" value={form.postalCode} onChange={(event) => update("postalCode", event.target.value)} />
        <input placeholder="Country" value={form.country} onChange={(event) => update("country", event.target.value)} />
      </div>
      <h2>
        <CreditCard size={20} />
        Payment Method
      </h2>
      <div className="payment-options">
        {paymentMethods.map((method) => (
          <label key={method}>
            <input type="radio" name="payment" checked={form.paymentMethod === method} onChange={() => update("paymentMethod", method)} />
            {method}
          </label>
        ))}
      </div>
    </div>
  );
}
