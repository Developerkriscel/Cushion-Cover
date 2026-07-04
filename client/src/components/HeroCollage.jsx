const IMAGES = {
  tableCover: {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
    alt: "Ivory Table Cover"
  },
  cushionCover: {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
    alt: "Sage Cushion Covers"
  },
  apron: {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
    alt: "Linen Apron Flat Lay"
  }
};

const CARDS = [
  {
    id: "table",
    image: IMAGES.tableCover,
    label: "Table Covers",
    className: "hero-card--table",
    style: {
      left: "0%",
      top: "8%",
      width: "90%",
      aspectRatio: "13 / 17",
      transform: "rotate(-2deg)",
      zIndex: 2,
    }
  },
  {
    id: "cushion",
    image: IMAGES.cushionCover,
    label: "Cushion Covers",
    className: "hero-card--cushion",
    style: {
      right: "-1%",
      top: "0%",
      width: "44%",
      aspectRatio: "25 / 31",
      transform: "rotate(5deg)",
      zIndex: 3,
    }
  },
  {
    id: "apron",
    image: IMAGES.apron,
    label: "Aprons",
    className: "hero-card--apron",
    style: {
      right: "0%",
      bottom: "3%",
      width: "42%",
      aspectRatio: "3 / 4",
      transform: "rotate(-4deg)",
      zIndex: 1,
    }
  },
];

export default function HeroCollage() {
  return (
    <div className="hero-collage-cards" aria-hidden="true">
      <div className="hero-collage-doodle hero-collage-doodle--1" />
      <div className="hero-collage-doodle hero-collage-doodle--2" />
      <div className="hero-collage-doodle hero-collage-doodle--3" />
      {CARDS.map((card) => (
        <div key={card.id} className={`hero-collage-card ${card.className}`} style={card.style}>
          <div className="hero-card-inner">
            <img src={card.image.src} alt={card.image.alt} loading="lazy" />
          </div>
          <span className="hero-card-label">{card.label}</span>
        </div>
      ))}
    </div>
  );
}
