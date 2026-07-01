export const categories = [
  {
    name: "Table Covers",
    slug: "table-covers",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    description: "Premium table covers designed for dining tables, center tables, and festive decor.",
    isFeatured: true
  },
  {
    name: "Cushion Covers",
    slug: "cushion-covers",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    description: "Stylish cushion covers crafted to add comfort, color, and elegance to your living space.",
    isFeatured: true
  },
  {
    name: "Aprons",
    slug: "aprons",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    description: "Beautiful and durable aprons for kitchen, baking, cooking, and gifting.",
    isFeatured: true
  },
  {
    name: "Kitchen and Dining Decor",
    slug: "kitchen-dining-decor",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    description: "Coordinated kitchen textiles and dining accents for everyday hosting.",
    isFeatured: false
  }
];

export const products = [
  {
    name: "Ivory Garden Jacquard Table Cover",
    slug: "ivory-garden-jacquard-table-cover",
    categorySlug: "table-covers",
    description:
      "A refined jacquard table cover with a soft ivory base and woven botanical pattern, tailored for family dinners and festive hosting.",
    price: 2499,
    discountPrice: 1999,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
        alt: "Dining table with white ivory tablecloth"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654653/ed-inal-Q3XVJVyJ6Y4-unsplash_phzg0h.jpg",
        alt: "Close up jacquard fabric texture tablecloth"
      }
    ],
    colors: ["Ivory", "Gold", "Sage"],
    sizes: ["4 Seater", "6 Seater", "8 Seater"],
    fabric: "Cotton jacquard",
    stock: 24,
    ratings: 4.8,
    numReviews: 18,
    featured: true,
    bestSeller: true,
    popularity: 96,
    care: "Machine wash cold, mild detergent, line dry in shade."
  },
  {
    name: "Sage Bloom Cushion Cover Set",
    slug: "sage-bloom-cushion-cover-set",
    categorySlug: "cushion-covers",
    description:
      "A set of two cushion covers with delicate floral embroidery and concealed zip closure for a polished living room refresh.",
    price: 1499,
    discountPrice: 1199,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
        alt: "Sage green floral cushion covers on sofa"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654902/mariah-krafft--qOa0YYfdGo-unsplash_koitma.jpg",
        alt: "Decorative cushion covers bedroom"
      }
    ],
    colors: ["Sage", "Cream", "Terracotta"],
    sizes: ["16 x 16", "18 x 18", "20 x 20"],
    fabric: "Cotton linen blend",
    stock: 36,
    ratings: 4.7,
    numReviews: 27,
    featured: true,
    bestSeller: true,
    popularity: 91,
    care: "Gentle hand wash separately. Do not bleach."
  },
  {
    name: "Artisan Linen Apron",
    slug: "artisan-linen-apron",
    categorySlug: "aprons",
    description:
      "A durable cross-back apron with deep utility pockets, made for cooking, baking, styling, and thoughtful gifting.",
    price: 1299,
    discountPrice: 999,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
        alt: "Linen apron flat lay kitchen"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655118/golden-horn-bridge-R_00GMyo2CE-unsplash_ynj6ji.jpg",
        alt: "Person wearing kitchen apron cooking"
      }
    ],
    colors: ["Natural", "Olive", "Charcoal"],
    sizes: ["Free Size"],
    fabric: "Washed linen cotton",
    stock: 18,
    ratings: 4.6,
    numReviews: 14,
    featured: true,
    bestSeller: false,
    popularity: 76,
    care: "Wash inside out. Iron on low heat."
  },
  {
    name: "Festive Gold Runner",
    slug: "festive-gold-runner",
    categorySlug: "table-covers",
    description: "A luminous dining runner with a subtle metallic thread, ideal for festive tablescapes and gifting.",
    price: 1799,
    discountPrice: 1399,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655229/bruno-ngarukiye-ZsmSKZOF_SA-unsplash_j9tsj7.jpg",
        alt: "Gold table runner dining table festive"
      }
    ],
    colors: ["Gold", "Champagne"],
    sizes: ["6 ft", "8 ft"],
    fabric: "Silk blend",
    stock: 7,
    ratings: 4.5,
    numReviews: 9,
    featured: false,
    bestSeller: true,
    popularity: 82,
    care: "Dry clean recommended."
  },
  {
    name: "Monsoon Stripe Cushion Cover",
    slug: "monsoon-stripe-cushion-cover",
    categorySlug: "cushion-covers",
    description: "A modern striped cushion cover that balances relaxed comfort with boutique styling.",
    price: 799,
    discountPrice: 649,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655315/morgan-deese-tr2CXTOwBg0-unsplash_cfisog.jpg",
        alt: "Blue stripe cushion cover sofa"
      }
    ],
    colors: ["Blue", "Cream", "Clay"],
    sizes: ["16 x 16", "18 x 18"],
    fabric: "Slub cotton",
    stock: 0,
    ratings: 4.3,
    numReviews: 6,
    featured: false,
    bestSeller: false,
    popularity: 54,
    care: "Cold wash and tumble dry low."
  },
  {
    name: "Chef's Gift Apron and Mitt Set",
    slug: "chefs-gift-apron-and-mitt-set",
    categorySlug: "aprons",
    description: "A coordinated apron and oven mitt set packaged for gifting to home chefs and bakers.",
    price: 1899,
    discountPrice: 1499,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655432/olga-ferina-7h59Wrc4qsA-unsplash_xc2ai0.jpg",
        alt: "Apron and oven mitt set kitchen gift"
      }
    ],
    colors: ["Rust", "Olive", "Natural"],
    sizes: ["Free Size"],
    fabric: "Canvas cotton",
    stock: 14,
    ratings: 4.9,
    numReviews: 12,
    featured: true,
    bestSeller: true,
    popularity: 88,
    care: "Spot clean mitts. Machine wash apron cold."
  }
];

export const coupons = [
  {
    code: "WELCOME10",
    discount: 10,
    discountType: "percentage",
    usageLimit: 250,
    isActive: true
  },
  {
    code: "FESTIVE250",
    discount: 250,
    discountType: "fixed",
    usageLimit: 100,
    isActive: true
  }
];

export const banners = [
  {
    title: "Refresh Your Home with Elegant Fabric Decor",
    subtitle:
      "Shop premium table covers, cushion covers, aprons, and handcrafted home decor essentials designed to bring comfort, beauty, and style to every corner of your home.",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1600&q=85",
    ctaLabel: "Shop Collection",
    ctaLink: "/products",
    placement: "home-hero",
    isActive: true
  }
];
