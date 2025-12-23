
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { generateReelsScript, generateContentCalendar, generateMediaKitData, generateDesignConcept } from '../services/geminiService.js';

// Helper to render markdown bold in UI
const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-bold">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
            })}
        </span>
    );
};

// 1. Canva Template Generator (Simulated with AI Layout Description)
export const CanvaTemplateTool = () => {
    const [type, setType] = useState('Instagram Post');
    const [style, setStyle] = useState('Minimalist');
    const [text, setText] = useState('');
    const [colors, setColors] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!text) return;
        setLoading(true);
        try {
            const res = await generateDesignConcept({ type, style, text, colors });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const handleOpenCanva = () => {
        const query = encodeURIComponent(`${style} ${type}`);
        window.open(`https://www.canva.com/search/templates?q=${query}`, '_blank');
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border rounded-lg bg-white text-sm">
                        <option>Instagram Post</option><option>Poster</option><option>Flyer</option><option>YouTube Thumbnail</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Style</label>
                    <select value={style} onChange={e => setStyle(e.target.value)} className="w-full p-3 border rounded-lg bg-white text-sm">
                        <option>Minimalist</option>
                        <option>Modern</option>
                        <option>Corporate</option>
                        <option>Creative</option>
                        <option>Retro</option>
                        <option>Bold</option>
                        <option>Elegant</option>
                        <option>Playful</option>
                    </select>
                </div>
            </div>
            <textarea value={text} onChange={e => setText(e.target.value)} rows={3} placeholder="Main text/headline to include..." className="w-full p-3 border rounded-lg bg-white text-sm" />
            <input value={colors} onChange={e => setColors(e.target.value)} placeholder="Color preferences (e.g. Blue & Gold)" className="w-full p-3 border rounded-lg bg-white text-sm" />
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="layout-template"/>} Generate Layout Concept
            </button>

            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4">
                    <h4 className="font-bold text-[#001F3F] text-lg">AI Design Blueprint</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white p-3 rounded border">
                            <span className="block text-xs font-bold text-gray-400 uppercase">Headline</span>
                            {renderFormattedText(result.headline)}
                        </div>
                        <div className="bg-white p-3 rounded border">
                            <span className="block text-xs font-bold text-gray-400 uppercase">Palette</span>
                            <div className="flex gap-2 mt-1">
                                {result.colorPalette.map((c, i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border shadow-sm" style={{ backgroundColor: c }} title={c}></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded border">
                        <span className="block text-xs font-bold text-gray-400 uppercase mb-2">Visual Layout</span>
                        <p className="text-gray-700 text-sm leading-relaxed">{renderFormattedText(result.layoutDescription)}</p>
                    </div>
                    <button 
                        onClick={handleOpenCanva}
                        className="w-full bg-blue-100 text-blue-800 py-2 rounded-lg font-bold text-xs hover:bg-blue-200 transition flex items-center justify-center gap-2"
                    >
                        Open in Canva <Icon name="external-link" size={12}/>
                    </button>
                </div>
            )}
        </div>
    );
};

