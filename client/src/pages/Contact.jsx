import { Helmet } from "react-helmet-async";
import { useState } from "react";
import api from "../services/api.js";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [message, setMessage] = useState("");
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await api.post("/content/contact", form);
      setMessage(data.message);
      setForm({ name: "", email: "", message: "" });
    } catch {
      setMessage("Unable to Send Message Right Now.");
    }
  };

  return (
    <>
      <Helmet><title>Contact Us | Elegant Home Decor</title></Helmet>
      <section className="container contact-layout">
        <div>
          <span className="eyebrow">Contact Us</span>
          <h1>We Are Here to Help Style Your Home</h1>
          <p>Email: hello@eleganthomedecor.com</p>
          <p>Phone: +91 90000 00000</p>
          <p>Address: Jaipur, Rajasthan, India</p>
          <p>Instagram: @eleganthomedecor</p>
        </div>
        <form className="contact-form" onSubmit={submit}>
          <input placeholder="Name" value={form.name} onChange={(event) => update("name", event.target.value)} required />
          <input type="email" placeholder="Email" value={form.email} onChange={(event) => update("email", event.target.value)} required />
          <textarea rows="6" placeholder="Message" value={form.message} onChange={(event) => update("message", event.target.value)} required />
          <button className="button primary">Send Message</button>
          {message && <small>{message}</small>}
        </form>
      </section>
    </>
  );
}
