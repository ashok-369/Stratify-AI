
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { Modal } from './Modal.jsx';
import { 
    CanvaTemplateTool, 
    InstagramPackTool, 
    ReelsScriptTool, 
    ThumbnailTool, 
    ContentCalendarTool, 
    MediaKitTool 
} from './CreativityTools.jsx';

const TOOLS = [
    { id: 'canva', title: 'Canva Templates', description: 'Auto-generate design layouts for posters & social.', icon: 'layout-template' },
    { id: 'insta', title: 'IG Post Pack', description: 'Create 9-grid themed post packs instantly.', icon: 'instagram' },
    { id: 'reels', title: 'Reels Scripter', description: 'Viral hooks, body scripts, and call-to-actions.', icon: 'film' },
    { id: 'thumb', title: 'Thumbnail Gen', description: 'High-CTR YouTube thumbnail concepts.', icon: 'youtube' },
    { id: 'calendar', title: 'Content Calendar', description: '30-day scheduled content plan for any niche.', icon: 'calendar' },
    { id: 'mediakit', title: 'Media Kit Creator', description: 'Professional influencer portfolio & stats.', icon: 'file-text' },
];

export const CreativitySuite = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'canva': return <CanvaTemplateTool onClose={() => setActiveTool(null)} />;
            case 'insta': return <InstagramPackTool onClose={() => setActiveTool(null)} />;
            case 'reels': return <ReelsScriptTool onClose={() => setActiveTool(null)} />;
            case 'thumb': return <ThumbnailTool onClose={() => setActiveTool(null)} />;
            case 'calendar': return <ContentCalendarTool onClose={() => setActiveTool(null)} />;
            case 'mediakit': return <MediaKitTool onClose={() => setActiveTool(null)} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-[#333]">
            {/* Minimal Header with Back Button */}
            <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-[#001F3F] transition-colors rounded-full hover:bg-gray-100" title="Back to Home">
                        <Icon name="arrow-left" size={24} />
                    </Link>
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-gradient-to-tr from-[#001F3F] to-indigo-600 p-2 rounded-lg text-white">
                             <Icon name="palette" size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-[#001F3F]">Stratify <span className="font-normal text-gray-500">Creative</span></h1>
                    </Link>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 text-center px-6 bg-gradient-to-b from-white to-blue-50/30 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-pink-100/40 rounded-full blur-[100px] pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-indigo-100/40 rounded-full blur-[80px] pointer-events-none"></div>

                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-white border border-gray-200 px-4 py-1.5 rounded-full text-xs font-bold text-gray-500 uppercase tracking-widest mb-6 shadow-sm">
                        <Icon name="sparkles" size={12} className="text-pink-500"/> Creator Studio
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#001F3F] mb-6 leading-tight">
                        Create Stunning Content <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">In Minutes</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Instant access to templates, scripts, calendars, and creative tools — no designer needed.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('creative-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#001F3F] text-white px-8 py-3.5 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2 shadow-blue-900/20 shadow-lg">
                            Start Creating <Icon name="arrow-right" size={18} />
                        </button>
                         <button onClick={() => document.getElementById('creative-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border border-gray-200 text-[#001F3F] px-8 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Daily Problem Section */}
            <section className="max-w-3xl mx-auto px-6 mb-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-white border border-gray-100 shadow-xl shadow-indigo-100/50 rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-pink-500"></div>
                    <p className="text-lg text-gray-600 font-medium italic">
                        "Creators need quick content without designers — this dashboard generates it instantly."
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="creative-tools" className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                onClick={() => setActiveTool(tool)}
                                className="bg-white border border-gray-100 p-8 rounded-[24px] hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-fade-in-up relative overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                
                                <div className="w-14 h-14 bg-gray-50 text-[#001F3F] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[#001F3F] group-hover:text-white transition-colors relative z-10">
                                    <Icon name={tool.icon} size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#001F3F] mb-2 relative z-10">{tool.title}</h3>
                                <p className="text-sm text-gray-500 mb-8 flex-grow leading-relaxed font-light relative z-10">{tool.description}</p>
                                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-[#001F3F] group-hover:gap-3 transition-all relative z-10">
                                    Open Tool <Icon name="arrow-right" size={16} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Modal isOpen={!!activeTool} onClose={() => setActiveTool(null)} title={activeTool?.title}>
                <div className="py-2">
                    {activeTool && renderToolContent(activeTool.id)}
                </div>
            </Modal>
        </div>
    );
};
