
// import React, { useEffect, useState } from 'react';
// import { Icon } from '../components/Icon.jsx';
// import { Link } from 'react-router-dom';
// import webLogo from '../assets/webLogo.png'

// const SUITES = [
//     { id: 'career', label: 'Career', icon: 'briefcase', path: '/career', color: 'from-violet-500 to-indigo-500', border: 'group-hover:border-indigo-500/50', text: 'text-indigo-200', desc: 'Resume, Cover Letter & Interview Prep' },
//     { id: 'business', label: 'Business', icon: 'trending-up', path: '/business', color: 'from-amber-400 to-orange-500', border: 'group-hover:border-amber-500/50', text: 'text-amber-200', desc: 'Plans, Pitch Decks & Legal Docs' },
//     { id: 'finance', label: 'Finance', icon: 'landmark', path: '/finance', color: 'from-emerald-400 to-teal-500', border: 'group-hover:border-emerald-500/50', text: 'text-emerald-200', desc: 'Tax, Budgeting & Investment Analysis' },
//     { id: 'coding', label: 'Coding', icon: 'terminal', path: '/coding', color: 'from-blue-500 to-cyan-500', border: 'group-hover:border-cyan-500/50', text: 'text-cyan-200', desc: 'Snippets, Scripts & Micro-Apps' },
//     { id: 'productivity', label: 'Productivity', icon: 'check-circle', path: '/productivity', color: 'from-fuchsia-500 to-pink-500', border: 'group-hover:border-pink-500/50', text: 'text-pink-200', desc: 'Planners, Habits & Notion Templates' },
//     { id: 'education', label: 'Education', icon: 'graduation-cap', path: '/education', color: 'from-sky-400 to-indigo-500', border: 'group-hover:border-sky-500/50', text: 'text-sky-200', desc: 'Study Notes, Exam Guides & Flashcards' },
//     { id: 'creative', label: 'Creativity', icon: 'palette', path: '/creativity', color: 'from-rose-400 to-red-500', border: 'group-hover:border-rose-500/50', text: 'text-rose-200', desc: 'Social Content, Scripts & Design' },
//     { id: 'lifestyle', label: 'Lifestyle', icon: 'heart', path: '/lifestyle', color: 'from-lime-400 to-green-500', border: 'group-hover:border-lime-500/50', text: 'text-lime-200', desc: 'Meal Plans, Fitness & Event Planning' },
// ];

// export const LandingPage = () => {
//     const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    
//     // Smooth mouse movement for parallax
//     useEffect(() => {
//         let rafId;
//         const handleMouseMove = (e) => {
//             rafId = requestAnimationFrame(() => {
//                 setMousePos({
//                     x: (e.clientX / window.innerWidth) * 2 - 1,
//                     y: (e.clientY / window.innerHeight) * 2 - 1
//                 });
//             });
//         };
//         window.addEventListener('mousemove', handleMouseMove);
//         return () => {
//             window.removeEventListener('mousemove', handleMouseMove);
//             cancelAnimationFrame(rafId);
//         };
//     }, []);

//     return (
//         // Changed to a rich dark gradient background for better aesthetics
//         <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#020617] text-white flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30">
            
//             {/* --- Premium Animated Background --- */}
//             <div className="absolute inset-0 pointer-events-none z-0">
//                 {/* 1. Deep Atmospheric Glows (Parallax) */}
//                 <div 
//                     className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] transition-transform duration-1000 ease-out will-change-transform mix-blend-screen"
//                     style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
//                 ></div>
//                 <div 
//                     className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform mix-blend-screen"
//                     style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
//                 ></div>

//                 {/* 2. Grid & Grain Overlay */}
//                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
//                 <div 
//                     className="absolute inset-0 opacity-[0.03]"
//                     style={{ 
//                         backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
//                         backgroundSize: '50px 50px'
//                     }}
//                 ></div>

//                 {/* 3. Dynamic Particles & Rings */}
//                 <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
//                     <circle cx="50%" cy="50%" r="40%" fill="none" stroke="url(#gradStroke)" strokeWidth="0.5" className="animate-spin-slower" strokeDasharray="10 10" opacity="0.3" />
//                     <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" className="animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
                    
//                     <defs>
//                         <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
//                             <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
//                             <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
//                             <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
//                         </linearGradient>
//                     </defs>

//                     {/* Floating Orbs */}
//                     {[...Array(15)].map((_, i) => (
//                         <circle
//                             key={i}
//                             cx={`${Math.random() * 100}%`}
//                             cy={`${Math.random() * 100}%`}
//                             r={Math.random() * 2 + 1}
//                             fill="#818cf8"
//                             opacity={Math.random() * 0.4 + 0.1}
//                             className="animate-pulse-soft"
//                             style={{ animationDelay: `${i * 0.8}s`, animationDuration: `${3 + Math.random() * 3}s` }}
//                         />
//                     ))}
//                 </svg>
//             </div>

//             {/* --- Header --- */}
//             <header className="relative z-50 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full animate-fade-in-up">
//                 {/* <div className="flex items-center gap-3">
//                     <div className="relative group">
//                         <div className="absolute inset-0 bg-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
//                         <div className="relative bg-white/5 p-2.5 rounded-xl backdrop-blur-md border border-white/10 shadow-xl">
//                             <Icon name="sparkles" className="text-indigo-300 group-hover:text-white transition-colors" size={24} />
//                         </div>
//                     </div>
//                     <span className="text-2xl font-bold tracking-tight text-white">Stratify <span className="text-indigo-400 font-light">AI</span></span>
//                 </div> */}
//                 <div className="flex items-center gap-4">
//     {/* Logo Container */}
//     <div className="relative group">
//         {/* The Purple Glow Effect */}
//         <div className="absolute -inset-1 bg-indigo-500/40 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-opacity"></div>
        
//         {/* The Logo Image/Frame */}
//         <div className="relative bg-slate-900/80 p-1.5 rounded-2xl border border-indigo-400/30 shadow-2xl">
//             <img 
//                 src={webLogo} 
//                 alt="Stratify AI Logo" 
//                 className="w-10 h-10 object-contain"
//             />
//         </div>
        
//         {/* Decorative Sparkles (Optional) */}
//         <div className="absolute -top-1 -right-1 text-white opacity-80 animate-pulse">
//             <Icon name="sparkles" size={12} />
//         </div>
//     </div>

//     {/* Typography */}
//     <div className="flex items-baseline">
//         <span className="text-3xl font-bold tracking-tight text-slate-200">
//             Stratify
//             <span className="text-indigo-400 font-semibold ml-0.5">AI</span>
//         </span>
//     </div>
// </div>
//                 {/* Optional: Add a subtle CTA in header */}
//                 <div className="hidden md:flex gap-4">
//                     <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">About</button>
//                     <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Pricing</button>
//                 </div>
//             </header>

//             {/* --- Main Content --- */}
//             <main className="relative z-10 flex-grow flex flex-col items-center px-6 py-12 md:py-20">
                
