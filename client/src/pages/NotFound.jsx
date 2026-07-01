import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="container success-page">
      <span className="eyebrow">404</span>
      <h1>Page Not Found</h1>
      <p>The Page You Are Looking for Is Not Available.</p>
      <Link className="button primary" to="/products">Shop Collection</Link>
    </section>
  );
}
