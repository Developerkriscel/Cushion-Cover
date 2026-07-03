import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { useFestiveTheme } from "../context/FestiveThemeContext.jsx";
import MagneticButton from "./MagneticButton.jsx";

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

const rotations = [-5, 5, 0];
const depths = [1, 1.5, 0.6];

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

  const stageRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const tx1 = useTransform(smoothX, (v) => v * depths[0]);
  const ty1 = useTransform(smoothY, (v) => v * depths[0]);
  const tx2 = useTransform(smoothX, (v) => v * depths[1]);
  const ty2 = useTransform(smoothY, (v) => v * depths[1]);
  const tx3 = useTransform(smoothX, (v) => v * depths[2]);
  const ty3 = useTransform(smoothY, (v) => v * depths[2]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el || typeof window === "undefined") return;
    const isMobile = window.innerWidth < 768 || "ontouchstart" in window;
    if (isMobile) return;

    const handleMouse = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      mouseX.set(dx * 24);
      mouseY.set(dy * 24);
    };

    const handleLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    el.addEventListener("mousemove", handleMouse);
    el.addEventListener("mouseleave", handleLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouse);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY]);

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
        {!isFestive && (
          <div className="hero-float-stage" ref={stageRef} aria-hidden="true">
            {floatingProducts.map((product, index) => {
              const transforms = [
                { x: tx1, y: ty1 },
                { x: tx2, y: ty2 },
                { x: tx3, y: ty3 },
              ][index];
              return (
                <motion.img
                  key={product.src}
                  className={`floating-product floating-product-${index + 1}`}
                  src={product.src}
                  alt={product.alt}
                  style={{
                    x: transforms.x,
                    y: transforms.y,
                    rotate: rotations[index],
                  }}
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