//                 {/* Hero Text */}
//                 <div className="text-center max-w-5xl mx-auto mb-24 space-y-8">
//                     <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium backdrop-blur-md animate-fade-in-up shadow-[0_0_20px_rgba(99,102,241,0.15)]">
//                         <span className="relative flex h-2 w-2">
//                           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
//                           <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
//                         </span>
//                         The AI Operating System for Success
//                     </div>
                    
//                     <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
//                         <span className="block text-slate-100 pb-2 drop-shadow-xl">Master Your</span>
//                         <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-sky-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]">
//                             Digital Life
//                         </span>
//                     </h1>
                    
//                     <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
//                         Eight powerful suites. One centralized intelligence. Accelerate your career, business, and lifestyle with premium AI agents.
//                     </p>
//                 </div>

//                 {/* Cards Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] w-full px-4 perspective-1000">
//                     {SUITES.map((suite, index) => (
//                         <Link 
//                             to={suite.path} 
//                             key={suite.id}
//                             className="group relative h-[280px] animate-fade-in-up"
//                             style={{ animationDelay: `${300 + (index * 100)}ms` }}
//                         >
//                             {/* Card Glow Effect - Enhanced colors */}
//                             <div className={`absolute -inset-0.5 bg-gradient-to-b ${suite.color} rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition duration-500`}></div>
                            
//                             {/* Card Content - Lighter background for 'Lite Dark' feel */}
//                             <div className={`relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[1.8rem] p-8 flex flex-col items-start overflow-hidden transition-all duration-500 group-hover:-translate-y-2 ${suite.border} hover:bg-white/10 hover:border-white/20 hover:shadow-2xl`}>
                                
//                                 {/* Spotlight Gradient inside card */}
//                                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

//                                 {/* Icon - Enhanced background */}
//                                 <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${suite.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-500 shadow-lg border border-white/10`}>
//                                     <div className="absolute inset-0 bg-black/20 rounded-2xl"></div>
//                                     <Icon name={suite.icon} size={26} className="text-white relative z-10" />
//                                 </div>

//                                 {/* Text */}
//                                 <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-colors">
//                                     {suite.label}
//                                 </h2>
//                                 <p className="text-sm text-slate-400 font-medium leading-relaxed mb-6 group-hover:text-slate-300 transition-colors">
//                                     {suite.desc}
//                                 </p>

//                                 {/* Action Arrow */}
//                                 <div className={`mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${suite.text} opacity-80 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0`}>
//                                     Launch <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </main>

//             <footer className="relative z-10 text-center py-10 border-t border-white/5 bg-[#020617]/50 backdrop-blur-md mt-12">
//                 <p className="text-slate-500 text-sm font-light flex items-center justify-center gap-2">
//                     &copy; 2025 Stratify AI <span className="w-1 h-1 rounded-full bg-indigo-500"></span> Crafted for Excellence
//                 </p>
//             </footer>
//         </div>
//     );
// };

// import React, { useEffect, useState } from 'react';
// import { Icon } from '../components/Icon.jsx';
// import { Link } from 'react-router-dom';
// import webLogo from '../assets/webLogo.png';

// const SUITES = [/* your suites array remains unchanged */];

// export const LandingPage = () => {
//     const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//     const [isDark, setIsDark] = useState(true); // Default: dark mode

//     useEffect(() => {
//         let rafId;
//         const handleMouseMove = (e) => {
//             rafId = requestAnimationFrame(() => {
//                 setMousePos({
//                     x: (e.clientX / window.innerWidth) * 2 - 1,
//                     y: (e.clientY / window.innerHeight) * 2 - 1
//                 });
//             });
//         };
//         window.addEventListener('mousemove', handleMouseMove);
//         return () => {
//             window.removeEventListener('mousemove', handleMouseMove);
//             cancelAnimationFrame(rafId);
//         };
//     }, []);

//     // Apply theme to body
//     useEffect(() => {
//         if (isDark) {
//             document.documentElement.classList.add('dark');
//             document.body.classList.add('bg-[#020617]', 'text-white');
//         } else {
//             document.documentElement.classList.remove('dark');
//             document.body.classList.remove('bg-[#020617]', 'text-white');
//             document.body.classList.add('bg-gray-50', 'text-gray-900');
//         }
//     }, [isDark]);

//     return (
//         <div className={`min-h-screen transition-all duration-1000 ${isDark 
//             ? 'bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#020617] text-white' 
//             : 'bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900'} 
//             flex flex-col relative overflow-hidden font-sans selection:bg-indigo-500/30`}>
            
//             {/* --- Animated Background (Only in Dark Mode) --- */}
//             {isDark && (
//                 <div className="absolute inset-0 pointer-events-none z-0">
//                     <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] transition-transform duration-1000 ease-out will-change-transform mix-blend-screen"
//                         style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}></div>
//                     <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] transition-transform duration-1000 ease-out will-change-transform mix-blend-screen"
//                         style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}></div>
//                     <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
//                     <div className="absolute inset-0 opacity-[0.03]"
//                         style={{ 
//                             backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
//                             backgroundSize: '50px 50px'
//                         }}></div>
//                     {/* SVG particles & rings */}
//                     <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
//                         <circle cx="50%" cy="50%" r="40%" fill="none" stroke="url(#gradStroke)" strokeWidth="0.5" className="animate-spin-slower" strokeDasharray="10 10" opacity="0.3" />
//                         <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="1" className="animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
//                         <defs>
//                             <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
//                                 <stop offset="0%" stopColor="rgba(99, 102, 241, 0)" />
//                                 <stop offset="50%" stopColor="rgba(99, 102, 241, 0.3)" />
//                                 <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
//                             </linearGradient>
//                         </defs>
//                         {[...Array(15)].map((_, i) => (
//                             <circle key={i} cx={`${Math.random() * 100}%`} cy={`${Math.random() * 100}%`} r={Math.random() * 2 + 1}
//                                 fill="#818cf8" opacity={Math.random() * 0.4 + 0.1} className="animate-pulse-soft"
//                                 style={{ animationDelay: `${i * 0.8}s`, animationDuration: `${3 + Math.random() * 3}s` }} />
//                         ))}
//                     </svg>
//                 </div>
//             )}

//             {/* --- Header --- */}
//             <header className="relative z-50 p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full animate-fade-in-up">
//                 {/* Logo */}
//                 <div className="flex items-center gap-4">
//                     <div className="relative group">
//                         <div className={`absolute -inset-1 ${isDark ? 'bg-indigo-500/40' : 'bg-indigo-600/30'} rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition-all duration-500`}></div>
//                         <div className={`relative ${isDark ? 'bg-slate-900/80' : 'bg-white/90'} p-1.5 rounded-2xl border ${isDark ? 'border-indigo-400/30' : 'border-indigo-600/20'} shadow-2xl backdrop-blur-xl`}>
//                             <img src={webLogo} alt="Stratify AI Logo" className="w-10 h-10 object-contain" />
//                         </div>
//                         <div className="absolute -top-1 -right-1 text-white opacity-80 animate-pulse">
//                             <Icon name="sparkles" size={12} />
//                         </div>
//                     </div>
//                     <div className="flex items-baseline">
//                         <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
//                             Stratify<span className="text-indigo-400 font-semibold ml-0.5">AI</span>
//                         </span>
//                     </div>
//                 </div>

