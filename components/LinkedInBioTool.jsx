
import React, { useState } from 'react';
import { generateLinkedInBios } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    currentRole: '',
    industry: '',
    skills: '',
    achievements: '',
    tone: 'Professional'
};

export const LinkedInBioTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [bios, setBios] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedIndex, setCopiedIndex] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!params.currentRole || !params.skills) {
            setError("Please provide at least your Current Role and Key Skills.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setBios([]);

        try {
            const results = await generateLinkedInBios(params);
            setBios(results);
        } catch (err) {
            setError(err.message || "Failed to generate bios. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = (text, index) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-navy outline-none";

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="grid lg:grid-cols-3 gap-8">
                
                {/* Input Section */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-sm">
                        <h3 className="text-xl font-bold text-navy dark:text-white mb-4 flex items-center gap-2">
                            <Icon name="linkedin" /> Profile Details
                        </h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Current Role *</label>
                                <input 
                                    name="currentRole" 
                                    value={params.currentRole} 
                                    onChange={handleChange} 
                                    placeholder="e.g. Marketing Manager" 
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                                <input 
                                    name="industry" 
                                    value={params.industry} 
                                    onChange={handleChange} 
                                    placeholder="e.g. SaaS / E-commerce" 
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Key Skills *</label>
                                <textarea 
                                    name="skills" 
                                    value={params.skills} 
                                    onChange={handleChange} 
                                    rows={3}
                                    placeholder="e.g. SEO, Content Strategy, Team Leadership, Google Analytics" 
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Achievements / Context</label>
                                <textarea 
                                    name="achievements" 
                                    value={params.achievements} 
                                    onChange={handleChange} 
                                    rows={4}
                                    placeholder="Describe your biggest wins, years of experience, or unique value prop." 
                                    className={inputClasses}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Tone</label>
                                <select 
                                    name="tone" 
                                    value={params.tone} 
                                    onChange={handleChange} 
                                    className={inputClasses}
                                >
                                    <option>Professional</option>
                                    <option>Casual</option>
                                    <option>Thought Leader</option>
                                </select>
                            </div>
                        </div>

                        {error && <div className="mt-4 p-3 bg-red-50 text-red-600 rounded text-sm">{error}</div>}

                        <button 
                            onClick={handleGenerate} 
                            disabled={isLoading} 
                            className="mt-6 w-full bg-[#0077b5] hover:bg-[#005582] text-white px-6 py-3 rounded-lg font-bold shadow transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="sparkles" />}
                            {isLoading ? 'Optimizing...' : 'Generate Bios'}
                        </button>
                    </div>
                </div>

                {/* Results Section */}
                <div className="lg:col-span-2">
                    {bios.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 min-h-[400px]">
                            <Icon name="linkedin" size={48} className="text-gray-300 dark:text-gray-600 mb-4" />
                            <p className="text-gray-500 dark:text-gray-400">Fill in your details to generate professional summaries.</p>
                        </div>
                    ) : (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-bold text-navy dark:text-white">Select Your Style</h3>
                            <div className="grid gap-6">
                                {bios.map((bio, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-md hover:shadow-lg transition-all p-6 relative group">
                                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleCopy(`${bio.headline}\n\n${bio.content}\n\n${bio.hashtags.join(' ')}`, index)}
                                                className={`p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${copiedIndex === index ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
                                            >
                                                <Icon name={copiedIndex === index ? "check" : "copy"} size={16} />
                                                {copiedIndex === index ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>

                                        <div className="mb-4">
                                            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200 mb-3">
                                                {bio.style}
                                            </span>
                                            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                                                {bio.headline}
                                            </h4>
                                        </div>

                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-100 dark:border-gray-700/50 mb-4">
                                            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                                                {bio.content}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {bio.hashtags.map((tag, i) => (
                                                <span key={i} className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