// 2. Instagram Post Pack
export const InstagramPackTool = () => {
    // Reusing design generator for simplicity but generating multiple
    const [theme, setTheme] = useState('Minimalist');
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        // Simulation: In a real app, this would loop 9 times or use a specific "pack" prompt
        // Here we simulate 6 post ideas based on the single prompt for brevity
        setTimeout(() => {
            setResult([
                "Quote: 'Success is a journey.' - Minimal typography centered.",
                "Photo: Workspace flatlay with coffee. Caption about focus.",
                "Carousel: 3 Tips for [Topic]. Slide 1: Hook, Slide 2-3: Content.",
                "Reel Cover: Bold text '[Topic] Hack'.",
                "Infographic: Pie chart showing stats related to [Topic].",
                "Meme: Relatable industry humor image."
            ]);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Pack Theme</label>
                <select value={theme} onChange={e => setTheme(e.target.value)} className="w-full p-3 border rounded-lg bg-white text-sm">
                    <option>Minimalist</option><option>Bold & Colorful</option><option>Dark Mode</option><option>Pastel Aesthetic</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Topic / Niche</label>
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Productivity Tips" className="w-full p-3 border rounded-lg bg-white text-sm" />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="instagram"/>} Generate 6-Post Pack
            </button>
            {result.length > 0 && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                    {result.map((post, i) => (
                        <div key={i} className="aspect-square bg-gray-100 rounded-lg p-4 flex items-center justify-center text-center text-xs text-gray-600 border border-gray-200 shadow-sm hover:shadow-md transition">
                            {post}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// 3. Reels Script Maker
export const ReelsScriptTool = () => {
    const [topic, setTopic] = useState('');
    const [niche, setNiche] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const res = await generateReelsScript({ topic, niche, tone: 'Viral' });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche (e.g. Fitness)" className="w-full p-3 border rounded-lg bg-white text-sm" />
                <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic (e.g. 5 min workout)" className="w-full p-3 border rounded-lg bg-white text-sm" />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="film"/>} Write Script
            </button>
            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4 max-h-96 overflow-y-auto">
                    <div className="bg-blue-100 p-3 rounded-lg text-blue-900 text-sm">
                        <span className="font-bold">HOOK:</span> {renderFormattedText(result.hook)}
                    </div>
                    <div className="space-y-2">
                        {result.body.map((scene, i) => (
                            <div key={i} className="flex gap-3 text-sm text-gray-700">
                                <span className="font-bold text-gray-400 shrink-0 w-6">{i+1}s</span> 
                                <div>{renderFormattedText(scene)}</div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg text-green-900 text-sm border border-green-100">
                        <span className="font-bold">CTA:</span> {renderFormattedText(result.cta)}
                    </div>
                    <div className="text-xs text-gray-500 italic">
                        {renderFormattedText(result.visualCues)}
                    </div>
                    {result.caption && (
                        <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-600 mt-2">
                            <span className="font-bold text-xs uppercase text-gray-400 block mb-1">Caption</span>
                            {renderFormattedText(result.caption)}
                            {result.hashtags && result.hashtags.length > 0 && (
                                <div className="mt-2 text-blue-500 text-xs">{result.hashtags.join(' ')}</div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 4. YouTube Thumbnail (Simplified Layout Gen)
export const ThumbnailTool = () => {
    return <CanvaTemplateTool />; // Reuse Layout logic for MVP
};

// 5. Content Calendar
export const ContentCalendarTool = () => {
    const [month, setMonth] = useState('October');
    const [niche, setNiche] = useState('');
    const [days, setDays] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!niche) return;
        setLoading(true);
        try {
            const res = await generateContentCalendar({ month, niche, platform: 'Instagram', frequency: 'Daily' });
            setDays(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <select value={month} onChange={e => setMonth(e.target.value)} className="w-full p-3 border rounded-lg bg-white text-sm">
                    {['January','February','March','April','May','June','July','August','September','October','November','December'].map(m => <option key={m}>{m}</option>)}
                </select>
                <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="Niche (e.g. Tech Reviews)" className="w-full p-3 border rounded-lg bg-white text-sm" />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="calendar"/>} Generate Calendar
            </button>
            {days.length > 0 && (
                <div className="border rounded-xl overflow-hidden max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-3">Day</th>
                                <th className="p-3">Idea</th>
                                <th className="p-3">Format</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {days.map((d, i) => (
                                <tr key={i} className="bg-white hover:bg-gray-50">
                                    <td className="p-3 font-bold text-gray-500">{d.day}</td>
                                    <td className="p-3 text-gray-800">{d.idea}</td>
                                    <td className="p-3"><span className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded-full">{d.format}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

// 6. Media Kit
export const MediaKitTool = () => {
    const [formData, setFormData] = useState({ name: '', niche: '', bio: '', followers: '', engagement: '', socialLinks: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!formData.name) return;
        setLoading(true);
        try {
            const res = await generateMediaKitData(formData);
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Name" className="w-full p-3 border rounded-lg bg-white text-sm" />
                <input value={formData.niche} onChange={e => setFormData({...formData, niche: e.target.value})} placeholder="Niche" className="w-full p-3 border rounded-lg bg-white text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <input value={formData.followers} onChange={e => setFormData({...formData, followers: e.target.value})} placeholder="Followers (e.g. 50k)" className="w-full p-3 border rounded-lg bg-white text-sm" />
                <input value={formData.engagement} onChange={e => setFormData({...formData, engagement: e.target.value})} placeholder="Engagement (e.g. 5%)" className="w-full p-3 border rounded-lg bg-white text-sm" />
            </div>
            <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} rows={2} placeholder="Short bio..." className="w-full p-3 border rounded-lg bg-white text-sm" />
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="file-text"/>} Create Kit
            </button>

            {result && (
                <div className="bg-white shadow-xl p-6 border-t-8 border-[#001F3F] rounded-lg mt-4">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{formData.name}</h2>
                    <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">{formData.niche} Creator</p>
                    
                    <div className="flex gap-4 mb-6">
                        <div className="text-center p-3 bg-gray-50 rounded w-1/2">
                            <span className="block text-xl font-bold text-[#001F3F]">{formData.followers}</span>
                            <span className="text-xs text-gray-400 uppercase">Audience</span>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded w-1/2">
                            <span className="block text-xl font-bold text-[#001F3F]">{formData.engagement}</span>
                            <span className="text-xs text-gray-400 uppercase">Engagement</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-xs text-gray-400 uppercase mb-1">About</h4>
                            <p className="text-sm text-gray-700">{result.bio}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs text-gray-400 uppercase mb-1">Audience</h4>
                            <p className="text-sm text-gray-700">{result.audienceDemographics}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-xs text-gray-400 uppercase mb-1">Partnership Ideas</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.collaborationIdeas.map((idea, i) => (
                                    <span key={i} className="text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded">{idea}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