//                 {/* Right Side: Theme Toggle + Auth Buttons */}
//                 <div className="flex items-center gap-6">
//                     {/* Theme Toggle */}
//                     <button
//                         onClick={() => setIsDark(!isDark)}
//                         className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 ${isDark ? 'bg-slate-700' : 'bg-gray-300'} shadow-inner`}
//                         aria-label="Toggle theme"
//                     >
//                         <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-500 flex items-center justify-center shadow-lg ${isDark 
//                             ? 'translate-x-6 bg-slate-900' 
//                             : 'translate-x-0 bg-white'}`}>
//                             <Icon name={isDark ? "moon" : "sun"} size={14} className={isDark ? "text-indigo-400" : "text-yellow-500"} />
//                         </div>
//                     </button>

//                     {/* Auth Buttons */}
//                     <div className="hidden md:flex items-center gap-3">
//                         <Link to="/signin">
//                             <button className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 backdrop-blur-xl border ${isDark 
//                                 ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white hover:border-white/20' 
//                                 : 'bg-white/70 border-gray-300 text-gray-700 hover:bg-white hover:shadow-md'}`}>
//                                 Sign In
//                             </button>
//                         </Link>
//                         <Link to="/signup">
//                             <button className="relative px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 overflow-hidden group">
//                                 <span className="relative z-10">Get Started</span>
//                                 <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </header>

//             {/* --- Main Content --- */}
//             <main className="relative z-10 flex-grow flex flex-col items-center px-6 py-12 md:py-20">
//                 {/* Hero Text */}
//                 <div className="text-center max-w-5xl mx-auto mb-24 space-y-8">
//                     <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark 
//                         ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' 
//                         : 'bg-indigo-100 border-indigo-300 text-indigo-700'} text-sm font-medium backdrop-blur-md animate-fade-in-up shadow-lg`}>
//                         <span className="relative flex h-2 w-2">
//                             <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'} opacity-75`}></span>
//                             <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`}></span>
//                         </span>
//                         The AI Operating System for Success
//                     </div>

//                     <h1 className={`text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] animate-fade-in-up`} style={{ animationDelay: '100ms' }}>
//                         <span className={`block ${isDark ? 'text-slate-100' : 'text-gray-800'} pb-2 drop-shadow-xl`}>Master Your</span>
//                         <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark 
//                             ? 'from-indigo-400 via-violet-300 to-sky-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]'
//                             : 'from-indigo-600 via-purple-600 to-blue-600 drop-shadow-lg'}`}>
//                             Digital Life
//                         </span>
//                     </h1>

//                     <p className={`text-lg md:text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up`} style={{ animationDelay: '200ms' }}>
//                         Eight powerful suites. One centralized intelligence. Accelerate your career, business, and lifestyle with premium AI agents.
//                     </p>
//                 </div>

//                 {/* Cards Grid - Light mode compatible */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] w-full px-4 perspective-1000">
//                     {SUITES.map((suite, index) => (
//                         <Link to={suite.path} key={suite.id}
//                             className="group relative h-[280px] animate-fade-in-up"
//                             style={{ animationDelay: `${300 + (index * 100)}ms` }}>
//                             <div className={`absolute -inset-0.5 bg-gradient-to-b ${suite.color} rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition duration-500 ${!isDark && 'opacity-20'}`}></div>
                            
//                             <div className={`relative h-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/70 shadow-xl'} backdrop-blur-xl rounded-[1.8rem] p-8 flex flex-col items-start overflow-hidden transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl`}>
//                                 <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

//                                 <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${suite.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-500 shadow-lg border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
//                                     <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-white/30'} rounded-2xl`}></div>
//                                     <Icon name={suite.icon} size={26} className={`relative z-10 ${isDark ? 'text-white' : 'text-gray-800'}`} />
//                                 </div>

//                                 <h2 className={`text-2xl font-bold ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200' : 'text-gray-800 group-hover:text-indigo-600'} mb-2 transition-all`}>
//                                     {suite.label}
//                                 </h2>
//                                 <p className={`text-sm ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600'} font-medium leading-relaxed mb-6 transition-colors`}>
//                                     {suite.desc}
//                                 </p>

//                                 <div className={`mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${suite.text} opacity-80 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0`}>
//                                     Launch <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
//                                 </div>
//                             </div>
//                         </Link>
//                     ))}
//                 </div>
//             </main>

//             <footer className={`relative z-10 text-center py-10 border-t ${isDark ? 'border-white/5 bg-[#020617]/50' : 'border-gray-200 bg-gray-50/80'} backdrop-blur-md mt-12`}>
//                 <p className={`${isDark ? 'text-slate-500' : 'text-gray-600'} text-sm font-light flex items-center justify-center gap-2`}>
//                     &copy; 2025 Stratify AI <span className="w-1 h-1 rounded-full bg-indigo-500"></span> Crafted for Excellence
//                 </p>
//             </footer>
//         </div>
//     );
// };

// import React, { useEffect, useState, useMemo, useRef } from 'react';
// import { Icon } from '../components/Icon.jsx';
// import { Link } from 'react-router-dom';
// import { Canvas, useFrame } from '@react-three/fiber';
// import { Stars } from '@react-three/drei';
// import * as THREE from 'three';
// import webLogo from '../assets/webLogo.png';

// // ==================== SAMPLE SUITES DATA (Replace with your own) ====================
// const SUITES = [
//   {
//     id: 1,
//     label: 'Career AI',
//     desc: 'Accelerate your professional growth with personalized guidance.',
//     icon: 'briefcase',
//     color: 'from-violet-500 to-purple-600',
//     text: 'text-violet-400',
//     path: '/career',
//   },
//   {
//     id: 2,
//     label: 'Business AI',
//     desc: 'Scale your ventures with intelligent automation and insights.',
//     icon: 'trending-up',
//     color: 'from-indigo-500 to-blue-600',
//     text: 'text-indigo-400',
//     path: '/business',
//   },
//   {
//     id: 3,
//     label: 'Content AI',
//     desc: 'Create stunning content faster than ever before.',
//     icon: 'pen-tool',
//     color: 'from-pink-500 to-rose-600',
//     text: 'text-pink-400',
//     path: '/content',
//   },
//   {
//     id: 4,
//     label: 'Learning AI',
//     desc: 'Master new skills with adaptive, personalized tutoring.',
//     icon: 'graduation-cap',
//     color: 'from-emerald-500 to-teal-600',
//     text: 'text-emerald-400',
//     path: '/learning',
//   },
//   {
//     id: 5,
//     label: 'Health AI',
//     desc: 'Optimize your wellness with data-driven recommendations.',
//     icon: 'heart',
//     color: 'from-orange-500 to-red-600',
//     text: 'text-orange-400',
//     path: '/health',
//   },
//   {
//     id: 6,
//     label: 'Finance AI',
//     desc: 'Manage wealth and investments with precision intelligence.',
//     icon: 'dollar-sign',
//     color: 'from-amber-500 to-yellow-600',
//     text: 'text-amber-400',
//     path: '/finance',
//   },
//   {
//     id: 7,
//     label: 'Creative AI',
//     desc: 'Unleash imagination with next-gen creative tools.',
//     icon: 'sparkles',
//     color: 'from-cyan-500 to-sky-600',
//     text: 'text-cyan-400',
//     path: '/creative',
//   },
//   {
//     id: 8,
//     label: 'Lifestyle AI',
//     desc: 'Elevate every aspect of your daily life effortlessly.',
//     icon: 'zap',
//     color: 'from-fuchsia-500 to-purple-600',
//     text: 'text-fuchsia-400',
//     path: '/lifestyle',
//   },
// ];

