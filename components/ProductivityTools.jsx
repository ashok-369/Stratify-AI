
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { 
    generateNotionTemplate, 
    generateStudyPlanner, 
    generateQuickStudyTable, 
    generateDigitalPlanner, 
    generateHabitTracker, 
    generatePersonalFinanceTracker,
    generateTimeBlocker,
    generateMeetingMinutes
} from '../services/geminiService.js';

// 1. Notion Template Generator
export const NotionGenerator = () => {
    const [category, setCategory] = useState('');
    const [focus, setFocus] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        if (!category) return;
        setLoading(true);
        try {
            const text = await generateNotionTemplate(category, focus);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900">
                        <option value="">Select Category...</option>
                        <option value="Work / Professional">Work / Professional</option>
                        <option value="Student / Academic">Student / Academic</option>
                        <option value="Personal / Lifestyle">Personal / Lifestyle</option>
                        <option value="Project Management">Project Management</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Specific Focus</label>
                    <input 
                        value={focus} 
                        onChange={e => setFocus(e.target.value)} 
                        placeholder="e.g. Content Calendar, Thesis"
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900"
                    />
                </div>
            </div>
            
            <button 
                onClick={handleGenerate} 
                disabled={loading || !category}
                className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors disabled:opacity-50"
            >
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Generate Template
            </button>

            {result && (
                <div className="relative bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <button onClick={handleCopy} className="absolute top-2 right-2 text-xs bg-white border p-2 rounded hover:bg-gray-100 flex items-center gap-1 text-gray-700">
                        <Icon name="copy" size={14}/> Copy
                    </button>
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-64 overflow-y-auto">{result}</pre>
                </div>
            )}
        </div>
    );
};

