import "./DiwaliDecoration.css";

function Diya({ className, gradientId }) {
  return (
    <svg className={`diya ${className}`} viewBox="0 0 120 60" role="img" aria-label="Decorative Diya">
      <defs>
        <radialGradient id={`${gradientId}-flame`} cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#fff8d0" />
          <stop offset="30%" stopColor="#ffd63a" />
          <stop offset="70%" stopColor="#ff8c00" />
          <stop offset="100%" stopColor="#e85d00" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${gradientId}-bowl`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4965a" />
          <stop offset="40%" stopColor="#b87333" />
          <stop offset="70%" stopColor="#8b4513" />
          <stop offset="100%" stopColor="#5d2e0c" />
        </linearGradient>
        <linearGradient id={`${gradientId}-rim`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8a868" />
          <stop offset="50%" stopColor="#c47a3a" />
          <stop offset="100%" stopColor="#9a5a2a" />
        </linearGradient>
        <filter id={`${gradientId}-glow`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={`${gradientId}-soft-glow`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="blur" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>

      <ellipse className="diya-aura" cx="60" cy="32" rx="48" ry="18" fill="url(#${gradientId}-flame)" filter={`url(#${gradientId}-soft-glow)`} opacity="0.25" />

      <path className="diya-flame" d="M60 8 C55 16 56 22 60 28 C64 22 65 16 60 8 Z" fill={`url(#${gradientId}-flame)`} filter={`url(#${gradientId}-glow)`} />
      <path className="diya-inner-flame" d="M60 14 C57 18 58 21 60 24 C62 21 63 18 60 14 Z" fill="#fff9c0" opacity="0.9" />

      <path className="diya-wick" d="M60 28 L60 34" stroke="#3d2a1a" strokeWidth="1.8" strokeLinecap="round" />

      <ellipse className="diya-oil" cx="60" cy="36" rx="38" ry="6" fill="#2a1a0a" opacity="0.85" />

      <path className="diya-bowl" d="M12 36 C18 52 42 58 60 58 C78 58 102 52 108 36 C96 44 24 44 12 36 Z" fill={`url(#${gradientId}-bowl)`} />

      <ellipse className="diya-rim" cx="60" cy="36" rx="52" ry="8" fill={`url(#${gradientId}-rim)`} />
      <path className="diya-rim-highlight" d="M24 34 C40 30 80 30 96 34" stroke="#f5c48a" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.6" />

      <circle className="diya-dot" cx="42" cy="45" r="1.8" fill="#6b3a18" opacity="0.5" />
      <circle className="diya-dot" cx="60" cy="48" r="1.8" fill="#6b3a18" opacity="0.5" />
      <circle className="diya-dot" cx="78" cy="45" r="1.8" fill="#6b3a18" opacity="0.5" />
    </svg>
  );
}

export default function DiwaliDecoration() {
  return (
    <div className="diwali-decoration" aria-hidden="true">
      <div className="diwali-string-lights">
        <div className="light-string light-string-1">
          {Array.from({ length: 8 }).map((_, index) => <span className="bulb" key={`a-${index}`} />)}
        </div>
        <div className="light-string light-string-2">
          {Array.from({ length: 8 }).map((_, index) => <span className="bulb" key={`b-${index}`} />)}
        </div>
      </div>

      <div className="diwali-diyas">
        <Diya className="diya-left" gradientId="diyaLeft" />
        <Diya className="diya-right" gradientId="diyaRight" />
      </div>

      <div className="diwali-pattern-overlay" />
    </div>
  );
}