
import React from 'react';

export const CareerAnimation = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      <svg
        className="w-full h-full opacity-40"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gradGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C5A059" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#003366" stopOpacity="0" />
            <stop offset="100%" stopColor="#004080" stopOpacity="0.4" />
          </linearGradient>
          <filter id="glow-career">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <mask id="scan-mask">
            <rect x="0" y="0" width="1000" height="600" fill="white" />
            <rect x="0" y="-100" width="1000" height="100" fill="black" className="animate-scan-vertical" />
          </mask>
        </defs>

        {/* Dynamic Background Mesh */}
        <path
          d="M 0 500 Q 250 400 500 500 T 1000 400 V 600 H 0 Z"
          fill="url(#gradBlue)"
          className="animate-wave-slow"
          opacity="0.5"
        />

        {/* Career Growth Line (Gold) */}
        <path
          d="M 100 500 C 300 500, 400 300, 600 250 S 800 100, 950 50"
          fill="none"
          stroke="url(#gradGold)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          className="animate-draw"
          filter="url(#glow-career)"
        />

        {/* Floating Resume/Profile Cards */}
        <g transform="translate(200, 200)" className="animate-float">
          <rect x="0" y="0" width="120" height="160" rx="8" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1="20" y1="30" x2="60" y2="30" stroke="rgba(255,255,255,0.3)" strokeWidth="4" strokeLinecap="round" />
          <line x1="20" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="20" y1="70" x2="90" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          <line x1="20" y1="90" x2="100" y2="90" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
          
          {/* Profile Pic Placeholder */}
          <circle cx="95" cy="30" r="12" fill="rgba(255,255,255,0.1)" />
        </g>

        <g transform="translate(750, 300)" className="animate-float-delayed">
          <rect x="0" y="0" width="140" height="100" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          {/* Checkmarks */}
          <circle cx="20" cy="30" r="6" stroke="#4CAF50" strokeWidth="2" fill="none" />
          <path d="M 16 30 L 20 34 L 26 26" stroke="#4CAF50" strokeWidth="2" fill="none" />
          <line x1="40" y1="30" x2="120" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
          
          <circle cx="20" cy="60" r="6" stroke="#4CAF50" strokeWidth="2" fill="none" />
          <path d="M 16 60 L 20 64 L 26 56" stroke="#4CAF50" strokeWidth="2" fill="none" />
          <line x1="40" y1="60" x2="100" y2="60" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
        </g>

        {/* Connection/Network Nodes */}
        {[
          { cx: 300, cy: 150 },
          { cx: 500, cy: 100 },
          { cx: 700, cy: 180 },
          { cx: 850, cy: 350 },
          { cx: 450, cy: 350 },
        ].map((node, i) => (
          <g key={i} className="animate-pulse-soft" style={{ animationDelay: `${i * 0.8}s` }}>
            <circle cx={node.cx} cy={node.cy} r="4" fill="#ffffff" opacity="0.6" />
            <circle cx={node.cx} cy={node.cy} r="20" stroke="#ffffff" strokeWidth="0.5" fill="none" opacity="0.1" className="animate-pulse-ring" />
            {/* Connecting Lines */}
            {i < 4 && (
              <line 
                x1={node.cx} y1={node.cy} 
                x2={[300, 500, 700, 850, 450][i+1]} y2={[150, 100, 180, 350, 350][i+1]} 
                stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="5 5" 
              />
            )}
          </g>
        ))}

        {/* Subtle Particles */}
        {Array.from({ length: 15 }).map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 1000}
            cy={Math.random() * 600}
            r={Math.random() * 2}
            fill="#FFD700"
            opacity={Math.random() * 0.5}
            className="animate-float"
            style={{ animationDuration: `${5 + Math.random() * 5}s`, animationDelay: `${Math.random() * 2}s` }}
          />
        ))}
      </svg>
      
      <style>{`
        @keyframes scan-vertical {
            0% { transform: translateY(0); opacity: 0; }
            50% { opacity: 0.2; }
            100% { transform: translateY(700px); opacity: 0; }
        }
        .animate-scan-vertical {
            animation: scan-vertical 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
