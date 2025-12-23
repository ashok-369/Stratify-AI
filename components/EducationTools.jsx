
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { 
    generateCheatSheet, 
    generateStudyNotes, 
    generateExamGuide, 
    generateQuestionBank, 
    generateAssignmentTemplate, 
    generateFlashcards 
} from '../services/geminiService.js';

const renderMarkdown = (text) => {
    if (!text) return null;
    
    // Pre-processing cleanup
    let html = text.trim();

    // 1. Blockquotes (Callouts)
    html = html.replace(/^>\s+(.*$)/gim, '<div class="border-l-4 border-indigo-500 bg-indigo-50 p-4 my-6 rounded-r-lg text-indigo-900 text-sm font-medium shadow-sm flex gap-3"><span class="text-xl">💡</span><div>$1</div></div>');

    // 2. Headers
    html = html
        .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-800 mt-6 mb-3 flex items-center gap-2"><span class="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-indigo-900 mt-8 mb-4 border-b-2 border-indigo-100 pb-2 tracking-tight">$1</h2>')
        .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-8 text-center">$1</h1>');

    // 3. Bold & Italic & Code
    html = html
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 bg-yellow-50 px-1 rounded border border-yellow-100">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="text-slate-600 italic font-serif">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-slate-100 text-pink-600 font-mono text-xs px-1.5 py-0.5 rounded border border-slate-200">$1</code>');

    // 4. Lists
    // Handle unordered lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="flex gap-3 mb-2 text-slate-700 leading-relaxed"><span class="text-indigo-400 font-bold mt-1.5 text-xs">●</span><span>$1</span></li>');
    // Handle ordered lists
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li class="flex gap-3 mb-2 text-slate-700 leading-relaxed group"><span class="text-indigo-600 font-bold bg-indigo-50 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 group-hover:bg-indigo-100 transition-colors">#</span><span>$1</span></li>');

    // Wrap lists in container (Simple heuristic)
    html = html.replace(/((<li.*<\/li>\s*)+)/g, '<ul class="my-6 pl-2">$1</ul>');

    // 5. Horizontal Rule
    html = html.replace(/^---$/gim, '<hr class="my-8 border-slate-200 border-dashed" />');

    // 6. Tables
    if (html.includes('|')) {
        // Remove markdown table divider rows like |---|---|
        html = html.replace(/\|[\s-]+\|[\s-]+\|/g, ''); 
        
        html = html.replace(/\|(.+)\|/g, (match) => {
            const cells = match.split('|').filter(c => c.trim() !== '');
            return `<tr class="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors">${cells.map(c => `<td class="p-3 text-sm text-slate-700">${c.trim()}</td>`).join('')}</tr>`;
        });
        // Wrap rows in table
        html = html.replace(/((<tr.*<\/tr>\s*)+)/g, '<div class="overflow-x-auto my-8 rounded-xl border border-slate-200 shadow-sm bg-white"><table class="w-full text-left border-collapse">$1</table></div>');
    }

    // 7. Newlines to <br> (for text blocks that weren't lists/headers)
    html = html.replace(/\n\n/g, '<div class="h-4"></div>');
    html = html.replace(/\n/g, ' '); // Collapse single newlines in paragraphs

    return html;
};

