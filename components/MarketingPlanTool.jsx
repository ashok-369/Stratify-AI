
import React, { useState } from 'react';
import { generateMarketingPlan } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const MarketingPlanTool = () => {
    const [formData, setFormData] = useState({
        productName: '',
        targetAudience: '',
        goals: '',
        budget: '',
        channels: '',
        rawContext: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.productName || !formData.goals) {
            setError("Please fill in Product Name and Goals.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const plan = await generateMarketingPlan(formData);
            setResult(plan);
        } catch (err) {
            setError(err.message || "Failed to generate marketing plan.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to clean text for PDF
    const cleanText = (text) => {
        if (!text || typeof text !== 'string') return "";
        return text.replace(/\*\*/g, '').replace(/^[\*\-]\s*/gm, '').trim();
    };

    // Helper to render markdown bold in UI
    const renderFormattedText = (text) => {
        if (!text || typeof text !== 'string') return null;
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return (
            <span>
                {parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
                    }
                    // Clean leading list markers
                    const cleanPart = part.replace(/^[\*\-]\s+/, '');
                    return <span key={i}>{cleanPart}</span>;
                })}
            </span>
        );
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

        const addHeader = (title) => {
            checkPageBreak(15);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(0, 31, 63); // Navy
            doc.text(title.toUpperCase(), margin, y);
            y += 8;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, y - 2, width - margin, y - 2);
            y += 5;
        };

        const addSection = (title, content) => {
            addHeader(title);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);

            if (Array.isArray(content)) {
                content.forEach(item => {
                    const cleanItem = cleanText(item);
                    const lines = doc.splitTextToSize(`• ${cleanItem}`, width - (margin * 2));
                    checkPageBreak(lines.length * 5);
                    doc.text(lines, margin, y);
                    y += (lines.length * 5) + 2;
                });
            } else {
                const cleanContent = cleanText(content);
                const lines = doc.splitTextToSize(cleanContent, width - (margin * 2));
                checkPageBreak(lines.length * 5);
                doc.text(lines, margin, y);
                y += (lines.length * 5) + 4;
            }
            y += 5;
        };

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 31, 63);
        doc.text("Strategic Marketing Plan", margin, y);
        y += 10;
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(formData.productName, margin, y);
        y += 20;

        addSection("Executive Summary", result.executiveSummary);
        addSection("Market Research", result.marketResearch);
        addSection("Goals & KPIs", result.goalsKPIs);
        addSection("Brand Positioning", result.brandPositioning);
        addSection("Marketing Strategy", result.marketingStrategy);
        
        checkPageBreak(30);
        addSection("Budget Allocation", result.budgetAllocation);
        addSection("Timeline & Roadmap", result.timelineRoadmap);
        addSection("Metrics & Reporting", result.metricsReporting);
        addSection("Risks & Mitigation", result.risksMitigation);

        doc.save(`${formData.productName.replace(/\s+/g, '_')}_MarketingPlan.pdf`);
    };

    const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-sm";

    return (
        <div className="max-w-7xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left: Input (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                        <Icon name="megaphone" /> Strategy Details
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Product / Service *</label>
                            <input name="productName" value={formData.productName} onChange={handleInputChange} placeholder="e.g. Eco-Friendly Water Bottle" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target Audience</label>
                            <input name="targetAudience" value={formData.targetAudience} onChange={handleInputChange} placeholder="e.g. Gen Z, Outdoor Enthusiasts" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Primary Goals *</label>
                            <input name="goals" value={formData.goals} onChange={handleInputChange} placeholder="e.g. 10k Sales in Q1" className={inputClass} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Budget</label>
                                <input name="budget" value={formData.budget} onChange={handleInputChange} placeholder="$5,000 / mo" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Channels</label>
                                <input name="channels" value={formData.channels} onChange={handleInputChange} placeholder="IG, TikTok, Email" className={inputClass} />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Context / Notes</label>
                            <textarea name="rawContext" value={formData.rawContext} onChange={handleInputChange} rows={4} placeholder="Any specific campaign ideas, competitors, or constraints?" className={`${inputClass} resize-none`} />
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
                        {loading ? <Icon name="loader" className="animate-spin" size={24} /> : <Icon name="target" size={24} />}
                        Build Plan
                    </button>
                </div>

                {/* Right: Output (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Icon name="line-chart" size={14}/> Marketing Plan
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
                            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Executive Summary */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-[#001F3F] mb-3 uppercase text-sm tracking-wide">Executive Summary</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.executiveSummary)}</p>
                                </div>

                                {/* Goals & Analysis Grid */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-[#001F3F] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
                                            <Icon name="target" size={16}/> Goals & KPIs
                                        </h4>
                                        <ul className="space-y-2">
                                            {result.goalsKPIs.map((kpi, i) => (
                                                <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                                                    <span className="text-green-500 font-bold">•</span>
                                                    {renderFormattedText(kpi)}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-[#001F3F] mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
                                            <Icon name="users" size={16}/> Market Research
                                        </h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.marketResearch)}</p>
                                    </div>
                                </div>

                                {/* Strategy */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-[#001F3F] mb-4 uppercase text-sm tracking-wide flex items-center gap-2">
                                        <Icon name="zap" size={16}/> Strategic Approach
                                    </h4>
                                    <div className="space-y-3">
                                        {result.marketingStrategy.map((strat, i) => (
                                            <div key={i} className="p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                                                <p className="text-sm text-gray-800">{renderFormattedText(strat)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget & Timeline */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-[#001F3F] mb-3 uppercase text-sm tracking-wide">Budget Allocation</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">{renderFormattedText(result.budgetAllocation)}</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h4 className="font-bold text-[#001F3F] mb-3 uppercase text-sm tracking-wide">Timeline</h4>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">{renderFormattedText(result.timelineRoadmap)}</p>
                                    </div>
                                </div>

                                {/* Risks */}
                                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                                    <h4 className="font-bold text-red-800 mb-3 uppercase text-sm tracking-wide flex items-center gap-2">
                                        <Icon name="alert-triangle" size={16}/> Risks & Mitigation
                                    </h4>
                                    <p className="text-sm text-red-900 leading-relaxed">{renderFormattedText(result.risksMitigation)}</p>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="megaphone" size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">Design your Marketing Strategy</p>
                                <p className="text-sm">Fill in the details to generate a comprehensive plan.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketingPlanTool;
