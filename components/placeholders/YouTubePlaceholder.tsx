import React from 'react';

export const YouTubePlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="youtubeGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#FF0000"/>
        <stop offset="100%" stopColor="#b2071d"/>
      </linearGradient>
    </defs>
    <rect x="10" y="25" width="80" height="50" rx="15" ry="15" fill="#444" />
    <rect x="12" y="27" width="76" height="46" rx="13" ry="13" fill="black" />
    <circle cx="50" cy="50" r="15" fill="url(#youtubeGradient)" />
    <path d="M46 43 L 57 50 L 46 57 Z" fill="white" />
  </svg>
);
