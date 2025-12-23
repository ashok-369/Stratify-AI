
import React, { useState } from 'react';
import { generateSalaryNegotiation } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
    jobRole: '',
    companyName: '',
    currentOffer: '',
    targetSalary: '',
    experience: '',
    negotiationStage: 'Initial Offer',
    leverage: ''
};

export const SalaryScriptTool = () => {
    const [params, setParams] = useState(INITIAL_PARAMS);
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setParams(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!params.jobRole || !params.targetSalary) {
            setError("Please provide at least Job Role and Target Salary.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await generateSalaryNegotiation(params);
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to generate script.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (result?.script) {
            navigator.clipboard.writeText(result.script);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    const inputClasses = "w-full p-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-navy outline-none transition-shadow";

    return (
        <div className="flex flex-col lg:flex-row h-[85vh] -m-6 md:-m-8">
            {/* Input Side */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
                <div className="max-w-xl mx-auto space-y-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-navy dark:text-white flex items-center gap-2">
                            <Icon name="dollar-sign" /> Negotiation Context
                        </h3>
                        <p className="text-sm text-gray-500">Provide details to generate a confident, tailored script.</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Negotiation Stage</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Initial Offer', 'Counter Offer', 'Performance Review'].map((stage) => (
                                    <button
                                        key={stage}
                                        onClick={() => setParams(prev => ({ ...prev, negotiationStage: stage }))}
                                        className={`p-2 rounded-lg text-xs font-semibold border transition-all ${params.negotiationStage === stage 
                                            ? 'bg-navy text-white border-navy' 
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                                    >
                                        {stage}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Job Role *</label>
                                <input name="jobRole" value={params.jobRole} onChange={handleChange} placeholder="e.g. Senior Dev" className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Company</label>
                                <input name="companyName" value={params.companyName} onChange={handleChange} placeholder="e.g. Tech Corp" className={inputClasses} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Offer / Pay</label>
                                <input name="currentOffer" value={params.currentOffer} onChange={handleChange} placeholder="$100k / $50hr" className={inputClasses} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Number *</label>
                                <input name="targetSalary" value={params.targetSalary} onChange={handleChange} placeholder="$120k / $65hr" className={inputClasses} />
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Experience / Level</label>
                            <input name="experience" value={params.experience} onChange={handleChange} placeholder="e.g. 5 years, Managed 2 teams" className={inputClasses} />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Your Leverage / Value Prop</label>
                            <textarea 
                                name="leverage" 
                                value={params.leverage} 
                                onChange={handleChange} 
                                rows={3} 
                                placeholder="Why do you deserve this? (e.g. Market research says X, I increased revenue by Y, I have a competing offer)" 
                                className={inputClasses} 
                            />
                        </div>

                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">{error}</div>}

                        <button 
                            onClick={handleGenerate} 
                            disabled={isLoading} 
                            className="w-full bg-green-700 hover:bg-green-800 text-white px-6 py-4 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="trending-up" />}
                            Generate Winning Script
                        </button>
                    </div>
                </div>
            </div>

            {/* Result Side */}
            <div className="w-full lg:w-1/2 bg-white dark:bg-gray-900 p-6 md:p-8 overflow-y-auto">
                <div className="max-w-xl mx-auto h-full flex flex-col">
                    {!result ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-60">
                            <Icon name="message-square" size={64} className="mb-4 text-gray-200 dark:text-gray-700" />
                            <h3 className="text-lg font-semibold text-gray-500">Ready to Negotiate?</h3>
                            <p className="text-sm">Fill in the context to get your script.</p>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            
                            {/* The Script Box */}
                            <div className="relative bg-navy text-white p-8 rounded-2xl shadow-xl">
                                <div className="absolute top-4 right-4">
                                    <button 
                                        onClick={handleCopy} 
                                        className="text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10"
                                        title="Copy Script"
                                    >
                                        <Icon name={isCopied ? "check" : "copy"} size={20} />
                                    </button>
                                </div>
                                <h4 className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <Icon name="message-square" size={14} /> The Script
                                </h4>
                                <p className="text-lg md:text-xl font-medium leading-relaxed font-serif">
                                    "{result.script}"
                                </p>
                            </div>

                            {/* Tips */}
                            <div className="space-y-4">
                                <h4 className="text-navy dark:text-white font-bold flex items-center gap-2">
                                    <Icon name="lightbulb" className="text-yellow-500" size={20} /> Strategic Tips
                                </h4>
                                <div className="grid gap-3">
                                    {result.tips.map((tip, i) => (
                                        <div key={i} className="flex gap-3 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                                            <span className="flex-shrink-0 w-6 h-6 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-xs">{i + 1}</span>
                                            <p className="text-gray-700 dark:text-gray-300 text-sm">{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reasoning */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                                <h4 className="text-blue-800 dark:text-blue-200 text-sm font-bold mb-2">Why this works</h4>
                                <p className="text-blue-900 dark:text-blue-100/80 text-sm leading-relaxed">
                                    {result.reasoning}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
