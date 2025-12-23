
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { Modal } from './Modal.jsx';
import { 
    CodeSnippetTool, 
    MicroToolGen, 
    ApiConnectorTool, 
    AutomationScriptTool, 
    WireframeTool, 
    MobileTemplateTool, 
    WebTemplateTool 
} from './CodingTools.jsx';

const TOOLS = [
    { id: 'snippet', title: 'Code Snippets', description: 'Instant, reusable code blocks for any language.', icon: 'code' },
    { id: 'micro', title: 'Micro App Gen', description: 'Generate logic for regex, encryption, and more.', icon: 'cpu' },
    { id: 'api', title: 'API Connector', description: 'Production-ready fetch/axios wrapper code.', icon: 'link' },
    { id: 'script', title: 'Auto Scripts', description: 'Python/Bash scripts for file & data tasks.', icon: 'terminal' },
    { id: 'wireframe', title: 'UI Wireframe', description: 'Layout structure code for Web & Mobile.', icon: 'layout' },
    { id: 'mobile', title: 'Mobile Starter', description: 'React Native/Flutter project boilerplate.', icon: 'smartphone' },
    { id: 'web', title: 'Web Template', description: 'Landing page code in React or HTML.', icon: 'globe' },
];

export const CodingSuite = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'snippet': return <CodeSnippetTool />;
            case 'micro': return <MicroToolGen />;
            case 'api': return <ApiConnectorTool />;
            case 'script': return <AutomationScriptTool />;
            case 'wireframe': return <WireframeTool />;
            case 'mobile': return <MobileTemplateTool />;
            case 'web': return <WebTemplateTool />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800 selection:bg-blue-100 selection:text-blue-900">
            {/* Minimal Header */}
            <div className="absolute top-0 left-0 p-6 z-50">
                <Link to="/" className="p-2 text-slate-400 hover:text-blue-600 transition-colors rounded-full hover:bg-slate-100 flex items-center gap-2 group" title="Back">
                    <div className="bg-white p-1 rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                        <Icon name="arrow-left" size={20} /> 
                    </div>
                    <span className="font-mono text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">Back</span>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 bg-white overflow-hidden text-center">
                {/* Tech Background Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-5">
                    <svg className="w-full h-full" width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#001F3F" strokeWidth="1"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-1.5 rounded-full text-xs font-bold text-blue-600 uppercase tracking-widest mb-8 font-mono">
                        <Icon name="terminal" size={12} /> Developer Suite
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-[#001F3F] mb-6 leading-tight tracking-tight">
                        Build Faster With <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Ready-to-Use Tools</span>
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Access code snippets, mini web apps, automation scripts, and templates designed to accelerate your engineering workflow.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('dev-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#001F3F] text-white px-8 py-3.5 rounded-lg font-bold hover:bg-blue-900 transition-all flex items-center gap-2 shadow-xl shadow-blue-900/10 transform hover:-translate-y-0.5">
                            Start Building <Icon name="arrow-right" size={18} />
                        </button>
                         <button onClick={() => document.getElementById('dev-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border border-slate-200 text-slate-700 px-8 py-3.5 rounded-lg font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Daily Problem Section */}
            <section className="max-w-3xl mx-auto px-6 -mt-8 relative z-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-3 text-slate-600 font-medium text-sm">
                        <Icon name="zap" className="text-blue-500" size={18} />
                        "Developers want to save time and avoid repetitive work — these tools automate everything."
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="dev-tools" className="relative py-24 px-6 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                onClick={() => setActiveTool(tool)}
                                className={`bg-white border border-slate-100 p-8 rounded-[16px] shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-fade-in-up hover:border-blue-200 relative overflow-hidden ${index === 0 || index === 3 ? 'lg:col-span-2' : ''}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Icon name="external-link" size={16} className="text-blue-400" />
                                </div>

                                <div className="w-12 h-12 bg-slate-50 text-[#001F3F] rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors relative z-10 font-mono">
                                    <Icon name={tool.icon} size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-[#001F3F] mb-2 relative z-10 font-mono">{tool.title}</h3>
                                <p className="text-sm text-slate-500 mb-8 flex-grow leading-relaxed relative z-10">{tool.description}</p>
                                <div className="mt-auto">
                                    <button className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-800 flex items-center gap-2">
                                        Open Tool <Icon name="arrow-right" size={12} />
                                    </button>
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
