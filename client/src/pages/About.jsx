import { Helmet } from "react-helmet-async";

export default function About() {
  return (
    <>
      <Helmet><title>About Us | Elegant Home Decor</title></Helmet>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Our Story</span>
          <h1>Fabric Decor With a Quiet Sense of Occasion</h1>
          <p>Elegant Home Decor Creates Thoughtfully Designed Table Covers, Cushion Covers, Aprons, and Kitchen Textiles for Homes That Value Comfort, Craft, and Graceful Everyday Living.</p>
        </div>
      </section>
      <section className="container content-grid">
        <div><h2>Mission</h2><p>To Make Premium Fabric Decor Accessible, Durable, and Beautiful Enough for Daily Use and Special Gatherings.</p></div>
        <div><h2>Quality Promise</h2><p>We Select Tactile Fabrics, Practical Finishes, and Refined Palettes That Pair Easily With Modern Indian Homes.</p></div>
        <div><h2>Craftsmanship</h2><p>Every Product Is Reviewed for Stitching, Drape, Wash Behavior, Closure Quality, and Finish Before It Reaches Your Home.</p></div>
      </section>
    </>
  );
}
