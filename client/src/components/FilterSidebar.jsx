export default function FilterSidebar({ filters, setFilters, categories }) {
  const update = (key, value) => setFilters((current) => ({ ...current, [key]: value }));

  return (
    <aside className="filters">
      <h3>Filters</h3>
      <label>
        Category
        <select value={filters.category || ""} onChange={(event) => update("category", event.target.value)}>
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.slug} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Fabric
        <select value={filters.fabric || ""} onChange={(event) => update("fabric", event.target.value)}>
          <option value="">Any Fabric</option>
          <option value="cotton">Cotton</option>
          <option value="linen">Linen</option>
          <option value="silk">Silk</option>
          <option value="canvas">Canvas</option>
        </select>
      </label>
      <label>
        Color
        <select value={filters.color || ""} onChange={(event) => update("color", event.target.value)}>
          <option value="">Any Color</option>
          <option>Ivory</option>
          <option>Sage</option>
          <option>Gold</option>
          <option>Olive</option>
          <option>Terracotta</option>
        </select>
      </label>
      <label>
        Availability
        <select value={filters.availability || ""} onChange={(event) => update("availability", event.target.value)}>
          <option value="">All</option>
          <option value="in-stock">In Stock</option>
        </select>
      </label>
      <div className="price-filter">
        <label>
          Min Price
          <input type="number" value={filters.minPrice || ""} onChange={(event) => update("minPrice", event.target.value)} />
        </label>
        <label>
          Max Price
          <input type="number" value={filters.maxPrice || ""} onChange={(event) => update("maxPrice", event.target.value)} />
        </label>
      </div>
      <button className="button ghost full" onClick={() => setFilters({})}>
        Clear Filters
      </button>
    </aside>
  );
}
