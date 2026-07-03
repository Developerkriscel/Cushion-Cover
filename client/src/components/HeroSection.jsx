import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFestiveTheme } from "../context/FestiveThemeContext.jsx";
import MagneticButton from "./MagneticButton.jsx";
import HeroCollage from "./HeroCollage.jsx";

export default function HeroSection() {
  const { theme } = useFestiveTheme();
  const isFestive = Boolean(theme?.heroBannerImage);
  const heroStyle = isFestive ? { backgroundImage: `linear-gradient(90deg, rgba(47, 42, 36, 0.76), rgba(47, 42, 36, 0.16)), url(${theme.heroBannerImage})` } : undefined;

  const heading = theme?.heroBannerText || "Premium Fabric Decor for Every Room";
  const subtext = theme?.heroBannerSubtext ||
    "Shop Premium Table Covers, Cushion Covers, Aprons, and Handcrafted Home Decor Essentials Designed to Bring Comfort, Beauty, and Style to Every Corner of Your Home.";

  const headingParts = heading === "Premium Fabric Decor for Every Room"
    ? ["Premium", "Fabric", "Decor\u00A0for", "Every\u00A0Room"]
    : heading.split(/\s+/);

  return (
    <section className={`hero ${isFestive ? "festive-hero" : ""}`} style={heroStyle}>
      <div className="container hero-content">
        <div className="hero-copy">
          <h1 className="hero-heading">
            {headingParts.map((part, i) => (
              <span key={i} className="hero-heading-line" style={{ animationDelay: `${i * 0.15}s` }}>
                {part}
                {i < headingParts.length - 1 ? "\u00A0" : ""}
              </span>
            ))}
          </h1>
          <p className="hero-subtext" style={{ animationDelay: `${headingParts.length * 0.15 + 0.15}s` }}>
            {subtext}
          </p>
          <div className="hero-actions" style={{ animationDelay: `${headingParts.length * 0.15 + 0.45}s` }}>
            <MagneticButton>
              <Link className="button primary" to="/products">
                Shop Collection <ArrowRight size={18} />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link className="button secondary" to="/products?sort=newest">
                Explore New Arrivals
              </Link>
            </MagneticButton>
          </div>
        </div>
        {!isFestive && <HeroCollage />}
      </div>
    </section>
  );
}
