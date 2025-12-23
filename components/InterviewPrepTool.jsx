
import React, { useState } from 'react';
import { generateInterviewPrep } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    jobRole: '',
    industry: '',
    experienceLevel: 'Mid-Senior',
    questionType: 'Mixed',
    jobDescription: ''
};

export const InterviewPrepTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openIndex, setOpenIndex] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectorChange = (field, value) => {
        setParams(prev => ({ ...prev, [field]: value }));
    };

    const handleResumeUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            alert('Please upload a PDF or Image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = (evt.target?.result).split(',')[1];
            setResumeFile({
                name: file.name,
                mimeType: file.type,
                data: base64
            });
        };
        reader.readAsDataURL(file);
    };

    const removeResume = () => {
        setResumeFile(null);
    };

    const handleGenerate = async () => {
        if (!params.jobRole) {
            setError("Please enter a Job Role to get started.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setQuestions([]);

        try {
            const results = await generateInterviewPrep({
                ...params,
                resume: resumeFile ? { data: resumeFile.data, mimeType: resumeFile.mimeType } : undefined
            });
            setQuestions(results);
            setOpenIndex(0); // Open first question by default
            
            // Scroll to results
            setTimeout(() => {
                document.getElementById('interview-results')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);

        } catch (err) {
            setError(err.message || "Failed to generate questions. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleCopyAnswer = (text, index, e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const handleExportPDF = () => {
        if (questions.length === 0) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        const pageWidth = doc.internal.pageSize.width;
        let y = 20;

        // Header
        doc.setFillColor(0, 31, 63); // Navy
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text(`Interview Cheat Sheet`, 15, 20);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`${params.jobRole} (${params.experienceLevel})`, 15, 30);

        doc.setTextColor(0, 0, 0);
        y = 55;

        questions.forEach((q, i) => {
            if (y > 250) { doc.addPage(); y = 20; }
            
            // Question Box Visual
            doc.setFillColor(245, 247, 250);
            doc.rect(10, y - 5, pageWidth - 20, 25, 'F');
            
            // Question
            doc.setFontSize(11);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(0, 31, 63);
            const qLines = doc.splitTextToSize(`Q${i+1}: ${q.question}`, 170);
            doc.text(qLines, 15, y + 5);
            y += (qLines.length * 6) + 10;

            // Tip (Analysis)
            doc.setFontSize(10);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(80, 80, 80);
            // Replaced emoji with text label to prevent PDF encoding errors
            const tipText = `ANALYSIS: ${q.tip}`;
            const tipLines = doc.splitTextToSize(tipText, 170);
            doc.text(tipLines, 15, y);
            y += (tipLines.length * 5) + 6;

            // Answer
            doc.setFont("helvetica", "normal");
            doc.setTextColor(0, 0, 0);
            const aLines = doc.splitTextToSize(`Talking Points: ${q.answer}`, 170);
            doc.text(aLines, 15, y);
            y += (aLines.length * 5) + 15;
        });

        doc.save(`Interview_Prep_${params.jobRole.replace(/\s+/g, '_')}.pdf`);
    };

    // Helper to render text with bolding (**text**) and bullet points (* text)
    const renderFormattedText = (text) => {
        if (!text || typeof text !== 'string') return null;
        return text.split('\n').map((line, i) => {
            const trimmed = line.trim();
            if (!trimmed) return null;

            const isBullet = trimmed.startsWith('* ') || trimmed.startsWith('- ');
            const cleanLine = trimmed.replace(/^[\*\-]\s+/, '');
            
            // Split by bold markers
            const parts = cleanLine.split(/(\*\*.*?\*\*)/g);

            return (
                <div key={i} className={`mb-1.5 leading-relaxed ${isBullet ? 'flex gap-2 pl-1' : ''}`}>
                    {isBullet && <span className="text-indigo-500 font-bold mt-1.5 text-[8px]">•</span>}
                    <span className={isBullet ? 'flex-1' : ''}>
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-semibold text-navy dark:text-indigo-300">{part.slice(2, -2)}</strong>;
                            }
                            return <span key={j}>{part}</span>;
                        })}
                    </span>
                </div>
            );
        });
    };

    // UI Helpers
    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputFieldClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-white text-gray-900 text-sm";
    
    // Icon aligned strictly to input container
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-6">
            
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-indigo-50 dark:bg-gray-800 rounded-2xl mb-2">
                    <Icon name="target" size={32} className="text-navy dark:text-indigo-400" />
                </div>
                <h2 className="text-4xl font-extrabold text-navy dark:text-white tracking-tight">
                     Interview Simulator
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Practice with role-specific questions tailored to your experience, resume soft skills, and industry.
                </p>
            </div>

            {/* Config Card */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-navy"></div>
                
                <div className="space-y-8">
                    {/* Top Row Inputs */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelClass}>Target Job Role *</label>
                            <div className="relative">
                                <div className={iconClass}><Icon name="briefcase" size={18} /></div>
                                <input 
                                    name="jobRole" 
                                    value={params.jobRole} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Product Marketing Manager" 
                                    className={inputFieldClass}
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className={labelClass}>Industry (Optional)</label>
                            <div className="relative">
                                <div className={iconClass}><Icon name="globe" size={18} /></div>
                                <input 
                                    name="industry" 
                                    value={params.industry} 
                                    onChange={handleChange} 
                                    placeholder="e.g. SaaS, Fintech, Healthcare" 
                                    className={inputFieldClass}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Selectors */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className={labelClass}>Experience Level</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Entry/Intern', 'Junior', 'Mid-Senior', 'Director/Exec'].map(level => (
                                    <button
                                        key={level}
                                        onClick={() => handleSelectorChange('experienceLevel', level)}
                                        className={`p-2.5 rounded-lg text-xs font-bold transition-all border ${
                                            params.experienceLevel === level 
                                            ? 'bg-navy text-white border-navy shadow-md' 
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <label className={labelClass}>Question Focus</label>
                            <div className="grid grid-cols-2 gap-2">
                                {['Mixed', 'Behavioral', 'Technical', 'Situational'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleSelectorChange('questionType', type)}
                                        className={`p-2.5 rounded-lg text-xs font-bold transition-all border ${
                                            params.questionType === type 
                                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' 
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300'
                                        }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* JD Context & Resume Upload */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                Job Description Context
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-3.5 text-gray-400 pointer-events-none"><Icon name="file-text" size={18} /></div>
                                <textarea 
                                    name="jobDescription" 
                                    value={params.jobDescription} 
                                    onChange={handleChange} 
                                    rows={4}
                                    placeholder="Paste JD bullets for specific questions..."
                                    className={`${inputFieldClass} pl-10 pt-3 resize-none h-[120px]`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={labelClass}>
                                Upload Resume (For Soft Skills Analysis)
                            </label>
                            {resumeFile ? (
                                <div className="w-full h-[120px] border border-green-200 bg-green-50 rounded-lg flex flex-col items-center justify-center text-center p-4 relative group">
                                    <button 
                                        onClick={removeResume}
                                        className="absolute top-2 right-2 text-green-700 hover:bg-green-100 p-1 rounded-full transition-colors"
                                        title="Remove File"
                                    >
                                        <Icon name="x" size={16} />
                                    </button>
                                    <div className="bg-green-100 p-2 rounded-full mb-2 text-green-600">
                                        <Icon name="file-check" size={24} />
                                    </div>
                                    <p className="text-sm font-bold text-green-800 truncate w-full px-2">{resumeFile.name}</p>
                                    <p className="text-xs text-green-600">Resume Attached</p>
                                </div>
                            ) : (
                                <div className="relative w-full h-[120px] border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer group bg-white">
                                    <input 
                                        type="file" 
                                        onChange={handleResumeUpload} 
                                        accept="application/pdf,image/*" 
                                        className="absolute inset-0 opacity-0 cursor-pointer z-10 w-full h-full" 
                                    />
                                    <div className="bg-gray-100 p-2 rounded-full mb-2 text-gray-400 group-hover:scale-110 transition-transform">
                                        <Icon name="upload" size={20} />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 group-hover:text-navy">Upload Resume (PDF)</p>
                                    <p className="text-[10px] text-gray-400 mt-1">To analyze soft skills</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2"><Icon name="x-circle" size={18} /> {error}</div>}

                    <button 
                        onClick={handleGenerate} 
                        disabled={isLoading} 
                        className="w-full bg-navy hover:bg-blue-800 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                    >
                        {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="sparkles" />}
                        {isLoading ? 'Analyzing Resume & Generating Questions...' : 'Start Interview Simulation'}
                    </button>
                </div>
            </div>

            {/* Results Section */}
            {(questions.length > 0 || isLoading) && (
                <div id="interview-results" className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-6">
                    
                    <div className="flex flex-col md:flex-row justify-between items-end border-b border-gray-200 dark:border-gray-700 pb-4 gap-4">
                        <div>
                            <h3 className="text-2xl font-bold text-navy dark:text-white">Prep Sheet</h3>
                            <p className="text-sm text-gray-500">{isLoading ? 'AI is analyzing requirements...' : `7 Questions tailored for ${params.jobRole}`}</p>
                        </div>
                        {!isLoading && (
                            <button 
                                onClick={handleExportPDF} 
                                className="flex items-center gap-2 bg-white dark:bg-gray-800 border dark:border-gray-700 px-5 py-2.5 rounded-lg font-bold text-navy dark:text-white shadow-sm hover:shadow-md transition-all"
                            >
                                <Icon name="download" size={18} /> Export PDF
                            </button>
                        )}
                    </div>

                    <div className="grid gap-4">
                        {isLoading ? (
                            // Skeleton Loader
                            Array(5).fill(0).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl p-6 animate-pulse">
                                    <div className="flex gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0"></div>
                                        <div className="space-y-2 w-full">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-20 bg-gray-100 dark:bg-gray-700/50 rounded-lg"></div>
                                </div>
                            ))
                        ) : (
                            questions.map((q, index) => (
                                <div 
                                    key={index} 
                                    className={`bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg ring-1 ring-navy dark:ring-indigo-500' : 'hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'}`}
                                >
                                    <button 
                                        onClick={() => toggleAccordion(index)}
                                        className="w-full flex items-start justify-between p-5 text-left group"
                                    >
                                        <div className="flex gap-4 pr-4">
                                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${openIndex === index ? 'bg-navy text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'}`}>
                                                {index + 1}
                                            </div>
                                            <div>
                                                <h4 className={`text-lg font-semibold leading-snug transition-colors ${openIndex === index ? 'text-navy dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {q.question}
                                                </h4>
                                            </div>
                                        </div>
                                        <Icon 
                                            name="chevron-down" 
                                            className={`text-gray-400 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-navy' : ''}`} 
                                        />
                                    </button>

                                    {openIndex === index && (
                                        <div className="px-6 pb-6 pl-[4.5rem] space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            
                                            {/* Insight Box */}
                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-800/30 flex gap-3">
                                                <Icon name="lightbulb" className="text-amber-600 shrink-0 mt-0.5" size={18} />
                                                <div className="w-full">
                                                    <h5 className="text-xs font-bold text-amber-800 dark:text-amber-500 uppercase tracking-wide mb-1">
                                                        Deep Analysis & Intent
                                                    </h5>
                                                    <div className="text-sm text-amber-900 dark:text-amber-100/80 leading-relaxed">
                                                        {renderFormattedText(q.tip)}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Answer Box */}
                                            <div className="relative group/answer">
                                                <div className="absolute top-2 right-2 opacity-0 group-hover/answer:opacity-100 transition-opacity z-10">
                                                     <button 
                                                        onClick={(e) => handleCopyAnswer(q.answer, index, e)}
                                                        className="p-1.5 bg-white shadow-sm border rounded text-gray-500 hover:text-navy text-xs flex items-center gap-1"
                                                    >
                                                        <Icon name={copiedIndex === index ? "check" : "copy"} size={14} />
                                                        {copiedIndex === index ? 'Copied' : 'Copy'}
                                                    </button>
                                                </div>
                                                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                                                    <Icon name="book-open" size={14} /> Key Talking Points
                                                </h5>
                                                <div className="text-gray-800 dark:text-gray-200 text-base border-l-2 border-indigo-200 pl-4">
                                                    {renderFormattedText(q.answer)}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
