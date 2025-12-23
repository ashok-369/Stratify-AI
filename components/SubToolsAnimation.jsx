
import React from 'react';

export const SubToolsAnimation = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <svg
        className="w-full h-full opacity-30 dark:opacity-20"
        viewBox="0 0 1000 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradConnect" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#001F3F" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#001F3F" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradWave" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0E0E0" stopOpacity="0" />
            <stop offset="50%" stopColor="#001F3F" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#E0E0E0" stopOpacity="0" />
          </linearGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Geometric Grid */}
        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(0,31,63,0.03)" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Connecting Network Mesh */}
        <g stroke="url(#gradConnect)" strokeWidth="0.5" className="animate-pulse-soft">
            <line x1="100" y1="100" x2="300" y2="300" />
            <line x1="300" y1="300" x2="600" y2="200" />
            <line x1="600" y1="200" x2="900" y2="400" />
            <line x1="900" y1="400" x2="700" y2="600" />
            <line x1="700" y1="600" x2="400" y2="500" />
            <line x1="400" y1="500" x2="100" y2="100" />
            
            {/* Cross connections */}
            <line x1="300" y1="300" x2="400" y2="500" />
            <line x1="600" y1="200" x2="700" y2="600" />
        </g>

        {/* Pulsing Nodes */}
        {[
            { cx: 100, cy: 100 }, { cx: 300, cy: 300 }, { cx: 600, cy: 200 },
            { cx: 900, cy: 400 }, { cx: 700, cy: 600 }, { cx: 400, cy: 500 }
        ].map((node, i) => (
            <g key={i} className="animate-pulse-glow" style={{ animationDelay: `${i * 0.5}s` }}>
                <circle cx={node.cx} cy={node.cy} r="3" fill="#FFD700" filter="url(#nodeGlow)" />
                <circle cx={node.cx} cy={node.cy} r="15" stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.3" className="animate-pulse-ring" />
            </g>
        ))}

        {/* Flowing Waves */}
        <path
          d="M 0 400 Q 250 300 500 400 T 1000 400"
          fill="none"
          stroke="url(#gradWave)"
          strokeWidth="60"
          className="animate-wave-slow"
          opacity="0.3"
          filter="blur(20px)"
        />
        <path
          d="M 0 600 Q 300 500 600 600 T 1200 600"
          fill="none"
          stroke="rgba(255,215,0,0.05)"
          strokeWidth="40"
          className="animate-wave"
          style={{ animationDuration: '30s' }}
          opacity="0.4"
        />

        {/* Floating Particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1000}
            cy={Math.random() * 800}
            r={Math.random() * 1.5 + 0.5}
            fill={i % 2 === 0 ? "#001F3F" : "#C5A059"}
            opacity={Math.random() * 0.4 + 0.1}
            className="animate-float"
            style={{ 
                animationDuration: `${6 + Math.random() * 4}s`, 
                animationDelay: `${Math.random() * 5}s` 
            }}
          />
        ))}
      </svg>
    </div>
  );
};
