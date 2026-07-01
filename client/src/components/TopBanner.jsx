import { useFestiveTheme } from "../context/FestiveThemeContext.jsx";

export default function TopBanner() {
  const { theme } = useFestiveTheme();
  const hasFestiveBanner = theme?.topBannerText || theme?.topBannerImage;

  if (!hasFestiveBanner) {
    return <div className="top-strip">Free Shipping Over Rs. 2,500 | Handcrafted Fabric Decor for Everyday Elegance</div>;
  }

  return (
    <div className="top-strip festive-top-strip">
      {theme.topBannerText && <span>{theme.topBannerText}</span>}
    </div>
  );
}