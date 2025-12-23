
import React, { useState } from 'react';
import { generateSOP } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const SOPBuilderTool = () => {
    const [formData, setFormData] = useState({
        procedureName: '',
        department: '',
        rawProcess: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.procedureName || !formData.rawProcess) {
            setError("Please fill in Procedure Name and Raw Process.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const sop = await generateSOP(formData);
            setResult(sop);
        } catch (err) {
            setError(err.message || "Failed to generate SOP.");
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

        const addHeader = (title) => {
            checkPageBreak(15);
            doc.setFillColor(240, 240, 240); // Light Gray Background
            doc.rect(margin, y - 5, width - (margin * 2), 10, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            doc.setTextColor(0, 31, 63); // Navy
            doc.text(title.toUpperCase(), margin + 2, y + 2);
            y += 12;
        };

        const addContent = (content) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);

            if (Array.isArray(content)) {
                content.forEach((step, i) => {
                    const cleanStep = cleanText(step);
                    const prefix = `${i + 1}.`;
                    const lines = doc.splitTextToSize(cleanStep, width - (margin * 2) - 10);
                    checkPageBreak(lines.length * 5);
                    doc.text(prefix, margin, y);
                    doc.text(lines, margin + 8, y);
                    y += (lines.length * 5) + 2;
                });
            } else {
                const cleanContent = cleanText(content);
                const lines = doc.splitTextToSize(cleanContent, width - (margin * 2));
                checkPageBreak(lines.length * 5);
                doc.text(lines, margin, y);
                y += (lines.length * 5) + 4;
            }
            y += 2;
        };

        // Header Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(0, 31, 63);
        doc.text("Standard Operating Procedure", margin, y);
        y += 10;
        
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text(result.title, margin, y);
        y += 15;

        // Meta Info Table
        doc.setLineWidth(0.1);
        doc.setDrawColor(200, 200, 200);
        doc.rect(margin, y, width - (margin * 2), 20);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Department:", margin + 2, y + 8);
        doc.text("Date:", margin + 100, y + 8);
        doc.setFont("helvetica", "normal");
        doc.text(formData.department || "General", margin + 30, y + 8);
        doc.text(new Date().toLocaleDateString(), margin + 115, y + 8);
        y += 25;

        addHeader("1. Purpose");
        addContent(result.purpose);

        addHeader("2. Scope");
        addContent(result.scope);

        addHeader("3. Definitions");
        addContent(result.definitions);

        addHeader("4. Responsibilities");
        addContent(result.responsibilities);

        checkPageBreak(40);
        addHeader("5. Procedure Steps");
        addContent(result.procedureSteps);

        checkPageBreak(30);
        addHeader("6. Tools & Resources");
        addContent(result.toolsResources);

        addHeader("7. Compliance & Safety");
        addContent(result.complianceSafety);

        addHeader("8. References");
        addContent(result.references);

        addHeader("9. Revision History");
        addContent(result.revisionHistory);

        doc.save(`${formData.procedureName.replace(/\s+/g, '_')}_SOP.pdf`);
    };

    const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-sm";

    return (
        <div className="max-w-7xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left: Input (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                        <Icon name="list" /> Process Details
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Procedure Name *</label>
                            <input name="procedureName" value={formData.procedureName} onChange={handleInputChange} placeholder="e.g. Employee Onboarding" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Department</label>
                            <input name="department" value={formData.department} onChange={handleInputChange} placeholder="e.g. HR / Operations" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Raw Process Steps / Notes *</label>
                            <textarea 
                                name="rawProcess" 
                                value={formData.rawProcess} 
                                onChange={handleInputChange} 
                                rows={8} 
                                placeholder="Paste your rough notes, bullet points, or voice-to-text transcript here. The AI will structure it." 
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
                        Build SOP
                    </button>
                </div>

                {/* Right: Output (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Icon name="file-text" size={14}/> SOP Document
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
                            <div className="bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="text-center border-b border-gray-200 pb-6">
                                    <h2 className="text-3xl font-bold text-[#001F3F] mb-2">{result.title}</h2>
                                    <p className="text-gray-500 uppercase text-xs tracking-widest">Standard Operating Procedure</p>
                                </div>

                                <div className="space-y-6">
                                    <section>
                                        <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">1. Purpose</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.purpose)}</p>
                                    </section>

                                    <section>
                                        <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">2. Scope</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.scope)}</p>
                                    </section>

                                    <section>
                                        <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">3. Definitions</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.definitions)}</p>
                                    </section>

                                    <section>
                                        <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">4. Responsibilities</h4>
                                        <p className="text-sm text-gray-700 leading-relaxed">{renderFormattedText(result.responsibilities)}</p>
                                    </section>

                                    <section className="bg-blue-50/50 p-6 rounded-lg border border-blue-100">
                                        <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-4 border-l-4 border-[#001F3F] pl-3">5. Procedure Steps</h4>
                                        <div className="space-y-3">
                                            {result.procedureSteps.map((step, i) => (
                                                <div key={i} className="flex gap-3">
                                                    <span className="font-bold text-[#001F3F] text-sm">{i + 1}.</span>
                                                    <p className="text-sm text-gray-800">{renderFormattedText(step)}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <section>
                                            <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">6. Tools & Resources</h4>
                                            <p className="text-sm text-gray-700">{renderFormattedText(result.toolsResources)}</p>
                                        </section>
                                        <section>
                                            <h4 className="font-bold text-[#001F3F] uppercase text-sm mb-2 border-l-4 border-[#001F3F] pl-3">7. Compliance</h4>
                                            <p className="text-sm text-gray-700">{renderFormattedText(result.complianceSafety)}</p>
                                        </section>
                                    </div>

                                    <section className="border-t border-gray-100 pt-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h5 className="font-bold text-gray-400 text-xs uppercase mb-1">References</h5>
                                                <p className="text-xs text-gray-600">{renderFormattedText(result.references)}</p>
                                            </div>
                                            <div>
                                                <h5 className="font-bold text-gray-400 text-xs uppercase mb-1">Revision History</h5>
                                                <p className="text-xs text-gray-600">{renderFormattedText(result.revisionHistory)}</p>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="list" size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">Standard Operating Procedure</p>
                                <p className="text-sm">Fill in process details to generate a structured SOP.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SOPBuilderTool;
