
import React, { useState } from 'react';
import { generateFinancialModel } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const FinancialModelTool = () => {
    const [formData, setFormData] = useState({
        businessType: '',
        revenueModel: '',
        pricing: '',
        monthlyCosts: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerate = async () => {
        if (!formData.businessType || !formData.revenueModel) {
            alert("Please fill in the Business Type and Revenue Model.");
            return;
        }
        
        // Construct the raw input string for the AI service
        const constructedInput = `
            Business Type: ${formData.businessType}
            Revenue Model: ${formData.revenueModel}
            Pricing Structure: ${formData.pricing}
            Estimated Monthly Costs: ${formData.monthlyCosts}
        `;

        setLoading(true);
        setError(null);
        try {
            const data = await generateFinancialModel({ rawInput: constructedInput });
            setResult(data);
        } catch (err) {
            setError(err.message || "Failed to generate financial model.");
        } finally {
            setLoading(false);
        }
    };

    // Helper to clean text for PDF (Remove markdown, fix currency symbols)
    const cleanText = (text) => {
        if (!text || typeof text !== 'string') return "";
        return text
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/#/g, '') // Remove headers
            .replace(/₹/g, 'Rs. ') // Fix Rupee symbol
            .replace(/€/g, 'EUR ')
            .replace(/£/g, 'GBP ')
            .replace(/\n/g, ' ') // Flatten newlines for wrapping
            .trim();
    };

    const downloadPDF = () => {
        if (!result) return;
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const width = doc.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;

        const checkPageBreak = (needed) => {
            if (y + needed > 280) {
                doc.addPage();
                y = 20;
            }
        };

        const addHeader = (title) => {
            checkPageBreak(25);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor(0, 31, 63); // Navy
            doc.text(title.toUpperCase(), margin, y);
            y += 8;
            doc.setDrawColor(200, 200, 200);
            doc.setLineWidth(0.5);
            doc.line(margin, y - 2, width - margin, y - 2);
            y += 5;
        };

        const addParagraph = (label, text) => {
            if (!text) return;
            checkPageBreak(20);
            
            const fullText = label ? `${label}: ${cleanText(text)}` : cleanText(text);
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            
            const lines = doc.splitTextToSize(fullText, width - (margin * 2));
            checkPageBreak(lines.length * 5);
            doc.text(lines, margin, y);
            y += (lines.length * 5) + 4;
        };

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(0, 31, 63);
        doc.text("Financial Model & Forecast", margin, y);
        y += 15;

        // Executive Summary
        addHeader("Executive Summary");
        addParagraph("", result.executiveSummary);

        // Assumptions
        addHeader("Key Assumptions");
        result.keyAssumptions.forEach(assump => {
            checkPageBreak(8);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(60, 60, 60);
            const cleanAssump = cleanText(assump);
            const lines = doc.splitTextToSize(`• ${cleanAssump}`, width - (margin * 2));
            doc.text(lines, margin, y);
            y += (lines.length * 5) + 2;
        });
        y += 5;

        // Forecast Table
        checkPageBreak(60); 
        addHeader("3-5 Year Financial Forecast");
        
        const cols = ["Category", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5"];
        // Adjusted column widths for better fit
        const colWidths = [50, 26, 26, 26, 26, 26]; 
        const rowHeight = 10; // Increased row height
        
        // Table Header
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, y, width - (margin * 2), rowHeight, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        
        let currentX = margin;
        cols.forEach((col, i) => {
            // Right align year columns
            if (i > 0) {
                doc.text(col, currentX + colWidths[i] - 2, y + 6, { align: "right" });
            } else {
                doc.text(col, currentX + 2, y + 6);
            }
            currentX += colWidths[i];
        });
        y += rowHeight;

        // Table Body
        doc.setFont("helvetica", "normal");
        result.financialForecast.forEach((row, i) => {
            checkPageBreak(rowHeight);
            
            if (i % 2 === 1) {
                doc.setFillColor(250, 250, 250);
                doc.rect(margin, y, width - (margin * 2), rowHeight, 'F');
            }

            const isBold = row.category.includes("Net") || row.category.includes("EBITDA") || row.category.includes("Gross");
            doc.setFont("helvetica", isBold ? "bold" : "normal");
            doc.setTextColor(isBold ? 0 : 60, isBold ? 0 : 60, isBold ? 0 : 60);

            currentX = margin;
            const values = [row.category, row.year1, row.year2, row.year3, row.year4, row.year5];
            
            values.forEach((val, colIndex) => {
                const cleanVal = cleanText(val || "-");
                if (colIndex > 0) {
                    // Right align numbers
                    doc.text(cleanVal, currentX + colWidths[colIndex] - 2, y + 6, { align: "right" });
                } else {
                    doc.text(cleanVal, currentX + 2, y + 6);
                }
                currentX += colWidths[colIndex];
            });
            
            doc.setDrawColor(230, 230, 230);
            doc.line(margin, y + rowHeight, width - margin, y + rowHeight);
            
            y += rowHeight;
        });
        y += 10;

        addHeader("Analysis");
        addParagraph("Revenue Model", result.revenueModel);
        addParagraph("Cost Structure", result.costStructure);
        addParagraph("Unit Economics", result.unitEconomics);
        
        checkPageBreak(30);
        addHeader("Funding & Valuation");
        addParagraph("Funding Requirements", result.fundingRequirements);
        addParagraph("Valuation Estimate", result.valuation);

        doc.save("Financial_Model.pdf");
    };

    const inputClass = "w-full p-4 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-[#001F3F] focus:border-transparent outline-none transition-shadow text-base";

    return (
        <div className="max-w-6xl mx-auto h-[80vh] flex flex-col">
            <div className="flex-1 grid lg:grid-cols-2 gap-8 min-h-0">
                
                {/* Left Column: Input Details */}
                <div className="flex flex-col h-full overflow-y-auto pr-2">
                    <h3 className="text-xl font-bold text-[#001F3F] mb-6">Input Details</h3>
                    
                    <div className="space-y-5 flex-1">
                        <div>
                            <input 
                                name="businessType"
                                value={formData.businessType} 
                                onChange={handleInputChange} 
                                placeholder="Business Type (e.g. SaaS)" 
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <input 
                                name="revenueModel"
                                value={formData.revenueModel} 
                                onChange={handleInputChange} 
                                placeholder="Revenue Model (e.g. Subscription)" 
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <input 
                                name="pricing"
                                value={formData.pricing} 
                                onChange={handleInputChange} 
                                placeholder="Pricing (e.g. $50/mo)" 
                                className={inputClass} 
                            />
                        </div>
                        <div>
                            <input 
                                name="monthlyCosts"
                                value={formData.monthlyCosts} 
                                onChange={handleInputChange} 
                                placeholder="Est. Monthly Costs" 
                                className={inputClass} 
                            />
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2 border border-red-200">
                                <Icon name="alert-triangle" size={16} /> {error}
                            </div>
                        )}
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full mt-8 py-4 bg-[#001F3F] hover:bg-blue-900 text-white rounded-lg font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {loading ? <Icon name="loader" className="animate-spin" size={24} /> : <Icon name="sparkles" size={24} />}
                        Generate Content
                    </button>
                </div>

                {/* Right Column: Generated Output */}
                <div className="flex flex-col h-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-wider">Generated Output</h3>
                        {result && (
                            <button 
                                onClick={downloadPDF}
                                className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded shadow-sm font-bold text-[#001F3F] hover:bg-gray-50 transition-colors flex items-center gap-1"
                            >
                                <Icon name="download" size={14} /> PDF
                            </button>
                        )}
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50/50">
                        {result ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Summary */}
                                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                                    <h4 className="font-bold text-[#001F3F] mb-2 flex items-center gap-2"><Icon name="target" size={16}/> Executive Summary</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">{result.executiveSummary}</p>
                                </div>

                                {/* Table Preview */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="px-6 py-3 border-b border-gray-100 bg-[#001F3F] text-white">
                                        <h4 className="font-bold text-sm">Forecast Preview</h4>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs text-left">
                                            <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-100">
                                                <tr>
                                                    <th className="p-3">Category</th>
                                                    <th className="p-3 text-right">Year 1</th>
                                                    <th className="p-3 text-right">Year 2</th>
                                                    <th className="p-3 text-right">Year 5</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {result.financialForecast.slice(0, 5).map((row, i) => (
                                                    <tr key={i} className="hover:bg-blue-50/30">
                                                        <td className="p-3 font-medium text-gray-800">{row.category}</td>
                                                        <td className="p-3 text-gray-600 text-right">{row.year1}</td>
                                                        <td className="p-3 text-gray-600 text-right">{row.year2}</td>
                                                        <td className="p-3 text-gray-600 text-right">{row.year5}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Analysis Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <h5 className="font-bold text-xs uppercase text-gray-400 mb-1">Valuation</h5>
                                        <p className="text-sm font-medium text-[#001F3F]">{result.valuation}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-100">
                                        <h5 className="font-bold text-xs uppercase text-gray-400 mb-1">Funding Needed</h5>
                                        <p className="text-sm font-medium text-[#001F3F]">{result.fundingRequirements.split('.')[0]}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                                <p>Output will appear here...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialModelTool;
