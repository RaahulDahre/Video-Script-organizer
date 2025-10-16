import React from 'react';

export const TelegramPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="telegramGradient" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0%" stopColor="#26A5E4"/>
        <stop offset="100%" stopColor="#3369e1"/>
      </linearGradient>
    </defs>
    <path 
      d="M 10 50 L 85 15 L 65 85 L 45 60 Z"
      fill="url(#telegramGradient)" 
      stroke="white" 
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M 10 50 L 48 58 L 85 15"
      fill="none"
      stroke="#FFFFFF80"
      strokeWidth="2"
    />
  </svg>
);
