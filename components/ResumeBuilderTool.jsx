
import React, { useState } from 'react';
import { generateResume } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    careerLevel: 'Experienced',
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    linkedin: '',
    education: '',
    experience: '',
    skills: ''
};

const TEMPLATES = [
    { id: 'modern', name: 'Modern', description: 'Clean, corporate blue accents', color: 'bg-blue-600' },
    { id: 'professional', name: 'Professional', description: 'Classic serif, elegant', color: 'bg-gray-700' },
    { id: 'executive', name: 'Executive', description: 'Bold header, authoritative', color: 'bg-navy' },
    { id: 'minimal', name: 'Minimal', description: 'Simple, teal accents, airy', color: 'bg-teal-600' },
];

export const ResumeBuilderTool = () => {
    const [formData, setFormData] = useState(INITIAL_PARAMS);
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    
    // Manage structured education state separately
    const [educationList, setEducationList] = useState([
        { id: '1', degree: '', institution: '', year: '', score: '' }
    ]);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isFresher = formData.careerLevel === 'Fresher';

    const handleLevelChange = (level) => {
        setFormData(prev => ({ ...prev, careerLevel: level }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Education List Handlers
    const handleEducationChange = (id, field, value) => {
        setEducationList(prev => prev.map(entry => 
            entry.id === id ? { ...entry, [field]: value } : entry
        ));
    };

    const addEducation = () => {
        setEducationList(prev => [
            ...prev, 
            { id: Date.now().toString(), degree: '', institution: '', year: '', score: '' }
        ]);
    };

    const removeEducation = (id) => {
        if (educationList.length > 1) {
            setEducationList(prev => prev.filter(e => e.id !== id));
        }
    };

    const handleSubmit = async () => {
        if (!formData.fullName || !formData.jobTitle) {
            setError("Full Name and Job Title are required.");
            return;
        }

        // Serialize structured education list into a string string for the AI service
        const educationString = educationList
            .map(e => `${e.degree} from ${e.institution} (${e.year}) ${e.score ? `- Score/CGPA: ${e.score}` : ''}`)
            .join('\n');

        const payload = { ...formData, education: educationString };
        
        setLoading(true);
        setError(null);
        try {
            const resume = await generateResume(payload);
            setResult(resume);
        } catch (error) {
            console.error("Failed to generate resume", error);
            setError(error.message || "Failed to generate resume. Please check your inputs and try again.");
        } finally {
            setLoading(false);
        }
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        let yPos = 20;
        const margin = 20;
        const contentWidth = pageWidth - (margin * 2);

        // --- Template Configs ---
        let titleFont = 'helvetica';
        let bodyFont = 'helvetica';
        let accentColor = [44, 62, 80]; // Default Dark Blue
        let headerAlign = 'left';

        if (selectedTemplate === 'professional') {
            titleFont = 'times';
            bodyFont = 'times';
            accentColor = [0, 0, 0];
            headerAlign = 'center';
        } else if (selectedTemplate === 'executive') {
            titleFont = 'helvetica';
            bodyFont = 'helvetica';
            accentColor = [0, 31, 63]; // Navy
            headerAlign = 'left';
        } else if (selectedTemplate === 'minimal') {
            titleFont = 'helvetica';
            bodyFont = 'helvetica';
            accentColor = [13, 148, 136]; // Teal
            headerAlign = 'left';
        } else {
            // Modern
            titleFont = 'helvetica';
            bodyFont = 'helvetica';
            accentColor = [37, 99, 235]; // Blue-600
            headerAlign = 'left';
        }

        const checkPageBreak = (height) => {
            if (yPos + height > pageHeight - margin) {
                doc.addPage();
                yPos = 20;
            }
        };

        const drawDivider = () => {
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, yPos, pageWidth - margin, yPos);
            yPos += 8;
        };

        // --- Header Rendering ---
        if (selectedTemplate === 'executive') {
            // Executive: Dark top block
            doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
            doc.rect(0, 0, pageWidth, 45, 'F');
            
            doc.setTextColor(255, 255, 255);
            doc.setFont(titleFont, 'bold');
            doc.setFontSize(24);
            doc.text(result.fullName.toUpperCase(), margin, 20);

            doc.setFontSize(14);
            doc.setFont(titleFont, 'normal');
            doc.setTextColor(220, 220, 220);
            doc.text(result.jobTitle.toUpperCase(), margin, 28);

            // Contact row white
            doc.setFontSize(10);
            doc.setTextColor(255, 255, 255);
            let contactLine = `${result.contactInfo.email} | ${result.contactInfo.phone}`;
            if (result.contactInfo.linkedin) contactLine += ` | ${result.contactInfo.linkedin}`;
            doc.text(contactLine, margin, 38);

            yPos = 60;
        } else {
            // Standard Header logic (Modern, Minimal, Professional)
            yPos = 20;
            if (headerAlign === 'center') {
                doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
                doc.setFont(titleFont, 'bold');
                doc.setFontSize(24);
                doc.text(result.fullName.toUpperCase(), pageWidth / 2, yPos, { align: 'center' });
                yPos += 8;

                doc.setFontSize(14);
                doc.setFont(titleFont, 'normal');
                doc.setTextColor(80, 80, 80);
                doc.text(result.jobTitle, pageWidth / 2, yPos, { align: 'center' });
                yPos += 8;

                doc.setFontSize(10);
                let contactLine = `${result.contactInfo.email}  •  ${result.contactInfo.phone}`;
                if (result.contactInfo.linkedin) contactLine += `  •  ${result.contactInfo.linkedin}`;
                doc.text(contactLine, pageWidth / 2, yPos, { align: 'center' });
                yPos += 10;
                drawDivider();

            } else {
                // Left aligned (Modern / Minimal)
                doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
                doc.setFont(titleFont, 'bold');
                doc.setFontSize(24);
                doc.text(result.fullName.toUpperCase(), margin, yPos);
                yPos += 8;

                doc.setFontSize(14);
                doc.setFont(titleFont, 'normal');
                doc.setTextColor(selectedTemplate === 'minimal' ? accentColor[0] : 100, selectedTemplate === 'minimal' ? accentColor[1] : 100, selectedTemplate === 'minimal' ? accentColor[2] : 100);
                doc.text(result.jobTitle, margin, yPos);
                yPos += 8;

                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                let contactLine = `${result.contactInfo.email} | ${result.contactInfo.phone}`;
                if (result.contactInfo.linkedin) contactLine += ` | ${result.contactInfo.linkedin}`;
                doc.text(contactLine, margin, yPos);
                yPos += 10;
                drawDivider();
            }
        }

        // --- Content Rendering ---
        
        const renderSectionTitle = (title) => {
            checkPageBreak(20);
            doc.setFont(titleFont, 'bold');
            doc.setFontSize(12);
            doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
            
            if (selectedTemplate === 'minimal') {
                 doc.text(title.toUpperCase(), margin, yPos);
                 // No line, just space
            } else if (selectedTemplate === 'professional') {
                 doc.text(title.toUpperCase(), pageWidth/2, yPos, { align: 'center' });
                 doc.setLineWidth(0.5);
                 doc.setDrawColor(0,0,0);
                 doc.line(pageWidth/2 - 20, yPos+2, pageWidth/2 + 20, yPos+2);
            } else {
                 // Modern / Executive
                 doc.text(title.toUpperCase(), margin, yPos);
                 doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
                 doc.setLineWidth(1); // Thicker line
                 doc.line(margin, yPos + 2, margin + 40, yPos + 2);
            }
            yPos += 10;
        };

        // Summary
        renderSectionTitle(isFresher ? 'Objective' : 'Professional Summary');
        doc.setFont(bodyFont, 'normal');
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        const summaryLines = doc.splitTextToSize(result.professionalSummary, contentWidth);
        doc.text(summaryLines, margin, yPos);
        yPos += (summaryLines.length * 5) + 8;

        // Experience
        if (result.experience?.length > 0) {
            renderSectionTitle(isFresher ? 'Internships & Projects' : 'Experience');
            
            result.experience.forEach((exp) => {
                checkPageBreak(30);
                
                // Role & Company Row
                doc.setFont(bodyFont, 'bold');
                doc.setFontSize(11);
                doc.setTextColor(0,0,0);
                doc.text(exp.role, margin, yPos);
                
                // Duration right aligned
                doc.setFont(bodyFont, 'italic');
                doc.setFontSize(9);
                doc.setTextColor(100,100,100);
                doc.text(exp.duration, pageWidth - margin, yPos, { align: 'right' });
                yPos += 5;

                // Company
                doc.setFont(bodyFont, 'bold'); // Semi-bold feel
                doc.setFontSize(10);
                doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
                doc.text(exp.company, margin, yPos);
                yPos += 6;

                // Bullets
                doc.setFont(bodyFont, 'normal');
                doc.setFontSize(10);
                doc.setTextColor(0,0,0);
                exp.achievements?.forEach((ach) => {
                    checkPageBreak(10);
                    const lines = doc.splitTextToSize(`• ${ach}`, contentWidth - 5);
                    doc.text(lines, margin + 5, yPos);
                    yPos += (lines.length * 5) + 1;
                });
                yPos += 4;
            });
            yPos += 4;
        }

        // Education
        if (result.education?.length > 0) {
            renderSectionTitle('Education');
            result.education.forEach((edu) => {
                checkPageBreak(20);
                doc.setFont(bodyFont, 'bold');
                doc.setFontSize(11);
                doc.setTextColor(0,0,0);
                doc.text(edu.degree, margin, yPos);

                doc.setFont(bodyFont, 'italic');
                doc.setFontSize(9);
                doc.setTextColor(100,100,100);
                doc.text(edu.year, pageWidth - margin, yPos, { align: 'right' });
                yPos += 5;

                doc.setFont(bodyFont, 'normal');
                doc.setFontSize(10);
                doc.setTextColor(accentColor[0], accentColor[1], accentColor[2]);
                doc.text(edu.institution, margin, yPos);
                yPos += 5;

                if (edu.details) {
                    doc.setFontSize(9);
                    doc.setTextColor(80,80,80);
                    doc.text(edu.details, margin, yPos);
                    yPos += 5;
                }
                yPos += 3;
            });
            yPos += 4;
        }

        // Skills
        if (result.skills?.length > 0) {
            checkPageBreak(20);
            renderSectionTitle('Skills');
            doc.setFont(bodyFont, 'normal');
            doc.setFontSize(10);
            doc.setTextColor(0,0,0);
            
            // Render as pills/text
            const skillsText = result.skills.join("  •  ");
            const lines = doc.splitTextToSize(skillsText, contentWidth);
            doc.text(lines, margin, yPos);
        }

        doc.save(`${result.fullName.replace(/\s+/g, '_')}_Resume.pdf`);
    };

    const renderResumePreview = () => {
        if (!result) return null;

        const isProfessional = selectedTemplate === 'professional';
        const isExecutive = selectedTemplate === 'executive';
        const isMinimal = selectedTemplate === 'minimal';
        const isModern = selectedTemplate === 'modern';

        const containerClass = `bg-white text-charcoal shadow-xl min-h-[1000px] w-full max-w-[210mm] mx-auto transition-all duration-500
            ${isProfessional ? 'font-serif' : 'font-sans'}
            ${isExecutive ? '' : 'p-12'} 
        `;

        return (
            <div className={containerClass}>
                {/* Header */}
                {isExecutive ? (
                    <div className="bg-navy text-white p-12 mb-8">
                        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{result.fullName}</h1>
                        <p className="text-xl text-blue-200 mb-4">{result.jobTitle}</p>
                        <div className="text-sm opacity-80 flex gap-4">
                            <span>{result.contactInfo.email}</span>|
                            <span>{result.contactInfo.phone}</span>
                            {result.contactInfo.linkedin && <>|<span>{result.contactInfo.linkedin}</span></>}
                        </div>
                    </div>
                ) : (
                    <div className={`mb-8 border-b pb-6 ${isProfessional ? 'text-center border-gray-300' : 'text-left border-gray-200'} ${isMinimal ? 'border-teal-100' : ''}`}>
                         <h1 className={`text-4xl font-bold uppercase mb-2 ${isModern ? 'text-blue-700' : 'text-gray-900'}`}>{result.fullName}</h1>
                         <p className={`text-xl font-medium mb-3 ${isMinimal ? 'text-teal-600' : 'text-gray-600'}`}>{result.jobTitle}</p>
                         <div className={`text-sm text-gray-500 ${isProfessional ? 'justify-center' : ''} flex gap-3`}>
                            <span>{result.contactInfo.email}</span>•
                            <span>{result.contactInfo.phone}</span>
                            {result.contactInfo.linkedin && <>•<span>{result.contactInfo.linkedin}</span></>}
                        </div>
                    </div>
                )}

                {/* Content Body */}
                <div className={`${isExecutive ? 'px-12 pb-12' : ''} space-y-8`}>
                    
                    {/* Summary */}
                    <section>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b 
                            ${isModern ? 'text-blue-800 border-blue-100' : ''}
                            ${isProfessional ? 'text-center border-b-2 border-gray-800 w-1/2 mx-auto mb-4' : ''}
                            ${isExecutive ? 'text-navy border-navy' : ''}
                            ${isMinimal ? 'text-teal-700 border-teal-100' : ''}
                        `}>
                            {isFresher ? 'Objective' : 'Professional Summary'}
                        </h3>
                        <p className="text-sm leading-relaxed text-gray-700">{result.professionalSummary}</p>
                    </section>

                    {/* Experience */}
                    <section>
                         <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b 
                            ${isModern ? 'text-blue-800 border-blue-100' : ''}
                            ${isProfessional ? 'text-center border-b-2 border-gray-800 w-1/2 mx-auto' : ''}
                            ${isExecutive ? 'text-navy border-navy' : ''}
                            ${isMinimal ? 'text-teal-700 border-teal-100' : ''}
                        `}>
                            {isFresher ? 'Internships & Projects' : 'Experience'}
                        </h3>
                        <div className="space-y-6">
                            {result.experience?.map((exp, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900 text-lg">{exp.role}</h4>
                                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">{exp.duration}</span>
                                    </div>
                                    <div className={`font-medium mb-2 ${isMinimal ? 'text-teal-600' : 'text-blue-700'}`}>{exp.company}</div>
                                    <ul className="list-disc list-outside ml-4 space-y-1">
                                        {exp.achievements?.map((ach, j) => (
                                            <li key={j} className="text-sm text-gray-600 pl-1">{ach}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Education */}
                    <section>
                         <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 pb-1 border-b 
                            ${isModern ? 'text-blue-800 border-blue-100' : ''}
                            ${isProfessional ? 'text-center border-b-2 border-gray-800 w-1/2 mx-auto' : ''}
                            ${isExecutive ? 'text-navy border-navy' : ''}
                            ${isMinimal ? 'text-teal-700 border-teal-100' : ''}
                        `}>Education</h3>
                        <div className="space-y-4">
                            {result.education?.map((edu, i) => (
                                <div key={i}>
                                    <div className="flex justify-between items-baseline">
                                        <h4 className="font-bold text-gray-900">{edu.degree}</h4>
                                        <span className="text-xs text-gray-500 italic">{edu.year}</span>
                                    </div>
                                    <div className={`font-medium text-sm ${isMinimal ? 'text-teal-600' : 'text-blue-700'}`}>{edu.institution}</div>
                                    <p className="text-xs text-gray-600 mt-1">{edu.details}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Skills */}
                    <section>
                        <h3 className={`text-sm font-bold uppercase tracking-wider mb-3 pb-1 border-b 
                            ${isModern ? 'text-blue-800 border-blue-100' : ''}
                            ${isProfessional ? 'text-center border-b-2 border-gray-800 w-1/2 mx-auto' : ''}
                            ${isExecutive ? 'text-navy border-navy' : ''}
                            ${isMinimal ? 'text-teal-700 border-teal-100' : ''}
                        `}>Skills</h3>
                        <div className={`flex flex-wrap gap-2 ${isProfessional ? 'justify-center' : ''}`}>
                            {result.skills?.map((skill, i) => (
                                <span key={i} className={`text-xs px-3 py-1 rounded-full border 
                                    ${isMinimal ? 'bg-teal-50 text-teal-800 border-teal-100' : 'bg-gray-100 text-gray-700 border-gray-200'}
                                `}>
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        );
    };

    const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1";
    const inputFieldClass = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent outline-none transition-all placeholder:text-gray-300 bg-white text-gray-900 text-sm";
    
    // Icon alignment fix: Absolute center Y inside the input wrapper
    const iconClass = "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none";
    // For textarea, stick to top
    const textareaIconClass = "absolute left-3 top-3.5 text-gray-400 pointer-events-none";

    if (result) {
        return (
            <div className="max-w-7xl mx-auto p-4 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Result Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 pb-6 border-b dark:border-gray-700">
                    <div>
                        <h2 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-2">
                             <Icon name="check-circle" className="text-green-500" /> Resume Generated
                        </h2>
                        <p className="text-gray-500 mt-1">Review your corporate-ready resume below.</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={() => setResult(null)}
                            className="px-6 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-navy dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2"
                        >
                            <Icon name="undo" size={16} /> Edit Inputs
                        </button>
                        <button 
                            onClick={downloadPDF}
                            className="flex items-center gap-2 bg-navy text-white px-8 py-3 rounded-lg hover:bg-blue-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                        >
                            <Icon name="download" size={20} />
                            Download PDF
                        </button>
                    </div>
                </div>

                {/* Template Grid */}
                <div>
                    <h3 className="text-lg font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                        <Icon name="layout" size={20} /> Choose Template Style
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TEMPLATES.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setSelectedTemplate(t.id)}
                                className={`group relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden ${selectedTemplate === t.id ? 'border-navy ring-2 ring-navy/20 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                            >
                                <div className={`h-24 w-full mb-3 rounded-lg shadow-inner ${t.color} opacity-80 group-hover:opacity-100 transition-opacity flex items-center justify-center`}>
                                     <div className="w-16 h-20 bg-white/20 backdrop-blur-sm rounded flex flex-col gap-1 p-1">
                                        <div className="w-8 h-1 bg-white/60 rounded"></div>
                                        <div className="w-full h-8 bg-white/40 rounded"></div>
                                        <div className="w-full h-full bg-white/30 rounded"></div>
                                     </div>
                                </div>
                                <div>
                                    <span className={`font-bold block ${selectedTemplate === t.id ? 'text-navy' : 'text-gray-700'}`}>{t.name}</span>
                                    <span className="text-xs text-gray-500">{t.description}</span>
                                </div>
                                {selectedTemplate === t.id && (
                                    <div className="absolute top-2 right-2 bg-navy text-white rounded-full p-1">
                                        <Icon name="check" size={12} />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Live Preview Area */}
                <div className="bg-gray-200 dark:bg-gray-900/50 p-8 md:p-12 rounded-2xl overflow-x-auto border dark:border-gray-700 shadow-inner">
                    <div className="transform scale-[0.9] md:scale-100 origin-top">
                        {renderResumePreview()}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-10 py-6">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-50 dark:bg-gray-800 rounded-2xl mb-2">
                    <Icon name="wand" size={32} className="text-navy dark:text-blue-400" />
                </div>
                <h2 className="text-4xl font-extrabold text-navy dark:text-white tracking-tight">
                     Resume Optimizer
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Transform your raw experience into a corporate-ready, ATS-friendly resume in seconds.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 md:p-10 border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-navy"></div>

                <div className="space-y-10">

                    {/* Career Level Toggle */}
                    <div className="flex flex-col items-center justify-center gap-3">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Experience Level</label>
                        <div className="flex bg-gray-100 dark:bg-gray-700 p-1.5 rounded-xl">
                            <button
                                onClick={() => handleLevelChange('Fresher')}
                                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${isFresher ? 'bg-white shadow-md text-navy transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                            >
                                <Icon name="graduation-cap" size={18} /> Fresher / Graduate
                            </button>
                            <button
                                onClick={() => handleLevelChange('Experienced')}
                                className={`px-6 py-3 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${!isFresher ? 'bg-white shadow-md text-navy transform scale-105' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                            >
                                <Icon name="briefcase" size={18} /> Experienced Pro
                            </button>
                        </div>
                    </div>
                    
                    {/* Section: Personal Information */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                            <div className="bg-blue-50 p-2 rounded-lg text-navy">
                                <Icon name="user" size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Personal Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-1.5">
                                <label className={labelClass}>Full Name *</label>
                                <div className="relative">
                                    <Icon name="user" size={18} className={iconClass} />
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className={inputFieldClass}
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>
                                    {isFresher ? "Target Role / Major" : "Job Title / Role *"}
                                </label>
                                <div className="relative">
                                    <Icon name="briefcase" size={18} className={iconClass} />
                                    <input
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleInputChange}
                                        className={inputFieldClass}
                                        placeholder={isFresher ? "e.g. Junior Developer" : "e.g. Senior Software Engineer"}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Email</label>
                                <div className="relative">
                                    <Icon name="mail" size={18} className={iconClass} />
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={inputFieldClass}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className={labelClass}>Phone</label>
                                <div className="relative">
                                    <Icon name="phone" size={18} className={iconClass} />
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={inputFieldClass}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-1.5">
                                <label className={labelClass}>LinkedIn / Portfolio URL</label>
                                <div className="relative">
                                    <Icon name="linkedin" size={18} className={iconClass} />
                                    <input
                                        name="linkedin"
                                        value={formData.linkedin}
                                        onChange={handleInputChange}
                                        className={inputFieldClass}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Professional Details */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                             <div className="bg-blue-50 p-2 rounded-lg text-navy">
                                <Icon name="file-text" size={20} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Professional Details</h3>
                        </div>

                        <div className="space-y-8">
                            
                            {/* Structured Education Section */}
                            <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
                                <div className="flex justify-between items-center mb-4">
                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                                        <Icon name="book-open" size={16} /> Education History
                                    </label>
                                    <button 
                                        onClick={addEducation}
                                        className="text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-3 py-1.5 rounded-lg flex items-center gap-1 text-navy dark:text-blue-300 font-bold hover:shadow-sm transition-all"
                                    >
                                        <Icon name="plus" size={14} /> Add Degree
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    {educationList.map((entry, index) => (
                                        <div key={entry.id} className="relative bg-white dark:bg-gray-800 p-5 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-shadow group">
                                            {educationList.length > 1 && (
                                                <button 
                                                    onClick={() => removeEducation(entry.id)}
                                                    className="absolute top-2 right-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    title="Remove"
                                                >
                                                    <Icon name="trash" size={16} />
                                                </button>
                                            )}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Degree</label>
                                                    <input 
                                                        value={entry.degree}
                                                        onChange={(e) => handleEducationChange(entry.id, 'degree', e.target.value)}
                                                        placeholder="e.g. B.Tech Computer Science"
                                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm focus:ring-1 focus:ring-navy outline-none font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Institution</label>
                                                    <input 
                                                        value={entry.institution}
                                                        onChange={(e) => handleEducationChange(entry.id, 'institution', e.target.value)}
                                                        placeholder="e.g. MIT"
                                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm focus:ring-1 focus:ring-navy outline-none font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Year</label>
                                                    <input 
                                                        value={entry.year}
                                                        onChange={(e) => handleEducationChange(entry.id, 'year', e.target.value)}
                                                        placeholder="2024"
                                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm focus:ring-1 focus:ring-navy outline-none font-medium"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Score / CGPA</label>
                                                    <input 
                                                        value={entry.score}
                                                        onChange={(e) => handleEducationChange(entry.id, 'score', e.target.value)}
                                                        placeholder="3.8 GPA"
                                                        className="w-full p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm focus:ring-1 focus:ring-navy outline-none font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelClass}>
                                    Key Skills (Comma separated)
                                </label>
                                <div className="relative">
                                    <Icon name="award" size={18} className={textareaIconClass} />
                                    <textarea
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleInputChange}
                                        rows={2}
                                        className={`${inputFieldClass} pl-10 pt-3 resize-none`}
                                        placeholder="e.g. React, TypeScript, Python, Project Management, Agile..."
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className={labelClass}>
                                    {isFresher ? "Internships, Projects & Capstones" : "Work Experience"}
                                </label>
                                <div className="relative">
                                    <Icon name="scroll-text" size={18} className={textareaIconClass} />
                                    <textarea
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleInputChange}
                                        rows={6}
                                        className={`${inputFieldClass} pl-10 pt-3`}
                                        placeholder={isFresher 
                                            ? "Paste details about your Internships, Academic Projects. Mention your role and what you built." 
                                            : "Paste your past job titles, companies, dates, and rough bullet points here. The AI will format them."}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center gap-2"><Icon name="x-circle" size={18} /> {error}</div>}

                    <div className="pt-4">
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full py-4 bg-navy hover:bg-blue-800 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>
                                    <Icon name="loader" className="animate-spin" size={24} /> Optimizing Resume...
                                </>
                            ) : (
                                <>
                                    <Icon name="wand" size={24} /> Generate Professional Resume
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-4">AI will format your inputs into a polished document.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