// 2. Planner Builder
export const PlannerBuilder = () => {
    const [config, setConfig] = useState({ 
        type: 'Daily Planner', 
        year: new Date().getFullYear().toString(), 
        style: 'Minimalist & Clean', 
        focus: '', 
        sections: { schedule: true, goals: true, habits: true, finance: false, wellness: false, notes: true, projects: false } 
    });
    const [result, setResult] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [quickType, setQuickType] = useState('Weekly');

    const toggleSection = (key) => { 
        setConfig(prev => ({ 
            ...prev, 
            sections: { ...prev.sections, [key]: !prev.sections[key] } 
        })); 
    };

    const handleGenerate = async () => { 
        const activeSections = Object.entries(config.sections).filter(([_, isActive]) => isActive).map(([name]) => name).join(', '); 
        const promptContext = `Type: ${config.type} Year: ${config.year} Style: ${config.style} Focus Area: ${config.focus || 'General Productivity'} Included Modules: ${activeSections}`; 
        setLoading(true); 
        try { 
            const text = await generateDigitalPlanner(promptContext); 
            setResult(text); 
        } catch(e) { console.error(e); } 
        setLoading(false); 
    };

    const cleanText = (text) => text.replace(/\*\*/g, '').replace(/^[\*\-]\s*/gm, '').trim();

    const downloadPlanPDF = () => { 
        if (!result) return; 
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF(); 
        const width = doc.internal.pageSize.getWidth(); 
        const margin = 20; 
        let y = 20; 
        const checkPageBreak = (needed) => { if (y + needed > 280) { doc.addPage(); y = 20; } }; 
        
        doc.setFillColor(0, 31, 63); 
        doc.rect(0, 0, width, 40, 'F'); 
        doc.setFont("helvetica", "bold"); 
        doc.setFontSize(22); 
        doc.setTextColor(255, 255, 255); 
        doc.text("Digital Planner Specification", margin, 20); 
        doc.setFontSize(12); 
        doc.setFont("helvetica", "normal"); 
        doc.text(`${config.type} • ${config.year} • ${config.style}`, margin, 30); 
        y = 55; 
        
        const lines = result.split('\n'); 
        lines.forEach(line => { 
            if (!line.trim()) { y += 4; return; } 
            checkPageBreak(15); 
            const isHeader = line.includes('**') && line.length < 80; 
            if (isHeader) { 
                y += 4; 
                checkPageBreak(10); 
                doc.setFont("helvetica", "bold"); 
                doc.setFontSize(12); 
                doc.setTextColor(0, 31, 63); 
                doc.text(cleanText(line), margin, y); 
                y += 6; 
                doc.setDrawColor(200, 200, 200); 
                doc.line(margin, y - 2, width - margin, y - 2); 
                y += 4; 
            } else { 
                doc.setFont("helvetica", "normal"); 
                doc.setFontSize(10); 
                doc.setTextColor(60, 60, 60); 
                const textLines = doc.splitTextToSize(cleanText(line), width - (margin * 2)); 
                checkPageBreak(textLines.length * 5); 
                if (line.trim().startsWith('*') || line.trim().startsWith('-')) { 
                    doc.text('•', margin, y); 
                    doc.text(textLines, margin + 5, y); 
                } else { 
                    doc.text(textLines, margin, y); 
                } 
                y += (textLines.length * 5) + 1; 
            } 
        }); 
        doc.save(`${config.type.replace(/\s/g, '_')}_Structure.pdf`); 
    };

    const downloadBlankGrid = () => { 
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF({ orientation: 'landscape' }); 
        doc.setFont("helvetica", "bold"); 
        doc.setFontSize(24); 
        doc.setTextColor(0, 31, 63); 
        doc.text(`${quickType} Grid Template`, 14, 20); 
        doc.setLineWidth(0.5); 
        doc.setDrawColor(200, 200, 200); 
        
        if (quickType === 'Weekly') { 
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
            let x = 14; let y = 30; const boxWidth = 38; const boxHeight = 150; 
            days.forEach((day) => { 
                doc.setFontSize(12); doc.setTextColor(0,0,0); doc.text(day, x, y); 
                doc.rect(x, y + 2, boxWidth, boxHeight); 
                x += 40; 
            }); 
        } else if (quickType === 'Monthly') { 
            let x = 14; let y = 30; const boxSize = 40; 
            for (let i = 0; i < 5; i++) { 
                for (let j = 0; j < 7; j++) { 
                    doc.rect(x + (j * boxSize), y + (i * 30), boxSize, 30); 
                } 
            } 
        } else if (quickType === 'Daily') { 
            let x = 14; let y = 35; 
            doc.setFontSize(12); 
            doc.text("Time Blocking", 14, 30); 
            doc.text("Top 3 Priorities", 100, 30); 
            doc.text("Notes", 100, 100); 
            for(let i=6; i<=22; i++) { 
                doc.setFontSize(10); 
                doc.text(`${i}:00`, 14, y+4); 
                doc.line(25, y, 90, y); 
                doc.line(25, y+8, 90, y+8); 
                y += 8; 
            } 
            doc.rect(100, 35, 180, 50); 
            doc.rect(100, 105, 180, 80); 
        } 
        doc.save(`${quickType}_Grid.pdf`); 
    };

    return ( 
        <div className="space-y-8"> 
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 space-y-6"> 
                <div className="flex items-center gap-2 mb-2"> 
                    <Icon name="pen-tool" className="text-[#001F3F]" /> 
                    <h3 className="text-lg font-bold text-[#001F3F]">Planner Architect</h3> 
                </div> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 
                    <div> 
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Planner Type</label> 
                        <select value={config.type} onChange={(e) => setConfig({...config, type: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900"> 
                            <option>Daily Planner</option><option>Weekly Planner</option><option>Monthly Overview</option><option>Student / Academic</option><option>Project Manager</option><option>All-in-One Life Planner</option> 
                        </select> 
                    </div> 
                    <div> 
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Visual Style</label> 
                        <select value={config.style} onChange={(e) => setConfig({...config, style: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900"> 
                            <option>Minimalist & Clean</option><option>Corporate Professional</option><option>Creative & Artistic</option><option>Dark Mode / High Contrast</option> 
                        </select> 
                    </div> 
                    <div> 
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Primary Goal / Focus</label> 
                        <input value={config.focus} onChange={(e) => setConfig({...config, focus: e.target.value})} placeholder="e.g. Scaling Business, Exam Prep, Wellness" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900" /> 
                    </div> 
                    <div> 
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Year</label> 
                        <input value={config.year} onChange={(e) => setConfig({...config, year: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900" /> 
                    </div> 
                </div> 
                <div> 
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Include Sections</label> 
                    <div className="flex flex-wrap gap-2"> 
                        {Object.keys(config.sections).map((sec) => ( 
                            <button key={sec} onClick={() => toggleSection(sec)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${config.sections[sec] ? 'bg-[#001F3F] text-white border-[#001F3F]' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>{sec.charAt(0).toUpperCase() + sec.slice(1)}</button> 
                        ))} 
                    </div> 
                </div> 
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"> 
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Generate Planner Structure 
                </button> 
            </div> 
            {result && ( 
                <div className="relative bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in"> 
                    <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4"> 
                        <h4 className="font-bold text-[#001F3F]">Generated Specification</h4> 
                        <div className="flex gap-2"> 
                            <button onClick={() => navigator.clipboard.writeText(result)} className="text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-100 flex items-center gap-1 text-gray-700"><Icon name="copy" size={14}/> Copy Text</button> 
                            <button onClick={downloadPlanPDF} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold"><Icon name="download" size={14}/> Export Plan PDF</button> 
                        </div> 
                    </div> 
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed">{result}</pre> 
                </div> 
            )} 
            <div className="border-t border-gray-100 pt-6"> 
                <div className="flex items-center justify-between mb-4"> 
                    <label className="block text-xs font-bold text-gray-500 uppercase">Quick Blank Templates</label> 
                    <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">No AI Required</span> 
                </div> 
                <div className="flex gap-3 mb-4"> 
                    {['Daily', 'Weekly', 'Monthly'].map(t => ( 
                        <button key={t} onClick={() => setQuickType(t)} className={`flex-1 py-2.5 rounded-lg border text-sm transition-all ${quickType === t ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{t}</button> 
                    ))} 
                </div> 
                <button onClick={downloadBlankGrid} className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"><Icon name="download" size={16} /> Download {quickType} Grid PDF</button> 
            </div> 
        </div> 
    );
};

// 3. Habit Tracker
export const HabitTracker = () => {
    const [preferences, setPreferences] = useState(''); 
    const [result, setResult] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [viewMode, setViewMode] = useState('doc');

    const handleGenerate = async () => { 
        if (!preferences) return; 
        setLoading(true); 
        try { 
            const text = await generateHabitTracker(preferences); 
            setResult(text); 
        } catch(e) { console.error(e); } 
        setLoading(false); 
    };

    const renderDocumentPreview = (markdown) => { 
        if (!markdown) return null; 
        const lines = markdown.split('\n'); 
        let inTable = false; 
        let tableHeader = []; 
        let tableRows = []; 
        const renderedElements = []; 
        
        const flushTable = () => { 
            if (tableHeader.length > 0) { 
                renderedElements.push(<div key={`table-${renderedElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm"><table className="w-full text-sm text-left"><thead className="bg-[#001F3F] text-white"><tr>{tableHeader.map((h, i) => <th key={i} className="px-4 py-3 font-bold border-b border-gray-200 whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="bg-white divide-y divide-gray-100">{tableRows.map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>{row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{__html: cell.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '<br/>')}} />)}</tr>))}</tbody></table></div>); 
            } 
            inTable = false; tableHeader = []; tableRows = []; 
        }; 
        
        lines.forEach((line, index) => { 
            const trimmed = line.trim(); 
            if (trimmed.startsWith('|')) { 
                if (!inTable) { inTable = true; tableHeader = trimmed.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')); } 
                else { if (trimmed.includes('---')) return; const row = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, '')); tableRows.push(row); } 
                return; 
            } else if (inTable) flushTable(); 
            
            if (trimmed.startsWith('#')) { 
                const level = trimmed.match(/^#+/)?.[0].length || 1; 
                const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, ''); 
                if (level === 1) renderedElements.push(<h1 key={index} className="text-3xl font-bold text-[#001F3F] mt-8 mb-4 pb-2 border-b-2 border-[#001F3F]">{text}</h1>); 
                else if (level === 2) renderedElements.push(<h2 key={index} className="text-xl font-bold text-[#001F3F] mt-6 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>{text}</h2>); 
                else renderedElements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{text}</h3>); 
                return; 
            } 
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) { 
                const text = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*/g, ''); 
                renderedElements.push(<div key={index} className="flex gap-3 mb-2 ml-4"><span className="text-[#001F3F] font-bold mt-1.5 text-[6px]">●</span><p className="text-gray-700 leading-relaxed text-sm">{text}</p></div>); 
                return; 
            } 
            if (trimmed) { 
                const text = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
                renderedElements.push(<p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: text}} />); 
            } 
        }); 
        if (inTable) flushTable(); 
        return renderedElements; 
    };

    const downloadPDF = () => { 
        if (!result) return; 
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF(); 
        const pageWidth = doc.internal.pageSize.getWidth(); 
        const pageHeight = doc.internal.pageSize.getHeight(); 
        const margin = 20; 
        const maxLineWidth = pageWidth - (margin * 2); 
        let y = 20; 
        const checkPageBreak = (needed) => { if (y + needed > pageHeight - margin) { doc.addPage(); y = 20; } }; 
        
        doc.setFillColor(0, 31, 63); 
        doc.rect(0, 0, pageWidth, 40, 'F'); 
        doc.setFont("helvetica", "bold"); 
        doc.setFontSize(24); 
        doc.setTextColor(255, 255, 255); 
        doc.text("Habit Tracking System", margin, 25); 
        doc.setFontSize(10); 
        doc.setTextColor(255, 215, 0); 
        doc.text("AI-GENERATED ROUTINE & GOALS", margin, 32); 
        y = 55; 
        
        const cleanForPdf = (text) => text.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '').trim(); 
        const lines = result.split('\n'); 
        let inTable = false; 
        let tableData = []; 
        
        const renderTable = () => { 
            if (tableData.length === 0) return; 
            const cleanRows = tableData.filter(row => !row.every(cell => cell.trim().match(/^[-:]+$/))); 
            if (cleanRows.length === 0) return; 
            const cols = cleanRows[0].length; 
            const colWidth = maxLineWidth / cols; 
            const rowHeight = 10; 
            checkPageBreak(rowHeight * 2); 
            doc.setFontSize(9); 
            doc.setFont("helvetica", "normal"); 
            cleanRows.forEach((row, i) => { 
                const isHeader = i === 0; 
                let maxRowHeight = rowHeight; 
                const cellTexts = row.map(cell => doc.splitTextToSize(cleanForPdf(cell), colWidth - 4)); 
                const maxLines = Math.max(...cellTexts.map(t => t.length)); 
                maxRowHeight = Math.max(rowHeight, maxLines * 5 + 4); 
                checkPageBreak(maxRowHeight); 
                if (isHeader) { 
                    doc.setFillColor(230, 240, 250); 
                    doc.rect(margin, y, maxLineWidth, maxRowHeight, 'F'); 
                    doc.setFont("helvetica", "bold"); 
                    doc.setTextColor(0, 31, 63); 
                } else { 
                    doc.setFont("helvetica", "normal"); 
                    doc.setTextColor(60, 60, 60); 
                } 
                row.forEach((_, j) => { 
                    doc.setDrawColor(220, 220, 220); 
                    doc.rect(margin + (j * colWidth), y, colWidth, maxRowHeight); 
                    doc.text(cellTexts[j], margin + (j * colWidth) + 2, y + 5); 
                }); 
                y += maxRowHeight; 
            }); 
            y += 10; tableData = []; inTable = false; 
        }; 
        
        for (let i = 0; i < lines.length; i++) { 
            const line = lines[i].trim(); 
            if (line.startsWith('|')) { 
                inTable = true; 
                const row = line.split('|').map(c => cleanForPdf(c)); 
                if (row[0] === '') row.shift(); 
                if (row[row.length-1] === '') row.pop(); 
                tableData.push(row); 
                continue; 
            } else if (inTable) { 
                renderTable(); 
                inTable = false; 
            } 
            if (!line) { y += 2; continue; } 
            if (line.startsWith('#')) { 
                checkPageBreak(20); 
                const level = line.match(/^#+/)?.[0].length || 1; 
                let text = line.replace(/^#+\s*/, ''); 
                text = cleanForPdf(text); 
                y += 5; 
                if (level === 1) { 
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(16); 
                    doc.setTextColor(0, 31, 63); 
                    doc.text(text.toUpperCase(), margin, y); 
                    doc.setLineWidth(0.5); 
                    doc.setDrawColor(0, 31, 63); 
                    doc.line(margin, y+2, margin+100, y+2); 
                    y += 10; 
                } else if (level === 2) { 
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(14); 
                    doc.setTextColor(0, 31, 63); 
                    doc.text(text, margin, y); 
                    y += 8; 
                } else { 
                    doc.setFont("helvetica", "bold"); 
                    doc.setFontSize(12); 
                    doc.setTextColor(50, 50, 50); 
                    doc.text(text, margin, y); 
                    y += 6; 
                } 
                continue; 
            } 
            if (line.startsWith('- ') || line.startsWith('* ')) { 
                let text = line.replace(/^[\-\*]\s*/, ''); 
                text = cleanForPdf(text); 
                doc.setFont("helvetica", "normal"); 
                doc.setFontSize(11); 
                doc.setTextColor(0, 0, 0); 
                doc.text("•", margin, y); 
                const textLines = doc.splitTextToSize(text, maxLineWidth - 10); 
                checkPageBreak(textLines.length * 5); 
                doc.text(textLines, margin + 6, y); 
                y += (textLines.length * 5) + 2; 
                continue; 
            } 
            const cleanLine = cleanForPdf(line); 
            if (cleanLine) { 
                doc.setFont("helvetica", "normal"); 
                doc.setFontSize(11); 
                doc.setTextColor(60, 60, 60); 
                const textLines = doc.splitTextToSize(cleanLine, maxLineWidth); 
                checkPageBreak(textLines.length * 5); 
                doc.text(textLines, margin, y); 
                y += (textLines.length * 5) + 3; 
            } 
        } 
        if (inTable) renderTable(); 
        doc.save("Habit_Tracker.pdf"); 
    };

    return ( 
        <div className="space-y-6"> 
            <div className="space-y-6 animate-in fade-in"> 
                <div> 
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Habit Goals & Preferences</label> 
                    <textarea value={preferences} onChange={e => setPreferences(e.target.value)} rows={4} placeholder="e.g. Wake up at 6 AM, Read 30 mins, No sugar, Gym 4x a week. I prefer a monthly layout." className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none" /> 
                </div> 
                <button onClick={handleGenerate} disabled={loading || !preferences} className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"> 
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Design Habit System 
                </button> 
                {result && ( 
                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200"> 
                        <div className="flex justify-between items-center mb-4"> 
                            <div className="flex bg-white rounded-lg p-1 border border-gray-200"> 
                                <button onClick={() => setViewMode('doc')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'doc' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Document View</button> 
                                <button onClick={() => setViewMode('raw')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'raw' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Raw Text</button> 
                            </div> 
                            <button onClick={downloadPDF} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold"> 
                                <Icon name="download" size={14}/> Export PDF 
                            </button> 
                        </div> 
                        {viewMode === 'doc' ? ( 
                            <div className="bg-white shadow-xl min-h-[600px] p-8 md:p-12 mx-auto max-w-[210mm] border-t-8 border-[#001F3F]"> 
                                {renderDocumentPreview(result)} 
                            </div> 
                        ) : ( 
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed bg-white p-4 rounded border">{result}</pre> 
                        )} 
                    </div> 
                )} 
            </div> 
        </div> 
    );
};

// 4. Finance Tracker
export const FinanceTracker = () => {
    const [mode, setMode] = useState('ai'); 
    const [viewMode, setViewMode] = useState('doc'); 
    const [aiInput, setAiInput] = useState(''); 
    const [aiResult, setAiResult] = useState(''); 
    const [loading, setLoading] = useState(false); 
    const [income, setIncome] = useState(''); 
    const [expenses, setExpenses] = useState([{ name: 'Rent', amount: '' }]); 
    
    const addExpense = () => setExpenses([...expenses, { name: '', amount: '' }]); 
    const updateExpense = (idx, field, val) => { const newExp = [...expenses]; newExp[idx][field] = val; setExpenses(newExp); }; 
    const handleAIGenerate = async () => { if (!aiInput) return; setLoading(true); try { const text = await generatePersonalFinanceTracker(aiInput); setAiResult(text); } catch (e) { console.error(e); } setLoading(false); }; 
    
    const renderDocumentPreview = (markdown) => { 
        if (!markdown) return null; 
        const lines = markdown.split('\n'); 
        let inTable = false; let tableHeader = []; let tableRows = []; 
        const renderedElements = []; 
        const flushTable = () => { if (tableHeader.length > 0) { renderedElements.push(<div key={`table-${renderedElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm"><table className="w-full text-sm text-left"><thead className="bg-[#001F3F] text-white"><tr>{tableHeader.map((h, i) => <th key={i} className="px-4 py-3 font-bold border-b border-gray-200">{h}</th>)}</tr></thead><tbody className="bg-white divide-y divide-gray-100">{tableRows.map((row, i) => (<tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>{row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{__html: cell.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '<br/>')}} />)}</tr>))}</tbody></table></div>); } inTable = false; tableHeader = []; tableRows = []; }; 
        lines.forEach((line, index) => { const trimmed = line.trim(); if (trimmed.startsWith('|')) { if (!inTable) { inTable = true; tableHeader = trimmed.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')); } else { if (trimmed.includes('---')) return; const row = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, '')); tableRows.push(row); } return; } else if (inTable) { flushTable(); } if (trimmed.startsWith('#')) { const level = trimmed.match(/^#+/)?.[0].length || 1; const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, ''); if (level === 1) { renderedElements.push(<h1 key={index} className="text-3xl font-bold text-[#001F3F] mt-8 mb-4 pb-2 border-b-2 border-[#001F3F]">{text}</h1>); } else if (level === 2) { renderedElements.push(<h2 key={index} className="text-xl font-bold text-[#001F3F] mt-6 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></span>{text}</h2>); } else { renderedElements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{text}</h3>); } return; } if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) { const text = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*/g, ''); renderedElements.push(<div key={index} className="flex gap-3 mb-2 ml-4"><span className="text-[#001F3F] font-bold mt-1.5 text-[6px]">●</span><p className="text-gray-700 leading-relaxed text-sm">{text}</p></div>); return; } if (trimmed) { const text = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); renderedElements.push(<p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: text}} />); } }); if (inTable) flushTable(); return renderedElements; };
    
    const downloadAIReport = () => { 
        if (!aiResult) return; 
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF(); 
        const pageWidth = doc.internal.pageSize.getWidth(); const pageHeight = doc.internal.pageSize.getHeight(); const margin = 20; const maxLineWidth = pageWidth - (margin * 2); let y = 20; const checkPageBreak = (needed) => { if (y + needed > pageHeight - margin) { doc.addPage(); y = 20; } }; 
        doc.setFillColor(0, 31, 63); doc.rect(0, 0, pageWidth, 40, 'F'); doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(255, 255, 255); doc.text("Personal Finance Plan", margin, 25); doc.setFontSize(10); doc.setTextColor(255, 215, 0); doc.text("AI-OPTIMIZED BUDGET & TRACKER", margin, 32); y = 55; 
        const cleanForPdf = (text) => { if (!text) return ""; return text.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '').trim(); }; 
        const lines = aiResult.split('\n'); 
        let inTable = false; let tableData = []; 
        const renderTable = () => { if (tableData.length === 0) return; const cleanRows = tableData.filter(row => !row.every(cell => cell.trim().match(/^[-:]+$/))); if (cleanRows.length === 0) return; const cols = cleanRows[0].length; const colWidth = maxLineWidth / cols; const rowHeight = 10; checkPageBreak(rowHeight * 2); doc.setFontSize(9); doc.setFont("helvetica", "normal"); cleanRows.forEach((row, i) => { const isHeader = i === 0; let maxRowHeight = rowHeight; const cellTexts = row.map(cell => doc.splitTextToSize(cleanForPdf(cell), colWidth - 4)); const maxLines = Math.max(...cellTexts.map(t => t.length)); maxRowHeight = Math.max(rowHeight, maxLines * 5 + 4); checkPageBreak(maxRowHeight); if (isHeader) { doc.setFillColor(230, 240, 250); doc.rect(margin, y, maxLineWidth, maxRowHeight, 'F'); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 31, 63); } else { doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60); } row.forEach((_, j) => { doc.setDrawColor(220, 220, 220); doc.rect(margin + (j * colWidth), y, colWidth, maxRowHeight); doc.text(cellTexts[j], margin + (j * colWidth) + 2, y + 5); }); y += maxRowHeight; }); y += 10; tableData = []; inTable = false; }; 
        for (let i = 0; i < lines.length; i++) { const line = lines[i].trim(); if (line.startsWith('|')) { inTable = true; const row = line.split('|').map(c => cleanForPdf(c)); if (row[0] === '') row.shift(); if (row[row.length-1] === '') row.pop(); tableData.push(row); continue; } else if (inTable) { renderTable(); inTable = false; } if (!line) { y += 2; continue; } if (line.startsWith('#')) { checkPageBreak(20); const level = line.match(/^#+/)?.[0].length || 1; let text = line.replace(/^#+\s*/, ''); text = cleanForPdf(text); y += 5; if (level === 1) { doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(0, 31, 63); doc.text(text.toUpperCase(), margin, y); doc.setLineWidth(0.5); doc.setDrawColor(0, 31, 63); doc.line(margin, y+2, margin+100, y+2); y += 10; } else if (level === 2) { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(0, 31, 63); doc.text(text, margin, y); y += 8; } else { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text(text, margin, y); y += 6; } continue; } if (line.startsWith('- ') || line.startsWith('* ')) { let text = line.replace(/^[\-\*]\s*/, ''); text = cleanForPdf(text); doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(0, 0, 0); doc.text("•", margin, y); const textLines = doc.splitTextToSize(text, maxLineWidth - 10); checkPageBreak(textLines.length * 5); doc.text(textLines, margin + 6, y); y += (textLines.length * 5) + 2; continue; } const cleanLine = cleanForPdf(line); if (cleanLine) { doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(60, 60, 60); const textLines = doc.splitTextToSize(cleanLine, maxLineWidth); checkPageBreak(textLines.length * 5); doc.text(textLines, margin, y); y += (textLines.length * 5) + 3; } } if (inTable) renderTable(); doc.save("Finance_Plan.pdf"); 
    };
    
    const downloadManualPDF = () => { 
        const { jsPDF } = window.jspdf; 
        const doc = new jsPDF(); 
        const totalExp = expenses.reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0); const net = (parseFloat(income) || 0) - totalExp; 
        doc.setFontSize(22); doc.setTextColor(0, 31, 63); doc.text("Monthly Budget Summary", 14, 20); doc.setFontSize(12); doc.text(`Total Income: $${income}`, 14, 40); doc.text(`Total Expenses: $${totalExp}`, 14, 50); doc.setFont("helvetica", "bold"); doc.text(`Net Balance: $${net}`, 14, 60); let y = 80; doc.setFont("helvetica", "bold"); doc.text("Expense Breakdown:", 14, y); y += 10; doc.setFont("helvetica", "normal"); expenses.forEach(exp => { if(exp.name) { doc.text(`${exp.name}: $${exp.amount || '0'}`, 14, y); y += 8; } }); doc.save("Finance_Tracker.pdf"); 
    };

    return ( 
        <div className="space-y-6"> 
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setMode('ai')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'ai' ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>AI System Architect</button>
                <button onClick={() => setMode('manual')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Manual Budget Calculator</button>
            </div> 
            {mode === 'ai' ? ( 
                <div className="space-y-6 animate-in fade-in"> 
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Paste Your Raw Finance Info</label>
                        <textarea value={aiInput} onChange={(e) => setAiInput(e.target.value)} rows={5} placeholder="e.g. Income: $5000/mo. Rent: $1200. Groceries: $400. Car: $300. Goals: Save for a house, pay off $5k credit card debt. Create a 50/30/20 budget plan." className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none" />
                    </div> 
                    <button onClick={handleAIGenerate} disabled={loading || !aiInput} className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50">{loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Organize My Finances</button> 
                    {aiResult && (<div className="bg-gray-100 p-4 rounded-xl border border-gray-200"><div className="flex justify-between items-center mb-4"><div className="flex bg-white rounded-lg p-1 border border-gray-200"><button onClick={() => setViewMode('doc')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'doc' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Document View</button><button onClick={() => setViewMode('raw')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'raw' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Raw Text</button></div><button onClick={downloadAIReport} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold"><Icon name="download" size={14}/> Export PDF</button></div>{viewMode === 'doc' ? (<div className="bg-white shadow-xl min-h-[600px] p-8 md:p-12 mx-auto max-w-[210mm] border-t-8 border-[#001F3F]">{renderDocumentPreview(aiResult)}</div>) : (<pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed bg-white p-4 rounded border">{aiResult}</pre>)}</div>)} 
                </div> 
            ) : ( 
                <div className="space-y-6 animate-in fade-in">
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Income</label><input value={income} onChange={e => setIncome(e.target.value)} type="number" placeholder="5000" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900" /></div>
                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-2">Expenses</label><div className="space-y-2 max-h-48 overflow-y-auto pr-2">{expenses.map((exp, i) => (<div key={i} className="flex gap-2"><input value={exp.name} onChange={e => updateExpense(i, 'name', e.target.value)} placeholder="Category (e.g. Rent)" className="flex-1 p-2 border border-gray-200 rounded bg-white text-gray-900" /><input value={exp.amount} onChange={e => updateExpense(i, 'amount', e.target.value)} placeholder="Amount" type="number" className="w-24 p-2 border border-gray-200 rounded bg-white text-gray-900" /></div>))}</div><button onClick={addExpense} className="mt-2 text-sm text-blue-600 font-bold hover:underline">+ Add Expense</button></div>
                    <button onClick={downloadManualPDF} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors"><Icon name="download" /> Generate Report</button>
                </div> 
            )} 
        </div> 
    );
};

// 5. Study Planner
export const StudyPlanner = () => {
    const [mode, setMode] = useState('ai');
    const [viewMode, setViewMode] = useState('doc');
    const [aiInput, setAiInput] = useState('');
    const [aiResult, setAiResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [subjects, setSubjects] = useState('');
    const [hours, setHours] = useState('');
    const [manualResult, setManualResult] = useState('');
    
    const handleAIGenerate = async () => {
        if (!aiInput) return;
        setLoading(true);
        try {
            const text = await generateStudyPlanner(aiInput);
            setAiResult(text);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const handleQuickGenerate = async () => {
        if (!subjects || !hours) return;
        setLoading(true);
        try {
            const text = await generateQuickStudyTable(subjects, hours);
            setManualResult(text);
        } catch(e) { console.error(e); }
        setLoading(false);
    };

    const renderDocumentPreview = (markdown) => {
        if (!markdown) return null;
        const lines = markdown.split('\n');
        let inTable = false;
        let tableHeader = [];
        let tableRows = [];
        const renderedElements = [];

        const flushTable = () => {
            if (tableHeader.length > 0) {
                renderedElements.push(
                    <div key={`table-${renderedElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#001F3F] text-white">
                                <tr>{tableHeader.map((h, i) => <th key={i} className="px-4 py-3 font-bold border-b border-gray-200">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {tableRows.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{__html: cell.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '<br/>')}} />)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
            inTable = false; tableHeader = []; tableRows = [];
        };

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('|')) {
                if (!inTable) { inTable = true; tableHeader = trimmed.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')); } 
                else { if (trimmed.includes('---')) return; const row = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, '')); tableRows.push(row); }
                return;
            } else if (inTable) flushTable();

            if (trimmed.startsWith('#')) {
                const level = trimmed.match(/^#+/)?.[0].length || 1;
                const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                if (level === 1) renderedElements.push(<h1 key={index} className="text-3xl font-bold text-[#001F3F] mt-8 mb-4 pb-2 border-b-2 border-[#001F3F]">{text}</h1>);
                else if (level === 2) renderedElements.push(<h2 key={index} className="text-xl font-bold text-[#001F3F] mt-6 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>{text}</h2>);
                else renderedElements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{text}</h3>);
                return;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const text = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*/g, '');
                renderedElements.push(<div key={index} className="flex gap-3 mb-2 ml-4"><span className="text-[#001F3F] font-bold mt-1.5 text-[6px]">●</span><p className="text-gray-700 leading-relaxed text-sm">{text}</p></div>);
                return;
            }
            if (trimmed) {
                const text = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                renderedElements.push(<p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: text}} />);
            }
        });
        if (inTable) flushTable();
        return renderedElements;
    };

    const downloadPDF = (content, filename) => {
        if (!content) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > pageHeight - margin) { doc.addPage(); y = 20; }
        };

        // Header
        doc.setFillColor(0, 31, 63); 
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(255, 255, 255);
        doc.text("Study Schedule", margin, 25);
        doc.setFontSize(10); doc.setTextColor(200, 230, 255);
        doc.text("OPTIMIZED FOR SUCCESS", margin, 32);
        y = 55;

        // Content Parsing
        const cleanForPdf = (text) => text.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
        const lines = content.split('\n');
        let inTable = false;
        let tableData = [];

        const renderTable = () => {
            if (tableData.length === 0) return;
            const cleanRows = tableData.filter(row => !row.every(cell => cell.trim().match(/^[-:]+$/)));
            if (cleanRows.length === 0) return;
            const cols = cleanRows[0].length;
            const colWidth = maxLineWidth / cols;
            const rowHeight = 10;
            
            checkPageBreak(rowHeight * 2);
            
            doc.setFontSize(9); doc.setFont("helvetica", "normal");
            cleanRows.forEach((row, i) => {
                const isHeader = i === 0;
                let maxRowHeight = rowHeight;
                const cellTexts = row.map(cell => doc.splitTextToSize(cleanForPdf(cell), colWidth - 4));
                const maxLines = Math.max(...cellTexts.map(t => t.length));
                maxRowHeight = Math.max(rowHeight, maxLines * 5 + 4);
                checkPageBreak(maxRowHeight);
                if (isHeader) { doc.setFillColor(240, 248, 255); doc.rect(margin, y, maxLineWidth, maxRowHeight, 'F'); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 31, 63); } 
                else { doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60); }
                row.forEach((_, j) => { doc.setDrawColor(220, 220, 220); doc.rect(margin + (j * colWidth), y, colWidth, maxRowHeight); doc.text(cellTexts[j], margin + (j * colWidth) + 2, y + 5); });
                y += maxRowHeight;
            });
            y += 10; tableData = []; inTable = false;
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|')) { inTable = true; const row = line.split('|').map(c => cleanForPdf(c)); if (row[0] === '') row.shift(); if (row[row.length-1] === '') row.pop(); tableData.push(row); continue; } 
            else if (inTable) { renderTable(); inTable = false; }
            if (!line) { y += 2; continue; }
            if (line.startsWith('#')) {
                checkPageBreak(20); const level = line.match(/^#+/)?.[0].length || 1; let text = line.replace(/^#+\s*/, ''); text = cleanForPdf(text); y += 5;
                if (level === 1) { doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(0, 31, 63); doc.text(text.toUpperCase(), margin, y); doc.setLineWidth(0.5); doc.setDrawColor(0, 31, 63); doc.line(margin, y+2, margin+100, y+2); y += 10; } 
                else if (level === 2) { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(0, 31, 63); doc.text(text, margin, y); y += 8; } 
                else { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text(text, margin, y); y += 6; }
                continue;
            }
            const cleanLine = cleanForPdf(line);
            if (cleanLine) { doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(60, 60, 60); const textLines = doc.splitTextToSize(cleanLine, maxLineWidth); checkPageBreak(textLines.length * 5); doc.text(textLines, margin, y); y += (textLines.length * 5) + 3; }
        }
        if (inTable) renderTable();
        doc.save(filename);
    };

    return (
        <div className="space-y-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
                <button onClick={() => setMode('ai')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'ai' ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>AI Study Architect</button>
                <button onClick={() => setMode('manual')} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'manual' ? 'bg-white text-[#001F3F] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Quick Timetable</button>
            </div>

            {mode === 'ai' ? (
                <div className="space-y-6 animate-in fade-in">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Describe Your Study Goals & Schedule</label>
                        <textarea 
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            rows={5}
                            placeholder="e.g. I have finals next week for Calculus, Physics, and History. I can study 4 hours a day. I need breaks. My goal is to get an A."
                            className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none"
                        />
                    </div>
                    
                    <button 
                        onClick={handleAIGenerate} 
                        disabled={loading || !aiInput}
                        className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Design Study Plan
                    </button>

                    {aiResult && (
                         <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                    <button onClick={() => setViewMode('doc')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'doc' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Document View</button>
                                    <button onClick={() => setViewMode('raw')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'raw' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Raw Text</button>
                                </div>
                                <button onClick={() => downloadPDF(aiResult, "Study_Masterplan.pdf")} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold">
                                    <Icon name="download" size={14}/> Export PDF
                                </button>
                            </div>
                            
                            {viewMode === 'doc' ? (
                                <div className="bg-white shadow-xl min-h-[600px] p-8 md:p-12 mx-auto max-w-[210mm] border-t-8 border-[#001F3F]">
                                    {renderDocumentPreview(aiResult)}
                                </div>
                            ) : (
                                <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed bg-white p-4 rounded border">{aiResult}</pre>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subjects / Topics</label>
                        <textarea value={subjects} onChange={e => setSubjects(e.target.value)} rows={3} placeholder="e.g. History, Math, Physics" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Available Hours / Day</label>
                        <input value={hours} onChange={e => setHours(e.target.value)} placeholder="e.g. 4 hours" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900" />
                    </div>
                    
                    <button 
                        onClick={handleQuickGenerate} 
                        disabled={loading || !subjects || !hours}
                        className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"
                    >
                        {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="table"/>} Generate Weekly Timetable
                    </button>

                    {manualResult && (
                         <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="font-bold text-[#001F3F]">Your Timetable</h4>
                                <button onClick={() => downloadPDF(manualResult, "Weekly_Timetable.pdf")} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold">
                                    <Icon name="download" size={14}/> Export PDF
                                </button>
                            </div>
                            <div className="bg-white shadow-xl p-8 border-t-8 border-[#001F3F]">
                                {renderDocumentPreview(manualResult)}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 6. Time Blocker
export const TimeBlocker = () => {
    const [tasks, setTasks] = useState('');
    const [hours, setHours] = useState('');
    const [priorities, setPriorities] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('doc');

    const handleGenerate = async () => {
        if (!tasks || !hours) return;
        setLoading(true);
        try {
            const text = await generateTimeBlocker(hours, priorities, tasks);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // Use the same renderer logic as StudyPlanner (Assuming StudyPlanner is defined in scope or imported)
    // For brevity, recreating essential parts of renderDocumentPreview here if needed, 
    // or assuming it's available. Since it's inside the same file in previous TS version, 
    // I will duplicate the renderer function or make it shared. 
    // Ideally, `renderDocumentPreview` should be extracted to a helper if used multiple times.
    // For this specific conversion, I'll assume we can reuse the logic.
    
    // DUPLICATING RENDERER FOR ISOLATION IN THIS COMPONENT SCOPE
    const renderDocumentPreview = (markdown) => {
        if (!markdown) return null;
        const lines = markdown.split('\n');
        let inTable = false;
        let tableHeader = [];
        let tableRows = [];
        const renderedElements = [];

        const flushTable = () => {
            if (tableHeader.length > 0) {
                renderedElements.push(
                    <div key={`table-${renderedElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#001F3F] text-white">
                                <tr>{tableHeader.map((h, i) => <th key={i} className="px-4 py-3 font-bold border-b border-gray-200">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {tableRows.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{__html: cell.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '<br/>')}} />)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
            inTable = false; tableHeader = []; tableRows = [];
        };

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('|')) {
                if (!inTable) { inTable = true; tableHeader = trimmed.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')); } 
                else { if (trimmed.includes('---')) return; const row = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, '')); tableRows.push(row); }
                return;
            } else if (inTable) flushTable();

            if (trimmed.startsWith('#')) {
                const level = trimmed.match(/^#+/)?.[0].length || 1;
                const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                if (level === 1) renderedElements.push(<h1 key={index} className="text-3xl font-bold text-[#001F3F] mt-8 mb-4 pb-2 border-b-2 border-[#001F3F]">{text}</h1>);
                else if (level === 2) renderedElements.push(<h2 key={index} className="text-xl font-bold text-[#001F3F] mt-6 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>{text}</h2>);
                else renderedElements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{text}</h3>);
                return;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const text = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*/g, '');
                renderedElements.push(<div key={index} className="flex gap-3 mb-2 ml-4"><span className="text-[#001F3F] font-bold mt-1.5 text-[6px]">●</span><p className="text-gray-700 leading-relaxed text-sm">{text}</p></div>);
                return;
            }
            if (trimmed) {
                const text = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                renderedElements.push(<p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: text}} />);
            }
        });
        if (inTable) flushTable();
        return renderedElements;
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > pageHeight - margin) { doc.addPage(); y = 20; }
        };

        // Header
        doc.setFillColor(0, 31, 63); 
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(255, 255, 255);
        doc.text("Time Blocking Plan", margin, 25);
        doc.setFontSize(10); doc.setTextColor(200, 230, 255);
        doc.text("OPTIMIZED PRODUCTIVITY SCHEDULE", margin, 32);
        y = 55;

        // Content Parsing
        const cleanForPdf = (text) => text.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
        const lines = result.split('\n');
        let inTable = false;
        let tableData = [];

        const renderTable = () => {
            if (tableData.length === 0) return;
            const cleanRows = tableData.filter(row => !row.every(cell => cell.trim().match(/^[-:]+$/)));
            if (cleanRows.length === 0) return;
            const cols = cleanRows[0].length;
            const colWidth = maxLineWidth / cols;
            const rowHeight = 10;
            
            // Fixed: Check space for header + 1 row instead of whole table to prevent empty pages
            checkPageBreak(rowHeight * 2);
            
            doc.setFontSize(9); doc.setFont("helvetica", "normal");
            cleanRows.forEach((row, i) => {
                const isHeader = i === 0;
                let maxRowHeight = rowHeight;
                const cellTexts = row.map(cell => doc.splitTextToSize(cleanForPdf(cell), colWidth - 4));
                const maxLines = Math.max(...cellTexts.map(t => t.length));
                maxRowHeight = Math.max(rowHeight, maxLines * 5 + 4);
                checkPageBreak(maxRowHeight);
                if (isHeader) { doc.setFillColor(240, 248, 255); doc.rect(margin, y, maxLineWidth, maxRowHeight, 'F'); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 31, 63); } 
                else { doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60); }
                row.forEach((_, j) => { doc.setDrawColor(220, 220, 220); doc.rect(margin + (j * colWidth), y, colWidth, maxRowHeight); doc.text(cellTexts[j], margin + (j * colWidth) + 2, y + 5); });
                y += maxRowHeight;
            });
            y += 10; tableData = []; inTable = false;
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|')) { inTable = true; const row = line.split('|').map(c => cleanForPdf(c)); if (row[0] === '') row.shift(); if (row[row.length-1] === '') row.pop(); tableData.push(row); continue; } 
            else if (inTable) { renderTable(); inTable = false; }
            if (!line) { y += 2; continue; }
            if (line.startsWith('#')) {
                checkPageBreak(20); const level = line.match(/^#+/)?.[0].length || 1; let text = line.replace(/^#+\s*/, ''); text = cleanForPdf(text); y += 5;
                if (level === 1) { doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(0, 31, 63); doc.text(text.toUpperCase(), margin, y); doc.setLineWidth(0.5); doc.setDrawColor(0, 31, 63); doc.line(margin, y+2, margin+100, y+2); y += 10; } 
                else if (level === 2) { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(0, 31, 63); doc.text(text, margin, y); y += 8; } 
                else { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text(text, margin, y); y += 6; }
                continue;
            }
            const cleanLine = cleanForPdf(line);
            if (cleanLine) { doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(60, 60, 60); const textLines = doc.splitTextToSize(cleanLine, maxLineWidth); checkPageBreak(textLines.length * 5); doc.text(textLines, margin, y); y += (textLines.length * 5) + 3; }
        }
        if (inTable) renderTable();
        doc.save("Time_Blocked_Schedule.pdf");
    };

    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Work Hours</label>
                    <input 
                        value={hours} 
                        onChange={e => setHours(e.target.value)} 
                        placeholder="e.g. 9am - 5pm" 
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Priorities</label>
                    <input 
                        value={priorities}
                        onChange={e => setPriorities(e.target.value)}
                        placeholder="Focus: Deep Work, Meetings" 
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900"
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Task List / Raw Notes</label>
                <textarea 
                    value={tasks} 
                    onChange={e => setTasks(e.target.value)} 
                    rows={5} 
                    placeholder="List your tasks, meetings, or rough schedule here..." 
                    className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none"
                />
            </div>
            <button 
                onClick={handleGenerate} 
                disabled={loading || !tasks}
                className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"
            >
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="clock"/>} Generate Schedule
            </button>
            {result && (
                <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                            <button onClick={() => setViewMode('doc')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'doc' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Document View</button>
                            <button onClick={() => setViewMode('raw')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'raw' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Raw Text</button>
                        </div>
                        <button onClick={downloadPDF} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold">
                            <Icon name="download" size={14}/> Export PDF
                        </button>
                    </div>
                    {viewMode === 'doc' ? (
                        <div className="bg-white shadow-xl min-h-[600px] p-8 md:p-12 mx-auto max-w-[210mm] border-t-8 border-[#001F3F]">
                            {renderDocumentPreview(result)}
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed bg-white p-4 rounded border">{result}</pre>
                    )}
                </div>
            )}
        </div>
    );
};

// 7. Meeting Notes Generator
export const MeetingNotesGenerator = () => {
    const [rawNotes, setRawNotes] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [viewMode, setViewMode] = useState('doc');

    const handleGenerate = async () => {
        if (!rawNotes) return;
        setLoading(true);
        try {
            const text = await generateMeetingMinutes(rawNotes);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    // --- Reuse Rich Document Renderer logic from above ---
    const renderDocumentPreview = (markdown) => {
        if (!markdown) return null;
        const lines = markdown.split('\n');
        let inTable = false;
        let tableHeader = [];
        let tableRows = [];
        const renderedElements = [];

        const flushTable = () => {
            if (tableHeader.length > 0) {
                renderedElements.push(
                    <div key={`table-${renderedElements.length}`} className="overflow-x-auto my-6 rounded-lg border border-gray-200 shadow-sm">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#001F3F] text-white">
                                <tr>{tableHeader.map((h, i) => <th key={i} className="px-4 py-3 font-bold border-b border-gray-200">{h}</th>)}</tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {tableRows.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700" dangerouslySetInnerHTML={{__html: cell.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '<br/>')}} />)}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            }
            inTable = false; tableHeader = []; tableRows = [];
        };

        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('|')) {
                if (!inTable) { inTable = true; tableHeader = trimmed.split('|').filter(c => c.trim()).map(c => c.trim().replace(/\*\*/g, '')); } 
                else { if (trimmed.includes('---')) return; const row = trimmed.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, '')); tableRows.push(row); }
                return;
            } else if (inTable) flushTable();

            if (trimmed.startsWith('#')) {
                const level = trimmed.match(/^#+/)?.[0].length || 1;
                const text = trimmed.replace(/^#+\s*/, '').replace(/\*\*/g, '');
                if (level === 1) renderedElements.push(<h1 key={index} className="text-3xl font-bold text-[#001F3F] mt-8 mb-4 pb-2 border-b-2 border-[#001F3F]">{text}</h1>);
                else if (level === 2) renderedElements.push(<h2 key={index} className="text-xl font-bold text-[#001F3F] mt-6 mb-3 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>{text}</h2>);
                else renderedElements.push(<h3 key={index} className="text-lg font-bold text-gray-800 mt-4 mb-2">{text}</h3>);
                return;
            }
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                const text = trimmed.replace(/^[\-\*]\s*/, '').replace(/\*\*/g, '');
                renderedElements.push(<div key={index} className="flex gap-3 mb-2 ml-4"><span className="text-[#001F3F] font-bold mt-1.5 text-[6px]">●</span><p className="text-gray-700 leading-relaxed text-sm">{text}</p></div>);
                return;
            }
            if (trimmed) {
                const text = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                renderedElements.push(<p key={index} className="text-gray-600 mb-3 leading-relaxed text-sm" dangerouslySetInnerHTML={{__html: text}} />);
            }
        });
        if (inTable) flushTable();
        return renderedElements;
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        const maxLineWidth = pageWidth - (margin * 2);
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > pageHeight - margin) { doc.addPage(); y = 20; }
        };

        // Header
        doc.setFillColor(0, 31, 63); 
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFont("helvetica", "bold"); doc.setFontSize(24); doc.setTextColor(255, 255, 255);
        doc.text("Meeting Minutes", margin, 25);
        doc.setFontSize(10); doc.setTextColor(200, 230, 255);
        doc.text("OFFICIAL RECORD", margin, 32);
        y = 55;

        // Content Parsing
        const cleanForPdf = (text) => text.replace(/(&lt;br&gt;|<br\s*\/?>|\\n)/gi, '\n').replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, '-').replace(/\*\*/g, '').replace(/__/g, '').replace(/\*/g, '').replace(/[^\x20-\x7E\n\r\t]/g, '').trim();
        const lines = result.split('\n');
        let inTable = false;
        let tableData = [];

        const renderTable = () => {
            if (tableData.length === 0) return;
            const cleanRows = tableData.filter(row => !row.every(cell => cell.trim().match(/^[-:]+$/)));
            if (cleanRows.length === 0) return;
            const cols = cleanRows[0].length;
            const colWidth = maxLineWidth / cols;
            const rowHeight = 10;
            
            checkPageBreak(rowHeight * 2);
            
            doc.setFontSize(9); doc.setFont("helvetica", "normal");
            cleanRows.forEach((row, i) => {
                const isHeader = i === 0;
                let maxRowHeight = rowHeight;
                const cellTexts = row.map(cell => doc.splitTextToSize(cleanForPdf(cell), colWidth - 4));
                const maxLines = Math.max(...cellTexts.map(t => t.length));
                maxRowHeight = Math.max(rowHeight, maxLines * 5 + 4);
                checkPageBreak(maxRowHeight);
                if (isHeader) { doc.setFillColor(240, 248, 255); doc.rect(margin, y, maxLineWidth, maxRowHeight, 'F'); doc.setFont("helvetica", "bold"); doc.setTextColor(0, 31, 63); } 
                else { doc.setFont("helvetica", "normal"); doc.setTextColor(60, 60, 60); }
                row.forEach((_, j) => { doc.setDrawColor(220, 220, 220); doc.rect(margin + (j * colWidth), y, colWidth, maxRowHeight); doc.text(cellTexts[j], margin + (j * colWidth) + 2, y + 5); });
                y += maxRowHeight;
            });
            y += 10; tableData = []; inTable = false;
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('|')) { inTable = true; const row = line.split('|').map(c => cleanForPdf(c)); if (row[0] === '') row.shift(); if (row[row.length-1] === '') row.pop(); tableData.push(row); continue; } 
            else if (inTable) { renderTable(); inTable = false; }
            if (!line) { y += 2; continue; }
            if (line.startsWith('#')) {
                checkPageBreak(20); const level = line.match(/^#+/)?.[0].length || 1; let text = line.replace(/^#+\s*/, ''); text = cleanForPdf(text); y += 5;
                if (level === 1) { doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.setTextColor(0, 31, 63); doc.text(text.toUpperCase(), margin, y); doc.setLineWidth(0.5); doc.setDrawColor(0, 31, 63); doc.line(margin, y+2, margin+100, y+2); y += 10; } 
                else if (level === 2) { doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(0, 31, 63); doc.text(text, margin, y); y += 8; } 
                else { doc.setFont("helvetica", "bold"); doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text(text, margin, y); y += 6; }
                continue;
            }
            const cleanLine = cleanForPdf(line);
            if (cleanLine) { doc.setFont("helvetica", "normal"); doc.setFontSize(11); doc.setTextColor(60, 60, 60); const textLines = doc.splitTextToSize(cleanLine, maxLineWidth); checkPageBreak(textLines.length * 5); doc.text(textLines, margin, y); y += (textLines.length * 5) + 3; }
        }
        if (inTable) renderTable();
        doc.save("Meeting_Minutes.pdf");
    };

    return (
        <div className="space-y-6">
            <div className="space-y-6 animate-in fade-in">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Raw Meeting Notes / Transcript</label>
                    <textarea 
                        value={rawNotes} 
                        onChange={e => setRawNotes(e.target.value)} 
                        rows={8} 
                        placeholder="Paste your rough meeting notes, transcript, or bullet points here..." 
                        className="w-full p-4 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-[#001F3F] bg-white text-gray-900 resize-none"
                    />
                </div>
                <button 
                    onClick={handleGenerate} 
                    disabled={loading || !rawNotes}
                    className="w-full bg-[#001F3F] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 transition-colors shadow-lg disabled:opacity-50"
                >
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Organize & Beautify Notes
                </button>
                {result && (
                    <div className="bg-gray-100 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex bg-white rounded-lg p-1 border border-gray-200">
                                <button onClick={() => setViewMode('doc')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'doc' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Document View</button>
                                <button onClick={() => setViewMode('raw')} className={`px-3 py-1.5 text-xs font-bold rounded ${viewMode === 'raw' ? 'bg-gray-100 text-[#001F3F]' : 'text-gray-500'}`}>Raw Text</button>
                            </div>
                            <button onClick={downloadPDF} className="text-xs bg-teal-50 border border-teal-200 px-3 py-1.5 rounded hover:bg-teal-100 flex items-center gap-1 text-teal-800 font-bold">
                                <Icon name="download" size={14}/> Export PDF
                            </button>
                        </div>
                        {viewMode === 'doc' ? (
                            <div className="bg-white shadow-xl min-h-[600px] p-8 md:p-12 mx-auto max-w-[210mm] border-t-8 border-[#001F3F]">
                                {renderDocumentPreview(result)}
                            </div>
                        ) : (
                            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono h-80 overflow-y-auto leading-relaxed bg-white p-4 rounded border">{result}</pre>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