const DownloadButton = ({ content, filename, title }) => {
    const cleanTextForPdf = (text) => {
        return text
            .replace(/[^\x00-\x7F]/g, (char) => {
                switch (char) {
                    case '’': return "'";
                    case '‘': return "'";
                    case '“': return '"';
                    case '”': return '"';
                    case '–': return '-';
                    case '—': return '-';
                    case '…': return '...';
                    case '•': return '*';
                    default: return '';
                }
            })
            .replace(/\*\*/g, '')  // Remove bold markers
            .replace(/\*/g, '')    // Remove italic markers
            .replace(/`/g, '')     // Remove code markers
            .trim();
    };

    const handleDownload = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const height = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = 20;

        // --- Styles ---
        const colors = {
            primary: [15, 23, 42],    // Slate 900 (Navy)
            secondary: [51, 65, 85],  // Slate 700
            accent: [79, 70, 229],    // Indigo 600
            text: [30, 41, 59],       // Slate 800
            lightText: [100, 116, 139], // Slate 500
            bgLight: [248, 250, 252]  // Slate 50
        };

        const checkPageBreak = (needed) => {
            if (y + needed > height - margin) {
                doc.addPage();
                y = 20; // New page starting Y
            }
        };

        // --- Header ---
        doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
        doc.rect(0, 0, width, 40, 'F');
        
        // Brand/Title
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text((title || "Document").toUpperCase(), margin, 20); 
        
        // Subtitle / Date / Context
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(203, 213, 225); // Slate 300
        const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        doc.text(`Generated by Stratify AI  |  ${dateStr}`, margin, 30);

        // Accent Strip
        doc.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
        doc.rect(0, 40, width, 2, 'F');

        y = 60; // Content Start Y

        // --- Content Parser ---
        const lines = content.split('\n');
        let tableBuffer = [];

        const renderTable = () => {
            if (tableBuffer.length === 0) return;

            // Remove delimiter rows (e.g. |---|---|)
            const cleanRows = tableBuffer.filter(row => !row.match(/^\|\s*[-:]+[-|\s:]*\|$/) && !row.match(/^\|\s*[-]+\s*\|$/));
            
            if (cleanRows.length === 0) {
                tableBuffer = [];
                return;
            }

            const availableWidth = width - (margin * 2);
            
            // Parse headers and body
            const headers = cleanRows[0].split('|').map(c => cleanTextForPdf(c)).filter((c, i, arr) => i !== 0 && i !== arr.length - 1);
            const body = cleanRows.slice(1).map(row => row.split('|').map(c => cleanTextForPdf(c)).filter((c, i, arr) => i !== 0 && i !== arr.length - 1));

            if (headers.length === 0) {
                tableBuffer = [];
                return;
            }

            const colWidth = availableWidth / headers.length;
            const minRowHeight = 10;

            checkPageBreak(minRowHeight * 2);

            // Draw Header Row
            doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
            doc.setDrawColor(226, 232, 240); // Slate 200
            doc.rect(margin, y, availableWidth, minRowHeight, 'FD');
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);

            headers.forEach((header, i) => {
                const x = margin + (i * colWidth);
                doc.text(header, x + 3, y + 6.5);
            });
            
            y += minRowHeight;

            // Draw Body Rows
            doc.setFont("helvetica", "normal");
            doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

            body.forEach((row, rowIndex) => {
                let maxCellHeight = minRowHeight;
                const cellTexts = [];

                row.forEach((cell, i) => {
                    const textLines = doc.splitTextToSize(cell, colWidth - 6);
                    cellTexts.push(textLines);
                    const cellHeight = (textLines.length * 4) + 6;
                    if (cellHeight > maxCellHeight) maxCellHeight = cellHeight;
                });

                checkPageBreak(maxCellHeight);

                // Alternating row color
                if (rowIndex % 2 === 1) {
                    doc.setFillColor(250, 250, 250);
                    doc.rect(margin, y, availableWidth, maxCellHeight, 'F');
                }

                // Grid lines
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.1);
                
                row.forEach((_, i) => {
                    const x = margin + (i * colWidth);
                    doc.rect(x, y, colWidth, maxCellHeight);
                    if (cellTexts[i]) {
                        doc.text(cellTexts[i], x + 3, y + 5);
                    }
                });

                y += maxCellHeight;
            });

            y += 8; // Margin after table
            tableBuffer = [];
        };
        
        lines.forEach((line) => {
            const rawLine = line.trim();
            
            // Table Detection
            if (rawLine.startsWith('|')) {
                tableBuffer.push(rawLine);
                return;
            } else {
                if (tableBuffer.length > 0) renderTable();
            }

            if(!rawLine) {
                y += 4;
                return;
            }

            const cleanLine = cleanTextForPdf(rawLine);

            // Special Handling for "Answer Key" to force new page
            if (cleanLine.toLowerCase().includes('answer key') && (rawLine.startsWith('#') || rawLine.startsWith('**'))) {
                doc.addPage();
                y = 20;
            }

            // H1 (#)
            if (rawLine.startsWith('# ')) {
                checkPageBreak(25);
                const text = cleanLine.replace(/^#\s*/, '');
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(18);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text(text, margin, y);
                
                // Underline
                doc.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                doc.setLineWidth(0.5);
                doc.line(margin, y + 3, width - margin, y + 3);
                
                y += 15;
            } 
            // H2 (##)
            else if (rawLine.startsWith('## ')) {
                checkPageBreak(20);
                const text = cleanLine.replace(/^##\s*/, '');
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
                doc.text(text.toUpperCase(), margin, y);
                y += 10;
            } 
            // H3 (###)
            else if (rawLine.startsWith('### ')) {
                checkPageBreak(15);
                const text = cleanLine.replace(/^###\s*/, '');
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
                doc.text(text, margin, y);
                y += 8;
            } 
            // Question Options (A. B. C. D. or a) b) etc)
            else if (rawLine.match(/^[A-Da-d][\.\)]\s/)) {
                checkPageBreak(8);
                
                const match = rawLine.match(/^([A-Da-d][\.\)])\s+(.*)/);
                const label = match ? match[1] : '';
                const text = match ? match[2] : cleanLine;

                // Indent options
                const indent = 12;
                
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                doc.text(label, margin + 5, y); // Small indent for label

                doc.setFont("helvetica", "normal");
                doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
                const splitText = doc.splitTextToSize(text, width - margin * 2 - indent);
                doc.text(splitText, margin + indent, y);
                
                y += (splitText.length * 5) + 2;
            }
            // Numbered Lists (Questions)
            else if (rawLine.match(/^\d+\.\s/)) {
               const match = rawLine.match(/^(\d+)\.\s+(.*)/);
               const num = match ? match[1] : '1';
               const text = cleanLine.replace(/^\d+\.\s*/, '');
               
               // Extra spacing before new question
               y += 4;
               checkPageBreak(12);
               
               // Draw number pill
               doc.setFillColor(colors.bgLight[0], colors.bgLight[1], colors.bgLight[2]);
               doc.roundedRect(margin, y - 4, 8, 6, 1, 1, 'F');

               doc.setFont("helvetica", "bold");
               doc.setFontSize(10);
               doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
               doc.text(`${num}.`, margin + 1.5, y);
               
               doc.setFont("helvetica", "bold"); // Bold question text
               doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
               const splitText = doc.splitTextToSize(text, width - margin * 2 - 12);
               doc.text(splitText, margin + 12, y);
               y += (splitText.length * 5) + 3;
            }
            // Bullet Lists (- or *)
            else if (rawLine.match(/^[-*]\s/)) {
                const text = cleanLine.replace(/^[-*]\s*/, '');
                checkPageBreak(8);
                
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
                
                // Draw Custom Bullet
                doc.setFillColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
                doc.circle(margin + 2, y - 1.5, 1, 'F');
                
                const splitText = doc.splitTextToSize(text, width - margin * 2 - 8);
                doc.text(splitText, margin + 8, y);
                y += (splitText.length * 5) + 2;
            }
            // Regular Paragraph
            else {
                checkPageBreak(10);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(10);
                doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
                
                const splitText = doc.splitTextToSize(cleanLine, width - margin * 2);
                doc.text(splitText, margin, y);
                y += (splitText.length * 5) + 3;
            }
        });

        // Flush any remaining table
        if (tableBuffer.length > 0) renderTable();

        // --- Footer with Page Numbers ---
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            
            // Footer Line
            doc.setDrawColor(226, 232, 240);
            doc.setLineWidth(0.5);
            doc.line(margin, height - 15, width - margin, height - 15);

            doc.setFontSize(8);
            doc.setTextColor(148, 163, 184); // Slate 400
            
            // Left footer text
            doc.text("Confidential - Internal Use", margin, height - 10);
            
            // Right footer text
            doc.text(`Page ${i} of ${pageCount}`, width - margin, height - 10, { align: 'right' });
        }

        doc.save(filename);
    };

    return (
        <button onClick={handleDownload} className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors shadow-md transform hover:-translate-y-0.5">
            <Icon name="download" size={14} /> Download PDF
        </button>
    );
};

// ... (Rest of component exports: CheatSheetTool, StudyNotesTool, etc. remain unchanged)
export const CheatSheetTool = () => {
    const [inputType, setInputType] = useState('text');
    const [rawContent, setRawContent] = useState('');
    const [fileData, setFileData] = useState(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            alert('Please upload a PDF or Image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = (evt.target?.result).split(',')[1];
            setFileData({
                name: file.name,
                mimeType: file.type,
                data: base64
            });
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (inputType === 'text' && !rawContent) return;
        if (inputType === 'file' && !fileData) return;

        setLoading(true);
        try {
            // Pass either text or file object to service
            const input = inputType === 'text' ? rawContent : fileData;
            const text = await generateCheatSheet(input);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-[80vh]">
            <div className="lg:col-span-4 flex flex-col h-full space-y-4">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 h-full flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                            <Icon name="table" className="text-indigo-600"/> Cheat Sheet Builder
                        </h3>
                        <p className="text-xs text-indigo-700/70 mt-1">
                            Paste notes or upload a PDF/Image. AI will structure it into a high-density, printable summary page.
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex bg-white rounded-lg p-1 border border-indigo-100 mb-4 shadow-sm">
                        <button 
                            onClick={() => setInputType('text')}
                            className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}
                        >
                            <Icon name="file-text" size={14} /> Paste Text
                        </button>
                        <button 
                            onClick={() => setInputType('file')}
                            className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'file' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}
                        >
                            <Icon name="upload" size={14} /> Upload PDF
                        </button>
                    </div>
                    
                    {inputType === 'text' ? (
                        <textarea 
                            value={rawContent} 
                            onChange={e => setRawContent(e.target.value)} 
                            placeholder="Paste your raw notes here...&#10;&#10;Example:&#10;Pythagoras theorem is a^2 + b^2 = c^2. Speed is distance over time. Newton's second law is F=ma..." 
                            className="flex-grow w-full p-4 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 resize-none text-sm shadow-inner placeholder:text-indigo-200" 
                        />
                    ) : (
                        <div className="flex-grow flex flex-col gap-4">
                            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 transition-colors cursor-pointer relative bg-white flex-1">
                                <input type="file" onChange={handleFileSelect} accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                                <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600 group-hover:scale-110 transition-transform">
                                    <Icon name="file-up" size={32} />
                                </div>
                                <p className="font-bold text-indigo-900">Click to upload or drag & drop</p>
                                <p className="text-xs text-indigo-400 mt-2">PDF, PNG, JPG (Max 10MB)</p>
                            </div>
                            
                            {fileData && (
                                <div className="bg-white p-3 rounded-lg border border-indigo-200 flex items-center gap-3 shadow-sm animate-fade-in-up">
                                    <div className="bg-red-50 p-2 rounded text-red-500">
                                        <Icon name={fileData.mimeType.includes('pdf') ? 'file-text' : 'image'} size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-slate-700 truncate">{fileData.name}</p>
                                        <p className="text-[10px] text-slate-400 uppercase">{fileData.mimeType.split('/')[1]}</p>
                                    </div>
                                    <div className="text-emerald-500">
                                        <Icon name="check-circle" size={16} />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <button 
                        onClick={handleGenerate} 
                        disabled={loading || (inputType === 'text' ? !rawContent : !fileData)} 
                        className="mt-4 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} 
                        {loading ? 'Analyzing Content...' : 'Generate Cheat Sheet'}
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8 h-full overflow-hidden flex flex-col bg-slate-100 rounded-2xl border border-slate-200 relative">
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Icon name="file-text" size={14} /> Live Preview
                    </span>
                    {result && <DownloadButton content={result} filename="Cheat_Sheet.pdf" title="Cheat Sheet" />}
                </div>
                
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {result ? (
                        <div className="bg-white shadow-2xl min-h-[800px] w-full max-w-[210mm] mx-auto p-12 rounded-sm border-t-8 border-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="prose prose-indigo prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) || '' }} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
                            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center animate-pulse">
                                <Icon name="layout" size={32} className="opacity-50" />
                            </div>
                            <p className="text-sm font-medium">Your generated sheet will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 2. Study Notes Tool ---
export const StudyNotesTool = () => {
    const [inputType, setInputType] = useState('text');
    const [rawContent, setRawContent] = useState('');
    const [fileData, setFileData] = useState(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            alert('Please upload a PDF or Image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (evt) => {
            const base64 = (evt.target?.result).split(',')[1];
            setFileData({ name: file.name, mimeType: file.type, data: base64 });
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (inputType === 'text' && !rawContent) return;
        if (inputType === 'file' && !fileData) return;
        setLoading(true);
        try {
            const input = inputType === 'text' ? rawContent : fileData;
            const text = await generateStudyNotes(input);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-[80vh]">
            <div className="lg:col-span-4 flex flex-col h-full space-y-4">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 h-full flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2"><Icon name="book" className="text-indigo-600"/> Study Notes Maker</h3>
                        <p className="text-xs text-indigo-700/70 mt-1">Clean, structured notes from messy input or slides.</p>
                    </div>
                    
                    <div className="flex bg-white rounded-lg p-1 border border-indigo-100 mb-4 shadow-sm">
                        <button onClick={() => setInputType('text')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}><Icon name="file-text" size={14} /> Text</button>
                        <button onClick={() => setInputType('file')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'file' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}><Icon name="upload" size={14} /> Upload</button>
                    </div>

                    {inputType === 'text' ? (
                        <textarea value={rawContent} onChange={e => setRawContent(e.target.value)} placeholder="Paste class notes or text here..." className="flex-grow w-full p-4 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 resize-none text-sm shadow-inner placeholder:text-indigo-200" />
                    ) : (
                        <div className="flex-grow flex flex-col gap-4">
                            <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 transition-colors cursor-pointer relative bg-white flex-1">
                                <input type="file" onChange={handleFileSelect} accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                                <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600"><Icon name="file-up" size={32} /></div>
                                <p className="font-bold text-indigo-900">Upload Source Material</p>
                            </div>
                            {fileData && <div className="bg-white p-3 rounded-lg border border-indigo-200 flex items-center gap-3 shadow-sm"><Icon name="check-circle" size={16} className="text-emerald-500"/><span className="text-xs font-bold text-slate-700 truncate flex-1">{fileData.name}</span></div>}
                        </div>
                    )}

                    <button onClick={handleGenerate} disabled={loading || (inputType === 'text' ? !rawContent : !fileData)} className="mt-4 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                        {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Generate Notes
                    </button>
                </div>
            </div>

            <div className="lg:col-span-8 h-full overflow-hidden flex flex-col bg-slate-100 rounded-2xl border border-slate-200 relative">
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Icon name="file-text" size={14} /> Notes Preview</span>
                    {result && <DownloadButton content={result} filename="Study_Notes.pdf" title="Study Notes" />}
                </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    {result ? (
                        <div className="bg-white shadow-2xl min-h-[800px] w-full max-w-[210mm] mx-auto p-12 rounded-sm border-t-8 border-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="prose prose-indigo prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) || '' }} />
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4"><Icon name="book-open" size={48} className="opacity-20" /><p className="text-sm font-medium">Notes will appear here</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- 3. Exam Guide Tool ---
export const ExamGuideTool = () => {
    const [inputType, setInputType] = useState('text');
    const [rawContent, setRawContent] = useState('');
    const [fileData, setFileData] = useState(null);
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) { alert('Please upload a PDF or Image file.'); return; }
        const reader = new FileReader();
        reader.onload = (evt) => { const base64 = (evt.target?.result).split(',')[1]; setFileData({ name: file.name, mimeType: file.type, data: base64 }); };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        if (inputType === 'text' && !rawContent) return;
        if (inputType === 'file' && !fileData) return;
        setLoading(true);
        try {
            const input = inputType === 'text' ? rawContent : fileData;
            const text = await generateExamGuide(input);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 h-[80vh]">
            <div className="lg:col-span-4 flex flex-col h-full space-y-4">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 h-full flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2"><Icon name="target" className="text-indigo-600"/> Exam Prep Guide</h3>
                        <p className="text-xs text-indigo-700/70 mt-1">Create a strategic study guide and plan for upcoming exams.</p>
                    </div>
                    <div className="flex bg-white rounded-lg p-1 border border-indigo-100 mb-4 shadow-sm">
                        <button onClick={() => setInputType('text')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'text' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}><Icon name="file-text" size={14} /> Text</button>
                        <button onClick={() => setInputType('file')} className={`flex-1 py-2 text-xs font-bold rounded-md flex items-center justify-center gap-2 transition-all ${inputType === 'file' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-indigo-50'}`}><Icon name="upload" size={14} /> Upload</button>
                    </div>
                    {inputType === 'text' ? ( <textarea value={rawContent} onChange={e => setRawContent(e.target.value)} placeholder="Paste syllabus or topic list here..." className="flex-grow w-full p-4 border border-indigo-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-slate-700 resize-none text-sm shadow-inner placeholder:text-indigo-200" /> ) : ( <div className="flex-grow flex flex-col gap-4"> <div className="border-2 border-dashed border-indigo-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 transition-colors cursor-pointer relative bg-white flex-1"> <input type="file" onChange={handleFileSelect} accept="application/pdf,image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" /> <div className="bg-indigo-100 p-4 rounded-full mb-4 text-indigo-600"><Icon name="file-up" size={32} /></div> <p className="font-bold text-indigo-900">Upload Syllabus/Notes</p> </div> {fileData && <div className="bg-white p-3 rounded-lg border border-indigo-200 flex items-center gap-3 shadow-sm"><Icon name="check-circle" size={16} className="text-emerald-500"/><span className="text-xs font-bold text-slate-700 truncate flex-1">{fileData.name}</span></div>} </div> )}
                    <button onClick={handleGenerate} disabled={loading || (inputType === 'text' ? !rawContent : !fileData)} className="mt-4 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-500/25 disabled:opacity-70 disabled:cursor-not-allowed"> {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="wand"/>} Generate Guide </button>
                </div>
            </div>
            <div className="lg:col-span-8 h-full overflow-hidden flex flex-col bg-slate-100 rounded-2xl border border-slate-200 relative">
                <div className="bg-white border-b border-slate-200 p-4 flex justify-between items-center shadow-sm z-10"> <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><Icon name="file-text" size={14} /> Guide Preview</span> {result && <DownloadButton content={result} filename="Exam_Guide.pdf" title="Exam Preparation Guide" />} </div>
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar"> {result ? ( <div className="bg-white shadow-2xl min-h-[800px] w-full max-w-[210mm] mx-auto p-12 rounded-sm border-t-8 border-indigo-500 animate-in fade-in slide-in-from-bottom-4 duration-700"> <div className="prose prose-indigo prose-sm max-w-none font-sans" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) || '' }} /> </div> ) : ( <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4"><Icon name="target" size={48} className="opacity-20" /><p className="text-sm font-medium">Guide will appear here</p></div> )} </div>
            </div>
        </div>
    );
};

