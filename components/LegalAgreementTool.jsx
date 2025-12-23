
import React, { useState, useRef } from 'react';
import { generateLegalAgreement } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const LegalAgreementTool = () => {
    const [formData, setFormData] = useState({
        agreementType: 'NDA',
        partyA: '',
        partyB: '',
        jurisdiction: '',
        keyTerms: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const editorRef = useRef(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeSelect = (type) => {
        setFormData(prev => ({ ...prev, agreementType: type }));
    };

    const handleGenerate = async () => {
        if (!formData.partyA || !formData.partyB) {
            alert("Please fill in both Party details.");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const docText = await generateLegalAgreement(formData);
            
            // Format Markdown to HTML for display
            let html = docText;
            html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold text-center mb-6 uppercase border-b-2 border-black pb-2">$1</h1>');
            html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-lg font-bold mt-6 mb-3 uppercase">$1</h2>');
            html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-md font-bold mt-4 mb-2">$1</h3>');
            html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
            html = html.replace(/\n/g, '<br/>');

            setResult(html);
        } catch (err) {
            setError(err.message || "Failed to generate agreement.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!editorRef.current) return;
        const bodyText = editorRef.current.innerText;

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

        // Header
        doc.setFont("times", "bold");
        doc.setFontSize(16);
        doc.text(formData.agreementType.toUpperCase(), width / 2, y, { align: "center" });
        y += 15;

        // Content
        doc.setFont("times", "normal");
        doc.setFontSize(11);
        
        const paragraphs = bodyText.split('\n');
        
        paragraphs.forEach(para => {
            if (!para.trim()) {
                y += 5;
                return;
            }
            
            const isHeader = para.toUpperCase() === para && para.length > 5;
            
            if (isHeader) {
                checkPageBreak(15);
                doc.setFont("times", "bold");
                doc.text(para, margin, y);
                y += 6;
                doc.setFont("times", "normal");
            } else {
                const lines = doc.splitTextToSize(para, width - (margin * 2));
                checkPageBreak(lines.length * 5);
                doc.text(lines, margin, y);
                y += (lines.length * 5) + 2;
            }
        });

        // Signature Block (Simulated)
        checkPageBreak(40);
        y += 10;
        doc.line(margin, y, margin + 70, y);
        doc.line(width - margin - 70, y, width - margin, y);
        y += 5;
        doc.text("Signed (Party A)", margin, y);
        doc.text("Signed (Party B)", width - margin - 70, y);

        doc.save(`${formData.agreementType.replace(/\s+/g, '_')}_Agreement.pdf`);
    };

    const inputClass = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-sm";

    return (
        <div className="max-w-6xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left Column: Configuration (4 cols) */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-bold text-[#001F3F] mb-4 flex items-center gap-2">
                        <Icon name="gavel" /> Agreement Details
                    </h3>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Agreement Type</label>
                            <div className="flex flex-wrap gap-2">
                                {['NDA', 'MoU', 'Founder Agreement', 'Service Contract', 'Custom'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeSelect(type)}
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${formData.agreementType === type ? 'bg-[#001F3F] text-white border-[#001F3F]' : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Party A (Disclosing/Provider)</label>
                                <input name="partyA" value={formData.partyA} onChange={handleInputChange} placeholder="Name & Address" className={inputClass} />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Party B (Receiving/Client)</label>
                                <input name="partyB" value={formData.partyB} onChange={handleInputChange} placeholder="Name & Address" className={inputClass} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jurisdiction</label>
                            <input name="jurisdiction" value={formData.jurisdiction} onChange={handleInputChange} placeholder="e.g. State of California" className={inputClass} />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Key Terms / Clauses</label>
                            <textarea 
                                name="keyTerms" 
                                value={formData.keyTerms} 
                                onChange={handleInputChange} 
                                rows={6} 
                                placeholder="Paste specific terms, payment details, duration, or special conditions here..." 
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
                        className="w-full mt-6 py-3 bg-[#001F3F] hover:bg-blue-900 text-white rounded-lg font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Icon name="loader" className="animate-spin" size={18} /> : <Icon name="sparkles" size={18} />}
                        Draft Agreement
                    </button>
                </div>

                {/* Right Column: Document Preview (8 cols) */}
                <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-xl overflow-hidden border border-gray-200 shadow-md">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider flex items-center gap-2">
                            <Icon name="file-text" size={14}/> Document Preview
                        </h3>
                        {result && (
                            <button 
                                onClick={downloadPDF}
                                className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm font-bold text-[#001F3F] hover:bg-gray-50 transition-colors flex items-center gap-1"
                            >
                                <Icon name="download" size={14} /> Download PDF
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-8 bg-gray-100/50">
                        {result ? (
                            <div className="bg-white shadow-xl min-h-[600px] p-10 mx-auto max-w-[210mm]">
                                <div 
                                    ref={editorRef}
                                    className="font-serif text-gray-800 leading-relaxed text-sm whitespace-pre-wrap outline-none"
                                    contentEditable
                                    suppressContentEditableWarning
                                    dangerouslySetInnerHTML={{ __html: result }}
                                />
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                <Icon name="shield" size={48} className="mb-4 opacity-20" />
                                <p className="text-sm">Configure parameters to generate a legal draft.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LegalAgreementTool;
