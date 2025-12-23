
import React, { useState } from 'react';
import { generateBrandingKit } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const BrandingKitTool = () => {
    const [formData, setFormData] = useState({
        brandName: '',
        industry: '',
        description: '',
        audience: '',
        values: '',
        designPreferences: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.brandName || !formData.industry) {
            alert("Please provide at least a Brand Name and Industry.");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const kit = await generateBrandingKit(formData);
            setResult(kit);
        } catch (err) {
            setError(err.message || "Failed to generate branding kit.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > height - margin) {
                doc.addPage();
                y = 20;
            }
        };

        const addHeader = (title) => {
            checkPageBreak(15);
            doc.setFillColor(0, 31, 63); // Navy
            doc.rect(0, y - 5, width, 12, 'F');
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(255, 255, 255);
            doc.text(title.toUpperCase(), margin, y + 3);
            y += 15;
        };

        const addText = (label, text) => {
            if (!text) return;
            checkPageBreak(20);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            if (label) doc.text(label, margin, y);
            
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);
            const lines = doc.splitTextToSize(text, width - (margin * 2) - (label ? 40 : 0));
            doc.text(lines, label ? margin + 40 : margin, y);
            y += (lines.length * 5) + 5;
        };

        // Cover
        doc.setFont("helvetica", "bold");
        doc.setFontSize(28);
        doc.setTextColor(0, 31, 63);
        doc.text(formData.brandName.toUpperCase(), margin, y);
        y += 10;
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.text("Brand Identity Guidelines", margin, y);
        y += 20;

        // Overview
        addHeader("Brand Overview");
        addText("Mission", result.overview.mission);
        addText("Vision", result.overview.vision);
        addText("Values", result.overview.values.join(", "));
        addText("Personality", result.overview.personality);

        // Logo
        addHeader("Logo Concepts");
        addText("Primary", result.logo.primaryConcept);
        addText("Secondary", result.logo.secondaryConcept);
        addText("Usage", result.logo.usage);

        // Colors
        checkPageBreak(50);
        addHeader("Color Palette");
        let x = margin;
        result.colors.forEach((color) => {
            doc.setFillColor(color.hex);
            doc.rect(x, y, 30, 30, 'F');
            
            doc.setFontSize(9);
            doc.setTextColor(0, 0, 0);
            doc.text(color.name, x, y + 35);
            doc.text(color.hex, x, y + 40);
            
            x += 40;
        });
        y += 50;

        // Typography
        addHeader("Typography");
        addText("Headings", result.typography.headings);
        addText("Body", result.typography.body);
        addText("Usage", result.typography.usage);

        // Imagery & Voice
        addHeader("Visual & Verbal Identity");
        addText("Imagery", result.imagery.style);
        addText("Voice/Tone", result.voice.tone);
        addText("Messaging", result.voice.messaging.join("\n• "));

        doc.save(`${formData.brandName.replace(/\s+/g, '_')}_BrandingKit.pdf`);
    };

    const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-sm";

    return (
        <div className="max-w-7xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left Column: Input (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                        <Icon name="pen-tool" /> Brand Details
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Brand Name *</label>
                            <input name="brandName" value={formData.brandName} onChange={handleInputChange} placeholder="e.g. Zenith Tech" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Industry *</label>
                            <input name="industry" value={formData.industry} onChange={handleInputChange} placeholder="e.g. SaaS / Healthcare" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Description / Vision</label>
                            <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} placeholder="What do you do? What is your mission?" className={`${inputClass} resize-none`} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Target Audience</label>
                            <input name="audience" value={formData.audience} onChange={handleInputChange} placeholder="e.g. Young professionals, Startups" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Brand Values</label>
                            <input name="values" value={formData.values} onChange={handleInputChange} placeholder="e.g. Innovation, Trust, Speed" className={inputClass} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Design Preferences (Vibe)</label>
                            <input name="designPreferences" value={formData.designPreferences} onChange={handleInputChange} placeholder="e.g. Minimalist, Dark Mode, Bold, Luxury" className={inputClass} />
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
                        {loading ? <Icon name="loader" className="animate-spin" size={24} /> : <Icon name="palette" size={24} />}
                        Generate Kit
                    </button>
                </div>

                {/* Right Column: Output (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Icon name="layers" size={14}/> Brand Identity Board
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
                                
                                {/* Overview Card */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-bold text-[#001F3F] mb-1">{formData.brandName}</h2>
                                    <p className="text-gray-500 text-sm mb-6 uppercase tracking-wide">{result.overview.personality}</p>
                                    
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">Mission</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">{result.overview.mission}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xs text-gray-400 uppercase mb-2">Vision</h4>
                                            <p className="text-sm text-gray-700 leading-relaxed">{result.overview.vision}</p>
                                        </div>
                                    </div>
                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {result.overview.values.map((v, i) => (
                                            <span key={i} className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">
                                                {v}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Color Palette */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                                        <Icon name="palette" size={18} /> Color Palette
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {result.colors.map((color, i) => (
                                            <div key={i} className="group">
                                                <div 
                                                    className="h-24 rounded-lg shadow-inner mb-3 transition-transform group-hover:scale-105"
                                                    style={{ backgroundColor: color.hex }}
                                                ></div>
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-gray-800 text-sm">{color.name}</span>
                                                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{color.hex}</span>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">{color.usage}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Typography & Logo */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                                            <Icon name="type" size={18} /> Typography
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold uppercase">Headings</span>
                                                <p className="text-xl font-bold text-gray-800">{result.typography.headings}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold uppercase">Body</span>
                                                <p className="text-base text-gray-600">{result.typography.body}</p>
                                            </div>
                                            <p className="text-xs text-gray-400 italic mt-2">{result.typography.usage}</p>
                                        </div>
                                    </div>

                                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                        <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                                            <Icon name="image" size={18} /> Logo Concept
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold uppercase">Primary</span>
                                                <p className="text-sm text-gray-700">{result.logo.primaryConcept}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-400 font-bold uppercase">Secondary</span>
                                                <p className="text-sm text-gray-700">{result.logo.secondaryConcept}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Imagery & Voice */}
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                                        <Icon name="megaphone" size={18} /> Voice & Visuals
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800 mb-2">Imagery Style</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-2">{result.imagery.style}</p>
                                            <p className="text-xs text-gray-400 italic">{result.imagery.guidelines}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-800 mb-2">Tone of Voice</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed mb-3">{result.voice.tone}</p>
                                            <div className="space-y-1">
                                                {result.voice.messaging.map((msg, i) => (
                                                    <div key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                        "{msg}"
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Applications */}
                                <div className="bg-gray-50 border border-gray-200 border-dashed p-6 rounded-xl">
                                    <h4 className="font-bold text-sm text-gray-500 uppercase mb-2">Applications</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{result.applications}</p>
                                </div>

                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="palette" size={64} className="mb-4 opacity-20" />
                                <p className="text-lg font-medium text-gray-500">Design your Brand Identity</p>
                                <p className="text-sm">Fill in the details to generate a complete branding kit.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandingKitTool;
