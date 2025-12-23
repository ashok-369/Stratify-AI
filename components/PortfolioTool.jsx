
import React, { useState } from 'react';
import { generatePortfolioContent } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PROJECT = {
    id: '1',
    title: '',
    description: '',
    techStack: '',
    link: ''
};

const INITIAL_PARAMS = {
    fullName: '',
    title: '',
    bio: '',
    email: '',
    linkedin: '',
    github: '',
    skills: '',
    projects: [INITIAL_PROJECT]
};

export const PortfolioTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleProjectChange = (id, field, value) => {
        setParams(prev => ({
            ...prev,
            projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
        }));
    };

    const addProject = () => {
        const newId = Date.now().toString();
        setParams(prev => ({
            ...prev,
            projects: [...prev.projects, { id: newId, title: '', description: '', techStack: '', link: '' }]
        }));
    };

    const removeProject = (id) => {
        if (params.projects.length <= 1) return;
        setParams(prev => ({
            ...prev,
            projects: prev.projects.filter(p => p.id !== id)
        }));
    };

    const handleAIPolish = async () => {
        if (!params.fullName || !params.bio) {
            setError("Please fill in your Name and a rough Bio first.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const result = await generatePortfolioContent(params);
            setParams(prev => ({
                ...prev,
                bio: result.bio,
                projects: prev.projects.map(p => {
                    const polished = result.projects.find((rp) => rp.id === p.id);
                    return polished ? { ...p, description: polished.description } : p;
                })
            }));
        } catch (err) {
            setError(err.message || "Failed to polish content.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportHTML = () => {
        const skillTags = params.skills.split(',').map(s => s.trim()).filter(s => s).map(s => 
            `<span class="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">${s}</span>`
        ).join('');

        const projectCards = params.projects.map(p => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-3">
                    <h3 class="text-xl font-bold text-gray-900">${p.title || 'Untitled Project'}</h3>
                    ${p.link ? `<a href="${p.link}" target="_blank" class="text-blue-600 hover:text-blue-800"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}
                </div>
                <p class="text-gray-600 mb-4 leading-relaxed">${p.description}</p>
                <div class="flex flex-wrap gap-2 mt-auto">
                    ${p.techStack.split(',').map(t => t.trim()).filter(t => t).map(t => 
                        `<span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">${t}</span>`
                    ).join('')}
                </div>
            </div>
        `).join('');

        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${params.fullName} - Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>body { font-family: 'Inter', sans-serif; }</style>
</head>
<body class="bg-gray-50 text-gray-900 min-h-screen">
    <div class="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <header class="text-center mb-16">
            <h1 class="text-4xl md:text-6xl font-bold text-[#001F3F] mb-4">${params.fullName || 'Your Name'}</h1>
            <p class="text-xl text-teal-600 font-medium mb-6">${params.title || 'Professional Title'}</p>
            <p class="max-w-2xl mx-auto text-gray-600 leading-relaxed mb-8">${params.bio || 'Your bio goes here.'}</p>
            
            <div class="flex justify-center gap-4">
                ${params.email ? `<a href="mailto:${params.email}" class="p-2 text-gray-600 hover:text-[#001F3F] transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg></a>` : ''}
                ${params.linkedin ? `<a href="${params.linkedin}" target="_blank" class="p-2 text-gray-600 hover:text-[#0077b5] transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></a>` : ''}
                ${params.github ? `<a href="${params.github}" target="_blank" class="p-2 text-gray-600 hover:text-black transition"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg></a>` : ''}
            </div>
        </header>

        <section class="mb-16">
            <h2 class="text-2xl font-bold text-[#001F3F] mb-6 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="19" y2="21"/></svg>
                Skills & Technologies
            </h2>
            <div class="flex flex-wrap gap-3">
                ${skillTags}
            </div>
        </section>

        <section>
            <h2 class="text-2xl font-bold text-[#001F3F] mb-8 flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                Featured Projects
            </h2>
            <div class="grid md:grid-cols-2 gap-6">
                ${projectCards}
            </div>
        </section>

        <footer class="mt-20 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
            &copy; ${new Date().getFullYear()} ${params.fullName}. All rights reserved.
        </footer>
    </div>
</body>
</html>`;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${params.fullName.replace(/\s+/g, '_')}_Portfolio.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const handleExportPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        const checkPageBreak = (height) => {
            if (y + height > 280) {
                doc.addPage();
                y = 20;
            }
        };

        // Header
        doc.setFillColor(0, 31, 63); // Navy
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text(params.fullName.toUpperCase(), pageWidth/2, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(13, 148, 136); // Teal
        doc.text(params.title, pageWidth/2, 30, { align: 'center' });

        y = 55;

        // Links
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        const links = [params.email, params.linkedin, params.github].filter(Boolean).join("  |  ");
        doc.text(links, pageWidth/2, y - 5, { align: 'center' });
        y += 10;

        // Bio
        checkPageBreak(30);
        doc.setFontSize(12);
        doc.setTextColor(0, 31, 63);
        doc.setFont("helvetica", "bold");
        doc.text("Professional Summary", 20, y);
        y += 7;
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        const bioLines = doc.splitTextToSize(params.bio, 170);
        doc.text(bioLines, 20, y);
        y += (bioLines.length * 5) + 10;

        // Skills
        if (params.skills) {
            checkPageBreak(20);
            doc.setFontSize(12);
            doc.setTextColor(0, 31, 63);
            doc.setFont("helvetica", "bold");
            doc.text("Skills", 20, y);
            y += 7;
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            doc.setFont("helvetica", "normal");
            const skillLines = doc.splitTextToSize(params.skills, 170);
            doc.text(skillLines, 20, y);
            y += (skillLines.length * 5) + 10;
        }

        // Projects
        checkPageBreak(20);
        doc.setFontSize(12);
        doc.setTextColor(0, 31, 63);
        doc.setFont("helvetica", "bold");
        doc.text("Featured Projects", 20, y);
        y += 10;

        params.projects.forEach(p => {
            if (!p.title) return;
            checkPageBreak(30);

            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "bold");
            doc.text(p.title, 20, y);
            
            if (p.link) {
                 doc.setFontSize(9);
                 doc.setTextColor(0, 0, 255);
                 doc.textWithLink("Link", 180, y, { url: p.link });
            }
            y += 6;

            if (p.description) {
                doc.setFontSize(10);
                doc.setTextColor(80, 80, 80);
                doc.setFont("helvetica", "normal");
                const descLines = doc.splitTextToSize(p.description, 170);
                doc.text(descLines, 20, y);
                y += (descLines.length * 5) + 2;
            }

            if (p.techStack) {
                doc.setFontSize(9);
                doc.setTextColor(100, 100, 100);
                doc.setFont("helvetica", "italic");
                doc.text(`Tech: ${p.techStack}`, 20, y);
                y += 8;
            }

            y += 4; // Spacing between projects
        });

        doc.save(`${params.fullName.replace(/\s+/g, '_')}_Portfolio.pdf`);
    };

    const inputClasses = "w-full p-2.5 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-navy outline-none text-sm";

    return (
        <div className="flex flex-col lg:flex-row h-[85vh] -m-6 md:-m-8">
            {/* Left: Editor */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                <div className="max-w-xl mx-auto space-y-8">
                    
                    {/* Header Controls */}
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                            <Icon name="file-text" size={20} /> Content Editor
                        </h3>
                        <button 
                            onClick={handleAIPolish}
                            disabled={isLoading}
                            className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-full flex items-center gap-1 font-medium transition"
                        >
                            {isLoading ? <Icon name="loader" size={12} className="animate-spin"/> : <Icon name="sparkles" size={12}/>}
                            AI Polish
                        </button>
                    </div>

                    {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded">{error}</div>}

                    {/* Profile Section */}
                    <div className="space-y-4 bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm">
                        <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide mb-2">Profile</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <input name="fullName" value={params.fullName} onChange={handleChange} placeholder="Full Name *" className={inputClasses} />
                            <input name="title" value={params.title} onChange={handleChange} placeholder="Professional Title *" className={inputClasses} />
                        </div>
                        <textarea name="bio" value={params.bio} onChange={handleChange} rows={3} placeholder="Short Professional Bio..." className={inputClasses} />
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Icon name="mail" size={14} className="absolute left-3 top-3 text-gray-400"/>
                                <input name="email" value={params.email} onChange={handleChange} placeholder="Email" className={`${inputClasses} pl-9`} />
                            </div>
                            <div className="relative">
                                <Icon name="linkedin" size={14} className="absolute left-3 top-3 text-gray-400"/>
                                <input name="linkedin" value={params.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className={`${inputClasses} pl-9`} />
                            </div>
                            <div className="relative">
                                <Icon name="github" size={14} className="absolute left-3 top-3 text-gray-400"/>
                                <input name="github" value={params.github} onChange={handleChange} placeholder="GitHub URL" className={`${inputClasses} pl-9`} />
                            </div>
                        </div>
                        <input name="skills" value={params.skills} onChange={handleChange} placeholder="Skills (comma separated, e.g. React, Node.js, Design)" className={inputClasses} />
                    </div>

                    {/* Projects Section */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 text-sm uppercase tracking-wide">Projects</h4>
                            <button onClick={addProject} className="text-xs flex items-center gap-1 text-navy dark:text-blue-300 font-medium hover:underline">
                                <Icon name="plus" size={14} /> Add Project
                            </button>
                        </div>
                        
                        {params.projects.map((project, index) => (
                            <div key={project.id} className="bg-white dark:bg-gray-800 p-5 rounded-xl border dark:border-gray-700 shadow-sm relative group">
                                <button 
                                    onClick={() => removeProject(project.id)}
                                    className="absolute top-3 right-3 text-gray-300 hover:text-red-500 transition-colors"
                                    title="Remove Project"
                                >
                                    <Icon name="trash" size={16} />
                                </button>
                                <div className="space-y-3">
                                    <div className="flex gap-3 pr-8">
                                        <input 
                                            value={project.title} 
                                            onChange={(e) => handleProjectChange(project.id, 'title', e.target.value)} 
                                            placeholder="Project Title" 
                                            className={`${inputClasses} font-semibold`} 
                                        />
                                        <input 
                                            value={project.link} 
                                            onChange={(e) => handleProjectChange(project.id, 'link', e.target.value)} 
                                            placeholder="Link (Optional)" 
                                            className={inputClasses} 
                                        />
                                    </div>
                                    <textarea 
                                        value={project.description} 
                                        onChange={(e) => handleProjectChange(project.id, 'description', e.target.value)} 
                                        rows={2} 
                                        placeholder="Project Description..." 
                                        className={inputClasses} 
                                    />
                                    <input 
                                        value={project.techStack} 
                                        onChange={(e) => handleProjectChange(project.id, 'techStack', e.target.value)} 
                                        placeholder="Tech Stack (e.g. React, Tailwind)" 
                                        className={inputClasses} 
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Preview */}
            <div className="w-full lg:w-1/2 bg-gray-200 dark:bg-gray-900 overflow-hidden flex flex-col">
                <div className="bg-white dark:bg-gray-950 border-b dark:border-gray-700 p-3 flex justify-between items-center shadow-sm z-10">
                    <div className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                        <Icon name="globe" size={14}/> Live Preview
                    </div>
                    <div className="flex gap-2">
                        <button onClick={handleExportHTML} className="text-xs flex items-center gap-1 bg-navy text-white px-3 py-1.5 rounded hover:bg-navy-light transition">
                            <Icon name="code" size={14} /> Export HTML
                        </button>
                        <button onClick={handleExportPDF} className="text-xs flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded hover:bg-gray-200 transition">
                            <Icon name="download" size={14} /> PDF
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {/* Simulated Browser Window */}
                    <div className="bg-white min-h-[800px] w-full max-w-2xl mx-auto shadow-2xl rounded-lg overflow-hidden flex flex-col text-gray-900 font-sans">
                        {/* Fake Browser Bar */}
                        <div className="bg-gray-100 border-b p-2 flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>

                        <div className="p-8 md:p-12">
                            {/* Portfolio Header */}
                            <div className="text-center mb-12">
                                <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">{params.fullName || 'Your Name'}</h1>
                                <p className="text-teal-600 font-medium text-lg mb-4">{params.title || 'Professional Title'}</p>
                                <p className="text-gray-600 max-w-lg mx-auto leading-relaxed mb-6">{params.bio || 'Your professional biography will appear here...'}</p>
                                
                                <div className="flex justify-center gap-4 text-gray-500">
                                    {params.email && <Icon name="mail" size={20} className="hover:text-navy cursor-pointer" />}
                                    {params.linkedin && <Icon name="linkedin" size={20} className="hover:text-[#0077b5] cursor-pointer" />}
                                    {params.github && <Icon name="github" size={20} className="hover:text-black cursor-pointer" />}
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-12">
                                <h2 className="text-xl font-bold text-navy mb-4 border-b pb-2">Skills</h2>
                                <div className="flex flex-wrap gap-2">
                                    {params.skills ? params.skills.split(',').map((s, i) => (
                                        <span key={i} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                                            {s.trim()}
                                        </span>
                                    )) : <span className="text-gray-400 text-sm italic">Add skills to see them here...</span>}
                                </div>
                            </div>

                            {/* Projects */}
                            <div>
                                <h2 className="text-xl font-bold text-navy mb-6 border-b pb-2">Projects</h2>
                                <div className="grid gap-6">
                                    {params.projects.map((p, i) => (
                                        <div key={i} className="group">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                                                    {p.title || 'Untitled Project'}
                                                </h3>
                                                {p.link && <Icon name="external-link" size={16} className="text-gray-400 group-hover:text-blue-600" />}
                                            </div>
                                            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                                                {p.description || 'Project description...'}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {p.techStack && p.techStack.split(',').map((t, j) => (
                                                    <span key={j} className="text-[10px] uppercase font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                                        {t.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
