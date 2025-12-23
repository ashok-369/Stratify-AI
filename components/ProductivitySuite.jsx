
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { Modal } from './Modal.jsx';
import { 
    NotionGenerator, 
    PlannerBuilder, 
    HabitTracker, 
    FinanceTracker, 
    StudyPlanner, 
    TimeBlocker, 
    MeetingNotesGenerator 
} from './ProductivityTools.jsx';
import { SubToolsAnimation } from './SubToolsAnimation.jsx';

const TOOLS = [
    { id: 'notion', title: 'Notion Template', description: 'Auto-generate Notion page structures.', icon: 'layout' },
    { id: 'planner', title: 'Digital Planner', description: 'Weekly/Monthly PDF layouts.', icon: 'calendar' },
    { id: 'habit', title: 'Habit Tracker', description: 'Track progress & build routines.', icon: 'check-circle' },
    { id: 'finance', title: 'Finance Tracker', description: 'Budgeting & expense summary.', icon: 'dollar-sign' },
    { id: 'study', title: 'Study Planner', description: 'Smart study schedule generator.', icon: 'book-open' },
    { id: 'time', title: 'Time Blocking', description: 'Drag-and-drop block creator.', icon: 'clock' },
    { id: 'meeting', title: 'Meeting Notes', description: 'Structured meeting templates.', icon: 'users' },
];

export const ProductivitySuite = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'notion': return <NotionGenerator />;
            case 'planner': return <PlannerBuilder />;
            case 'habit': return <HabitTracker />;
            case 'finance': return <FinanceTracker />;
            case 'study': return <StudyPlanner />;
            case 'time': return <TimeBlocker />;
            case 'meeting': return <MeetingNotesGenerator />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-charcoal">
             {/* Header */}
             <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
                    <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-[#001F3F] transition-colors rounded-full hover:bg-gray-100" title="Back to Home">
                        <Icon name="arrow-left" size={24} />
                    </Link>
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="bg-[#001F3F] p-2 rounded-lg text-white group-hover:bg-blue-900 transition-colors">
                             <Icon name="zap" size={20} />
                        </div>
                        <h1 className="text-xl font-bold text-[#001F3F]">Stratify <span className="font-normal text-gray-500">Productivity</span></h1>
                    </Link>
                </nav>
            </header>
             
            {/* Hero Section */}
            <section className="relative pt-24 pb-24 text-center px-6 overflow-hidden">
                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100">
                        <Icon name="zap" size={14} className="text-yellow-500"/> Personal Organization Suite
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-[#001F3F] mb-6 leading-tight">
                        Organize Your Life With <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">Smart Productivity Tools</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Instant access to digital planners, habit systems, study trackers, and structure templates designed for peak performance.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('prod-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-[#001F3F] text-white px-8 py-3.5 rounded-full font-bold hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2">
                            Start Organizing <Icon name="arrow-right" size={18} />
                        </button>
                         <button onClick={() => document.getElementById('prod-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border border-gray-200 text-[#001F3F] px-8 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

             {/* Daily Problem / Statement Box */}
             <section className="max-w-4xl mx-auto px-6 mb-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-white border border-gray-100 shadow-xl shadow-blue-900/5 rounded-2xl p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#001F3F]"></div>
                    <p className="text-lg text-gray-600 font-medium italic">
                        "People are overwhelmed and need structure — this dashboard helps them stay organized instantly."
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="prod-tools" className="relative bg-gray-50 py-24 px-6 border-t border-gray-100">
                <SubToolsAnimation />
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                onClick={() => setActiveTool(tool)}
                                className="bg-white border border-gray-100 p-8 rounded-[20px] hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col items-start h-full animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="bg-blue-50 text-[#001F3F] p-4 rounded-2xl mb-5 group-hover:bg-[#001F3F] group-hover:text-white transition-colors">
                                    <Icon name={tool.icon} size={28} />
                                </div>
                                <h3 className="text-lg font-bold text-[#001F3F] mb-2">{tool.title}</h3>
                                <p className="text-sm text-gray-500 mb-6 flex-grow leading-relaxed font-light">{tool.description}</p>
                                <div className="mt-auto flex items-center gap-2 text-sm font-bold text-[#001F3F] group-hover:gap-3 transition-all">
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
