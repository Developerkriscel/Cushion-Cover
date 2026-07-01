import { useEffect, useState } from "react";

const images = [
  "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
  "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
  "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
  "https://res.cloudinary.com/djligggal/image/upload/v1782655229/bruno-ngarukiye-ZsmSKZOF_SA-unsplash_j9tsj7.jpg",
];

const altTexts = [
  "Ivory Table Cover",
  "Sage Cushion Covers",
  "Artisan Linen Apron",
  "Festive Table Runner",
];

const boxClasses = ["collage-square-1", "collage-square-2", "collage-rectangle"];

export default function HeroCollage() {
  const [indices, setIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prev) => prev.map((idx) => (idx + 1) % images.length));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-collage" aria-hidden="true">
      <div className="collage-grid">
        {images.slice(0, 3).map((_, boxIndex) => (
          <div
            key={boxIndex}
            className={`collage-box ${boxClasses[boxIndex]}`}
          >
            <div className="collage-img-stack">
              {images.map((src, imgIdx) => (
                <img
                  key={imgIdx}
                  src={src}
                  alt={altTexts[imgIdx]}
                  className="collage-img"
                  style={{
                    opacity: indices[boxIndex] === imgIdx ? 1 : 0,
                    transition: "opacity 600ms ease",
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}