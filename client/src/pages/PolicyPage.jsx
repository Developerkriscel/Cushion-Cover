import { Helmet } from "react-helmet-async";

const copy = {
  privacy: ["Privacy Policy", "We Collect Only the Information Needed to Process Orders, Support Accounts, and Improve Shopping Experiences. Payment Secrets Are Handled by Secure Gateways and Are Never Exposed to the Frontend."],
  terms: ["Terms and Conditions", "By Using This Website, Customers Agree to Provide Accurate Account, Shipping, and Payment Information. Product Colors May Vary Slightly Due to Display Settings and Handcrafted Fabric Variation."],
  returns: ["Return and Refund Policy", "Returns Are Accepted for Unused Products in Original Packaging Within 7 Days. Custom Fabric Products May Be Exchange-Only Unless Damaged or Incorrect."]
};

export default function PolicyPage({ type }) {
  const [title, body] = copy[type] || copy.privacy;
  return (
    <>
      <Helmet><title>{title} | Elegant Home Decor</title></Helmet>
      <section className="container policy-page">
        <span className="eyebrow">Store Policy</span>
        <h1>{title}</h1>
        <p>{body}</p>
        <h2>Customer Support</h2>
        <p>For Order, Return, and Product Care Questions, Contact hello@eleganthomedecor.com With Your Order ID.</p>
      </section>
    </>
  );
}