// --- 4. Question Bank ---
export const QuestionBankTool = () => {
    const [subject, setSubject] = useState('');
    const [chapter, setChapter] = useState('');
    const [type, setType] = useState('Multiple Choice');
    const [count, setCount] = useState('20');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const text = await generateQuestionBank(subject, chapter, type, count);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subject</label>
                        <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Chemistry" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic / Chapter</label>
                        <input value={chapter} onChange={e => setChapter(e.target.value)} placeholder="Periodic Table" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white" />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Question Type</label>
                        <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white">
                            <option>Multiple Choice</option>
                            <option>Short Answer</option>
                            <option>Long Essay</option>
                            <option>True/False</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Count</label>
                        <select value={count} onChange={e => setCount(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white">
                            <option>10</option>
                            <option>20</option>
                            <option>50</option>
                            <option>100</option>
                        </select>
                    </div>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="help-circle"/>} Generate Questions
                </button>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto max-h-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-500 uppercase text-xs">Preview</h3>
                    {result && <DownloadButton content={result} filename="Question_Bank.pdf" title="Question Bank" />}
                </div>
                {result ? (
                    <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) || '' }} />
                ) : <div className="text-gray-400 text-center mt-20">Output will appear here...</div>}
            </div>
        </div>
    );
};

// --- 5. Assignment Template ---
export const AssignmentTemplateTool = () => {
    const [type, setType] = useState('Essay');
    const [topic, setTopic] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const text = await generateAssignmentTemplate(type, topic);
            setResult(text);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Assignment Type</label>
                    <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white">
                        <option>Essay</option>
                        <option>Research Report</option>
                        <option>Case Study Analysis</option>
                        <option>Lab Report</option>
                        <option>Thesis Proposal</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic / Prompt</label>
                    <textarea value={topic} onChange={e => setTopic(e.target.value)} rows={4} placeholder="e.g. The Impact of AI on Global Economics" className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white resize-none" />
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="layout"/>} Create Outline
                </button>
            </div>
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto max-h-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-500 uppercase text-xs">Structure</h3>
                    {result && <DownloadButton content={result} filename="Assignment_Outline.pdf" title="Assignment Outline" />}
                </div>
                {result ? (
                    <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: renderMarkdown(result) || '' }} />
                ) : <div className="text-gray-400 text-center mt-20">Output will appear here...</div>}
            </div>
        </div>
    );
};