// // ==================== GALAXY COMPONENT ====================
// const Galaxy = ({ config }) => {
//   const pointsRef = useRef();

//   const { positions, colors } = useMemo(() => {
//     const {
//       count = 15000,
//       radius = 9,
//       branches = 7,
//       spin = 1.2,
//       randomness = 0.3,
//       randomnessPower = 3.5,
//       insideColor = '#8b5cf6',
//       outsideColor = '#3b82f6',
//     } = config;

//     const positions = new Float32Array(count * 3);
//     const colors = new Float32Array(count * 3);

//     const colorInside = new THREE.Color(insideColor);
//     const colorOutside = new THREE.Color(outsideColor);

//     for (let i = 0; i < count; i++) {
//       const i3 = i * 3;

//       const r = Math.random() * radius;
//       const spinAngle = r * spin;
//       const branchAngle = (i % branches) / branches * Math.PI * 2;

//       const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
//       const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
//       const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

//       positions[i3]     = Math.cos(branchAngle + spinAngle) * r + randomX;
//       positions[i3 + 1] = randomY;
//       positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

//       const mixedColor = colorInside.clone().lerp(colorOutside, r / radius);

//       colors[i3]     = mixedColor.r;
//       colors[i3 + 1] = mixedColor.g;
//       colors[i3 + 2] = mixedColor.b;
//     }

//     return { positions, colors };
//   }, [config]);

//   useFrame((state, delta) => {
//     if (pointsRef.current) {
//       pointsRef.current.rotation.y += config.rotationSpeed * delta;
//     }
//   });

//   return (
//     <points ref={pointsRef}>
//       <bufferGeometry>
//         <bufferAttribute
//           attach="attributes-position"
//           count={positions.length / 3}
//           array={positions}
//           itemSize={3}
//         />
//         <bufferAttribute
//           attach="attributes-color"
//           count={colors.length / 3}
//           array={colors}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         size={config.size || 0.015}
//         sizeAttenuation={true}
//         depthWrite={false}
//         blending={THREE.AdditiveBlending}
//         vertexColors={true}
//         transparent
//         opacity={0.9}
//       />
//     </points>
//   );
// };

// // ==================== MAIN LANDING PAGE ====================
// export const LandingPage = () => {
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isDark, setIsDark] = useState(true);

