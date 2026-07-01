import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFestiveTheme } from "../context/FestiveThemeContext.jsx";

const floatingProducts = [
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
    alt: "Ivory Table Cover"
  },
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
    alt: "Sage Cushion Covers"
  },
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
    alt: "Artisan Linen Apron"
  }
];

export default function HeroSection() {
  const { theme } = useFestiveTheme();
  const isFestive = Boolean(theme?.heroBannerImage);
  const heroStyle = isFestive ? { backgroundImage: `linear-gradient(90deg, rgba(47, 42, 36, 0.76), rgba(47, 42, 36, 0.16)), url(${theme.heroBannerImage})` } : undefined;

return (
    <section className={`hero ${isFestive ? "festive-hero" : ""}`} style={heroStyle}>
      <div className="container hero-content">
        <div className="hero-copy">
          <h1>{theme?.heroBannerText || "Premium Fabric Decor for Every Room"}</h1>
          <p>
            {theme?.heroBannerSubtext ||
              "Shop Premium Table Covers, Cushion Covers, Aprons, and Handcrafted Home Decor Essentials Designed to Bring Comfort, Beauty, and Style to Every Corner of Your Home."}
          </p>
          <div className="hero-actions">
            <Link className="button primary" to="/products">
              Shop Collection <ArrowRight size={18} />
            </Link>
            <Link className="button secondary" to="/products?sort=newest">
              Explore New Arrivals
            </Link>
          </div>
        </div>
        {!isFestive && (
          <div className="hero-float-stage" aria-hidden="true">
            {floatingProducts.map((product, index) => (
              <img key={product.src} className={`floating-product floating-product-${index + 1}`} src={product.src} alt={product.alt} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
