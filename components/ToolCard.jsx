
import React from 'react';
import { Icon } from './Icon.jsx';

export const ToolCard = ({ tool, onClick }) => {
  return (
    <div 
      onClick={() => onClick(tool)}
      className="group relative h-full flex flex-col justify-between overflow-hidden rounded-2xl cursor-pointer transition-all duration-500 hover:-translate-y-2"
    >
      {/* Background with Glassmorphism & Gradient Border */}
      <div className="absolute inset-0 bg-white/80 dark:bg-slate-800/60 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 rounded-2xl transition-all duration-300 group-hover:bg-white dark:group-hover:bg-slate-800 group-hover:border-primary-light/50 dark:group-hover:border-primary/50 shadow-sm group-hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] dark:group-hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"></div>
      
      {/* Metallic Shimmer Overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/40 dark:via-white/5 to-transparent transition-opacity duration-500" style={{ mixBlendMode: 'overlay' }}></div>

      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Icon Container with Circular Progress */}
        <div className="relative w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="4" className="dark:stroke-white/5" />
                <circle 
                    cx="50" cy="50" r="46" 
                    fill="none" 
                    stroke="url(#gradIcon)" 
                    strokeWidth="4" 
                    strokeDasharray="289" 
                    strokeDashoffset="289" 
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out group-hover:animate-draw-circle"
                />
                <defs>
                    <linearGradient id="gradIcon" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366F1" />
                        <stop offset="100%" stopColor="#A855F7" />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* The Icon */}
            <div className="relative bg-slate-50 dark:bg-slate-700 w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                <Icon name={tool.iconName || tool.icon} className="text-slate-700 dark:text-slate-200 transition-colors duration-300 group-hover:text-primary dark:group-hover:text-primary-light" size={20} />
            </div>
        </div>

        <div className="text-center flex-grow">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent dark:group-hover:from-white dark:group-hover:to-primary-light transition-all tracking-tight">
                {tool.title}
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed font-light line-clamp-3 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">
                {tool.description}
            </p>
        </div>
      
        <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700/50 group-hover:border-transparent transition-colors">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                {tool.isComingSoon ? (
                    <span className="text-slate-300">Coming Soon</span>
                ) : (
                    <>
                        Open Tool 
                        <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};