// --- 6. Flashcard Generator ---
export const FlashcardTool = () => {
    const [topic, setTopic] = useState('');
    const [count, setCount] = useState('8');
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [flippedIndex, setFlippedIndex] = useState(null);

    const handleGenerate = async () => {
        if (!topic) return;
        setLoading(true);
        try {
            const data = await generateFlashcards(topic, count);
            setCards(data);
            setFlippedIndex(null); // Reset flips
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        // @ts-ignore
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        let y = 20;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Flashcards: " + topic, 20, y);
        y += 15;

        cards.forEach((card, i) => {
            if (y > 250) { doc.addPage(); y = 20; }
            doc.setFillColor(245, 247, 250);
            doc.rect(20, y, 170, 30, 'F');
            doc.setDrawColor(200, 200, 200);
            doc.rect(20, y, 170, 30, 'S');
            
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            doc.text(`Q: ${card.front}`, 25, y + 10);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            const splitBack = doc.splitTextToSize(`A: ${card.back}`, 160);
            doc.text(splitBack, 25, y + 20);
            
            y += 35;
        });
        
        doc.save(`${topic.replace(/\s/g, '_')}_Flashcards.pdf`);
    };

    const handleFlip = (index) => {
        setFlippedIndex(flippedIndex === index ? null : index);
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 h-full">
            
            {/* Custom Styles for 3D Transform */}
            <style>{`
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotate-y-180 { transform: rotateY(180deg); }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
            `}</style>

            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Topic</label>
                    <input 
                        value={topic} 
                        onChange={e => setTopic(e.target.value)} 
                        placeholder="e.g. Spanish Vocabulary, Cell Biology" 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white" 
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Number of Cards</label>
                    <select 
                        value={count} 
                        onChange={e => setCount(e.target.value)} 
                        className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                    >
                        <option value="5">5 Cards</option>
                        <option value="8">8 Cards</option>
                        <option value="12">12 Cards</option>
                        <option value="15">15 Cards</option>
                        <option value="20">20 Cards</option>
                    </select>
                </div>
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="layers"/>} Generate Cards
                </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 overflow-y-auto max-h-[600px] relative">
                <div className="flex justify-between items-center mb-6 sticky top-0 bg-gray-50 pb-2 z-10 border-b border-gray-200/50">
                    <h3 className="font-bold text-gray-500 uppercase text-xs">{cards.length > 0 ? `${cards.length} Cards Generated` : 'Preview'}</h3>
                    {cards.length > 0 && (
                        <button onClick={downloadPDF} className="flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                            <Icon name="download" size={14} /> PDF
                        </button>
                    )}
                </div>
                
                {cards.length > 0 ? (
                    <div className="grid gap-6">
                        {cards.map((card, i) => (
                            <div 
                                key={i} 
                                onClick={() => handleFlip(i)}
                                className="group perspective-1000 w-full h-48 cursor-pointer"
                            >
                                <div className={`relative w-full h-full text-center transition-all duration-700 transform-style-3d shadow-sm rounded-xl border border-gray-200 ${flippedIndex === i ? 'rotate-y-180' : ''}`}>
                                    
                                    {/* Front Face */}
                                    <div className="absolute inset-0 w-full h-full bg-white rounded-xl backface-hidden flex flex-col items-center justify-center p-6 shadow-sm">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Question</span>
                                        <h4 className="text-lg font-bold text-slate-800 leading-snug">{card.front}</h4>
                                        <div className="absolute bottom-3 text-xs text-gray-300 flex items-center gap-1">
                                            <Icon name="redo" size={12} /> Click to flip
                                        </div>
                                    </div>

                                    {/* Back Face */}
                                    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl backface-hidden rotate-y-180 flex flex-col items-center justify-center p-6 shadow-md border border-blue-100">
                                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3">Answer</span>
                                        <p className="text-slate-700 font-medium leading-relaxed">{card.back}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-400 text-center mt-20 italic flex flex-col items-center gap-2">
                        <Icon name="layers" size={32} className="opacity-20" />
                        <p>Cards will appear here...</p>
                    </div>
                )}
            </div>
        </div>
    );
};
