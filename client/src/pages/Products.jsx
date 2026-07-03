import { Helmet } from "react-helmet-async";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api.js";
import { categories as fallbackCategories, products as fallbackProducts } from "../data/fallbackCatalog.js";
import FilterSidebar from "../components/FilterSidebar.jsx";
import ProductGrid from "../components/ProductGrid.jsx";
import Loader from "../components/Loader.jsx";

const COLLAGE_IMAGES = [
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654298/nataliya-smirnova-H9mg9aDTdaQ-unsplash_nfhgus.jpg",
    alt: "Ivory Table Cover",
  },
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782654756/lucas-de-moura-b0kTwnDM1O0-unsplash_z0di7l.jpg",
    alt: "Sage Cushion Covers",
  },
  {
    src: "https://res.cloudinary.com/djligggal/image/upload/v1782655012/golden-horn-bridge-dOQeGVGNmpk-unsplash_qpgwe1.jpg",
    alt: "Artisan Linen Apron",
  },
];

function PageHeroCollage() {
  const delays = [0.3, 0.4, 0.5];
  return (
    <div className="page-hero-collage shop-hero-collage" aria-hidden="true">
      <div className="collage-row">
        {COLLAGE_IMAGES.map((img, i) => (
          <div
            key={img.src}
            className={`collage-box ${i === 0 ? "collage-square-1" : i === 1 ? "collage-rectangle" : "collage-square-2"}`}
            style={{ animationDelay: `${delays[i]}s` }}
          >
            <img className="collage-img" src={img.src} alt={img.alt} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [filters, setFilters] = useState(Object.fromEntries(params.entries()));
  const [products, setProducts] = useState(fallbackProducts);
  const [categories, setCategories] = useState(fallbackCategories);
  const [loading, setLoading] = useState(true);

  const queryString = useMemo(() => new URLSearchParams(filters).toString(), [filters]);

  useEffect(() => {
    setFilters(Object.fromEntries(params.entries()));
  }, [params]);

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/products?${queryString}`), api.get("/categories")])
      .then(([productRes, categoryRes]) => {
        setProducts(productRes.data.products || fallbackProducts);
        setCategories(categoryRes.data.length ? categoryRes.data : fallbackCategories);
      })
      .catch(() => {
        let local = [...fallbackProducts];
        if (filters.category) local = local.filter((product) => product.category?.slug === filters.category);
        if (filters.search) local = local.filter((product) => product.name.toLowerCase().includes(filters.search.toLowerCase()));
        setProducts(local);
      })
      .finally(() => setLoading(false));
  }, [queryString]);

  const updateFilters = (updater) => {
    const next = typeof updater === "function" ? updater(filters) : updater;
    Object.keys(next).forEach((key) => !next[key] && delete next[key]);
    setFilters(next);
    setParams(next);
  };

  return (
    <>
      <Helmet>
        <title>Shop Home Decor | Elegant Home Decor</title>
        <meta name="description" content="Browse Table Covers, Cushion Covers, Aprons, Kitchen Textiles, and Handcrafted Home Decor." />
      </Helmet>
      <section className="page-hero compact-hero">
        <div className="container page-hero-content">
          <div className="page-hero-text">
            <span className="eyebrow shop-hero-line" style={{ animationDelay: "0s" }}>Shop Collection</span>
            <h1 className="shop-hero-line" style={{ animationDelay: "0.15s" }}>Premium Fabric Decor for Every Room</h1>
          </div>
          <PageHeroCollage />
        </div>
      </section>
      <section className="container listing-layout">
        <div className="shop-filter-sidebar" style={{ animationDelay: "0.3s" }}>
          <FilterSidebar filters={filters} setFilters={updateFilters} categories={categories} />
        </div>
        <div className="listing-main">
          <div className="listing-toolbar">
            <select value={filters.sort || "newest"} onChange={(event) => updateFilters((current) => ({ ...current, sort: event.target.value }))}>
              <option value="newest">Newest</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="popularity">Popularity</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          {loading ? <Loader label="Finding Products" /> : <ProductGrid products={products} />}
        </div>
      </section>
    </>
  );
}
