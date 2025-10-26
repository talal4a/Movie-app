const CinverseLogo = ({ className = 'w-12 h-12' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 120 120"
    className={className}
  >
    <defs>
      <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF0000" />
        <stop offset="25%" stopColor="#DC143C" />
        <stop offset="50%" stopColor="#B22222" />
        <stop offset="75%" stopColor="#8B0000" />
        <stop offset="100%" stopColor="#660000" />
      </linearGradient>

      <linearGradient id="bloodRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#4A0404" />
        <stop offset="30%" stopColor="#8B0000" />
        <stop offset="60%" stopColor="#DC143C" />
        <stop offset="100%" stopColor="#4A0404" />
      </linearGradient>

      <linearGradient id="brightRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF6B6B" />
        <stop offset="50%" stopColor="#FF0000" />
        <stop offset="100%" stopColor="#CC0000" />
      </linearGradient>

      <radialGradient id="spotlight">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
        <stop offset="40%" stopColor="#FFCCCC" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#FF0000" stopOpacity="0" />
      </radialGradient>

      <radialGradient id="lensFlareRed">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
        <stop offset="20%" stopColor="#FF6B6B" stopOpacity="0.6" />
        <stop offset="60%" stopColor="#DC143C" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#8B0000" stopOpacity="0" />
      </radialGradient>

      <filter id="cinematicShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dx="0" dy="4" result="offsetblur" />
        <feFlood floodColor="#000000" floodOpacity="0.5" />
        <feComposite in2="offsetblur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="redGlow">
        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
        <feFlood floodColor="#FF0000" floodOpacity="0.5" />
        <feComposite in2="coloredBlur" operator="in" />
        <feMerge>
          <feMergeNode />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>

      <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceAlpha" result="blur" stdDeviation="3" />
        <feOffset in="blur" dx="0" dy="2" />
        <feComposite operator="out" in2="SourceAlpha" />
        <feComponentTransfer>
          <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
        </feComponentTransfer>
        <feBlend mode="normal" in2="SourceGraphic" />
      </filter>
    </defs>

    <circle cx="60" cy="60" r="55" fill="url(#bloodRed)" opacity="0.3" />

    <circle
      cx="60"
      cy="60"
      r="48"
      fill="none"
      stroke="url(#brightRed)"
      strokeWidth="1"
      opacity="0.5"
      filter="url(#redGlow)"
    />

    <g transform="translate(60, 60)" filter="url(#cinematicShadow)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <path
          key={angle}
          d={`M 0,0 L ${30 * Math.cos((angle * Math.PI) / 180)},${30 * Math.sin((angle * Math.PI) / 180)} 
              A 30,30 0 0,1 ${30 * Math.cos(((angle + 45) * Math.PI) / 180)},${30 * Math.sin(((angle + 45) * Math.PI) / 180)} Z`}
          fill="url(#redGrad)"
          opacity="0.95"
          transform={`rotate(${angle})`}
        />
      ))}
    </g>

    <circle
      cx="60"
      cy="60"
      r="26"
      fill="none"
      stroke="url(#brightRed)"
      strokeWidth="2"
      opacity="0.8"
    />

    <circle cx="60" cy="60" r="25" fill="#0A0A0A" filter="url(#innerShadow)" />

    <circle cx="60" cy="60" r="23" fill="url(#spotlight)" opacity="0.3" />

    <polygon
      points="52,48 52,72 74,60"
      fill="#FFFFFF"
      filter="url(#redGlow)"
      opacity="0.95"
    />

    <circle cx="45" cy="45" r="3" fill="url(#lensFlareRed)" opacity="0.8" />
    <circle cx="75" cy="45" r="2" fill="url(#lensFlareRed)" opacity="0.6" />
    <circle cx="45" cy="75" r="1.5" fill="url(#lensFlareRed)" opacity="0.5" />

    <rect
      x="5"
      y="55"
      width="20"
      height="10"
      rx="1"
      fill="url(#redGrad)"
      opacity="0.4"
    />
    <rect
      x="95"
      y="55"
      width="20"
      height="10"
      rx="1"
      fill="url(#redGrad)"
      opacity="0.4"
    />

    <rect
      x="8"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />
    <rect
      x="14"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />
    <rect
      x="20"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />

    <rect
      x="97"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />
    <rect
      x="103"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />
    <rect
      x="109"
      y="58"
      width="3"
      height="4"
      rx="0.5"
      fill="#FFFFFF"
      opacity="0.6"
    />

    <circle
      cx="60"
      cy="60"
      r="52"
      fill="none"
      stroke="url(#bloodRed)"
      strokeWidth="0.5"
      opacity="0.3"
    />
  </svg>
);

export default CinverseLogo;
