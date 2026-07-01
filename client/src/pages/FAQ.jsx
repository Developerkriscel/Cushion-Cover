import { Helmet } from "react-helmet-async";

const faqs = [
  ["How Long Does Shipping Take?", "Most Orders Are Dispatched in 1-2 Business Days and Delivered Within 4-7 Business Days."],
  ["What Is Your Return Policy?", "Unused Products in Original Condition Can Be Returned or Exchanged Within 7 Days of Delivery."],
  ["Which Payment Methods Are Supported?", "The Backend Supports Razorpay, Stripe, and Cash on Delivery Order Capture."],
  ["How Should I Care for Fabric Products?", "Use Mild Detergent, Wash Dark Colors Separately, and Dry in Shade Unless a Product Recommends Dry Cleaning."]
];

export default function FAQ() {
  return (
    <>
      <Helmet><title>FAQ | Elegant Home Decor</title></Helmet>
      <section className="container faq-page">
        <span className="eyebrow">Help Center</span>
        <h1>Frequently Asked Questions</h1>
        {faqs.map(([question, answer]) => (
          <details key={question} open>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>
    </>
  );
}
