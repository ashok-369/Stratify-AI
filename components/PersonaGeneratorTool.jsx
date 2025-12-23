
import React, { useState } from 'react';
import { generatePersonas } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const PersonaGeneratorTool = () => {
    const [formData, setFormData] = useState({
        productDescription: '',
        targetAudience: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.productDescription) {
            setError("Please fill in the Product/Service Description.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const personas = await generatePersonas(formData);
            setResult(personas);
        } catch (err) {
            setError(err.message || "Failed to generate personas.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to render formatted text (remove stars, bold markers)
    const renderFormattedText = (text) => {
        if (!text || typeof text !== 'string') return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return (
            <span>
                {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    const cleanPart = part.replace(/^[\*\-]\s+/, '');
                    return <span key={i}>{cleanPart}</span>;
                })}
            </span>
        );
    };

    // Helper to clean text for PDF
    const cleanText = (text) => {
        if (!text || typeof text !== 'string') return "";
        return text.replace(/\*\*/g, '').replace(/^[\*\-]\s*/gm, '').trim();
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > 280) {
                doc.addPage();
                y = 20;
            }
        };

        const addHeader = (title, subTitle) => {
            checkPageBreak(30);
            doc.setFillColor(0, 31, 63); // Navy
            doc.rect(margin, y - 5, width - (margin * 2), 14, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(255, 255, 255);
            doc.text(title.toUpperCase(), margin + 5, y + 4);
            
            if (subTitle) {
                doc.setFontSize(10);
                doc.setFont("helvetica", "italic");
                doc.setTextColor(200, 200, 200);
                doc.text(subTitle, width - margin - 5, y + 4, { align: 'right' });
            }
            y += 18;
        };

        const addSection = (label, content) => {
            if (!content) return;
            checkPageBreak(25);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(0, 31, 63);
            doc.text(label, margin, y);
            y += 5;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const cleanContent = cleanText(content);
            const lines = doc.splitTextToSize(cleanContent, width - (margin * 2));
            doc.text(lines, margin, y);
            y += (lines.length * 5) + 5;
        };

        // Cover
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 31, 63);
        doc.text("Customer Personas", margin, y);
        y += 10;
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text("Target Audience Analysis", margin, y);
        y += 20;

        result.forEach((persona, index) => {
            if (index > 0) doc.addPage();
            else y = 50;

            addHeader(persona.name, `Persona ${index + 1}`);
            
            addSection("Demographics", persona.demographics);
            addSection("Psychographics", persona.psychographics);
            
            checkPageBreak(40);
            addSection("Goals & Challenges", persona.goalsChallenges);
            
            checkPageBreak(30);
            addSection("Pain Points", persona.painPoints);
            
            checkPageBreak(30);
            addSection("Buying Behavior", persona.buyingBehavior);
            
            addSection("Messaging & Engagement", persona.messaging);
            addSection("Visual Style", persona.visualStyle);
        });

        doc.save(`Customer_Personas.pdf`);
    };

    const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-sm";

    return (
        <div className="max-w-7xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left: Input (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                        <Icon name="users" /> Audience Details
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Product / Service *</label>
                            <textarea 
                                name="productDescription" 
                                value={formData.productDescription} 
                                onChange={handleInputChange} 
                                rows={4} 
                                placeholder="Describe what you are selling..." 
                                className={`${inputClass} resize-none`} 
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target Audience / Context</label>
                            <textarea 
                                name="targetAudience" 
                                value={formData.targetAudience} 
                                onChange={handleInputChange} 
                                rows={4} 
                                placeholder="E.g., Small business owners, busy moms, tech enthusiasts..." 
                                className={`${inputClass} resize-none`} 
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-6 py-4 bg-[#001F3F] hover:bg-blue-900 text-white rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Icon name="loader" className="animate-spin" size={24} /> : <Icon name="sparkles" size={24} />}
                        Generate Personas
                    </button>
                </div>

                {/* Right: Output (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Icon name="user" size={14}/> Generated Profiles
                        </h3>
                        {result && (
                            <button 
                                onClick={downloadPDF}
                                className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm font-bold text-[#001F3F] hover:bg-gray-50 transition-colors flex items-center gap-1"
                            >
                                <Icon name="download" size={14} /> Export PDF
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8">
                        {result ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {result.map((persona, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="bg-[#001F3F] p-4 flex justify-between items-center">
                                            <h3 className="text-white font-bold text-lg">{persona.name}</h3>
                                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded">Persona #{index + 1}</span>
                                        </div>
                                        <div className="p-6 grid md:grid-cols-2 gap-6">
                                            
                                            {/* Demographics & Psychographics */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">Demographics</h4>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{renderFormattedText(persona.demographics)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">Psychographics</h4>
                                                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{renderFormattedText(persona.psychographics)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">Visual / Mood</h4>
                                                    <p className="text-sm text-gray-500 italic">{renderFormattedText(persona.visualStyle)}</p>
                                                </div>
                                            </div>

                                            {/* Strategy */}
                                            <div className="space-y-6">
                                                <div>
                                                    <h4 className="font-bold text-xs text-[#001F3F] uppercase mb-2 flex items-center gap-2"><Icon name="target" size={12} /> Goals & Challenges</h4>
                                                    <p className="text-sm text-gray-700">{renderFormattedText(persona.goalsChallenges)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-red-600 uppercase mb-2 flex items-center gap-2"><Icon name="alert-triangle" size={12} /> Pain Points</h4>
                                                    <p className="text-sm text-gray-700">{renderFormattedText(persona.painPoints)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-green-600 uppercase mb-2 flex items-center gap-2"><Icon name="trending-up" size={12} /> Buying Behavior</h4>
                                                    <p className="text-sm text-gray-700">{renderFormattedText(persona.buyingBehavior)}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-xs text-blue-600 uppercase mb-2 flex items-center gap-2"><Icon name="message-square" size={12} /> Messaging</h4>
                                                    <p className="text-sm text-gray-700">{renderFormattedText(persona.messaging)}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="users" size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">Know Your Customer</p>
                                <p className="text-sm">Enter details to generate comprehensive personas.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PersonaGeneratorTool;
