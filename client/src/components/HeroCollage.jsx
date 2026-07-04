import { useEffect, useState } from "react";

const IMG_POOLS = {
  tableCover: [
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg", alt: "Ivory Table Cover" },
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654653/ed-inal-Q3XVJVyJ6Y4-unsplash_phzg0h.jpg", alt: "Jacquard Fabric Texture" },
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655229/bruno-ngarukiye-ZsmSKZOF_SA-unsplash_j9tsj7.jpg", alt: "Gold Table Runner" },
  ],
  cushionCover: [
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg", alt: "Sage Cushion Covers" },
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782654902/mariah-krafft--qOa0YYfdGo-unsplash_koitma.jpg", alt: "Decorative Cushion Covers" },
  ],
  apron: [
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg", alt: "Linen Apron Flat Lay" },
    { src: "https://res.cloudinary.com/djligggal/image/upload/v1782655118/golden-horn-bridge-R_00GMyo2CE-unsplash_ynj6ji.jpg", alt: "Person Wearing Apron" },
  ],
};

const CARDS = [
  { id: "table", pool: IMG_POOLS.tableCover, label: "Table Covers", rotation: -1.5, aspectRatio: "13 / 17" },
  { id: "cushion", pool: IMG_POOLS.cushionCover, label: "Cushion Covers", rotation: 2.5, aspectRatio: "5 / 6" },
  { id: "apron", pool: IMG_POOLS.apron, label: "Aprons", rotation: -1, aspectRatio: "3 / 4" },
];

export default function HeroCollage() {
  const [imgIdx, setImgIdx] = useState([0, 0, 0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setImgIdx((prev) =>
        prev.map((idx, i) => {
          const pool = CARDS[i].pool;
          return (idx + 1) % pool.length;
        })
      );
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="hero-collage-cards">
      <div className="hero-collage-doodle hero-collage-doodle--1" />
      <div className="hero-collage-doodle hero-collage-doodle--2" />
      {CARDS.map((card, i) => (
        <div
          key={card.id}
          className="hero-collage-card"
          style={{ transform: `rotate(${card.rotation}deg)` }}
        >
          <div className="hero-card-inner" style={{ aspectRatio: card.aspectRatio }}>
            <img src={card.pool[imgIdx[i]].src} alt={card.pool[imgIdx[i]].alt} loading="lazy" />
          </div>
          <span className="hero-card-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
