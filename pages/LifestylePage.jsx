
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Modal } from '../components/Modal.jsx';
import { 
    WeddingInviter, 
    BirthdayMaker, 
    PhotoAlbum, 
    MealPlanner, 
    FitnessPlanner, 
    RelationshipCoach, 
    ParentingTools 
} from '../components/LifestyleTools.jsx';

const TOOLS = [
    { id: 'wedding', title: 'Wedding Invitations', description: 'Design elegant invites instantly.', icon: 'heart', color: 'text-rose-500', bg: 'bg-rose-50' },
    { id: 'birthday', title: 'Birthday Flyers', description: 'Fun templates for any age.', icon: 'gift', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'album', title: 'Digital Album', description: 'Organize memories beautifully.', icon: 'camera-icon', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'meal', title: 'Meal Planner', description: 'Healthy eating made simple.', icon: 'utensils', color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'fitness', title: 'Fitness Routine', description: 'Workouts that fit your life.', icon: 'dumbbell', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'relationship', title: 'Relationship Guide', description: 'Advice for stronger bonds.', icon: 'smile', color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'parenting', title: 'Parenting Helpers', description: 'Charts for happy homes.', icon: 'baby', color: 'text-yellow-500', bg: 'bg-yellow-50' },
];

export const LifestylePage = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'wedding': return <WeddingInviter />;
            case 'birthday': return <BirthdayMaker />;
            case 'album': return <PhotoAlbum />;
            case 'meal': return <MealPlanner />;
            case 'fitness': return <FitnessPlanner />;
            case 'relationship': return <RelationshipCoach />;
            case 'parenting': return <ParentingTools />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-stone-50 font-sans text-stone-800">
            {/* Minimal Back Nav */}
            <div className="absolute top-6 left-6 z-50">
                <Link to="/" className="p-3 bg-white/80 backdrop-blur rounded-full shadow-sm hover:bg-white transition-all text-stone-500 hover:text-stone-800 flex items-center gap-2">
                    <Icon name="arrow-left" size={20} /> <span className="font-bold text-xs uppercase tracking-widest pr-2">Back</span>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden bg-gradient-to-b from-orange-50 via-white to-stone-50">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full shadow-sm text-sm font-serif italic text-stone-600 mb-8 border border-stone-100">
                        <Icon name="sun-medium" size={16} className="text-orange-400" /> Lifestyle & Family Suite
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-serif font-medium text-stone-800 mb-6 leading-tight">
                        Make Everyday Moments <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 italic">Beautiful & Organized</span>
                    </h1>
                    
                    <p className="text-lg text-stone-500 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Create invitations, photo albums, planners, fitness routines, and relationship guides — instantly designed for your life.
                    </p>
                    
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('life-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-stone-800 text-white px-8 py-3.5 rounded-full font-medium hover:bg-stone-900 hover:shadow-lg transition-all flex items-center gap-2">
                            Start Creating <Icon name="arrow-right" size={18} />
                        </button>
                        <button onClick={() => document.getElementById('life-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-stone-600 border border-stone-200 px-8 py-3.5 rounded-full font-medium hover:bg-stone-50 transition-all">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Daily Problem Box */}
            <section className="max-w-3xl mx-auto px-6 -mt-8 relative z-20 mb-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-white border border-stone-100 shadow-xl shadow-orange-500/5 rounded-[2rem] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-200 to-rose-200"></div>
                    <p className="text-lg text-stone-600 font-serif italic">
                        "People want quick, customizable personal solutions — these tools make everyday life easy and beautiful."
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="life-tools" className="relative pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                onClick={() => setActiveTool(tool)}
                                className={`bg-white border border-stone-100 p-8 rounded-[24px] hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer group flex flex-col h-full animate-fade-in-up ${index === TOOLS.length - 1 ? 'lg:col-start-2' : ''}`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className={`w-14 h-14 ${tool.bg} ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <Icon name={tool.icon} size={28} />
                                </div>
                                <h3 className="text-xl font-serif text-stone-800 mb-2">{tool.title}</h3>
                                <p className="text-stone-500 mb-8 flex-grow leading-relaxed font-light text-sm">{tool.description}</p>
                                <div className="mt-auto">
                                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest group-hover:text-stone-800 transition-colors flex items-center gap-2">
                                        Open Tool <Icon name="arrow-right" size={14} />
                                    </span>
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
