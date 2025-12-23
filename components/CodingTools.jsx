
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { 
    generateCodeSnippets, 
    generateMicroApp, 
    generateApiConnector, 
    generateAutomationScript, 
    generateWireframe, 
    generateAppTemplate, 
    generateWebsiteTemplate 
} from '../services/geminiService.js';

// --- Reusable Code Viewer ---
const CodeViewer = ({ files, instructions }) => {
    const [activeFile, setActiveFile] = useState(0);
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(files[activeFile].content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-[#0f172a] rounded-lg border border-slate-700 overflow-hidden font-mono text-sm shadow-2xl">
            {/* Tab Bar */}
            <div className="flex items-center justify-between bg-[#1e293b] border-b border-slate-700 px-2">
                <div className="flex overflow-x-auto">
                    {files.map((file, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveFile(i)}
                            className={`px-4 py-2 border-r border-slate-700 text-xs transition-colors ${activeFile === i ? 'bg-[#0f172a] text-blue-400 font-bold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                        >
                            {file.name}
                        </button>
                    ))}
                </div>
                <button onClick={handleCopy} className="text-slate-400 hover:text-white px-3 transition-colors flex items-center gap-1.5 text-xs">
                    <Icon name={copied ? 'check' : 'copy'} size={14} /> {copied ? 'Copied' : 'Copy'}
                </button>
            </div>
            
            {/* Code Content */}
            <div className="p-4 overflow-x-auto custom-scrollbar h-[400px]">
                <pre className="text-blue-100/90 leading-relaxed whitespace-pre font-mono">
                    <code>{files[activeFile].content}</code>
                </pre>
            </div>

            {/* Footer / Instructions */}
            {instructions && (
                <div className="bg-[#1e293b] p-3 border-t border-slate-700 text-slate-400 text-xs flex gap-2 items-start">
                    <Icon name="terminal" size={14} className="mt-0.5 text-green-500" />
                    <span className="leading-snug">{instructions}</span>
                </div>
            )}
        </div>
    );
};

// --- Shared Input Styles ---
const inputClass = "w-full p-3 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 font-medium placeholder:text-slate-400 transition-all";
const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2";

// 1. Snippet Library
export const CodeSnippetTool = () => {
    const [lang, setLang] = useState('JavaScript');
    const [topic, setTopic] = useState('');
    const [snippets, setSnippets] = useState([]);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await generateCodeSnippets({ language: lang, topic });
            setSnippets(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Language</label>
                    <select value={lang} onChange={e => setLang(e.target.value)} className={inputClass}>
                        <option>JavaScript</option><option>TypeScript</option><option>Python</option><option>SQL</option><option>React</option><option>HTML/CSS</option><option>Rust</option><option>Go</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Context (Optional)</label>
                    <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Array manipulation, Auth" className={inputClass} />
                </div>
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="code"/>} Generate Snippets
            </button>
            {snippets.length > 0 && (
                <div className="space-y-6 animate-in fade-in">
                    {snippets.map((s, i) => (
                        <div key={i} className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><Icon name="check-circle" size={14} className="text-green-500"/> {s.title}</h4>
                            <p className="text-xs text-slate-500">{s.explanation}</p>
                            <CodeViewer files={[{ name: `snippet_${i+1}.${lang === 'Python' ? 'py' : lang === 'SQL' ? 'sql' : 'js'}`, content: s.code, language: lang }]} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 2. Micro Tools Generator
export const MicroToolGen = () => {
    const [type, setType] = useState('URL Shortener Logic');
    const [features, setFeatures] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await generateMicroApp({ type, features });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className={labelClass}>Tool Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className={inputClass}>
                    <option>URL Shortener Logic</option><option>Encryption/Decryption Tool</option><option>Regex Tester</option><option>Color Converter (HEX/RGB)</option><option>JSON Formatter</option><option>Password Generator</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>Specific Requirements</label>
                <input value={features} onChange={e => setFeatures(e.target.value)} placeholder="e.g. Use dark mode style, include copy button..." className={inputClass} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="cpu"/>} Create Micro-App
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};

// 3. API Connector
export const ApiConnectorTool = () => {
    const [url, setUrl] = useState('');
    const [method, setMethod] = useState('GET');
    const [lang, setLang] = useState('JavaScript (Fetch)');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!url) return;
        setLoading(true);
        try {
            const res = await generateApiConnector({ url, method, language: lang });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className={labelClass}>API Endpoint</label>
                    <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://api.example.com/v1/data" className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>Method</label>
                    <select value={method} onChange={e => setMethod(e.target.value)} className={inputClass}>
                        <option>GET</option><option>POST</option><option>PUT</option><option>DELETE</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={labelClass}>Library / Language</label>
                <select value={lang} onChange={e => setLang(e.target.value)} className={inputClass}>
                    <option>JavaScript (Fetch)</option><option>JavaScript (Axios)</option><option>Python (Requests)</option><option>TypeScript (Axios)</option><option>cURL</option>
                </select>
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="link"/>} Generate Connector
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};

// 4. Automation Script
export const AutomationScriptTool = () => {
    const [task, setTask] = useState('Email Automation');
    const [lang, setLang] = useState('Python');
    const [details, setDetails] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!details) return;
        setLoading(true);
        try {
            const res = await generateAutomationScript({ taskType: task, language: lang, details });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Task Type</label>
                    <select value={task} onChange={e => setTask(e.target.value)} className={inputClass}>
                        <option>Email Automation</option><option>File System Management</option><option>Data Cleaning / CSV</option><option>Web Scraping</option><option>Cron Job / Scheduling</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Language</label>
                    <select value={lang} onChange={e => setLang(e.target.value)} className={inputClass}>
                        <option>Python</option><option>Node.js</option><option>Bash Shell</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={labelClass}>What should it do?</label>
                <textarea value={details} onChange={e => setDetails(e.target.value)} rows={3} placeholder="e.g. Read all CSVs in a folder and merge them..." className={`${inputClass} resize-none`} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="terminal"/>} Build Script
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};

// 5. Wireframe Generator
export const WireframeTool = () => {
    const [platform, setPlatform] = useState('Web');
    const [desc, setDesc] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!desc) return;
        setLoading(true);
        try {
            const res = await generateWireframe({ platform, description: desc });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setPlatform('Web')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${platform === 'Web' ? 'bg-white shadow text-blue-900' : 'text-slate-500'}`}>Web</button>
                <button onClick={() => setPlatform('Mobile')} className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${platform === 'Mobile' ? 'bg-white shadow text-blue-900' : 'text-slate-500'}`}>Mobile</button>
            </div>
            <div>
                <label className={labelClass}>Describe the Interface</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="e.g. A dashboard with a sidebar, a top chart, and a user table..." className={`${inputClass} resize-none`} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="layout"/>} Generate Wireframe Code
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};

// 6. Mobile App Template
export const MobileTemplateTool = () => {
    const [framework, setFramework] = useState('React Native');
    const [name, setName] = useState('');
    const [type, setType] = useState('E-commerce');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!name) return;
        setLoading(true);
        try {
            const res = await generateAppTemplate({ framework, appName: name, type });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Framework</label>
                    <select value={framework} onChange={e => setFramework(e.target.value)} className={inputClass}>
                        <option>React Native</option><option>Flutter</option><option>Swift</option><option>Kotlin</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>App Type</label>
                    <input value={type} onChange={e => setType(e.target.value)} placeholder="E-commerce" className={inputClass} />
                </div>
            </div>
            <div>
                <label className={labelClass}>App Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="MyAwesomeApp" className={inputClass} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="smartphone"/>} Scaffold Project
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};

// 7. Website Template
export const WebTemplateTool = () => {
    const [style, setStyle] = useState('Startup');
    const [stack, setStack] = useState('React/Tailwind');
    const [desc, setDesc] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!desc) return;
        setLoading(true);
        try {
            const res = await generateWebsiteTemplate({ style, techStack: stack, description: desc });
            setResult(res);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Style</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className={inputClass}>
                        <option>Startup</option><option>Minimal</option><option>Corporate</option><option>Portfolio</option>
                    </select>
                </div>
                <div>
                    <label className={labelClass}>Tech Stack</label>
                    <select value={stack} onChange={e => setStack(e.target.value)} className={inputClass}>
                        <option>React/Tailwind</option><option>HTML/CSS</option>
                    </select>
                </div>
            </div>
            <div>
                <label className={labelClass}>Brand / Content</label>
                <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} placeholder="Headline, color preference, sections..." className={`${inputClass} resize-none`} />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="globe"/>} Generate Code
            </button>
            {result && <div className="animate-in fade-in"><CodeViewer files={result.files} instructions={result.instructions} /></div>}
        </div>
    );
};