//   useEffect(() => {
//     let rafId;
//     const handleMouseMove = (e) => {
//       rafId = requestAnimationFrame(() => {
//         setMousePos({
//           x: (e.clientX / window.innerWidth) * 2 - 1,
//           y: (e.clientY / window.innerHeight) * 2 - 1,
//         });
//       });
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   useEffect(() => {
//     if (isDark) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDark]);

//   const galaxyConfig = {
//     count: 15000,
//     radius: 9,
//     branches: 7,
//     spin: 1.2,
//     randomness: 0.3,
//     randomnessPower: 3.5,
//     insideColor: '#8b5cf6',
//     outsideColor: '#3b82f6',
//     size: 0.015,
//     rotationSpeed: 0.05,
//   };

//   return (
//     <div className={`min-h-screen relative overflow-hidden font-sans selection:bg-indigo-500/30 ${isDark ? 'text-white' : 'text-gray-900'}`}>
      
//       {/* Background Layers */}
//       {isDark && (
//         <div className="absolute inset-0 z-0">
//           <Canvas
//             camera={{ position: [0, 0, 6], fov: 60 }}
//             gl={{ antialias: true, alpha: true }}
//             style={{ position: 'absolute', top: 0, left: 0 }}
//           >
//             <ambientLight intensity={0.5} />
//             <Galaxy config={galaxyConfig} />
//             <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
//           </Canvas>
//         </div>
//       )}

//       {isDark && (
//         <div className="absolute inset-0 pointer-events-none z-10">
//           <div
//             className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] transition-transform duration-1000 ease-out mix-blend-screen"
//             style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
//           />
//           <div
//             className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] transition-transform duration-1000 ease-out mix-blend-screen"
//             style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
//           />

//           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
//           <div
//             className="absolute inset-0 opacity-[0.03]"
//             style={{
//               backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
//               backgroundSize: '50px 50px',
//             }}
//           />

//           <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="rgba(99,102,241,0)" />
//                 <stop offset="50%" stopColor="rgba(99,102,241,0.3)" />
//                 <stop offset="100%" stopColor="rgba(99,102,241,0)" />
//               </linearGradient>
//             </defs>
//             <circle cx="50%" cy="50%" r="40%" fill="none" stroke="url(#gradStroke)" strokeWidth="0.5" className="animate-spin-slower" strokeDasharray="10 10" />
//             <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" style={{ animationDirection: 'reverse', animationDuration: '45s' }} />
//             {[...Array(15)].map((_, i) => (
//               <circle
//                 key={i}
//                 cx={`${Math.random() * 100}%`}
//                 cy={`${Math.random() * 100}%`}
//                 r={Math.random() * 2 + 1}
//                 fill="#818cf8"
//                 opacity={Math.random() * 0.4 + 0.1}
//                 style={{ animationDelay: `${i * 0.8}s`, animationDuration: `${3 + Math.random() * 3}s` }}
//                 className="animate-pulse"
//               />
//             ))}
//           </svg>
//         </div>
//       )}

//       {!isDark && (
//         <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 z-0" />
//       )}

//       {/* Main Content */}
//       <div className="relative z-20 flex flex-col min-h-screen">
//         <header className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-4">
//             <div className="relative group">
//               <div className={`absolute -inset-1 ${isDark ? 'bg-indigo-500/40' : 'bg-indigo-600/30'} rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500`} />
//               <div className={`relative ${isDark ? 'bg-slate-900/80' : 'bg-white/90'} p-1.5 rounded-2xl border ${isDark ? 'border-indigo-400/30' : 'border-indigo-600/20'} shadow-2xl backdrop-blur-xl`}>
//                 <img src={webLogo} alt="Stratify AI Logo" className="w-10 h-10 object-contain" />
//               </div>
//             </div>
//             <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
//               Stratify<span className="text-indigo-400 font-semibold ml-0.5">AI</span>
//             </span>
//           </div>

//           <div className="flex items-center gap-6">
//             <button
//               onClick={() => setIsDark(!isDark)}
//               className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 ${isDark ? 'bg-slate-700' : 'bg-gray-300'} shadow-inner`}
//               aria-label="Toggle theme"
//             >
//               <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-500 flex items-center justify-center shadow-lg ${isDark ? 'translate-x-6 bg-slate-900' : 'bg-white'}`}>
//                 <Icon name={isDark ? 'moon' : 'sun'} size={14} className={isDark ? 'text-indigo-400' : 'text-yellow-500'} />
//               </div>
//             </button>

//             <div className="hidden md:flex items-center gap-3">
//               <Link to="/signin">
//                 <button className={`px-5 py-2.5 rounded-xl font-medium text-sm backdrop-blur-xl border transition-all duration-300 ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white/70 border-gray-300 text-gray-700 hover:bg-white'}`}>
//                   Sign In
//                 </button>
//               </Link>
//               <Link to="/signup">
//                 <button className="relative px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 overflow-hidden group">
//                   <span className="relative z-10">Get Started</span>
//                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow flex flex-col items-center px-6 py-12 md:py-20">
//           <div className="text-center max-w-5xl mx-auto mb-24 space-y-8">
//             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-700'} text-sm font-medium backdrop-blur-md shadow-lg`}>
//               <span className="relative flex h-2 w-2">
//                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'} opacity-75`} />
//                 <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`} />
//               </span>
//               The AI Operating System for Success
//             </div>

//             <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
//               <span className={`block ${isDark ? 'text-slate-100' : 'text-gray-800'} pb-2 drop-shadow-xl`}>Master Your</span>
//               <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-indigo-400 via-violet-300 to-sky-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]' : 'from-indigo-600 via-purple-600 to-blue-600 drop-shadow-lg'}`}>
//                 Digital Life
//               </span>
//             </h1>

//             <p className={`text-lg md:text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto font-light leading-relaxed`}>
//               Eight powerful suites. One centralized intelligence. Accelerate your career, business, and lifestyle with premium AI agents.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] w-full px-4">
//             {SUITES.map((suite, index) => (
//               <Link
//                 to={suite.path}
//                 key={suite.id}
//                 className="group relative h-[280px]"
//                 style={{ animationDelay: `${300 + index * 100}ms` }}
//               >
//                 <div className={`absolute -inset-0.5 bg-gradient-to-b ${suite.color} rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition duration-500 ${!isDark && 'opacity-20'}`} />
//                 <div className={`relative h-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/70 shadow-xl'} backdrop-blur-xl rounded-[1.8rem] p-8 flex flex-col items-start overflow-hidden transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl`}>
//                   <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${suite.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-500 shadow-lg border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
//                     <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-white/30'} rounded-2xl`} />
//                     <Icon name={suite.icon} size={26} className={`relative z-10 ${isDark ? 'text-white' : 'text-gray-800'}`} />
//                   </div>
//                   <h2 className={`text-2xl font-bold ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200' : 'text-gray-800 group-hover:text-indigo-600'} mb-2 transition-all`}>
//                     {suite.label}
//                   </h2>
//                   <p className={`text-sm ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600'} font-medium leading-relaxed mb-6 transition-colors`}>
//                     {suite.desc}
//                   </p>
//                   <div className={`mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${suite.text} opacity-80 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0`}>
//                     Launch <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </main>

//         <footer className={`text-center py-10 border-t ${isDark ? 'border-white/5 bg-[#020617]/50' : 'border-gray-200 bg-gray-50/80'} backdrop-blur-md mt-12`}>
//           <p className={`${isDark ? 'text-slate-500' : 'text-gray-600'} text-sm font-light flex items-center justify-center gap-2`}>
//             © 2025 Stratify AI <span className="w-1 h-1 rounded-full bg-indigo-500"></span> Crafted for Excellence
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// pages/LandingPage.jsx

// import React, { useEffect, useState } from 'react';
// import { Icon } from '../components/Icon.jsx';
// import { Link } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber';
// import { Stars } from '@react-three/drei';
// import Galaxy from '../components/Galaxy.jsx'; // Make sure this path is correct
// import webLogo from '../assets/webLogo.png';

// const SUITES = [
//   { id: 'career', label: 'Career', icon: 'briefcase', path: '/career', color: 'from-violet-500 to-indigo-500', text: 'text-indigo-200', desc: 'Resume, Cover Letter & Interview Prep' },
//   { id: 'business', label: 'Business', icon: 'trending-up', path: '/business', color: 'from-amber-400 to-orange-500', text: 'text-amber-200', desc: 'Plans, Pitch Decks & Legal Docs' },
//   { id: 'finance', label: 'Finance', icon: 'landmark', path: '/finance', color: 'from-emerald-400 to-teal-500', text: 'text-emerald-200', desc: 'Tax, Budgeting & Investment Analysis' },
//   { id: 'coding', label: 'Coding', icon: 'terminal', path: '/coding', color: 'from-blue-500 to-cyan-500', text: 'text-cyan-200', desc: 'Snippets, Scripts & Micro-Apps' },
//   { id: 'productivity', label: 'Productivity', icon: 'check-circle', path: '/productivity', color: 'from-fuchsia-500 to-pink-500', text: 'text-pink-200', desc: 'Planners, Habits & Notion Templates' },
//   { id: 'education', label: 'Education', icon: 'graduation-cap', path: '/education', color: 'from-sky-400 to-indigo-500', text: 'text-sky-200', desc: 'Study Notes, Exam Guides & Flashcards' },
//   { id: 'creative', label: 'Creativity', icon: 'palette', path: '/creativity', color: 'from-rose-400 to-red-500', text: 'text-rose-200', desc: 'Social Content, Scripts & Design' },
//   { id: 'lifestyle', label: 'Lifestyle', icon: 'heart', path: '/lifestyle', color: 'from-lime-400 to-green-500', text: 'text-lime-200', desc: 'Meal Plans, Fitness & Event Planning' },
// ];

// export const LandingPage = () => {
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isDark, setIsDark] = useState(true);

//   // Mouse parallax
//   useEffect(() => {
//     let rafId;
//     const handleMouseMove = (e) => {
//       rafId = requestAnimationFrame(() => {
//         setMousePos({
//           x: (e.clientX / window.innerWidth) * 2 - 1,
//           y: (e.clientY / window.innerHeight) * 2 - 1,
//         });
//       });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   // Dark/Light mode
//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDark);
//   }, [isDark]);

//   return (
//     <div className={`min-h-screen relative overflow-hidden font-sans selection:bg-indigo-500/30 ${isDark ? 'bg-gradient-to-b from-slate-900 via-[#0f172a] to-[#020617] text-white' : 'bg-gradient-to-b from-gray-50 via-white to-gray-100 text-gray-900'}`}>

//       {/* Dark Mode: 3D Galaxy Background (Now Visible & Bright) */}
//       {isDark && (
//         <div className="absolute inset-0 z-0 pointer-events-none">
//           <Canvas
//             camera={{ position: [0, 0, 8], fov: 60 }}
//             gl={{ antialias: true, alpha: true }}
//             style={{ position: 'absolute', top: 0, left: 0 }}
//           >
//             <ambientLight intensity={1.2} />
//             <Galaxy /> {/* Uses the fixed Galaxy component with toneMapped={false} */}
//             <Stars radius={120} depth={60} count={6000} factor={5} saturation={0} fade speed={1} />
//           </Canvas>
//         </div>
//       )}

//       {/* Dark Mode: 2D Overlays (Glow blobs, grain, SVG particles) */}
//       {isDark && (
//         <div className="absolute inset-0 pointer-events-none z-10">
//           <div
//             className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-600/10 rounded-full blur-[120px] mix-blend-screen transition-transform duration-1000"
//             style={{ transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)` }}
//           />
//           <div
//             className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-blue-600/10 rounded-full blur-[100px] mix-blend-screen transition-transform duration-1000"
//             style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
//           />

//           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]" />
//           <div
//             className="absolute inset-0 opacity-[0.03]"
//             style={{
//               backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
//               backgroundSize: '50px 50px',
//             }}
//           />

//           <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
//             <defs>
//               <linearGradient id="gradStroke" x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="rgba(99,102,241,0)" />
//                 <stop offset="50%" stopColor="rgba(99,102,241,0.3)" />
//                 <stop offset="100%" stopColor="rgba(99,102,241,0)" />
//               </linearGradient>
//             </defs>

//             <circle cx="50%" cy="50%" r="40%" fill="none" stroke="url(#gradStroke)" strokeWidth="0.5" strokeDasharray="10 10" className="animate-spin" style={{ animationDuration: '30s' }} />
//             <circle cx="50%" cy="50%" r="28%" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" className="animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />

//             {[...Array(15)].map((_, i) => (
//               <circle
//                 key={i}
//                 cx={`${Math.random() * 100}%`}
//                 cy={`${Math.random() * 100}%`}
//                 r={Math.random() * 2 + 1}
//                 fill="#818cf8"
//                 opacity={Math.random() * 0.4 + 0.1}
//                 className="animate-pulse"
//                 style={{ animationDelay: `${i * 0.8}s`, animationDuration: `${3 + Math.random() * 3}s` }}
//               />
//             ))}
//           </svg>
//         </div>
//       )}

//       {/* Light Mode Background */}
//       {!isDark && <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100 z-0" />}

//       {/* Main Content */}
//       <div className="relative z-20 flex flex-col min-h-screen">
//         <header className="p-6 md:p-8 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-4">
//             <div className="relative group">
//               <div className={`absolute -inset-1 ${isDark ? 'bg-indigo-500/40' : 'bg-indigo-600/30'} rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500`} />
//               <div className={`relative ${isDark ? 'bg-slate-900/80' : 'bg-white/90'} p-1.5 rounded-2xl border ${isDark ? 'border-indigo-400/30' : 'border-indigo-600/20'} shadow-2xl backdrop-blur-xl`}>
//                 <img src={webLogo} alt="Stratify AI Logo" className="w-10 h-10 object-contain" />
//               </div>
//               <div className="absolute -top-1 -right-1 text-white opacity-80 animate-pulse">
//                 <Icon name="sparkles" size={12} />
//               </div>
//             </div>
//             <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-slate-200' : 'text-gray-800'}`}>
//               Stratify<span className="text-indigo-400 font-semibold ml-0.5">AI</span>
//             </span>
//           </div>

//           <div className="flex items-center gap-6">
//             {/* Theme Toggle */}
//             <button
//               onClick={() => setIsDark(!isDark)}
//               className={`relative w-14 h-8 rounded-full p-1 transition-all duration-500 ${isDark ? 'bg-slate-700' : 'bg-gray-300'} shadow-inner`}
//               aria-label="Toggle theme"
//             >
//               <div className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-transform duration-500 flex items-center justify-center shadow-lg ${isDark ? 'translate-x-6 bg-slate-900' : 'translate-x-0 bg-white'}`}>
//                 <Icon name={isDark ? 'moon' : 'sun'} size={14} className={isDark ? 'text-indigo-400' : 'text-yellow-500'} />
//               </div>
//             </button>

//             {/* Sign In & Get Started */}
//             <div className="hidden md:flex items-center gap-3">
//               <Link to="/signin">
//                 <button className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 backdrop-blur-xl border ${isDark ? 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10' : 'bg-white/70 border-gray-300 text-gray-700 hover:bg-white'}`}>
//                   Sign In
//                 </button>
//               </Link>
//               <Link to="/signup">
//                 <button className="relative px-6 py-2.5 rounded-xl font-medium text-sm text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 overflow-hidden group">
//                   <span className="relative z-10">Get Started</span>
//                   <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow flex flex-col items-center px-6 py-12 md:py-20">
//           <div className="text-center max-w-5xl mx-auto mb-24 space-y-8">
//             <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-100 border-indigo-300 text-indigo-700'} text-sm font-medium backdrop-blur-md shadow-lg`}>
//               <span className="relative flex h-2 w-2">
//                 <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isDark ? 'bg-indigo-400' : 'bg-indigo-600'} opacity-75`} />
//                 <span className={`relative inline-flex rounded-full h-2 w-2 ${isDark ? 'bg-indigo-500' : 'bg-indigo-600'}`} />
//               </span>
//               The AI Operating System for Success
//             </div>

//             <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
//               <span className={`block ${isDark ? 'text-slate-100' : 'text-gray-800'} pb-2 drop-shadow-xl`}>Master Your</span>
//               <span className={`block text-transparent bg-clip-text bg-gradient-to-r ${isDark ? 'from-indigo-400 via-violet-300 to-sky-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.4)]' : 'from-indigo-600 via-purple-600 to-blue-600 drop-shadow-lg'}`}>
//                 Digital Life
//               </span>
//             </h1>

//             <p className={`text-lg md:text-xl ${isDark ? 'text-slate-400' : 'text-gray-600'} max-w-2xl mx-auto font-light leading-relaxed`}>
//               Eight powerful suites. One centralized intelligence. Accelerate your career, business, and lifestyle with premium AI agents.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1400px] w-full px-4">
//             {SUITES.map((suite, index) => (
//               <Link to={suite.path} key={suite.id} className="group relative h-[280px]" style={{ animationDelay: `${300 + index * 100}ms` }}>
//                 <div className={`absolute -inset-0.5 bg-gradient-to-b ${suite.color} rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition duration-500 ${!isDark && 'opacity-20'}`} />
//                 <div className={`relative h-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/70 border-gray-200/70 shadow-xl'} backdrop-blur-xl rounded-[1.8rem] p-8 flex flex-col items-start overflow-hidden transition-all duration-500 group-hover:-translate-y-2 hover:shadow-2xl`}>
//                   <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

//                   <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${suite.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-500 shadow-lg border ${isDark ? 'border-white/10' : 'border-gray-300'}`}>
//                     <div className={`absolute inset-0 ${isDark ? 'bg-black/20' : 'bg-white/30'} rounded-2xl`} />
//                     <Icon name={suite.icon} size={26} className={`relative z-10 ${isDark ? 'text-white' : 'text-gray-800'}`} />
//                   </div>

//                   <h2 className={`text-2xl font-bold ${isDark ? 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200' : 'text-gray-800 group-hover:text-indigo-600'} mb-2 transition-all`}>
//                     {suite.label}
//                   </h2>

//                   <p className={`text-sm ${isDark ? 'text-slate-400 group-hover:text-slate-300' : 'text-gray-600'} font-medium leading-relaxed mb-6 transition-colors`}>
//                     {suite.desc}
//                   </p>

//                   <div className={`mt-auto flex items-center gap-2 text-sm font-bold uppercase tracking-wider ${suite.text} opacity-80 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0`}>
//                     Launch <Icon name="arrow-right" size={14} className="group-hover:translate-x-1 transition-transform" />
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </main>

//         <footer className={`text-center py-10 border-t ${isDark ? 'border-white/5 bg-[#020617]/50' : 'border-gray-200 bg-gray-50/80'} backdrop-blur-md mt-12`}>
//           <p className={`${isDark ? 'text-slate-500' : 'text-gray-600'} text-sm font-light flex items-center justify-center gap-2`}>
//             © 2025 Stratify AI <span className="w-1 h-1 rounded-full bg-indigo-500"></span> Crafted for Excellence
//           </p>
//         </footer>
//       </div>
//     </div>
//   );
// };

// import React, { useEffect, useState } from 'react';
// import { Icon } from '../components/Icon.jsx';
// import { Link } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber';
// import { Stars } from '@react-three/drei';
// import Galaxy from '../components/Galaxy.jsx';
// import webLogo from '../assets/webLogo.png';

// const SUITES = [ /* your suites array unchanged */ ];

// export const LandingPage = () => {
//   const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
//   const [isDark, setIsDark] = useState(true);

//   useEffect(() => {
//     let rafId;
//     const handleMouseMove = (e) => {
//       rafId = requestAnimationFrame(() => {
//         setMousePos({
//           x: (e.clientX / window.innerWidth) * 2 - 1,
//           y: (e.clientY / window.innerHeight) * 2 - 1,
//         });
//       });
//     };
//     window.addEventListener('mousemove', handleMouseMove);
//     return () => {
//       window.removeEventListener('mousemove', handleMouseMove);
//       if (rafId) cancelAnimationFrame(rafId);
//     };
//   }, []);

//   useEffect(() => {
//     document.documentElement.classList.toggle('dark', isDark);
//   }, [isDark]);

//   return (
//     <div className={`min-h-screen relative overflow-hidden font-sans ${isDark ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-900'}`}>

//       {/* Luxury Subtle Particles – Perfect in Both Modes */}
//       <div className="absolute inset-0 z-0 pointer-events-none">
//         <Canvas camera={{ position: [0, 0, 10], fov: 75 }} gl={{ antialias: true, alpha: true }}>
//           <ambientLight intensity={0.8} />
//           <Galaxy isLight={!isDark} />
//           <Stars radius={150} depth={80} count={4000} factor={3} saturation={0} fade speed={0.5} />
//         </Canvas>
//       </div>

//       {/* Dark Mode: Subtle luxury glows */}
//       {isDark && (
//         <div className="absolute inset-0 pointer-events-none z-10 opacity-50">
//           <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-gradient-to-r from-amber-500/5 to-transparent rounded-full blur-[100px]" style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }} />
//           <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-r from-indigo-500/5 to-transparent rounded-full blur-[100px]" style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }} />
//         </div>
//       )}

//       {/* Content */}
//       <div className="relative z-20 flex flex-col min-h-screen">
//         <header className="p-8 md:p-12 flex justify-between items-center max-w-7xl mx-auto w-full">
//           <div className="flex items-center gap-6">
//             <div className="relative">
//               <div className={`absolute -inset-1 ${isDark ? 'bg-gradient-to-r from-amber-500/30 to-indigo-500/30' : 'bg-gradient-to-r from-indigo-400/20 to-purple-400/20'} rounded-full blur-xl opacity-70`} />
//               <img src={webLogo} alt="Stratify AI" className="relative w-12 h-12 rounded-full object-contain shadow-2xl" />
//             </div>
//             <span className="text-4xl font-light tracking-wider">
//               Stratify<span className="font-bold text-indigo-500">AI</span>
//             </span>
//           </div>

//           <div className="flex items-center gap-8">
//             <button onClick={() => setIsDark(!isDark)} className="p-2 rounded-full bg-white/10 backdrop-blur-md">
//               <Icon name={isDark ? 'moon' : 'sun'} size={20} />
//             </button>
//             <div className="hidden lg:flex items-center gap-6">
//               <Link to="/signin" className="text-sm font-medium opacity-80 hover:opacity-100 transition">Sign In</Link>
//               <Link to="/signup">
//                 <button className="px-8 py-3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-2xl hover:shadow-indigo-500/50 transition">
//                   Get Started
//                 </button>
//               </Link>
//             </div>
//           </div>
//         </header>

//         <main className="flex-grow flex flex-col items-center justify-center px-8 py-20">
//           <div className="text-center max-w-6xl space-y-12">
//             <p className="text-sm uppercase tracking-widest opacity-70 font-medium">The AI Operating System for Success</p>
//             <h1 className="text-6xl md:text-8xl font-light leading-tight">
//               Master Your<br />
//               <span className="font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Digital Empire</span>
//             </h1>
//             <p className="text-xl md:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
//               Eight elite suites. One supreme intelligence. Elevate your career, enterprise, and legacy with unparalleled AI mastery.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-32 max-w-7xl w-full">
//             {SUITES.map((suite, index) => (
//               <Link to={suite.path} key={suite.id} className="group">
//                 <div className={`relative h-80 rounded-3xl overflow-hidden ${isDark ? 'bg-white/5 border-white/10' : 'bg-white/60 border-gray-200/50'} backdrop-blur-2xl border shadow-2xl transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-3xl`}>
//                   <div className={`absolute inset-0 bg-gradient-to-br ${suite.color} opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
//                   <div className="p-10 flex flex-col h-full">
//                     <div className={`w-16 h-16 rounded-2xl ${isDark ? 'bg-white/10' : 'bg-gray-100'} flex items-center justify-center mb-8 shadow-xl`}>
//                       <Icon name={suite.icon} size={32} className={isDark ? 'text-white' : 'text-gray-800'} />
//                     </div>
//                     <h3 className="text-2xl font-semibold mb-4">{suite.label}</h3>
//                     <p className="text-sm opacity-70 flex-grow">{suite.desc}</p>
//                     <div className="mt-8 flex items-center gap-3 text-indigo-400 font-semibold">
//                       Explore <Icon name="arrow-right" size={16} className="group-hover:translate-x-2 transition" />
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </main>

//         <footer className="py-12 text-center opacity-60">
//           <p className="text-sm">© 2025 Stratify AI • Engineered for Excellence</p>
//         </footer>
//       </div>
//     </div>
//   );
// };
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import Galaxy from '../components/Galaxy.jsx';
import { Icon } from '../components/Icon.jsx';
import webLogo from '../assets/webLogo.png';

const SUITES = [
  { id: 'career', label: 'Career', icon: 'briefcase', path: '/career', color: 'from-indigo-600 to-purple-700', desc: 'Resume, Cover Letter & Interview Prep' },
  { id: 'business', label: 'Business', icon: 'trending-up', path: '/business', color: 'from-amber-600 to-orange-700', desc: 'Plans, Pitch Decks & Legal Docs' },
  { id: 'finance', label: 'Finance', icon: 'landmark', path: '/finance', color: 'from-emerald-600 to-teal-700', desc: 'Tax, Budgeting & Investment Analysis' },
  { id: 'coding', label: 'Coding', icon: 'terminal', path: '/coding', color: 'from-blue-600 to-cyan-700', desc: 'Snippets, Scripts & Micro-Apps' },
  { id: 'productivity', label: 'Productivity', icon: 'check-circle', path: '/productivity', color: 'from-purple-600 to-pink-700', desc: 'Planners, Habits & Notion Templates' },
  { id: 'education', label: 'Education', icon: 'graduation-cap', path: '/education', color: 'from-sky-600 to-indigo-700', desc: 'Study Notes, Exam Guides & Flashcards' },
  { id: 'creative', label: 'Creativity', icon: 'palette', path: '/creativity', color: 'from-rose-600 to-red-700', desc: 'Social Content, Scripts & Design' },
  { id: 'lifestyle', label: 'Lifestyle', icon: 'heart', path: '/lifestyle', color: 'from-emerald-600 to-green-700', desc: 'Meal Plans, Fitness & Events' },
];

export const LandingPage = () => {
  const [isDark, setIsDark] = useState(true);
  const [tilt, setTilt] = useState({});

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  const handleMove = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    setTilt((prev) => ({
      ...prev,
      [id]: {
        transform: `
          perspective(1200px)
          rotateX(${(-y / 18)}deg)
          rotateY(${(x / 18)}deg)
          translateY(-14px)
        `
      }
    }));
  };

  const resetTilt = (id) => {
    setTilt((prev) => ({
      ...prev,
      [id]: {
        transform: 'perspective(1200px) rotateX(0deg) rotateY(0deg)'
      }
    }));
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>

      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 70 }}>
          <ambientLight intensity={0.7} />
          <Galaxy isLight={!isDark} />
          <Stars radius={120} depth={80} count={5000} factor={3} fade />
        </Canvas>
      </div>

      <div className="relative z-10">

        {/* Header */}
        <header className="max-w-7xl mx-auto px-8 py-16 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <img src={webLogo} className="w-14 h-14 rounded-full shadow-2xl" />
            <span className="text-3xl tracking-widest">
              Stratify<span className="text-indigo-500 font-medium">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl"
            >
              <Icon name={isDark ? 'moon' : 'sun'} />
            </button>
            <Link to="/signin" className="opacity-70 hover:opacity-100">Sign In</Link>
            <Link to="/signup">
              <button className="px-10 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-700 shadow-xl">
                Get Started
              </button>
            </Link>
          </div>
        </header>

        {/* Hero */}
        <main className="text-center px-8 py-32 max-w-6xl mx-auto">
          <p className="uppercase tracking-widest opacity-60 mb-12">
            The AI Operating System for Success
          </p>

          <h1 className="text-7xl md:text-9xl font-light mb-10 leading-tight">
            Master Your<br />
            <span className="font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-amber-400 bg-clip-text text-transparent">
              Digital Empire
            </span>
          </h1>

          <p className="text-xl md:text-2xl opacity-70 max-w-3xl mx-auto">
            Eight elite AI suites designed to elevate careers, businesses, and legacies.
          </p>
        </main>

        {/* Suites */}
        <section className="max-w-7xl mx-auto px-8 pb-40">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

            {SUITES.map((suite) => (
              <Link key={suite.id} to={suite.path} className="group">
                <div
                  onMouseMove={(e) => handleMove(e, suite.id)}
                  onMouseLeave={() => resetTilt(suite.id)}
                  style={tilt[suite.id]}
                  className={`
                    relative h-96 rounded-3xl overflow-hidden
                    transition-all duration-500 ease-out
                    hover:scale-[1.03]
                    border
                    ${isDark
                      ? 'bg-gradient-to-br from-white/10 via-white/5 to-white/10 border-white/20'
                      : 'bg-white/60 border-gray-200/60'}
                    backdrop-blur-2xl
                    shadow-[0_40px_120px_-30px_rgba(0,0,0,0.6)]
                  `}
                >

                  {/* Neon Glow */}
                  <div
                    className={`
                      absolute -inset-40
                      opacity-0 group-hover:opacity-50
                      transition duration-700
                      blur-[120px]
                      bg-gradient-to-br ${suite.color}
                    `}
                  />

                  {/* Border Shine */}
                  <div
                    className="
                      absolute inset-0 rounded-3xl
                      opacity-0 group-hover:opacity-100
                      transition duration-500
                      bg-gradient-to-br from-white/30 via-transparent to-transparent
                      pointer-events-none
                    "
                  />

                  <div className="relative z-10 p-12 flex flex-col h-full">

                    {/* Icon */}
                    <div
                      className={`
                        w-20 h-20 rounded-3xl mb-10 flex items-center justify-center
                        bg-gradient-to-br ${suite.color}
                        text-white
                        shadow-[0_0_40px_rgba(99,102,241,0.6)]
                        animate-[float_6s_ease-in-out_infinite]
                      `}
                    >
                      <Icon name={suite.icon} size={40} />
                    </div>

                    <h3 className="text-3xl font-semibold tracking-wide mb-6">
                      {suite.label}
                    </h3>

                    <p className="text-sm opacity-75 flex-grow">
                      {suite.desc}
                    </p>

                    <div className="mt-10 flex items-center gap-3 font-medium text-indigo-400">
                      Explore <Icon name="arrow-right" size={18} />
                    </div>

                  </div>
                </div>
              </Link>
            ))}

          </div>
        </section>

        {/* Footer */}
        <footer className="py-16 text-center text-sm opacity-50">
          © 2025 Stratify AI • Engineered for Excellence
        </footer>

      </div>
    </div>
  );
};
