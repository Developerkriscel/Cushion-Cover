import { Star } from "lucide-react";

export default function TestimonialCard({ quote, name, location }) {
  return (
    <article className="testimonial">
      <div className="stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} size={16} fill="currentColor" />
        ))}
      </div>
      <p>{quote}</p>
      <strong>{name}</strong>
      <span>{location}</span>
    </article>
  );
}
