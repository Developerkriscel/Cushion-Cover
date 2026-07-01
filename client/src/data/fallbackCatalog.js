export const categories = [
  {
    _id: "cat-table",
    name: "Table Covers",
    slug: "table-covers",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=80",
    description: "Premium Table Covers Designed for Dining Tables, Center Tables, and Festive Decor."
  },
  {
    _id: "cat-cushion",
    name: "Cushion Covers",
    slug: "cushion-covers",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=80",
    description: "Stylish Cushion Covers Crafted to Add Comfort, Color, and Elegance to Your Living Space."
  },
  {
    _id: "cat-apron",
    name: "Aprons",
    slug: "aprons",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=900&q=80",
    description: "Beautiful and Durable Aprons for Kitchen, Baking, Cooking, and Gifting."
  }
];

export const products = [
  {
    _id: "p1",
    name: "Ivory Garden Jacquard Table Cover",
    slug: "ivory-garden-jacquard-table-cover",
    category: { name: "Table Covers", slug: "table-covers" },
    description: "A Refined Jacquard Table Cover With a Soft Ivory Base and Woven Botanical Pattern.",
    price: 2499,
    discountPrice: 1999,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
        alt: "Dining Table With White Ivory Tablecloth"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654653/ed-inal-Q3XVJVyJ6Y4-unsplash_phzg0h.jpg",
        alt: "Close Up Jacquard Fabric Texture Tablecloth"
      }
    ],
    colors: ["Ivory", "Gold", "Sage"],
    sizes: ["4 Seater", "6 Seater", "8 Seater"],
    fabric: "Cotton Jacquard",
    stock: 24,
    ratings: 4.8,
    numReviews: 18,
    featured: true,
    bestSeller: true,
    care: "Machine Wash Cold, Mild Detergent, Line Dry in Shade."
  },
  {
    _id: "p2",
    name: "Sage Bloom Cushion Cover Set",
    slug: "sage-bloom-cushion-cover-set",
    category: { name: "Cushion Covers", slug: "cushion-covers" },
    description: "A Set of Two Cushion Covers With Delicate Floral Embroidery and Concealed Zip Closure.",
    price: 1499,
    discountPrice: 1199,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
        alt: "Sage Green Floral Cushion Covers on Sofa"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782654902/mariah-krafft--qOa0YYfdGo-unsplash_koitma.jpg",
        alt: "Decorative Cushion Covers Bedroom"
      }
    ],
    colors: ["Sage", "Cream", "Terracotta"],
    sizes: ["16 x 16", "18 x 18", "20 x 20"],
    fabric: "Cotton Linen Blend",
    stock: 36,
    ratings: 4.7,
    numReviews: 27,
    featured: true,
    bestSeller: true,
    care: "Gentle Hand Wash Separately. Do Not Bleach."
  },
  {
    _id: "p3",
    name: "Artisan Linen Apron",
    slug: "artisan-linen-apron",
    category: { name: "Aprons", slug: "aprons" },
    description: "A Durable Cross-Back Apron With Deep Utility Pockets, Made for Cooking and Thoughtful Gifting.",
    price: 1299,
    discountPrice: 999,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
        alt: "Linen Apron Flat Lay Kitchen"
      },
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655118/golden-horn-bridge-R_00GMyo2CE-unsplash_ynj6ji.jpg",
        alt: "Person Wearing Kitchen Apron Cooking"
      }
    ],
    colors: ["Natural", "Olive", "Charcoal"],
    sizes: ["Free Size"],
    fabric: "Washed Linen Cotton",
    stock: 18,
    ratings: 4.6,
    numReviews: 14,
    featured: true,
    bestSeller: false,
    care: "Wash Inside Out. Iron on Low Heat."
  },
  {
    _id: "p4",
    name: "Festive Gold Runner",
    slug: "festive-gold-runner",
    category: { name: "Table Covers", slug: "table-covers" },
    description: "A Luminous Dining Runner With a Subtle Metallic Thread, Ideal for Festive Tablescapes.",
    price: 1799,
    discountPrice: 1399,
    images: [
      {
        url: "https://res.cloudinary.com/djligggal/image/upload/v1782655229/bruno-ngarukiye-ZsmSKZOF_SA-unsplash_j9tsj7.jpg",
        alt: "Gold Table Runner Dining Table Festive"
      }
    ],
    colors: ["Gold", "Champagne"],
    sizes: ["6 ft", "8 ft"],
    fabric: "Silk Blend",
    stock: 7,
    ratings: 4.5,
    numReviews: 9,
    featured: false,
    bestSeller: true,
    care: "Dry Clean Recommended."
  }
];
