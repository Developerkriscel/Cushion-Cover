import "./ChristmasDecoration.css";

const snowflakes = Array.from({ length: 28 });
const lights = Array.from({ length: 18 });

export default function ChristmasDecoration() {
  return (
    <div className="christmas-decoration" aria-hidden="true">
      <div className="christmas-lights">
        {lights.map((_, index) => (
          <span className="christmas-bulb" key={`christmas-light-${index}`} />
        ))}
      </div>

      <div className="christmas-snow">
        {snowflakes.map((_, index) => (
          <span className="snowflake" key={`snowflake-${index}`} />
        ))}
      </div>
    </div>
  );
}
