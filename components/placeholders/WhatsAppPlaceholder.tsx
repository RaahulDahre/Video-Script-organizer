import React from 'react';

export const WhatsAppPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="whatsappGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#25D366"/>
        <stop offset="100%" stopColor="#128C7E"/>
      </linearGradient>
    </defs>
    <path 
      d="M20 80 V 30 C 20 20 30 20 30 20 H 70 C 80 20 80 30 80 30 V 60 C 80 70 70 70 70 70 H 40 L 20 80 Z"
      fill="url(#whatsappGradient)" 
      stroke="white" 
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);
