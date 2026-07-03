import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const HERO_IMAGES = [
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg", alt: "Ivory Table Cover" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654653/ed-inal-Q3XVJVyJ6Y4-unsplash_phzg0h.jpg", alt: "Jacquard Fabric Texture" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655229/bruno-ngarukiye-ZsmSKZOF_SA-unsplash_j9tsj7.jpg", alt: "Gold Table Runner" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg", alt: "Sage Cushion Covers" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654902/mariah-krafft--qOa0YYfdGo-unsplash_koitma.jpg", alt: "Decorative Cushion Covers" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg", alt: "Linen Apron Flat Lay" },
  { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655118/golden-horn-bridge-R_00GMyo2CE-unsplash_ynj6ji.jpg", alt: "Person Wearing Apron" },
];

const SLOTS = [
  { id: "featured", top: "14%", left: "16%", width: "58%", aspectRatio: "3 / 4", zIndex: 2, floatDuration: 5, floatDelay: 0 },
  { id: "medium",   top: "2%",  left: "56%", width: "40%", aspectRatio: "4 / 5", zIndex: 3, floatDuration: 4.2, floatDelay: 0.7 },
  { id: "small",    top: "64%", left: "2%",  width: "32%", aspectRatio: "1 / 1", zIndex: 1, floatDuration: 3.4, floatDelay: 1.4 },
];

const CROSSFADE_MS = 3500;
const POSITION_ROTATE_MS = 7000;

export default function HeroCollage() {
  const prefersReducedMotion = useReducedMotion();
  const stageRef = useRef(null);
  const hoverRef = useRef(false);
  const [alive, setAlive] = useState(true);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 25 });

  const tx1 = useTransform(smoothX, (v) => v * 1);
  const ty1 = useTransform(smoothY, (v) => v * 1);
  const tx2 = useTransform(smoothX, (v) => v * 1.5);
  const ty2 = useTransform(smoothY, (v) => v * 1.5);
  const tx3 = useTransform(smoothX, (v) => v * 0.6);
  const ty3 = useTransform(smoothY, (v) => v * 0.6);
  const cardTx = [{ x: tx1, y: ty1 }, { x: tx2, y: ty2 }, { x: tx3, y: ty3 }];

  const [imageIdx, setImageIdx] = useState([0, 3, 5]);

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

  useEffect(() => {
    if (prefersReducedMotion || !alive) return;
    const timer = setInterval(() => {
      setImageIdx((prev) => prev.map((i) => (i + 1) % HERO_IMAGES.length));
    }, CROSSFADE_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, alive]);

  useEffect(() => {
    if (prefersReducedMotion || !alive) return;
    const timer = setInterval(() => {
      setImageIdx((prev) => [prev[2], prev[0], prev[1]]);
    }, POSITION_ROTATE_MS);
    return () => clearInterval(timer);
  }, [prefersReducedMotion, alive]);

  return (
    <div
      className="hero-float-stage"
      ref={stageRef}
      aria-hidden="true"
      onMouseEnter={() => { hoverRef.current = true; setAlive(false); }}
      onMouseLeave={() => { hoverRef.current = false; setAlive(true); }}
    >
      {SLOTS.map((slot, i) => {
        const current = HERO_IMAGES[imageIdx[i]];

        return (
          <div
            key={slot.id}
            className={`hero-collage-card hero-collage-card--${slot.id}`}
            style={{
              position: "absolute",
              top: slot.top,
              left: slot.left,
              width: slot.width,
              aspectRatio: slot.aspectRatio,
              zIndex: slot.zIndex,
            }}
          >
            <div
              className="hero-collage-card-float"
              style={{
                width: "100%",
                height: "100%",
                animation: prefersReducedMotion ? "none" : undefined,
              }}
            >
              <motion.div
                className="hero-collage-card-parallax"
                style={{
                  width: "100%",
                  height: "100%",
                  x: cardTx[i].x,
                  y: cardTx[i].y,
                }}
                whileHover={{ scale: 1.04 }}
              >
                <div className="hero-collage-card-inner">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={current.src}
                      src={current.src}
                      alt={current.alt}
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        opacity: { duration: 0.55, ease: "easeInOut" },
                        scale: { duration: 3.5, ease: "easeOut" },
                      }}
                    />
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
