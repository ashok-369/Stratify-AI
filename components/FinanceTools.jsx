
import React, { useState } from 'react';
import { Icon } from './Icon.jsx';
import { 
    generateTaxComputation, 
    generateInvestmentAnalysis, 
    generateBudgetPlan, 
    generateComplianceChecklist, 
    generateAuditChecklist, 
    generateInvoiceTemplate 
} from '../services/geminiService.js';

// Helper for generic text cleaning for PDF
const cleanText = (text) => {
    if (!text) return "";
    return text
        .replace(/\*\*/g, '')
        .replace(/^[\*\-]\s*/gm, '')
        .replace(/₹/g, 'Rs. ')
        .replace(/€/g, 'EUR ')
        .replace(/£/g, 'GBP ')
        .trim();
};

// Helper to render markdown bold in UI
const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return null;
    
    // Split by newlines first to handle paragraphs
    const lines = text.split('\n');
    
    return (
        <div className="space-y-2">
            {lines.map((line, lineIndex) => {
                if (!line.trim()) return null;
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <div key={lineIndex} className="text-sm leading-relaxed">
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
                            }
                            // Clean leading list markers
                            return <span key={i}>{part.replace(/^[\*\-]\s+/, '')}</span>;
                        })}
                    </div>
                );
            })}
        </div>
    );
};

// Helper to parse markdown table string to structured data
const parseMarkdownTable = (md) => {
    if (!md) return { headers: [], rows: [] };
    const lines = md.split('\n').filter(l => l.trim().length > 0);
    // Find the header line (usually the first one with |)
    const headerLine = lines.find(l => l.includes('|'));
    if (!headerLine) return { headers: [], rows: [] };
    
    const headers = headerLine.split('|').filter(c => c.trim()).map(c => c.trim());
    
    // Rows are lines after separator line (which contains ---)
    const rowLines = lines.filter(l => l.includes('|') && !l.includes('---') && l !== headerLine);
    
    const rows = rowLines.map(line => {
        return line.split('|').filter(c => c.trim() !== '').map(c => c.trim().replace(/\*\*/g, ''));
    });
    
    return { headers, rows };
};

