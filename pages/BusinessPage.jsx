
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon.jsx';
import { generatePersonas, generateBusinessContent } from '../services/geminiService.js';
import { Modal } from '../components/Modal.jsx';
import BusinessPlanTool from '../components/BusinessPlanTool.jsx';
import PitchDeckTool from '../components/PitchDeckTool.jsx';
import FinancialModelTool from '../components/FinancialModelTool.jsx';
import LegalAgreementTool from '../components/LegalAgreementTool.jsx';
import BrandingKitTool from '../components/BrandingKitTool.jsx';
import MarketingPlanTool from '../components/MarketingPlanTool.jsx';
import SOPBuilderTool from '../components/SOPBuilderTool.jsx';
import PersonaGeneratorTool from '../components/PersonaGeneratorTool.jsx';
import { DashboardAnimation } from '../components/DashboardAnimation.jsx';
import { SubToolsAnimation } from '../components/SubToolsAnimation.jsx';

const TOOLS = [
    { id: 'biz_plan', title: 'Business Plan', description: 'Investor-ready structured PDF generator.', icon: 'file-text' },
    { id: 'pitch_deck', title: 'Pitch Deck', description: 'Slide content outline & structure.', icon: 'presentation' },
    { id: 'financials', title: 'Financial Model', description: '3-Year projections & Excel export.', icon: 'file-spreadsheet' },
    { id: 'legal', title: 'Legal Agreem.', description: 'NDAs, Founders Agreements & MOUs.', icon: 'gavel' },
    { id: 'branding', title: 'Branding Kit', description: 'Logo ideas, palettes & typography.', icon: 'palette' },
    { id: 'marketing', title: 'Marketing Plan', description: 'Campaign strategy & ad copy.', icon: 'megaphone' },
    { id: 'sop', title: 'SOP Builder', description: 'Standard Operating Procedures.', icon: 'list' },
    { id: 'persona', title: 'Personas', description: 'Detailed customer avatars.', icon: 'users' },
];

