
import React, { useState, useRef, useEffect } from 'react';
import { generateHRPolicy } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    policyType: 'remote_work',
    companyName: '',
    industry: '',
    jurisdiction: '',
    customRules: ''
};

const POLICY_TEMPLATES = [
    { 
        id: 'remote_work', 
        label: 'Remote Work', 
        icon: 'home', 
        defaultRules: 'Hybrid model: 3 days in office, 2 days remote. Core hours 10am-3pm. Equipment provided by company.' 
    },
    { 
        id: 'code_of_conduct', 
        label: 'Code of Conduct', 
        icon: 'scale', 
        defaultRules: 'Respectful behavior, zero tolerance for discrimination, dress code is business casual.' 
    },
    { 
        id: 'anti_harassment', 
        label: 'Anti-Harassment', 
        icon: 'shield', 
        defaultRules: 'Define harassment clearly. Reporting procedure involves HR or anonymous hotline. Protection against retaliation.' 
    },
    { 
        id: 'leave_policy', 
        label: 'Leave & Time Off', 
        icon: 'clock', 
        defaultRules: '15 days PTO, 5 sick days. Requests must be made 2 weeks in advance via portal.' 
    },
    { 
        id: 'social_media', 
        label: 'Social Media', 
        icon: 'globe', 
        defaultRules: 'Do not speak on behalf of company. Confidentiality of internal projects. Respectful online presence.' 
    },
    { 
        id: 'confidentiality', 
        label: 'Confidentiality', 
        icon: 'lock', 
        defaultRules: 'Definition of trade secrets. Handling of client data. Obligations after employment ends.' 
    }
];

