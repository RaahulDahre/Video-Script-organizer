import React from 'react';

export const InstagramPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <radialGradient id="instagramGradient" cx="0.3" cy="1" r="1">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </radialGradient>
    </defs>
    <rect width="100" height="100" rx="25" ry="25" fill="url(#instagramGradient)" />
    <rect x="15" y="15" width="70" height="70" rx="18" ry="18" fill="none" stroke="white" strokeWidth="6" />
    <circle cx="50" cy="50" r="18" fill="none" stroke="white" strokeWidth="6" />
    <circle cx="72" cy="28" r="4" fill="white" />
  </svg>
);
