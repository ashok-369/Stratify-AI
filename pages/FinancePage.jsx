
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { Modal } from '../components/Modal.jsx';
import { SubToolsAnimation } from '../components/SubToolsAnimation.jsx';
import { 
    TaxComputationTool, 
    InvestmentTracker, 
    BudgetBuilder, 
    ComplianceChecklist, 
    AuditChecklist, 
    InvoiceTool 
} from '../components/FinanceTools.jsx';

const TOOLS = [
    { id: 'tax', title: 'Tax Calculator', description: 'Estimate liability with jurisdiction-aware templates.', icon: 'calculator' },
    { id: 'invest', title: 'Investment Tracker', description: 'Portfolio health checks & growth projections.', icon: 'trending-up' },
    { id: 'budget', title: 'Budget Worksheet', description: 'Smart allocation tables & savings analysis.', icon: 'pie-chart' },
    { id: 'compliance', title: 'Annual Compliance', description: 'Dates & filings for Pvt Ltd, LLP & Startups.', icon: 'shield-check' },
    { id: 'audit', title: 'Audit Checklist', description: 'Internal & financial audit stepwise guides.', icon: 'clipboard-list' },
    { id: 'invoice', title: 'Invoice Generator', description: 'Professional, tax-compliant invoice templates.', icon: 'receipt' },
];

export const FinancePage = () => {
    const [activeTool, setActiveTool] = useState(null);

    const renderToolContent = (id) => {
        switch(id) {
            case 'tax': return <TaxComputationTool onClose={() => setActiveTool(null)} />;
            case 'invest': return <InvestmentTracker onClose={() => setActiveTool(null)} />;
            case 'budget': return <BudgetBuilder onClose={() => setActiveTool(null)} />;
            case 'compliance': return <ComplianceChecklist onClose={() => setActiveTool(null)} />;
            case 'audit': return <AuditChecklist onClose={() => setActiveTool(null)} />;
            case 'invoice': return <InvoiceTool onClose={() => setActiveTool(null)} />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-800">
            {/* Minimal Header with Back Button */}
            <div className="absolute top-0 left-0 p-6 z-50">
                <Link to="/" className="p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center gap-2" title="Back">
                    <Icon name="arrow-left" size={24} /> <span className="font-bold text-sm uppercase tracking-widest">Back</span>
                </Link>
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-24 px-6 bg-[#001F3F] overflow-hidden text-center">
                <div className="absolute inset-0 opacity-10">
                    <SubToolsAnimation />
                </div>
                
                <div className="relative z-10 max-w-4xl mx-auto animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 rounded-full text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6">
                        <Icon name="landmark" size={14} /> Corporate Finance Suite
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                        Organize Your Finances <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">With Smart Tools</span>
                    </h1>
                    <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
                        Instant access to tax templates, budget sheets, audit checklists, and business invoicing systems.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => document.getElementById('fin-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-emerald-600 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/50">
                            Start Managing <Icon name="arrow-right" size={18} />
                        </button>
                         <button onClick={() => document.getElementById('fin-tools')?.scrollIntoView({ behavior: 'smooth' })} className="bg-transparent border border-white/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-white/10 transition-all flex items-center gap-2">
                            Explore Tools
                        </button>
                    </div>
                </div>
            </section>

            {/* Daily Problem Section */}
            <section className="max-w-3xl mx-auto px-6 -mt-8 relative z-20 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="bg-white border border-gray-100 shadow-xl rounded-xl p-8 text-center">
                    <p className="text-lg text-slate-600 font-medium italic">
                        "People struggle with financial organization — these tools simplify finances instantly."
                    </p>
                </div>
            </section>

            {/* Tools Grid */}
            <section id="fin-tools" className="relative py-20 px-6 bg-gray-50/50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {TOOLS.map((tool, index) => (
                             <div 
                                key={tool.id}
                                onClick={() => setActiveTool(tool)}
                                className="bg-white border border-gray-200 p-8 rounded-[16px] hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-2 transition-all duration-300 cursor-pointer group flex flex-col h-full animate-fade-in-up relative overflow-hidden"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-14 h-14 bg-[#001F3F]/5 text-[#001F3F] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#001F3F] group-hover:text-emerald-400 transition-colors relative z-10">
                                    <Icon name={tool.icon} size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-[#001F3F] mb-2 relative z-10">{tool.title}</h3>
                                <p className="text-sm text-gray-500 mb-8 flex-grow leading-relaxed relative z-10">{tool.description}</p>
                                <div className="mt-auto">
                                    <button className="text-sm font-bold text-white bg-[#001F3F] px-4 py-2 rounded-lg group-hover:bg-emerald-600 transition-colors w-full flex justify-center items-center gap-2">
                                        Open Tool <Icon name="arrow-right" size={14} />
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