export const HRPolicyTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [generatedContent, setGeneratedContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);
    
    const editorRef = useRef(null);

    // Sync content to editor when generated
    useEffect(() => {
        if (editorRef.current && generatedContent) {
            editorRef.current.innerHTML = generatedContent;
        }
    }, [generatedContent]);

    const handleTemplateSelect = (template) => {
        setParams(prev => ({
            ...prev,
            policyType: template.id,
            customRules: template.defaultRules
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!params.companyName) {
            setError("Please enter your Company Name.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedContent('');

        try {
            const rawText = await generateHRPolicy(params);
            
            // Advanced Markdown Parsing
            let html = rawText;

            // 1. Normalize Line Endings (Critical for Regex)
            html = html.replace(/\r\n/g, '\n');

            // 2. Remove "---" or "***" horizontal rules
            html = html.replace(/^[\*\-]{3,}$/gm, '<hr class="my-6 border-gray-300"/>');

            // 3. Headers: #, ##, ### -> Styled Headers
            // Note: We use a generic h3 style for simplicity in the editor, but visually distinct
            html = html.replace(/^(#{1,6})\s+(.+)$/gm, '<h3 class="text-lg font-bold text-navy mt-6 mb-2">$2</h3>');

            // 4. Bold: **text** -> <b>text</b>
            html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

            // 5. Lists: * Text or - Text -> Indented bullet
            html = html.replace(/^[\*\-]\s+(.+)$/gm, '<div class="flex gap-2 mb-1 ml-4"><span class="font-bold text-gray-400">&bull;</span><span>$1</span></div>');

            // 6. Numbered Lists: 1. Text -> Indented number
            html = html.replace(/^(\d+\.)\s+(.+)$/gm, '<div class="flex gap-2 mb-1 ml-4"><span class="font-bold text-gray-500">$1</span><span>$2</span></div>');

            // 7. Newlines to Breaks
            html = html.replace(/\n/g, '<br/>');

            // 8. Cleanup: Remove breaks immediately following block elements to prevent double spacing
            html = html.replace(/(<\/h3>|<\/div>|<hr[^>]*>)\s*<br\/>/g, '$1');

            setGeneratedContent(html);
            
            // Scroll to preview
            setTimeout(() => {
                document.getElementById('policy-preview')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (err) {
            setError(err.message || "Failed to generate policy.");
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
        
        // Header
        doc.setFontSize(18);
        doc.setFont("helvetica", "bold");
        doc.text(params.companyName.toUpperCase(), 15, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("HR Policy Document", 15, 27);
        doc.line(15, 30, 195, 30);

        // Body
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(bodyText, 180);
        
        let y = 40;
        lines.forEach((line) => {
            if (y > 280) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, 15, y);
            y += 6;
        });
        
        doc.save(`${params.companyName.replace(/\s+/g, '_')}_${params.policyType}_Policy.pdf`);
    };

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-navy outline-none text-sm";

    return (
        <div className="flex flex-col lg:flex-row h-[85vh] -m-6 md:-m-8">
            
            {/* Sidebar: Templates */}
            <div className="hidden lg:flex flex-col w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 z-10">
                <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <h3 className="font-bold text-navy dark:text-white flex items-center gap-2 text-sm uppercase tracking-wider">
                        <Icon name="scroll-text" size={16} /> Templates
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {POLICY_TEMPLATES.map(t => (
                        <button
                            key={t.id}
                            onClick={() => handleTemplateSelect(t)}
                            className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all ${params.policyType === t.id ? 'bg-blue-50 text-navy border border-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:border-blue-800 shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'}`}
                        >
                            <div className={`p-1.5 rounded-md ${params.policyType === t.id ? 'bg-white/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                                <Icon name={t.icon} size={16} />
                            </div>
                            <span className="text-sm font-medium">{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content: Config & Preview */}
            <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-6 space-y-8">
                        
                        {/* Configuration Section */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm p-6 md:p-8">
                            <div className="mb-6 border-b dark:border-gray-700 pb-4">
                                <h3 className="text-xl font-bold text-navy dark:text-white mb-1">Configure Policy</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Enter company details to generate a compliant {params.policyType.replace('_', ' ')} policy.</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Company Details *</label>
                                    <input name="companyName" value={params.companyName} onChange={handleChange} placeholder="Company Legal Name" className={inputClasses} />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Industry</label>
                                        <input name="industry" value={params.industry} onChange={handleChange} placeholder="e.g. Retail, Tech, Healthcare" className={inputClasses} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jurisdiction</label>
                                        <input name="jurisdiction" value={params.jurisdiction} onChange={handleChange} placeholder="e.g. California, UK, General" className={inputClasses} />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block flex items-center gap-2">
                                        Specific Rules & Context
                                        <span className="bg-yellow-100 text-yellow-800 text-[10px] px-2 rounded-full font-normal">AI Context</span>
                                    </label>
                                    <textarea 
                                        name="customRules" 
                                        value={params.customRules} 
                                        onChange={handleChange} 
                                        rows={4} 
                                        placeholder="E.g. 'Unlimited PTO but requires approval', 'Office hours 9-5', 'Zero tolerance policy'..." 
                                        className={inputClasses} 
                                    />
                                </div>

                                {error && <div className="text-red-600 text-sm bg-red-50 p-3 rounded border border-red-200">{error}</div>}

                                <button 
                                    onClick={handleGenerate} 
                                    disabled={isLoading} 
                                    className="w-full bg-navy hover:bg-navy-light text-white px-6 py-4 rounded-xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="sparkles" />}
                                    Generate Policy Document
                                </button>
                            </div>
                        </div>

                        {/* Preview Section */}
                        <div id="policy-preview" className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
                            <div className="bg-gray-50 dark:bg-gray-900/50 border-b dark:border-gray-700 p-4 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                    <Icon name="file-text" size={14} /> Document Preview
                                </span>
                                <div className="flex gap-2">
                                    <button onClick={handleCopy} disabled={!generatedContent} className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded transition ${isCopied ? 'bg-green-100 text-green-700' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700'}`}>
                                        <Icon name={isCopied ? "check" : "copy"} size={14} /> {isCopied ? 'Copied' : 'Copy Text'}
                                    </button>
                                    <button onClick={handleExportPDF} disabled={!generatedContent} className="text-xs flex items-center gap-1 bg-navy text-white px-3 py-1.5 rounded hover:bg-navy-light transition disabled:opacity-50">
                                        <Icon name="download" size={14} /> PDF
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-8 overflow-x-auto">
                                <div className="bg-white shadow-xl min-h-[500px] w-full max-w-[210mm] mx-auto p-12 text-gray-800 font-serif leading-relaxed">
                                    {generatedContent ? (
                                        <div 
                                            ref={editorRef} 
                                            contentEditable 
                                            suppressContentEditableWarning 
                                            className="outline-none focus:bg-blue-50/10 min-h-[300px]"
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60 py-20">
                                            <Icon name="scroll-text" size={48} className="mb-4 text-gray-300" />
                                            <p className="font-sans text-sm">Configure and generate to see your policy here.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 text-center pb-8">
                            Disclaimer: This tool generates templates based on best practices. It does not constitute legal advice. Please review with legal counsel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
