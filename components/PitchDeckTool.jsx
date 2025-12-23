
import React, { useState } from 'react';
import { generatePitchDeck } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const PitchDeckTool = () => {
    const [companyName, setCompanyName] = useState('');
    const [rawData, setRawData] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleGenerate = async () => {
        if (!rawData) {
            alert("Please provide some raw content or notes about your business.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await generatePitchDeck({ companyName, rawData });
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to generate pitch deck.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        
        const { jsPDF } = window.jspdf;
        // Landscape orientation, A4 size
        const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        
        // Colors based on your screenshots
        const colors = {
            navy: [0, 31, 63],      // #001F3F
            accent: [99, 102, 241], // Indigo/Violet
            text: [50, 50, 50],     // Dark Gray
            lightText: [150, 150, 150],
            bgGray: [248, 250, 252] // Light Gray for concept box
        };

        const margin = 15;

        result.slides.forEach((slide, index) => {
            if (index > 0) doc.addPage();

            // --- COVER SLIDE (Index 0) ---
            if (index === 0) {
                // 1. Full Navy Background
                doc.setFillColor(colors.navy[0], colors.navy[1], colors.navy[2]);
                doc.rect(0, 0, width, height, 'F');
                
                // 2. Title
                doc.setTextColor(255, 255, 255);
                doc.setFont("helvetica", "bold");
                doc.setFontSize(36);
                const titleText = (companyName || slide.title).toUpperCase();
                doc.text(titleText, width / 2, height / 2 - 10, { align: 'center' });

                // 3. Accent Line
                doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                doc.setLineWidth(2);
                const lineWidth = 220; // wide line
                doc.line((width - lineWidth) / 2, height / 2 + 5, (width + lineWidth) / 2, height / 2 + 5);

                // 4. Subtitle / Presentation Label
                doc.setFont("helvetica", "normal");
                doc.setFontSize(14);
                doc.setTextColor(220, 220, 220);
                doc.text("Investor Presentation", width / 2, height / 2 + 20, { align: 'center' });

                // 5. Footer Confidentiality
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("Confidential Investor Deck", width / 2, height - 15, { align: 'center' });
                
                return; // End of Cover Slide
            }

            // --- CONTENT SLIDES ---
            
            // 1. Header Bar (Navy)
            const headerHeight = 25;
            doc.setFillColor(colors.navy[0], colors.navy[1], colors.navy[2]);
            doc.rect(0, 0, width, headerHeight, 'F');

            // 2. Accent Strip (Bottom of header)
            doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
            doc.setLineWidth(1);
            doc.line(0, headerHeight, width, headerHeight);

            // 3. Slide Title
            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(255, 255, 255);
            doc.text(slide.title.toUpperCase(), margin, 17);

            // 4. Footer
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.2);
            doc.line(margin, height - 12, width - margin, height - 12);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(colors.lightText[0], colors.lightText[1], colors.lightText[2]);
            doc.text(companyName || "Stratify AI", margin, height - 7);
            doc.text(`${index + 1} / ${result.slides.length}`, width - margin, height - 7, { align: "right" });

            // 5. Content Layout (Two Columns)
            const contentStartY = headerHeight + 15;
            const colGap = 10;
            const rightColWidth = 85; // Width for Visual Concept Box
            const leftColWidth = width - (margin * 2) - rightColWidth - colGap;
            
            let cursorY = contentStartY;

            // --- Left Column: Bullet Points ---
            doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(12);

            slide.content.forEach(point => {
                const bullet = "•";
                const text = point.replace(/^[\*\-]\s*/, ''); // clean existing bullets
                const indent = 6;
                
                const lines = doc.splitTextToSize(text, leftColWidth - indent);
                
                // Draw Bullet
                doc.text(bullet, margin, cursorY);
                // Draw Text
                doc.text(lines, margin + indent, cursorY);
                
                cursorY += (lines.length * 6) + 4; // Spacing
            });

            // --- Right Column: Visual Concept Box ---
            if (slide.visualIdea) {
                const boxX = margin + leftColWidth + colGap;
                const boxY = contentStartY;
                
                // Calculate height based on text
                doc.setFontSize(10);
                const visualText = doc.splitTextToSize(slide.visualIdea, rightColWidth - 10);
                const boxHeight = 20 + (visualText.length * 5); // padding + text height

                // Background
                doc.setFillColor(colors.bgGray[0], colors.bgGray[1], colors.bgGray[2]);
                doc.setDrawColor(200, 200, 200);
                doc.setLineWidth(0.3);
                doc.roundedRect(boxX, boxY, rightColWidth, boxHeight, 3, 3, 'FD');

                // Label
                doc.setFont("helvetica", "bold");
                doc.setFontSize(9);
                doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                doc.text("VISUAL CONCEPT", boxX + 5, boxY + 8);

                // Text
                doc.setFont("helvetica", "italic");
                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                doc.text(visualText, boxX + 5, boxY + 16);
            }
        });

        doc.save(`${(companyName || 'Pitch_Deck').replace(/\s+/g, '_')}.pdf`);
    };

    if (result) {
        return (
            <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
                <div className="flex justify-between items-center mb-6">
                    <button 
                        onClick={() => setResult(null)}
                        className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2"
                    >
                        <Icon name="arrow-left" className="rotate-180" size={16} /> Edit Input
                    </button>
                    <button 
                        onClick={downloadPDF}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md font-medium"
                    >
                        <Icon name="download" size={18} />
                        Export Professional PDF
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {result.slides.map((slide, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
                            {/* Slide Preview Header */}
                            <div className="bg-[#001F3F] px-4 py-3 text-white flex justify-between items-center shrink-0 border-b-4 border-indigo-500">
                                <h3 className="font-bold text-sm truncate pr-2 w-3/4">{slide.title}</h3>
                                <span className="text-xs font-mono opacity-50 shrink-0">#{i + 1}</span>
                            </div>
                            
                            <div className="p-5 flex flex-col gap-4 flex-grow">
                                {/* Visual Concept Preview */}
                                {slide.visualIdea && (
                                    <div className="bg-gray-50 border border-gray-200 border-dashed p-3 rounded-lg">
                                        <div className="text-[10px] font-bold text-indigo-600 uppercase mb-1 flex items-center gap-1">
                                            <Icon name="image" size={12} /> Visual
                                        </div>
                                        <p className="text-xs text-gray-600 italic leading-snug line-clamp-3">{slide.visualIdea}</p>
                                    </div>
                                )}

                                {/* Content Preview */}
                                <ul className="space-y-2 text-sm text-slate-700 overflow-y-auto max-h-60">
                                    {slide.content.map((point, j) => (
                                        <li key={j} className="flex gap-2 leading-relaxed items-start">
                                            <span className="text-indigo-500 font-bold mt-1.5 text-[6px] shrink-0">●</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 rounded-2xl mb-4 text-indigo-600">
                    <Icon name="presentation" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-slate-900">Pitch Deck Architect</h2>
                <p className="text-slate-500 mt-2">
                    Paste your raw notes, metrics, and ideas. We'll structure them into a compelling 10-12 slide investor deck.
                </p>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 border border-slate-100">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Company / Project Name</label>
                        <input 
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-gray-900"
                            placeholder="e.g. Stratify AI"
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">
                            Raw Content & Data 
                            <span className="ml-2 text-xs font-normal text-slate-400">(Paste anything: problem, solution, metrics, team info...)</span>
                        </label>
                        <textarea 
                            value={rawData}
                            onChange={(e) => setRawData(e.target.value)}
                            rows={8} 
                            className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-white text-gray-900 leading-relaxed"
                            placeholder="Example: We solve the problem of inefficient logistics using AI. Market size is $50B. We have 3 pilot customers. Seeking $1.5M Seed funding. Team is ex-Amazon/Google engineers."
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                            <Icon name="alert-triangle" size={16} /> {error}
                        </div>
                    )}

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 transform hover:-translate-y-0.5"
                    >
                        {loading ? <Icon name="loader" className="animate-spin" /> : <Icon name="sparkles" />}
                        {loading ? 'Structuring Deck...' : 'Generate Pitch Deck'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PitchDeckTool;