// 1. Tax Computation
export const TaxComputationTool = () => {
    const [inputs, setInputs] = useState({ status: 'Individual', income: '', deductions: '', region: '' });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateTaxComputation(inputs);
            setResult(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        const checkPageBreak = (height) => {
            if (y + height > 280) {
                doc.addPage();
                y = 20;
            }
        };

        // --- Title Header ---
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 31, 63); // Navy #001F3F
        doc.text("Tax Computation Summary", margin, y);
        y += 8;

        // --- Metadata ---
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        const dateStr = new Date().toLocaleDateString();
        doc.text(`Generated on ${dateStr} | Status: ${inputs.status} | Region: ${inputs.region || 'Standard'}`, margin, y);
        y += 20;

        // --- Estimated Tax Highlight Box ---
        const estimatedTaxText = cleanText(result.estimatedTax);
        
        // Box Styling
        const boxHeight = 25;
        doc.setFillColor(236, 253, 245); // Emerald-50
        doc.setDrawColor(16, 185, 129); // Emerald-500
        doc.setLineWidth(0.5);
        doc.roundedRect(margin, y, pageWidth - (margin * 2), boxHeight, 3, 3, 'FD');
        
        // Text inside box
        doc.setFontSize(16);
        doc.setTextColor(6, 95, 70); // Emerald-800
        doc.setFont("helvetica", "bold");
        // Center vertically in box
        doc.text(`Estimated Tax: ${estimatedTaxText}`, margin + 10, y + 16);
        y += boxHeight + 15;

        // --- Breakdown Section ---
        checkPageBreak(40);
        doc.setFontSize(11);
        doc.setTextColor(107, 114, 128); // Gray-500 for Label
        doc.setFont("helvetica", "bold");
        doc.text("BREAKDOWN", margin, y);
        y += 8;

        doc.setFontSize(11);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(31, 41, 55); // Gray-800

        result.breakdown?.forEach((item) => {
            const cleanItem = cleanText(item);
            const lines = doc.splitTextToSize(`•  ${cleanItem}`, pageWidth - (margin * 2));
            checkPageBreak(lines.length * 6);
            doc.text(lines, margin, y);
            y += (lines.length * 6) + 4; // Increased spacing for readability
        });
        y += 10;

        // --- Recommendation Box ---
        if (result.recommendations) {
            checkPageBreak(50);
            
            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const recText = cleanText(result.recommendations);
            const recLines = doc.splitTextToSize(recText, pageWidth - (margin * 2) - 16); // Padding adjustment
            
            const recBoxHeight = (recLines.length * 5) + 30; // Header + padding

            checkPageBreak(recBoxHeight);

            // Draw Recommendation Box
            doc.setFillColor(240, 253, 244); // Green-50
            doc.setDrawColor(187, 247, 208); // Green-200
            doc.roundedRect(margin, y, pageWidth - (margin * 2), recBoxHeight, 3, 3, 'FD');

            // Header inside box
            doc.setTextColor(21, 128, 61); // Green-700
            doc.setFont("helvetica", "bold");
            doc.setFontSize(10);
            doc.text("AI RECOMMENDATION", margin + 8, y + 12);

            // Body inside box
            doc.setTextColor(22, 101, 52); // Green-800
            doc.setFont("helvetica", "normal");
            doc.text(recLines, margin + 8, y + 22);
        }

        doc.save('Tax_Summary.pdf');
    };

    return (
        <div className="space-y-6 font-sans text-slate-800">
            <div className="grid grid-cols-2 gap-4">
                <select value={inputs.status} onChange={e => setInputs({...inputs, status: e.target.value})} className="p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]">
                    <option>Individual</option><option>Business / Corporate</option><option>Freelancer</option>
                </select>
                <input placeholder="Region (e.g. US, UK, India)" value={inputs.region} onChange={e => setInputs({...inputs, region: e.target.value})} className="p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            </div>
            <input placeholder="Total Annual Income" value={inputs.income} onChange={e => setInputs({...inputs, income: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            <textarea placeholder="Deductions (e.g. Investments, Home Loan Interest)" value={inputs.deductions} onChange={e => setInputs({...inputs, deductions: e.target.value})} rows={3} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="calculator"/>} Compute Tax
            </button>

            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4 animate-in fade-in">
                    <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#001F3F] text-lg">Estimated Tax: <span className="text-emerald-600">{result.estimatedTax}</span></h4>
                        <button onClick={downloadPDF} className="text-xs bg-white border px-3 py-1 rounded flex items-center gap-1 hover:bg-gray-50"><Icon name="download" size={14}/> PDF</button>
                    </div>
                    <div className="bg-white p-4 rounded border border-gray-200">
                        <p className="text-sm font-bold text-gray-500 uppercase mb-2">Breakdown</p>
                        <ul className="list-disc ml-4 space-y-1 text-sm text-gray-700">
                            {result.breakdown?.map((item, i) => <li key={i}>{cleanText(item)}</li>)}
                        </ul>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded border border-emerald-100">
                        <p className="text-sm font-bold text-emerald-800 uppercase mb-1">AI Recommendation</p>
                        <div className="text-sm text-emerald-700">{renderFormattedText(result.recommendations)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 2. Investment Tracker
export const InvestmentTracker = () => {
    // ... (No changes to InvestmentTracker logic, keeping it consistent)
    const [assets, setAssets] = useState('');
    const [goals, setGoals] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateInvestmentAnalysis({ assets, goals });
            setResult(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20;
        let y = 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 31, 63);
        doc.text("Investment Portfolio Analysis", margin, y);
        y += 10;

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
        y += 15;

        // ... (Existing logic) ...
        const boxWidth = (pageWidth - (margin * 3)) / 2;
        const boxPadding = 6;
        const labelHeight = 10;
        const textYStart = y + labelHeight + 6;
        
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        
        const healthText = cleanText(result.portfolioHealth);
        const growthText = cleanText(result.projectedGrowth);
        
        const healthLines = doc.splitTextToSize(healthText, boxWidth - (boxPadding * 2));
        const growthLines = doc.splitTextToSize(growthText, boxWidth - (boxPadding * 2));
        
        const lineHeight = 5;
        const maxLines = Math.max(healthLines.length, growthLines.length);
        const contentHeight = maxLines * lineHeight;
        const boxHeight = labelHeight + contentHeight + (boxPadding * 2); 
        
        const box2X = margin + boxWidth + margin;

        doc.setFillColor(240, 248, 255);
        doc.setDrawColor(200, 220, 255);
        doc.roundedRect(margin, y, boxWidth, boxHeight, 2, 2, 'FD');
        
        doc.setFillColor(236, 253, 245);
        doc.setDrawColor(16, 185, 129);
        doc.roundedRect(box2X, y, boxWidth, boxHeight, 2, 2, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "bold");
        doc.text("PORTFOLIO HEALTH", margin + boxPadding, y + labelHeight);
        doc.text("PROJECTED GROWTH", box2X + boxPadding, y + labelHeight);

        doc.setFontSize(11);
        doc.setTextColor(0, 31, 63);
        doc.text(healthLines, margin + boxPadding, textYStart);
        doc.setTextColor(6, 95, 70); 
        doc.text(growthLines, box2X + boxPadding, textYStart);
        y += boxHeight + 15;

        doc.setFontSize(14);
        doc.setTextColor(0, 31, 63);
        doc.setFont("helvetica", "bold");
        doc.text("Asset Allocation", margin, y);
        y += 8;

        const { headers, rows } = parseMarkdownTable(result.assetAllocation);
        
        if (headers.length > 0) {
            const tableWidth = pageWidth - (margin * 2);
            const colWidth = tableWidth / headers.length;
            const rowHeight = 10;

            doc.setFillColor(0, 31, 63);
            doc.rect(margin, y, tableWidth, rowHeight, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            
            headers.forEach((h, i) => {
                doc.text(h, margin + (i * colWidth) + 5, y + 6.5);
            });
            y += rowHeight;

            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            
            rows.forEach((row, rowIndex) => {
                if (y + rowHeight > pageHeight - margin) {
                    doc.addPage();
                    y = 20;
                }

                if (rowIndex % 2 === 0) {
                    doc.setFillColor(248, 248, 248);
                    doc.rect(margin, y, tableWidth, rowHeight, 'F');
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                
                doc.setDrawColor(230, 230, 230);
                doc.setLineWidth(0.1);
                doc.line(margin, y + rowHeight, margin + tableWidth, y + rowHeight);

                row.forEach((cell, i) => {
                    let cellText = cleanText(cell);
                    doc.text(cellText, margin + (i * colWidth) + 5, y + 6.5);
                });
                y += rowHeight;
            });
            y += 10;
        }

        if (y + 20 > pageHeight - margin) { doc.addPage(); y = 20; }
        
        doc.setFontSize(14);
        doc.setTextColor(0, 31, 63);
        doc.setFont("helvetica", "bold");
        doc.text("Expert Analysis", margin, y);
        y += 8;

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        
        const analysisText = cleanText(result.analysis);
        const analysisLines = doc.splitTextToSize(analysisText, pageWidth - (margin * 2));
        
        const analysisLineHeight = 5;
        analysisLines.forEach(line => {
             if (y + analysisLineHeight > pageHeight - margin) {
                doc.addPage();
                y = 20;
            }
            doc.text(line, margin, y);
            y += analysisLineHeight;
        });

        doc.save('Investment_Analysis.pdf');
    };

    const renderTable = () => {
        if (!result.assetAllocation) return null;
        const { headers, rows } = parseMarkdownTable(result.assetAllocation);
        return (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#001F3F] text-white">
                        <tr>
                            {headers.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <textarea value={assets} onChange={e => setAssets(e.target.value)} rows={4} placeholder="List Assets: e.g. Stock A ($5k), Crypto ($1k), Gold ($2k)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            <input value={goals} onChange={e => setGoals(e.target.value)} placeholder="Investment Goal (e.g. Retirement in 20 years)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="trending-up"/>} Analyze Portfolio
            </button>
            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-6 animate-in fade-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-[#001F3F]">Analysis Report</h3>
                        <button onClick={downloadPDF} className="text-xs bg-white border px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-50 shadow-sm font-medium"><Icon name="download" size={14}/> Download PDF</button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Health Score</span>
                            <span className="text-xl font-bold text-[#001F3F] mt-1 block">{result.portfolioHealth}</span>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wide">Projected Growth</span>
                            <span className="text-xl font-bold text-emerald-600 mt-1 block">{result.projectedGrowth}</span>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                        <span className="block text-xs font-bold text-gray-400 uppercase mb-3 tracking-wide">Asset Allocation</span>
                        {renderTable()}
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <span className="block text-xs font-bold text-blue-800 uppercase mb-2">Expert Analysis</span>
                        <div className="text-sm text-blue-900 leading-relaxed">{renderFormattedText(result.analysis)}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

// 3. Budget Worksheet (No changes)
export const BudgetBuilder = () => {
    // ... (Same content as previous response) ...
    const [income, setIncome] = useState('');
    const [expenses, setExpenses] = useState('');
    const [goal, setGoal] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateBudgetPlan({ income, expenses, goal });
            setResult(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 31, 63);
        doc.text("Budget Worksheet", margin, y);
        y += 10;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, y);
        y += 15;

        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const summaryText = cleanText(result.summary);
        const summaryLines = doc.splitTextToSize(summaryText, pageWidth - (margin * 2));
        doc.text(summaryLines, margin, y);
        y += (summaryLines.length * 5) + 10;

        const { headers, rows } = parseMarkdownTable(result.allocationTable);
        if (headers.length > 0) {
            const tableWidth = pageWidth - (margin * 2);
            const colWidth = tableWidth / headers.length;
            const rowHeight = 10;

            doc.setFillColor(0, 31, 63);
            doc.rect(margin, y, tableWidth, rowHeight, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            headers.forEach((h, i) => {
                doc.text(h, margin + (i * colWidth) + 5, y + 6.5);
            });
            y += rowHeight;

            doc.setTextColor(0, 0, 0);
            doc.setFont("helvetica", "normal");
            rows.forEach((row, rowIndex) => {
                if (rowIndex % 2 === 0) {
                    doc.setFillColor(248, 248, 248);
                    doc.rect(margin, y, tableWidth, rowHeight, 'F');
                } else {
                    doc.setFillColor(255, 255, 255);
                }
                
                row.forEach((cell, i) => {
                    doc.text(cleanText(cell), margin + (i * colWidth) + 5, y + 6.5);
                });
                y += rowHeight;
            });
            y += 10;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(21, 128, 61); 
        doc.text(`Savings Rate: ${result.savingsRate}`, margin, y);
        y += 10;

        if (result.tips && result.tips.length > 0) {
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(0, 31, 63);
            doc.text("Smart Tips", margin, y);
            y += 8;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            result.tips.forEach((tip) => {
                const cleanTip = cleanText(tip);
                const lines = doc.splitTextToSize(`• ${cleanTip}`, pageWidth - (margin * 2));
                doc.text(lines, margin, y);
                y += (lines.length * 5) + 2;
            });
        }

        doc.save('Budget_Plan.pdf');
    };

    const renderTable = () => {
        if (!result.allocationTable) return null;
        const { headers, rows } = parseMarkdownTable(result.allocationTable);
        return (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full text-sm text-left">
                    <thead className="bg-[#001F3F] text-white">
                        <tr>
                            {headers.map((h, i) => <th key={i} className="px-4 py-3">{h}</th>)}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {rows.map((row, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                {row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-700">{cell}</td>)}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <input value={income} onChange={e => setIncome(e.target.value)} placeholder="Monthly Income (e.g. $5000)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            <textarea value={expenses} onChange={e => setExpenses(e.target.value)} rows={3} placeholder="Expenses Categories (e.g. Rent, Food, Travel)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            <input value={goal} onChange={e => setGoal(e.target.value)} placeholder="Savings Goal (e.g. Save $1000)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="pie-chart"/>} Build Budget
            </button>

            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-[#001F3F] text-lg">{cleanText(result.summary)}</h4>
                        <button onClick={downloadPDF} className="text-xs bg-white border px-3 py-1.5 rounded flex items-center gap-1 hover:bg-gray-50 shadow-sm font-medium"><Icon name="download" size={14}/> PDF</button>
                    </div>
                    {renderTable()}
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 p-3 rounded font-bold text-sm border border-emerald-100">
                        <Icon name="check-circle" size={16} /> Savings Rate: {result.savingsRate}
                    </div>
                    {result.tips && result.tips.length > 0 && (
                        <div className="bg-yellow-50 p-4 rounded border border-yellow-100 mt-2">
                            <span className="block text-xs font-bold text-yellow-700 uppercase mb-2">Smart Tips</span>
                            <div className="space-y-1">
                                {result.tips.map((tip, i) => (
                                    <div key={i} className="text-sm text-yellow-900">
                                        • {renderFormattedText(tip)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// 4. Annual Compliance (No changes)
export const ComplianceChecklist = () => {
    // ... (Same content) ...
    const [entity, setEntity] = useState('Private Limited');
    const [region, setRegion] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateComplianceChecklist(entity, region);
            setResult(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <select value={entity} onChange={e => setEntity(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]">
                    <option>Private Limited</option><option>LLP</option><option>Sole Proprietorship</option><option>Startup (General)</option>
                </select>
                <input value={region} onChange={e => setRegion(e.target.value)} placeholder="Region (e.g. California)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            </div>
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="shield-check"/>} Generate Checklist
            </button>

            {result && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4 max-h-96 overflow-y-auto">
                    <h4 className="font-bold text-[#001F3F] mb-4 sticky top-0 bg-gray-50 py-2 border-b">Annual Compliance List</h4>
                    <div className="space-y-3">
                        {result.checklist?.map((item, i) => (
                            <div key={i} className="bg-white p-3 rounded border border-gray-200 flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase">{item.category}</span>
                                    <p className="text-sm font-semibold text-gray-800">{cleanText(item.item)}</p>
                                    {item.formName && <span className="text-xs text-blue-600 bg-blue-50 px-1.5 rounded">{item.formName}</span>}
                                </div>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded whitespace-nowrap">{item.dueDate}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// 5. Audit Checklist (No changes)
export const AuditChecklist = () => {
    // ... (Same content) ...
    const [type, setType] = useState('Internal Financial Audit');
    const [context, setContext] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const data = await generateAuditChecklist(type, context);
            setResult(data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <select value={type} onChange={e => setType(e.target.value)} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]">
                <option>Internal Financial Audit</option><option>Operational Process Audit</option><option>IT Security Audit</option><option>Inventory Audit</option>
            </select>
            <textarea value={context} onChange={e => setContext(e.target.value)} rows={3} placeholder="Specific focus areas (e.g. Payroll, Petty Cash)" className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
            
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="clipboard-list"/>} Create Audit Plan
            </button>

            {result && (
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-4 space-y-4">
                    <h4 className="font-bold text-[#001F3F] border-b pb-2">{result.title}</h4>
                    <p className="text-sm text-gray-600 italic">{result.scope}</p>
                    <ul className="space-y-2">
                        {result.checklist?.map((item, i) => (
                            <li key={i} className="flex gap-2 items-start text-sm text-gray-800">
                                <input type="checkbox" className="mt-1" />
                                <span>{renderFormattedText(item)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// 6. Invoice Generator
export const InvoiceTool = () => {
    const [inputs, setInputs] = useState({ from: '', to: '', items: '', notes: '' });
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            // Note: generateInvoiceTemplate now returns JSON
            const result = await generateInvoiceTemplate(inputs);
            setData(result);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const downloadPDF = () => {
        if (!data) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        let y = 20;

        const checkPageBreak = (height) => {
            if (y + height > 280) {
                doc.addPage();
                y = 20;
            }
        };

        // Header Section
        doc.setFillColor(0, 31, 63); // Navy Blue
        doc.rect(0, 0, pageWidth, 40, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("INVOICE", margin, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`#${data.invoiceNumber}`, pageWidth - margin, 20, { align: 'right' });
        doc.text(`Date: ${data.date}`, pageWidth - margin, 25, { align: 'right' });
        if(data.dueDate) doc.text(`Due: ${data.dueDate}`, pageWidth - margin, 30, { align: 'right' });

        y = 55;

        // Addresses
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("From:", margin, y);
        doc.text("Bill To:", pageWidth / 2 + 10, y);
        
        y += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        
        const fromLines = doc.splitTextToSize(data.from || "", (pageWidth/2) - 30);
        const toLines = doc.splitTextToSize(data.to || "", (pageWidth/2) - 30);
        
        doc.text(fromLines, margin, y);
        doc.text(toLines, pageWidth / 2 + 10, y);
        
        y += Math.max(fromLines.length, toLines.length) * 5 + 15;

        // Items Table Header
        const col1 = margin;
        const col2 = pageWidth - margin - 50; // Amount
        const col3 = pageWidth - margin - 80; // Rate
        const col4 = pageWidth - margin - 100; // Qty

        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, pageWidth - (margin * 2), 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 31, 63);
        doc.text("Description", col1 + 2, y + 7);
        doc.text("Qty", col4, y + 7);
        doc.text("Rate", col3, y + 7);
        doc.text("Amount (Rs.)", pageWidth - margin - 2, y + 7, { align: 'right' });
        
        y += 12;

        // Items
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);

        data.items.forEach((item, i) => {
            checkPageBreak(15);
            // Stripe rows
            if (i % 2 === 1) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margin, y - 2, pageWidth - (margin * 2), 10, 'F');
            }

            const descLines = doc.splitTextToSize(item.description, col4 - col1 - 5);
            doc.text(descLines, col1 + 2, y + 2);
            doc.text(String(item.quantity), col4, y + 2);
            doc.text(String(item.rate), col3, y + 2);
            doc.text(String(item.amount), pageWidth - margin - 2, y + 2, { align: 'right' });
            
            y += (Math.max(descLines.length, 1) * 5) + 4;
        });

        y += 5;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 10;

        // Totals
        checkPageBreak(40);
        const totalsX = pageWidth - margin - 60;
        
        doc.setFont("helvetica", "normal");
        doc.text("Subtotal:", totalsX, y);
        doc.text(`Rs. ${data.subtotal}`, pageWidth - margin, y, { align: 'right' });
        y += 6;
        
        doc.text(`${data.taxLabel || 'Tax'}:`, totalsX, y);
        doc.text(`Rs. ${data.tax}`, pageWidth - margin, y, { align: 'right' });
        y += 8;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 31, 63);
        doc.text("Total:", totalsX, y);
        doc.text(`Rs. ${data.total}`, pageWidth - margin, y, { align: 'right' });
        y += 15;

        // Notes
        if (data.notes) {
            checkPageBreak(30);
            doc.setFontSize(10);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(100, 100, 100);
            doc.text("NOTES", margin, y);
            y += 5;
            doc.setFont("helvetica", "normal");
            doc.setTextColor(60, 60, 60);
            const noteLines = doc.splitTextToSize(data.notes, pageWidth - (margin * 2));
            doc.text(noteLines, margin, y);
        }

        doc.save(`Invoice_${data.invoiceNumber}.pdf`);
    };

    const currencyFormat = (val) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);
    };

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <input placeholder="Your Business Details (Name, Address, Tax ID)" value={inputs.from} onChange={e => setInputs({...inputs, from: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
                <input placeholder="Client Details (Name, Address)" value={inputs.to} onChange={e => setInputs({...inputs, to: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
                <textarea placeholder="Line Items (Item Name, Qty, Price - comma separated or simple list)" value={inputs.items} onChange={e => setInputs({...inputs, items: e.target.value})} rows={5} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
                <input placeholder="Notes / Terms (e.g. Net 30)" value={inputs.notes} onChange={e => setInputs({...inputs, notes: e.target.value})} className="w-full p-3 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-[#001F3F]" />
                
                <button onClick={handleGenerate} disabled={loading} className="w-full bg-[#001F3F] text-white py-3 rounded-lg font-bold hover:bg-blue-900 transition flex items-center justify-center gap-2">
                    {loading ? <Icon name="loader" className="animate-spin"/> : <Icon name="receipt"/>} Generate Invoice
                </button>
            </div>
            
            <div className="bg-gray-100 rounded-xl border border-gray-200 p-6 min-h-[400px]">
                {data ? (
                    <div className="bg-white shadow-xl p-8 rounded-sm max-w-[210mm] mx-auto min-h-[600px] text-sm text-gray-800 font-sans">
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-[#001F3F] mb-1">INVOICE</h1>
                                <p className="text-gray-500 font-medium">#{data.invoiceNumber}</p>
                            </div>
                            <div className="text-right text-gray-600">
                                <p>Date: {data.date}</p>
                                {data.dueDate && <p>Due: {data.dueDate}</p>}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            <div>
                                <h4 className="font-bold text-gray-400 text-xs uppercase mb-2">From</h4>
                                <pre className="font-sans whitespace-pre-wrap text-gray-700">{data.from}</pre>
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-400 text-xs uppercase mb-2">Bill To</h4>
                                <pre className="font-sans whitespace-pre-wrap text-gray-700">{data.to}</pre>
                            </div>
                        </div>

                        <table className="w-full mb-8">
                            <thead className="bg-gray-50 text-gray-600 font-bold border-b">
                                <tr>
                                    <th className="text-left py-3 px-2">Item</th>
                                    <th className="text-center py-3 px-2">Qty</th>
                                    <th className="text-right py-3 px-2">Rate</th>
                                    <th className="text-right py-3 px-2">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {data.items?.map((item, i) => (
                                    <tr key={i}>
                                        <td className="py-3 px-2">{item.description}</td>
                                        <td className="text-center py-3 px-2">{item.quantity}</td>
                                        <td className="text-right py-3 px-2">{currencyFormat(item.rate)}</td>
                                        <td className="text-right py-3 px-2 font-medium">{currencyFormat(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="flex justify-end mb-8">
                            <div className="w-1/2 space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{currencyFormat(data.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>{data.taxLabel}</span>
                                    <span>{currencyFormat(data.tax)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-[#001F3F] border-t pt-2 mt-2">
                                    <span>Total</span>
                                    <span>{currencyFormat(data.total)}</span>
                                </div>
                            </div>
                        </div>

                        {data.notes && (
                            <div className="border-t pt-4">
                                <h4 className="font-bold text-gray-400 text-xs uppercase mb-2">Notes</h4>
                                <p className="text-gray-600 italic">{data.notes}</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t flex justify-end">
                             <button onClick={downloadPDF} className="bg-[#001F3F] text-white px-4 py-2 rounded font-bold text-xs flex items-center gap-2 hover:bg-blue-900 transition">
                                <Icon name="download" size={14}/> Download PDF
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center text-gray-400">
                        <Icon name="receipt" size={48} className="mb-4 opacity-50" />
                        <p className="text-sm font-medium">Invoice Preview will appear here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
