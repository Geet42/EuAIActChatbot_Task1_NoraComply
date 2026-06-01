// Nora Comply wordmark + shield icon — custom SVG, no icon library
export function NoraLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield body */}
      <path
        d="M20 3L6 8.5V19C6 27.5 12.2 35.3 20 37C27.8 35.3 34 27.5 34 19V8.5L20 3Z"
        fill="url(#shield-grad)"
        stroke="rgba(72,149,239,0.4)"
        strokeWidth="0.75"
      />
      {/* N letterform inside shield */}
      <path
        d="M13 27V13H16.2L23.8 23.4V13H27V27H23.8L16.2 16.6V27H13Z"
        fill="white"
        fillOpacity="0.95"
      />
      <defs>
        <linearGradient id="shield-grad" x1="6" y1="3" x2="34" y2="37" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1D3A6B" />
          <stop offset="100%" stopColor="#0F2040" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// EU official flag — 12 gold stars on blue circle, used as knowledge-base badge
export function EUFlag({ size = 20 }: { size?: number }) {
  const stars = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const r = 7.5;
    const cx = 12 + r * Math.cos(angle);
    const cy = 12 + r * Math.sin(angle);
    return { cx, cy };
  });

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="11" fill="#003399" stroke="rgba(255,204,0,0.3)" strokeWidth="0.5" />
      {stars.map((s, i) => (
        <g key={i} transform={`translate(${s.cx}, ${s.cy})`}>
          {/* 5-pointed star */}
          <polygon
            points="0,-2 0.59,-0.81 1.9,-0.62 0.95,0.31 1.18,1.62 0,1 -1.18,1.62 -0.95,0.31 -1.9,-0.62 -0.59,-0.81"
            fill="#FFCC00"
          />
        </g>
      ))}
    </svg>
  );
}