export const BusinessPage = () => {
    const [activeTool, setActiveTool] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [formData, setFormData] = useState({});
    const [error, setError] = useState(null);

    const handleOpen = (tool) => {
        setActiveTool(tool);
        setResult(null);
        setFormData({});
        setError(null);
    };

    const handleInput = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Generic text tools (legacy fallback)
            const res = await generateBusinessContent(activeTool.title, formData);
            setResult(res);
        } catch (e) {
            console.error(e);
            setError("Generation failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExport = () => {
        const element = document.createElement("a");
        const file = new Blob([typeof result === 'string' ? result : JSON.stringify(result, null, 2)], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${activeTool.title.replace(/\s/g, '_')}_Export.txt`;
        document.body.appendChild(element);
        element.click();
    };

    const renderForm = () => {
        const inputClass = "w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#001F3F] outline-none text-charcoal";
        return <>
                <input name="topic" placeholder={`Topic for ${activeTool?.title}`} className={inputClass} onChange={handleInput} />
                <textarea name="details" placeholder="Additional Details..." rows={4} className={inputClass} onChange={handleInput} />
        </>;
    };

    const renderResult = () => {
        if (!result) return null;
        
        // Default text result
        return (
            <div className="whitespace-pre-line text-sm text-gray-700 leading-relaxed font-mono bg-gray-50 p-6 rounded-lg border">
                {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
            </div>
        );
    };

    return (
        <div className="bg-white min-h-screen text-[#36454F] font-sans flex flex-col">
            <header className="sticky top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-gray-100">
                <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-[#001F3F] transition-colors rounded-full hover:bg-gray-100" title="Back to Home">
                            <Icon name="arrow-left" size={24} />
                        </Link>
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-[#001F3F] p-2 rounded-lg text-white group-hover:bg-[#003366] transition-colors">
                                <Icon name="trending-up" size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-[#001F3F]">Stratify <span className="font-normal text-gray-500">Business</span></h1>
                        </Link>
                    </div>
                    <div className="flex bg-gray-100 p-1 rounded-lg">
                        <Link to="/career" className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 rounded-md transition-colors">Career</Link>
                        <button className="px-4 py-2 text-sm font-bold bg-white shadow-sm text-[#001F3F] rounded-md cursor-default">Startup</button>
                    </div>
                </nav>
            </header>

            <div className="flex-grow w-full relative">
                {/* Hero Section */}
                <div className="relative bg-[#001F3F] overflow-hidden z-10">
                    <DashboardAnimation />
                    
                    <div className="relative z-10 max-w-7xl mx-auto px-8 pt-24 pb-16 text-center animate-fade-in-up">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-blue-200 text-sm font-semibold mb-6">
                            Enterprise Suite
                        </div>
                        <h1 className="text-5xl font-bold text-white mb-6 leading-tight drop-shadow-sm">
                            Build & Scale Your <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">Business Faster</span>
                        </h1>
                        <p className="text-xl text-blue-100/80 max-w-2xl mx-auto mb-10">
                            Instant access to investor-ready templates, legal documents, financial models, and branding tools tailored for startups.
                        </p>
                        <div className="flex justify-center gap-4">
                             <button onClick={() => document.getElementById('biz-tools')?.scrollIntoView({ behavior: 'smooth'})} className="bg-white text-[#001F3F] px-8 py-3.5 rounded-lg font-bold hover:bg-gray-100 transition shadow-lg flex items-center gap-2">
                                Explore Tools <Icon name="arrow-right" size={18} />
                             </button>
                        </div>
                    </div>
                </div>

                {/* Problem Statement */}
                <div className="relative z-10 max-w-4xl mx-auto px-6 my-16 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                     <div className="bg-white border border-gray-100 p-8 rounded-2xl text-center shadow-lg shadow-blue-900/5">
                        <Icon name="zap" className="mx-auto mb-4 text-yellow-500" size={32} />
                        <p className="text-gray-600 font-medium text-lg italic">
                            "Entrepreneurs need ready-to-use business documents fast — this dashboard gives them everything instantly."
                        </p>
                     </div>
                </div>

                {/* Tools Grid Section */}
                <div id="biz-tools" className="relative pb-24 px-8">
                    {/* Background Animation */}
                    <SubToolsAnimation />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {TOOLS.map((tool, index) => (
                                <div 
                                    key={tool.id}
                                    onClick={() => handleOpen(tool)}
                                    className="h-full opacity-0 animate-fade-in-up"
                                    style={{ animationDelay: `${(index * 100) + 300}ms` }}
                                >
                                    <div className="bg-white border border-gray-100 p-8 rounded-xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col items-start h-full relative overflow-hidden">
                                        
                                        {/* Card Hover BG */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        
                                        {/* Metallic Shimmer */}
                                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none bg-gradient-to-tr from-transparent via-white/40 to-transparent transition-opacity duration-500" style={{ mixBlendMode: 'overlay' }}></div>

                                        <div className="relative z-10 bg-[#001F3F]/5 p-4 rounded-xl text-[#001F3F] mb-5 group-hover:bg-[#001F3F] group-hover:text-white transition-colors shadow-sm">
                                            <Icon name={tool.icon} size={28} />
                                        </div>
                                        <h3 className="relative z-10 text-lg font-bold text-[#001F3F] mb-2">{tool.title}</h3>
                                        <p className="relative z-10 text-sm text-gray-500 mb-6 flex-grow leading-relaxed">{tool.description}</p>
                                        <button className="relative z-10 text-sm font-bold text-[#001F3F] flex items-center gap-2 group-hover:gap-3 transition-all">
                                            Open Tool <Icon name="arrow-right" size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Tool Modal */}
            <Modal isOpen={!!activeTool} onClose={() => setActiveTool(null)} title={activeTool?.title}>
                {activeTool?.id === 'biz_plan' ? (
                    <BusinessPlanTool />
                ) : activeTool?.id === 'pitch_deck' ? (
                    <PitchDeckTool />
                ) : activeTool?.id === 'financials' ? (
                    <FinancialModelTool />
                ) : activeTool?.id === 'legal' ? (
                    <LegalAgreementTool />
                ) : activeTool?.id === 'branding' ? (
                    <BrandingKitTool />
                ) : activeTool?.id === 'marketing' ? (
                    <MarketingPlanTool />
                ) : activeTool?.id === 'sop' ? (
                    <SOPBuilderTool />
                ) : activeTool?.id === 'persona' ? (
                    <PersonaGeneratorTool />
                ) : (
                    <div className="grid lg:grid-cols-2 gap-8 h-full">
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-[#001F3F] mb-4">Input Details</h3>
                                <div className="space-y-4">
                                    {renderForm()}
                                </div>
                            </div>
                            {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded">{error}</div>}
                            <button 
                                onClick={handleGenerate} 
                                disabled={isLoading}
                                className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-[#003366] transition flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="wand" />}
                                Generate Content
                            </button>
                        </div>
                        <div className="bg-gray-100 rounded-xl p-6 overflow-y-auto max-h-[600px] border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-gray-500 uppercase text-xs">Generated Output</h3>
                                {result && (
                                    <button onClick={handleExport} className="text-xs bg-white px-3 py-1.5 rounded shadow-sm font-bold text-[#001F3F]">
                                        Download
                                    </button>
                                )}
                            </div>
                            {result ? renderResult() : <div className="text-gray-400 text-center mt-20 italic">Output will appear here...</div>}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
