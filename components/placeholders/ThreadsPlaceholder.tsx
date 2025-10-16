import React from 'react';

export const ThreadsPlaceholder: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path 
      d="M 20,20 C 40,40 60,40 80,20" 
      fill="none" 
      stroke="#fff" 
      strokeWidth="5" 
      strokeLinecap="round" 
    />
    <path 
      d="M 20,50 C 40,30 60,70 80,50" 
      fill="none" 
      stroke="#aaa" 
      strokeWidth="5" 
      strokeLinecap="round" 
    />
     <path 
      d="M 20,80 C 40,60 60,60 80,80" 
      fill="none" 
      stroke="#666" 
      strokeWidth="5" 
      strokeLinecap="round" 
    />
  </svg>
);
