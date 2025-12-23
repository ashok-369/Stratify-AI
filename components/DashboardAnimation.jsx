
import React from 'react';

export const DashboardAnimation = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full opacity-30"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradSilver" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#A0A0A0" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0.6" />
          </linearGradient>
          <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#003366" stopOpacity="0" />
            <stop offset="100%" stopColor="#003366" stopOpacity="0.3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background Grid - Perspective */}
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
          <line x1="0" y1="500" x2="1000" y2="500" />
          <line x1="0" y1="400" x2="1000" y2="400" />
          <line x1="0" y1="300" x2="1000" y2="300" />
          <line x1="100" y1="600" x2="400" y2="200" />
          <line x1="900" y1="600" x2="600" y2="200" />
          <line x1="500" y1="600" x2="500" y2="200" />
        </g>

        {/* Animated Bar Chart */}
        <g transform="translate(150, 250)">
          {[0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 0.7].map((h, i) => (
            <rect
              key={i}
              x={i * 60}
              y={200 - 200 * h}
              width="30"
              height={200 * h}
              fill="url(#gradSilver)"
              className="animate-grow"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </g>

        {/* Area Chart Background */}
        <path
          d="M 100 450 Q 250 350 400 400 T 700 300 T 950 200 V 600 H 100 Z"
          fill="url(#gradBlue)"
          className="animate-pulse-soft"
        />

        {/* Animated Line Graph (Gold) */}
        <path
          d="M 100 450 Q 250 350 400 400 T 700 300 T 950 200"
          fill="none"
          stroke="url(#gradGold)"
          strokeWidth="3"
          filter="url(#glow)"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-draw"
        />

        {/* Pulsing Data Nodes */}
        {[
          { cx: 400, cy: 400 },
          { cx: 700, cy: 300 },
          { cx: 950, cy: 200 },
        ].map((node, i) => (
          <g key={i} className="animate-pulse-ring" style={{ animationDelay: `${1 + i * 0.5}s` }}>
            <circle cx={node.cx} cy={node.cy} r="6" fill="#FFD700" />
            <circle cx={node.cx} cy={node.cy} r="12" stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.5" />
          </g>
        ))}

        {/* Floating Data Widgets (Glassmorphism) */}
        <g transform="translate(750, 100)" className="animate-float">
          <rect width="180" height="100" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
          <line x1="20" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
          <line x1="20" y1="50" x2="140" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
          <circle cx="150" cy="30" r="10" fill="#4CAF50" opacity="0.8" />
        </g>

        <g transform="translate(50, 150)" className="animate-float-delayed">
          <rect width="140" height="80" rx="10" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
          <circle cx="40" cy="40" r="20" stroke="rgba(255,255,255,0.3)" strokeWidth="3" fill="none" />
          <line x1="80" y1="30" x2="120" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <line x1="80" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
        </g>

      </svg>
    </div>
  );
};
