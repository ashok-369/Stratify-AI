
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { generateLifestyleContent } from '../services/geminiService.js';

// Helper for exporting
const exportToPNG = (id, fileName) => {
    if (typeof window.html2canvas !== 'undefined') {
        const element = document.getElementById(id);
        if(!element) return;
        
        window.html2canvas(element, { 
            useCORS: true,
            scale: 2, // Better resolution
            backgroundColor: null // Capture transparency/background correctly
        }).then((canvas) => {
            const link = document.createElement('a');
            link.download = fileName;
            link.href = canvas.toDataURL();
            link.click();
        });
    } else {
        alert("Download feature requires html2canvas library to be loaded.");
    }
};

// 1. Wedding Inviter
export const WeddingInviter = () => {
    const [details, setDetails] = useState({
        couple: '',
        date: '',
        venue: '',
        rsvp: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState('classic');

    const themes = {
        classic: "bg-white text-stone-800 border-4 border-double border-stone-300 font-serif",
        floral: "bg-rose-50 text-rose-900 border-4 border-rose-200 font-serif",
        modern: "bg-slate-900 text-white border-none font-sans tracking-widest"
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'wedding', data: details });
            setResult(res);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full">
            <div className="w-full lg:w-1/3 space-y-4">
                <h3 className="font-bold text-gray-700">Details</h3>
                <input value={details.couple} onChange={e => setDetails({...details, couple: e.target.value})} placeholder="Couple Names (e.g. Jack & Rose)" className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-rose-200 outline-none" />
                <input value={details.date} onChange={e => setDetails({...details, date: e.target.value})} placeholder="Date & Time" className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-rose-200 outline-none" />
                <input value={details.venue} onChange={e => setDetails({...details, venue: e.target.value})} placeholder="Venue Address" className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-rose-200 outline-none" />
                <input value={details.rsvp} onChange={e => setDetails({...details, rsvp: e.target.value})} placeholder="RSVP Details" className="w-full p-3 border rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-rose-200 outline-none" />
                
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Visual Theme</label>
                    <div className="flex gap-2">
                        {Object.keys(themes).map(t => (
                            <button key={t} onClick={() => setTheme(t)} className={`px-3 py-2 capitalize rounded border ${theme === t ? 'bg-stone-800 text-white' : 'bg-white text-gray-700'}`}>
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleGenerate} disabled={loading} className="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-lg font-bold flex justify-center gap-2 transition-colors">
                     {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="sparkles"/>} Generate Text
                </button>

                <button onClick={() => exportToPNG('wedding-invite', 'invitation.png')} className="w-full bg-stone-800 text-white py-3 rounded flex justify-center items-center gap-2">
                    <Icon name="download" size={16} /> Download Image
                </button>
            </div>
            
            <div className="w-full lg:w-2/3 bg-gray-100 flex items-center justify-center p-8 rounded-xl">
                <div id="wedding-invite" className={`w-[400px] h-[600px] p-8 flex flex-col justify-center items-center text-center shadow-2xl transition-all ${themes[theme]}`}>
                    <div className="text-sm uppercase tracking-[0.3em] mb-8">You Are Invited to the Wedding of</div>
                    <h1 className="text-5xl mb-6 leading-tight">{details.couple || "Couple Name"}</h1>
                    <div className="w-16 h-[1px] bg-current mb-6 opacity-50"></div>
                    
                    {result ? (
                        <>
                            <div className="text-xl mb-4 font-bold">{result.headline}</div>
                            <div className="text-lg opacity-80 mb-8 whitespace-pre-wrap">{result.body}</div>
                            <div className="text-xs uppercase tracking-wider mt-auto opacity-60">{result.rsvp}</div>
                        </>
                    ) : (
                        <>
                            <div className="text-xl mb-2">{details.date || "Date & Time"}</div>
                            <div className="text-lg opacity-80 mb-12">{details.venue || "Venue Location"}</div>
                            <div className="text-xs uppercase tracking-wider mt-auto opacity-60">{details.rsvp || "RSVP Details"}</div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// 2. Birthday Flyer
export const BirthdayMaker = () => {
    const [details, setDetails] = useState({
        name: '',
        age: '',
        date: '',
        time: '',
        location: '',
        rsvp: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeThemeId, setActiveThemeId] = useState('vibrant');

    const themes = [
        {
            id: 'vibrant',
            name: 'Vibrant Pop',
            containerClass: 'bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-500 text-white',
            titleClass: 'font-black text-6xl uppercase tracking-tighter drop-shadow-md',
            subtitleClass: 'font-bold text-2xl uppercase tracking-wide bg-white text-pink-500 px-4 py-1 rounded-full transform -rotate-2 inline-block mb-4 shadow-lg',
            bodyClass: 'font-medium text-white/90',
            borderClass: 'p-6 border-4 border-white/30 h-full rounded-2xl flex flex-col items-center justify-center',
            icon: '🎉'
        },
        {
            id: 'elegant',
            name: 'Midnight Gala',
            containerClass: 'bg-neutral-900 text-[#D4AF37] border-[16px] border-double border-[#D4AF37]',
            titleClass: 'font-serif italic text-6xl tracking-wide text-[#FCF6BA] drop-shadow-[0_2px_10px_rgba(197,160,89,0.3)]',
            subtitleClass: 'font-sans text-xs tracking-[0.3em] uppercase text-neutral-400 mb-6',
            bodyClass: 'font-serif text-[#F3E5AB] tracking-wide',
            borderClass: 'p-8 border border-[#D4AF37] h-full flex flex-col justify-center items-center',
            icon: '✨'
        },
        {
            id: 'retro',
            name: 'Retro Disco',
            containerClass: 'bg-[#2a0a4e] text-[#0ff]',
            titleClass: 'font-mono text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0ff] to-[#f0f] drop-shadow-[2px_2px_0px_rgba(255,255,255,0.2)]',
            subtitleClass: 'font-mono text-xl text-[#f0f] mt-2 mb-6',
            bodyClass: 'font-mono text-cyan-200',
            borderClass: 'p-6 border-4 border-[#f0f] border-dashed rounded-3xl h-full flex flex-col items-center justify-center',
            icon: '🪩'
        },
        {
            id: 'kids',
            name: 'Playful Day',
            containerClass: 'bg-[#eff6ff] text-[#1e3a8a] relative overflow-hidden',
            titleClass: 'font-black text-6xl text-[#3b82f6] drop-shadow-[3px_3px_0px_#93c5fd]',
            subtitleClass: 'font-bold text-2xl text-[#f59e0b] mb-4',
            bodyClass: 'font-bold text-slate-600',
            borderClass: 'p-6 border-[8px] border-dashed border-[#60a5fa] rounded-[3rem] bg-white h-full flex flex-col items-center justify-center',
            icon: '🎈'
        },
        {
            id: 'minimal',
            name: 'Swiss Minimal',
            containerClass: 'bg-white text-black',
            titleClass: 'font-sans font-black text-7xl leading-none tracking-tighter',
            subtitleClass: 'font-sans text-xl font-normal text-gray-500 mb-8',
            bodyClass: 'font-sans text-gray-900 font-medium',
            borderClass: 'p-10 border-l-[20px] border-black h-full flex flex-col justify-between items-start text-left',
            icon: ''
        }
    ];

    const currentTheme = themes.find(t => t.id === activeThemeId) || themes[0];

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value });
    };

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'birthday', data: details });
            setResult(res);
        } catch (e) {
            console.error(e);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 h-full min-h-[600px]">
            {/* Controls */}
            <div className="w-full lg:w-1/3 space-y-6 overflow-y-auto pr-2">
                <div className="space-y-3">
                    <h3 className="text-lg font-bold text-stone-700 flex items-center gap-2">
                        <Icon name="pen-tool" size={18} /> Party Details
                    </h3>
                    <input name="name" value={details.name} onChange={handleChange} placeholder="Honoree Name (e.g. Alex)" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                    <input name="age" value={details.age} onChange={handleChange} placeholder="Age (e.g. 30th)" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                    <div className="grid grid-cols-2 gap-3">
                        <input name="date" value={details.date} onChange={handleChange} placeholder="Date (e.g. Oct 20)" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                        <input name="time" value={details.time} onChange={handleChange} placeholder="Time (e.g. 7 PM)" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                    </div>
                    <input name="location" value={details.location} onChange={handleChange} placeholder="Location" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                    <input name="rsvp" value={details.rsvp} onChange={handleChange} placeholder="RSVP Info" className="w-full p-3 border border-stone-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-purple-200 outline-none transition-all" />
                </div>

                <div>
                    <h3 className="text-lg font-bold text-stone-700 mb-3 flex items-center gap-2">
                        <Icon name="palette" size={18} /> Theme
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {themes.map(theme => (
                            <button
                                key={theme.id}
                                onClick={() => setActiveThemeId(theme.id)}
                                className={`p-3 rounded-lg text-sm font-medium border text-left transition-all flex items-center gap-2 ${activeThemeId === theme.id ? 'border-purple-500 ring-1 ring-purple-500 bg-purple-50 text-purple-900' : 'border-stone-200 hover:border-stone-300 bg-white text-stone-600'}`}
                            >
                                <div className={`w-4 h-4 rounded-full border shadow-sm ${theme.id === 'vibrant' ? 'bg-orange-400' : theme.id === 'elegant' ? 'bg-black' : theme.id === 'kids' ? 'bg-blue-400' : 'bg-white'}`}></div>
                                {theme.name}
                            </button>
                        ))}
                    </div>
                </div>

                <button onClick={handleGenerate} disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-bold flex justify-center gap-2 transition-colors">
                     {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="sparkles"/>} Generate Text
                </button>
                
                <button onClick={() => exportToPNG('birthday-flyer', 'birthday_flyer.png')} className="w-full bg-stone-800 hover:bg-stone-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 mt-4">
                    <Icon name="download" /> Download Flyer
                </button>
            </div>

            {/* Preview Area */}
            <div className="w-full lg:w-2/3 bg-stone-100/50 rounded-2xl flex items-center justify-center p-8 overflow-hidden border border-stone-200">
                <div 
                    id="birthday-flyer" 
                    className={`relative w-full max-w-md aspect-[3/4] shadow-2xl transition-all duration-500 p-4 ${currentTheme.containerClass}`}
                >
                    <div className={`w-full h-full ${currentTheme.borderClass}`}>
                        {activeThemeId === 'minimal' ? (
                            <>
                                <div className="space-y-4 w-full">
                                    <div className="text-xs uppercase tracking-widest border-b border-black pb-2 mb-8 font-bold">You Are Invited</div>
                                    <h1 className={currentTheme.titleClass}>
                                        {details.name || "NAME"}
                                        <br/>
                                        <span className="text-gray-300">IS TURNING</span>
                                        <br/>
                                        {details.age || "AGE"}
                                    </h1>
                                </div>
                                <div className="w-full space-y-4 mt-auto">
                                    <div className="border-t border-black pt-4 grid grid-cols-2 gap-8">
                                        <div>
                                            <div className="font-bold text-xs uppercase text-gray-400 mb-1">When</div>
                                            <div className="text-xl font-bold">{details.date || "Date"}</div>
                                            <div className="text-lg text-gray-600">{details.time || "Time"}</div>
                                        </div>
                                        <div>
                                            <div className="font-bold text-xs uppercase text-gray-400 mb-1">Where</div>
                                            <div className="text-xl font-bold leading-tight">{details.location || "Location Address"}</div>
                                        </div>
                                    </div>
                                    <div className="text-xs font-mono text-gray-500 mt-8">
                                        RSVP: {details.rsvp || "Contact Info"}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center h-full w-full">
                                <div className="text-5xl mb-6 animate-bounce">{currentTheme.icon}</div>
                                <div className={currentTheme.subtitleClass}>Let's Celebrate!</div>
                                <h1 className={`mb-2 leading-none ${currentTheme.titleClass}`}>
                                    {result?.headline || (details.name || "Name")}
                                </h1>
                                <div className="text-3xl font-bold mb-8 opacity-90">{details.age ? `${details.age}TH` : (details.age || "Age B-Day")}</div>
                                
                                <div className={`space-y-3 p-6 rounded-xl w-full max-w-xs mx-auto bg-white/10 backdrop-blur-sm ${currentTheme.bodyClass}`}>
                                     {result ? (
                                         <p className="whitespace-pre-line">{result.body}</p>
                                     ) : (
                                         <>
                                            <div className="text-xl font-bold uppercase">{details.date || "DATE"} @ {details.time || "TIME"}</div>
                                            <div className="text-lg opacity-90 leading-tight">{details.location || "LOCATION"}</div>
                                         </>
                                     )}
                                     {result?.details && <div className="text-sm mt-4 font-bold opacity-75 pt-2 border-t border-current/20">{result.details}</div>}
                                     {!result && details.rsvp && <div className="text-sm mt-4 font-bold opacity-75 pt-2 border-t border-current/20">RSVP: {details.rsvp}</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 3. Enhanced Photo Album
export const PhotoAlbum = () => {
    const [title, setTitle] = useState('Summer Memories');
    const [layout, setLayout] = useState('polaroid');
    const [photos, setPhotos] = useState([]);

    const handleUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const newPhotos = files.map((file) => ({
                id: Date.now() + Math.random(),
                src: URL.createObjectURL(file),
                caption: 'Caption...',
                rotation: Math.random() * 6 - 3,
                tapeRot: Math.random() * 20 - 10
            }));
            setPhotos(prev => [...prev, ...newPhotos]);
        }
    };

    const removePhoto = (id) => {
        setPhotos(prev => prev.filter(p => p.id !== id));
    };

    const updateCaption = (id, val) => {
        setPhotos(prev => prev.map(p => p.id === id ? { ...p, caption: val } : p));
    };

    return (
        <div className="flex flex-col h-full gap-6">
            <div className="flex flex-col md:flex-row flex-wrap gap-4 items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm sticky top-0 z-20">
                <input value={title} onChange={e => setTitle(e.target.value)} className="font-bold text-lg outline-none border-b" placeholder="Album Title" />
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    {['grid', 'polaroid', 'scrapbook'].map(l => (
                        <button key={l} onClick={() => setLayout(l)} className={`px-4 py-1.5 text-xs font-bold capitalize rounded-md ${layout === l ? 'bg-white shadow' : ''}`}>{l}</button>
                    ))}
                </div>
                <div className="relative">
                    <input type="file" multiple accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full" />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Add Photos</button>
                </div>
                <button onClick={() => exportToPNG('photo-album', 'album.png')} className="bg-stone-800 text-white px-4 py-2 rounded-lg font-bold text-sm">Save Image</button>
            </div>

            <div className="flex-1 bg-gray-100 overflow-y-auto rounded-xl border border-gray-200 p-8 flex justify-center">
                <div id="photo-album" className={`min-h-[800px] w-full max-w-[1000px] p-12 relative shadow-2xl ${layout === 'polaroid' ? 'bg-neutral-900' : layout === 'grid' ? 'bg-white' : 'bg-[#fdf6e3]'}`}>
                    <h1 className={`text-5xl text-center mb-16 ${layout === 'polaroid' ? 'text-white' : 'text-gray-900'}`}>{title}</h1>
                    <div className={`${layout === 'grid' ? 'grid grid-cols-3 gap-4' : 'flex flex-wrap justify-center gap-8'}`}>
                        {photos.map((photo) => (
                            <div key={photo.id} className={`relative group ${layout === 'polaroid' ? 'bg-white p-3 pb-16 shadow-xl w-[260px]' : 'bg-gray-200'}`} style={layout !== 'grid' ? { transform: `rotate(${photo.rotation}deg)` } : {}}>
                                <button onClick={() => removePhoto(photo.id)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 z-10"><Icon name="x" size={12}/></button>
                                <div className="overflow-hidden aspect-square">
                                    <img src={photo.src} className="w-full h-full object-cover" alt="" />
                                </div>
                                {layout === 'polaroid' && (
                                    <div className="absolute bottom-4 left-0 right-0 px-4">
                                        <input value={photo.caption} onChange={(e) => updateCaption(photo.id, e.target.value)} className="w-full bg-transparent text-center outline-none font-serif text-lg" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. Meal Planner
export const MealPlanner = () => {
    const [goal, setGoal] = useState('Healthy Balance');
    const [diet, setDiet] = useState('Omnivore');
    const [duration, setDuration] = useState('3');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'meal', data: { goal, diet, duration } });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("Meal Plan", margin, y);
        y += 15;
        
        if (result.overview) {
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(result.overview, width - (margin * 2));
            doc.text(lines, margin, y);
            y += (lines.length * 6) + 10;
        }
        
        result.schedule?.forEach(day => {
             if (y > 270) { doc.addPage(); y = 20; }
             doc.setFont("helvetica", "bold");
             doc.setFontSize(14);
             doc.text(day.day, margin, y);
             y += 8;
             doc.setFont("helvetica", "normal");
             doc.setFontSize(11);
             day.meals.forEach(m => {
                 doc.text(`• ${m}`, margin + 5, y);
                 y += 6;
             });
             y += 6;
        });
        
        if (result.shoppingList) {
             if (y > 250) { doc.addPage(); y = 20; }
             doc.setFont("helvetica", "bold");
             doc.setFontSize(14);
             doc.text("Shopping List", margin, y);
             y += 8;
             doc.setFont("helvetica", "normal");
             doc.setFontSize(11);
             const listText = result.shoppingList.join(", ");
             const lines = doc.splitTextToSize(listText, width - (margin * 2));
             doc.text(lines, margin, y);
        }
        
        doc.save("Meal_Plan.pdf");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
                <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Goal" className="w-full p-3 border rounded-lg" />
                <input value={diet} onChange={e => setDiet(e.target.value)} placeholder="Diet" className="w-full p-3 border rounded-lg" />
                <select value={duration} onChange={e => setDuration(e.target.value)} className="w-full p-3 border rounded-lg">
                    <option value="1">1 Day</option><option value="3">3 Days</option><option value="7">7 Days</option>
                </select>
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold flex justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="utensils"/>} Generate Plan
            </button>
            {result && (
                <div className="bg-orange-50 p-6 rounded-xl space-y-6 max-h-96 overflow-y-auto border border-orange-100">
                    <div className="flex justify-between items-center">
                        <p className="text-orange-900 italic">{result.overview}</p>
                        <button onClick={downloadPDF} className="text-xs bg-white border px-3 py-1.5 rounded flex items-center gap-1"><Icon name="download" size={14}/> PDF</button>
                    </div>
                    <div className="space-y-4">
                        {result.schedule?.map((day, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm">
                                <h4 className="font-bold text-orange-600 mb-2">{day.day}</h4>
                                <ul className="list-disc ml-4 text-sm space-y-1 text-gray-700">
                                    {day.meals.map((m, j) => <li key={j}>{m}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                    {result.shoppingList && (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <h4 className="font-bold text-orange-800 mb-2">Shopping List</h4>
                            <div className="flex flex-wrap gap-2">
                                {result.shoppingList.map((item, i) => (
                                    <span key={i} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">{item}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 5. Fitness Planner
export const FitnessPlanner = () => {
    const [level, setLevel] = useState('Beginner');
    const [goal, setGoal] = useState('Build Muscle');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'fitness', data: { level, goal } });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <select value={level} onChange={e => setLevel(e.target.value)} className="w-full p-3 border rounded-lg">
                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
                <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Goal" className="w-full p-3 border rounded-lg" />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="dumbbell"/>} Create Routine
            </button>
            {result && (
                <div className="bg-emerald-50 p-6 rounded-xl space-y-4 max-h-96 overflow-y-auto border border-emerald-100">
                    <h3 className="text-xl font-bold text-emerald-800">{result.goal}</h3>
                    <div className="space-y-3">
                        {result.schedule?.map((day, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm flex justify-between items-start">
                                <div>
                                    <h4 className="font-bold text-emerald-700">{day.day}</h4>
                                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded font-bold">{day.focus}</span>
                                </div>
                                <ul className="text-sm text-right space-y-1 text-gray-700">
                                    {day.exercises.map((ex, j) => <li key={j}>• {ex}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// 6. Relationship Coach
export const RelationshipCoach = () => {
    const [situation, setSituation] = useState('');
    const [context, setContext] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        if (!situation) return;
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'relationship', data: { situation, context } });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <input value={situation} onChange={e => setSituation(e.target.value)} placeholder="Situation (e.g. Argument about chores)" className="w-full p-3 border rounded-lg" />
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3} placeholder="Context / Details..." className="w-full p-3 border rounded-lg resize-none" />
            <button onClick={generate} disabled={loading} className="w-full bg-pink-500 text-white py-3 rounded-lg font-bold flex justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="heart"/>} Get Advice
            </button>
            {result && (
                <div className="bg-pink-50 p-6 rounded-xl space-y-6 max-h-96 overflow-y-auto border border-pink-100">
                    <h3 className="text-lg font-bold text-pink-800">{result.title}</h3>
                    <p className="text-pink-900/80">{result.introduction}</p>
                    <div className="space-y-4">
                        {result.steps?.map((step, i) => (
                            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-pink-100">
                                <h4 className="font-bold text-gray-800 mb-1">Step {i+1}: {step.title}</h4>
                                <p className="text-sm text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-pink-700 italic border-t border-pink-200 pt-4">{result.closing}</p>
                </div>
            )}
        </div>
    );
};

// 7. Parenting Tools
export const ParentingTools = () => {
    const [chartType, setChartType] = useState('Chore Chart');
    const [age, setAge] = useState('5');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generate = async () => {
        setLoading(true);
        try {
            const res = await generateLifestyleContent({ type: 'parenting', data: { chartType, age } });
            setResult(res);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <select value={chartType} onChange={e => setChartType(e.target.value)} className="w-full p-3 border rounded-lg">
                    <option>Chore Chart</option><option>Reward System</option><option>Routine Checklist</option>
                </select>
                <input value={age} onChange={e => setAge(e.target.value)} placeholder="Child Age" className="w-full p-3 border rounded-lg" />
            </div>
            <button onClick={generate} disabled={loading} className="w-full bg-yellow-500 text-white py-3 rounded-lg font-bold flex justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="baby"/>} Create Chart
            </button>
            {result && (
                <div className="bg-yellow-50 p-6 rounded-xl space-y-4 max-h-96 overflow-y-auto border border-yellow-200">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-yellow-800">{result.title}</h3>
                        <button onClick={() => exportToPNG('parent-chart', 'chart.png')} className="text-xs bg-white px-3 py-1.5 rounded-lg border border-yellow-200 font-bold">Download</button>
                    </div>
                    <div id="parent-chart" className="bg-white p-6 rounded-xl shadow-lg border-4 border-yellow-100">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-yellow-50 text-yellow-800">
                                <tr>
                                    <th className="p-3 border-b border-yellow-100">Task</th>
                                    {result.columns.map((col, i) => <th key={i} className="p-3 border-b border-yellow-100 text-center">{col}</th>)}
                                </tr>
                            </thead>
                            <tbody>
                                {result.rows.map((row, i) => (
                                    <tr key={i} className="hover:bg-yellow-50/50">
                                        <td className="p-3 border-b border-yellow-50 font-medium text-gray-700">{row}</td>
                                        {result.columns.map((_, j) => <td key={j} className="p-3 border-b border-yellow-50 border-l border-yellow-50 text-center"><div className="w-4 h-4 border-2 border-yellow-200 rounded-full mx-auto"></div></td>)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {result.tips && (
                        <div className="bg-white p-4 rounded-lg text-sm text-yellow-900 border border-yellow-200 shadow-sm">
                            <strong className="block mb-1">Parenting Tips:</strong> {result.tips.join(' • ')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
