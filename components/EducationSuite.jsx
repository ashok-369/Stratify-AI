
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Icon.jsx';
import { Modal } from './Modal.jsx';
import { 
    CheatSheetTool, 
    StudyNotesTool, 
    ExamGuideTool, 
    QuestionBankTool, 
    AssignmentTemplateTool, 
    FlashcardTool 
} from './EducationTools.jsx';

const TOOLS = [
    { id: 'cheat_sheet', title: 'Cheat Sheet Gen.', description: 'Instant 1-page summaries for Math, Coding, Science.', icon: 'table' },
    { id: 'study_notes', title: 'Study Notes', description: 'Detailed bullet-point notes from any topic.', icon: 'book' },
    { id: 'exam_guide', title: 'Exam Guide', description: 'Step-by-step preparation timelines & strategy.', icon: 'target' },
    { id: 'question_bank', title: 'Question Bank', description: 'Generate practice questions with answers.', icon: 'help-circle' },
    { id: 'assignment', title: 'Assignment Outline', description: 'Structures for essays, reports & case studies.', icon: 'file-check' },
    { id: 'flashcards', title: 'Flashcards', description: 'Interactive cards for definition & recall.', icon: 'layers' },
];

export const EducationSuite = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'cheat_sheet': return <CheatSheetTool onClose={() => setActiveTool(null)} />;
            case 'study_notes': return <StudyNotesTool onClose={() => setActiveTool(null)} />;
            case 'exam_guide': return <ExamGuideTool onClose={() => setActiveTool(null)} />;
            case 'question_bank': return <QuestionBankTool onClose={() => setActiveTool(null)} />;
            case 'assignment': return <AssignmentTemplateTool onClose={() => setActiveTool(null)} />;
            case 'flashcards': return <FlashcardTool onClose={() => setActiveTool(null)} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            
            {/* Header (Minimal Nav) */}
            <header className="border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-blue-900 transition-colors rounded-full hover:bg-gray-100" title="Back to Home">
                            <Icon name="arrow-left" size={24} />
                        </Link>
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-blue-900 p-2 rounded-lg text-white group-hover:bg-blue-800 transition-colors">
                                <Icon name="graduation-cap" size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-blue-900">Stratify <span className="font-normal text-gray-500">Education</span></h1>
                        </Link>
                    </div>
                    <div className="flex gap-4 text-sm font-medium text-gray-500">
                        <Link to="/career" className="hover:text-blue-900 transition-colors">Career</Link>
                        <Link to="/business" className="hover:text-blue-900 transition-colors">Business</Link>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-20 pb-20 text-center px-6 bg-white overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 0 L100 0 L100 80 Q50 100 0 80 Z" fill="url(#gradBlue)" opacity="0.1" />
                        <defs>
                            <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#E0F2FE" /> 
                                <stop offset="100%" stopColor="#FFFFFF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-900 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
                        <Icon name="book-open" size={14}/> Academic Intelligence
                    </div>
                    <h1 className="text-5xl md:text-6xl font-serif font-bold text-blue-900 mb-6 leading-tight">
                        Learn Faster With <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Smart Educational Tools</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Instant access to cheat sheets, study notes, exam guides, and flashcards designed to optimize your learning journey.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('edu-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-blue-900 text-white px-8 py-3.5 rounded-full font-bold hover:shadow-lg hover:-translate-y-1 transition-all flex items-center gap-2">
                            Start Learning <Icon name="arrow-right" size={18} />
                        </button>
                         <button onClick={() => document.getElementById('edu-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white border border-gray-200 text-blue-900 px-8 py-3.5 rounded-full font-bold hover:bg-gray-50 transition-all flex items-center gap-2">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Daily Problem Section */}
            <section className="max-w-3xl mx-auto px-6 mb-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 text-center shadow-sm">
                    <div className="flex items-center justify-center gap-3 text-blue-800 font-medium italic">
                        <Icon name="lightbulb" className="text-yellow-500" size={20} />
                        "Students need instant help for exams and homework — this dashboard gives fast, structured learning tools."
                    </div>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="edu-tools" className="relative pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                className="bg-white border border-gray-100 p-8 rounded-[20px] shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] hover:shadow-[0_10px_30px_-10px_rgba(0,31,63,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                                onClick={() => setActiveTool(tool)}
                            >
                                <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                                    <Icon name={tool.icon} size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-blue-900 mb-2">{tool.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 flex-grow leading-relaxed">{tool.description}</p>
                                <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <span className="text-xs font-bold text-blue-900 uppercase tracking-wider group-hover:text-blue-700">Open Tool</span>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-900 transition-colors">
                                        <Icon name="arrow-right" size={14} />
                                    </div>
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
