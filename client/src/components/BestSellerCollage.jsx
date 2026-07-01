import { useEffect, useState } from "react";
import api from "../services/api.js";
import { products as fallbackProducts } from "../data/fallbackCatalog.js";

const DURATION = 2500;
const FADE_DURATION = 600;

export default function BestSellerCollage() {
  const [images, setImages] = useState([]);
  const [indices, setIndices] = useState([0, 0, 0]);
  const [loaded, setLoaded] = useState([false, false, false]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const res = await api.get("/products?featured=true");
        const products = res.data?.products || [];
        const bestSellers = products.filter((p) => p.bestSeller === true);
        const allImages = bestSellers.length >= 3
          ? bestSellers.slice(0, 6).map((p) => p.images?.[0]?.url).filter(Boolean)
          : fallbackProducts.filter((p) => p.bestSeller).slice(0, 6).map((p) => p.images?.[0]?.url).filter(Boolean);
        
        if (allImages.length >= 3) {
          setImages(allImages);
        }
      } catch {
        const fallbackImages = fallbackProducts.filter((p) => p.bestSeller).slice(0, 6).map((p) => p.images?.[0]?.url).filter(Boolean);
        if (fallbackImages.length >= 3) setImages(fallbackImages);
      }
    };
    fetchBestSellers();
  }, []);

  useEffect(() => {
    if (images.length < 3) return;
    const interval = setInterval(() => {
      setIndices((prev) => prev.map((idx, i) => (idx + 1) % images.length));
    }, DURATION);
    return () => clearInterval(interval);
  }, [images.length]);

  const handleLoad = (i) => {
    setLoaded((prev) => {
      const next = [...prev];
      next[i] = true;
      return next;
    });
  };

  if (images.length < 3) return null;

  const rotations = [-3, 2, -1];
  const boxStyles = {
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    border: "3px solid #fffdfa",
    overflow: "hidden",
    background: "transparent",
  };

  return (
    <div className="collage-wrapper" aria-hidden="true">
      <div className="collage-grid">
        {images.slice(0, 3).map((img, boxIndex) => {
          const rotation = rotations[boxIndex];
          const imgStack = images.map((src, imgIdx) => (
            <img
              key={imgIdx}
              src={src}
              alt={`Best seller product ${imgIdx + 1}`}
              className="collage-img"
              style={{
                opacity: indices[boxIndex] === imgIdx ? 1 : 0,
                transition: `opacity ${FADE_DURATION}ms ease`,
              }}
              onLoad={() => handleLoad(boxIndex)}
            />
          ));
          return (
            <div
              key={boxIndex}
              className={`collage-box collage-box-${boxIndex + 1}`}
              style={{
                ...boxStyles,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <div className="collage-img-stack" style={{ position: "relative", width: "100%", height: "100%" }}>
                {imgStack}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}