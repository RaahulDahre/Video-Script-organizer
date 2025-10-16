import React from 'react';

export const YouTubeShortsPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="shortsGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF0000"/>
        <stop offset="100%" stopColor="#b2071d"/>
      </linearGradient>
    </defs>
    <rect x="25" y="10" width="50" height="80" rx="15" ry="15" fill="#444" />
    <rect x="27" y="12" width="46" height="76" rx="13" ry="13" fill="black" />
    <path 
      d="m41.2 34.3 15.7 3.3c 1 .3 1.6 1.3 1.6 2.5v7.8c0 1.2-.6 2.2-1.6 2.5L41.2 53.7c-1 .3-2-.4-2-1.5V35.8c0-1.2.9-1.8 2-1.5Z"
      fill="url(#shortsGradient)"
    />
    <path d="M47.1 40.9 51.2 43l-4.1 2.1Z" fill="white"/>
  </svg>
);
