
import React, { useState, useRef, useEffect } from 'react';
import { generateOfferLetter } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    type: 'acceptance',
    candidateName: '',
    hiringManagerName: '',
    companyName: '',
    jobTitle: '',
    offerDetails: '',
    targetCompensation: '',
    negotiationFocus: '',
    declineReason: '',
    tone: 'Professional'
};

export const OfferLetterTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    
    const editorRef = useRef(null);

    useEffect(() => {
        if (editorRef.current && generatedContent) {
            editorRef.current.innerText = generatedContent;
        }
    }, [generatedContent]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (type) => {
        setParams(prev => ({ ...prev, type }));
    };

    const handleGenerate = async () => {
        if (!params.candidateName || !params.companyName || !params.jobTitle) {
            setError("Please fill in the Candidate Name, Company Name, and Job Title.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        try {
            const text = await generateOfferLetter(params);
            setGeneratedContent(text);
        } catch (err) {
            setError(err.message || "Failed to generate offer letter.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (editorRef.current) {
            navigator.clipboard.writeText(editorRef.current.innerText);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const handleExportPDF = () => {
        if (!editorRef.current) return;
        const bodyText = editorRef.current.innerText;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        
        const lines = doc.splitTextToSize(bodyText, 180);
        doc.text(lines, 15, 20);
        
        doc.save(`${params.type}_letter_${params.companyName.replace(/\s+/g, '_')}.pdf`);
    };

    // Styling constants matching ResumeBuilderTool
    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputFieldClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-white text-gray-900 text-sm";
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
    const textareaIconClass = "absolute left-3 top-3.5 text-gray-400 pointer-events-none";

    return (
        <div className="max-w-6xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-12 gap-8 min-h-0">
                
                {/* Left: Configuration (5 cols) */}
                <div className="lg:col-span-5 flex flex-col h-full overflow-y-auto pr-2 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-6 flex items-center gap-2">
                        <Icon name="handshake" /> Offer Context
                    </h3>

                    {/* Type Tabs */}
                    <div className="grid grid-cols-2 gap-2 mb-6">
                        <button 
                            onClick={() => handleTypeChange('acceptance')}
                            className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${params.type === 'acceptance' ? 'bg-green-100 text-green-800 ring-1 ring-green-500 shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Icon name="check-circle" size={16} /> Accept Offer
                        </button>
                        <button 
                            onClick={() => handleTypeChange('negotiation_salary')}
                            className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${params.type === 'negotiation_salary' ? 'bg-blue-100 text-blue-800 ring-1 ring-blue-500 shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Icon name="trending-up" size={16} /> Negotiate Salary
                        </button>
                        <button 
                            onClick={() => handleTypeChange('negotiation_benefits')}
                            className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${params.type === 'negotiation_benefits' ? 'bg-purple-100 text-purple-800 ring-1 ring-purple-500 shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Icon name="plus" size={16} /> Negotiate Benefits
                        </button>
                        <button 
                            onClick={() => handleTypeChange('decline')}
                            className={`p-3 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${params.type === 'decline' ? 'bg-red-100 text-red-800 ring-1 ring-red-500 shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Icon name="x-circle" size={16} /> Decline Offer
                        </button>
                    </div>

                    <div className="space-y-4 flex-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Your Name *</label>
                                <div className="relative">
                                    <Icon name="user" size={18} className={iconClass} />
                                    <input name="candidateName" value={params.candidateName} onChange={handleChange} placeholder="John Doe" className={inputFieldClass} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Job Title *</label>
                                <div className="relative">
                                    <Icon name="briefcase" size={18} className={iconClass} />
                                    <input name="jobTitle" value={params.jobTitle} onChange={handleChange} placeholder="Product Manager" className={inputFieldClass} />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Company Name *</label>
                                <div className="relative">
                                    <Icon name="home" size={18} className={iconClass} />
                                    <input name="companyName" value={params.companyName} onChange={handleChange} placeholder="Tech Corp" className={inputFieldClass} />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Hiring Manager</label>
                                <div className="relative">
                                    <Icon name="users" size={18} className={iconClass} />
                                    <input name="hiringManagerName" value={params.hiringManagerName} onChange={handleChange} placeholder="Jane Smith" className={inputFieldClass} />
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Fields Container */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            {params.type === 'acceptance' && (
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Offer Details (To Confirm)</label>
                                    <div className="relative">
                                        <Icon name="file-text" size={18} className={textareaIconClass} />
                                        <textarea 
                                            name="offerDetails" 
                                            value={params.offerDetails} 
                                            onChange={handleChange} 
                                            rows={3} 
                                            placeholder="e.g. $120k Salary, Start Date: Oct 1st. (Mention key terms to confirm)" 
                                            className={`${inputFieldClass} pl-10 pt-3 resize-none`} 
                                        />
                                    </div>
                                </div>
                            )}

                            {params.type === 'negotiation_salary' && (
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Target Compensation</label>
                                    <div className="relative">
                                        <Icon name="dollar-sign" size={18} className={iconClass} />
                                        <input 
                                            name="targetCompensation" 
                                            value={params.targetCompensation} 
                                            onChange={handleChange} 
                                            placeholder="e.g. $135,000 base salary" 
                                            className={inputFieldClass} 
                                        />
                                    </div>
                                    <p className="text-[10px] text-blue-600 bg-blue-50 p-2 rounded mt-1">Tip: Be realistic. A 10-15% increase is standard for negotiation.</p>
                                </div>
                            )}

                            {params.type === 'negotiation_benefits' && (
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Negotiation Focus</label>
                                    <div className="relative">
                                        <Icon name="list" size={18} className={textareaIconClass} />
                                        <textarea 
                                            name="negotiationFocus" 
                                            value={params.negotiationFocus} 
                                            onChange={handleChange} 
                                            rows={3} 
                                            placeholder="e.g. Remote work days, Signing bonus, More PTO, Laptop upgrade..." 
                                            className={`${inputFieldClass} pl-10 pt-3 resize-none`} 
                                        />
                                    </div>
                                </div>
                            )}

                            {params.type === 'decline' && (
                                <div className="space-y-1.5">
                                    <label className={labelClass}>Reason (Optional)</label>
                                    <div className="relative">
                                        <Icon name="message-square" size={18} className={textareaIconClass} />
                                        <textarea 
                                            name="declineReason" 
                                            value={params.declineReason} 
                                            onChange={handleChange} 
                                            rows={3} 
                                            placeholder="Brief reason e.g. 'Accepted another offer with better commute'..." 
                                            className={`${inputFieldClass} pl-10 pt-3 resize-none`} 
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                         <div className="space-y-1.5">
                            <label className={labelClass}>Tone</label>
                            <div className="relative">
                                <Icon name="sparkles" size={18} className={iconClass} />
                                <select name="tone" 
                                    value={params.tone} onChange={handleChange} className={`${inputFieldClass} appearance-none`}>
                                    <option>Professional</option>
                                    <option>Enthusiastic</option>
                                    <option>Firm</option>
                                    <option>Grateful</option>
                                </select>
                                <Icon name="chevron-down" size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                        
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 flex items-center gap-2"><Icon name="alert-triangle" size={16}/> {error}</div>}
                    </div>

                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading} 
                        className="w-full mt-6 py-4 bg-navy hover:bg-navy-light text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 transform hover:-translate-y-0.5"
                    >
                        {isLoading ? <Icon name="loader" className="animate-spin" size={20} /> : <Icon name="wand" size={20} />}
                        Generate Email Draft
                    </button>
                </div>

                {/* Right: Preview (7 cols) */}
                <div className="lg:col-span-7 flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <div className="bg-white border-b border-gray-200 p-4 flex justify-between items-center shadow-sm z-10">
                        <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 tracking-wider">
                            <Icon name="mail" size={14} /> Draft Preview
                        </span>
                        <div className="flex gap-2">
                            <button onClick={handleCopy} disabled={!generatedContent} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded transition font-medium ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'}`}>
                                <Icon name={isCopied ? "check" : "copy"} size={14} /> {isCopied ? 'Copied' : 'Copy Text'}
                            </button>
                            <button onClick={handleExportPDF} disabled={!generatedContent} className="text-xs flex items-center gap-1 bg-navy text-white px-3 py-1.5 rounded hover:bg-navy-light transition font-medium disabled:opacity-50">
                                <Icon name="download" size={14} /> Save PDF
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex-1 p-8 overflow-y-auto bg-gray-200/50">
                        <div className="bg-white shadow-xl min-h-[600px] p-10 md:p-12 text-gray-800 font-sans leading-relaxed rounded-sm max-w-2xl mx-auto">
                            {generatedContent ? (
                                <div 
                                    ref={editorRef} 
                                    contentEditable 
                                    suppressContentEditableWarning 
                                    className="outline-none whitespace-pre-wrap focus:bg-blue-50/10 p-2 -ml-2 rounded"
                                />
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 mt-20">
                                    <div className="bg-gray-100 p-4 rounded-full mb-4">
                                        <Icon name="mail" size={32} />
                                    </div>
                                    <p className="font-medium text-sm">Draft will appear here</p>
                                    <p className="text-xs mt-1">Configure options on the left to start</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
