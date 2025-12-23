
import React, { useState } from 'react';
import { analyzeBusinessPlan } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const BusinessPlanTool = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [formData, setFormData] = useState({
    ideaTitle: '',
    industry: '',
    description: '',
    targetMarket: '',
    goals: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.ideaTitle || !formData.description) {
        alert("Please provide at least a Business Name and Description to generate a plan.");
        return;
    }

    setLoading(true);
    try {
      const plan = await analyzeBusinessPlan(formData);
      setResult(plan);
    } catch (error) {
      console.error("Failed to analyze plan", error);
      alert(error.message || "Failed to analyze business plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to remove markdown for PDF
  const stripMarkdown = (text) => {
      if (!text || typeof text !== 'string') return "";
      return text.replace(/\*\*/g, '').replace(/^[\*\-]\s*/gm, '');
  };

  // Helper to render markdown bold in UI
  const renderFormattedText = (text) => {
    if (!text || typeof text !== 'string') return null;
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <span>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                    return <strong key={i} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
                }
                // Also clean leading list markers if they appear in text blocks
                const cleanPart = part.replace(/^[\*\-]\s+/, '');
                return <span key={i}>{cleanPart}</span>;
            })}
        </span>
    );
  };

  const downloadPDF = () => {
    if (!result) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 20;
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    const checkPageBreak = (heightNeeded) => {
      if (yPos + heightNeeded > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
    };

    const addHeading = (text) => {
      checkPageBreak(15);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(44, 62, 80);
      doc.text(text, margin, yPos);
      yPos += 10;
    };

    const addParagraph = (text) => {
      const cleanText = stripMarkdown(text);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(cleanText, contentWidth);
      checkPageBreak(lines.length * 6);
      doc.text(lines, margin, yPos);
      yPos += (lines.length * 5) + 6;
    };

    const addList = (items) => {
      if (!items || items.length === 0) return;
      doc.setFontSize(11);
      items.forEach(item => {
        const cleanItem = stripMarkdown(item);
        const text = `• ${cleanItem}`;
        const lines = doc.splitTextToSize(text, contentWidth);
        checkPageBreak(lines.length * 6);
        doc.text(lines, margin, yPos);
        yPos += (lines.length * 5) + 2;
      });
      yPos += 4;
    };

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(result.title, margin, yPos);
    yPos += 15;
    
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth-margin, yPos);
    yPos += 15;

    addHeading('Executive Summary');
    addParagraph(result.executiveSummary);

    addHeading('Market Analysis');
    addParagraph(result.marketAnalysis);

    addHeading('Advantages (Pros)');
    addList(result.pros);

    addHeading('Challenges (Cons)');
    addList(result.cons);

    addHeading('Financial Outlook');
    addParagraph(result.financialOutlook);

    addHeading('Future Roadmap');
    addParagraph(result.futureRoadmap);

    addHeading('Conclusion');
    addParagraph(result.conclusion);

    doc.save('Business_Plan_Analysis.pdf');
  };

  if (result) {
    return (
      <div className="max-w-6xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center mb-6">
          <button 
             onClick={() => setResult(null)}
             className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-2"
          >
            <Icon name="arrow-right" className="rotate-180" size={16} /> Back to Idea Input
          </button>
          <button 
            onClick={downloadPDF}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md font-medium"
          >
            <Icon name="download" size={18} />
            Export Plan as PDF
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <Icon name="bar-chart-2" />
              <span className="uppercase tracking-widest text-xs font-bold">Strategic Analysis Report</span>
            </div>
            <h1 className="text-4xl font-bold mb-2">{result.title}</h1>
            <p className="text-slate-400">Comprehensive AI Analysis & Feasibility Study</p>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                  <Icon name="target" className="text-emerald-600" size={24} /> Executive Summary
                </h3>
                <p className="text-slate-600 leading-relaxed text-justify bg-slate-50 p-6 rounded-lg border border-slate-100">
                  {renderFormattedText(result.executiveSummary)}
                </p>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                  <Icon name="trending-up" className="text-green-600" size={24} /> Market Analysis
                </h3>
                <p className="text-slate-600 leading-relaxed text-justify">
                  {renderFormattedText(result.marketAnalysis)}
                </p>
              </section>

              <section>
                <h3 className="flex items-center gap-2 text-xl font-bold text-slate-800 mb-4">
                   <Icon name="dollar-sign" className="text-emerald-600" size={24} /> Financial Outlook
                </h3>
                <p className="text-slate-600 leading-relaxed bg-emerald-50 p-6 rounded-lg border border-emerald-100 text-justify">
                  {renderFormattedText(result.financialOutlook)}
                </p>
              </section>
              
               <section>
                <h3 className="text-xl font-bold text-slate-800 mb-4">Future Roadmap</h3>
                <p className="text-slate-600 leading-relaxed text-justify">
                  {renderFormattedText(result.futureRoadmap)}
                </p>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div> Pros & Strengths
                </h4>
                <ul className="space-y-3">
                  {result.pros?.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-green-500 font-bold shrink-0">✓</span> 
                      <span>{renderFormattedText(pro)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                <h4 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                  <Icon name="alert-triangle" size={18} /> Cons & Risks
                </h4>
                <ul className="space-y-3">
                  {result.cons?.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="text-red-500 font-bold shrink-0">•</span> 
                      <span>{renderFormattedText(con)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
                 <h4 className="text-lg font-bold text-emerald-900 mb-2">Conclusion</h4>
                 <p className="text-sm text-emerald-800 italic">
                   {renderFormattedText(result.conclusion)}
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Strategic Business Planner</h2>
        <p className="text-slate-500">Describe your idea, and our AI will conduct a SWOT analysis and build a strategic plan.</p>
      </div>

      <div className="bg-white shadow-lg rounded-xl p-8 border-t-4 border-emerald-600">
        <div className="space-y-8">
          
          {/* Section: Core Concept */}
          <section>
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Core Concept</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Business Name (Proposed)
                </label>
                <input
                  name="ideaTitle"
                  value={formData.ideaTitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 bg-white text-slate-900"
                  placeholder="e.g. EcoLogistics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Industry
                </label>
                <input
                  name="industry"
                  value={formData.industry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all placeholder:text-slate-300 bg-white text-slate-900"
                  placeholder="e.g. Supply Chain / Tech"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Idea Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-300 bg-white text-slate-900 resize-none"
                placeholder="Describe your product or service in detail..."
              />
            </div>
          </section>

          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Target Audience</label>
             <textarea
              name="targetMarket"
              value={formData.targetMarket}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-300 bg-white text-slate-900 resize-none"
              placeholder="Who are your customers?"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-600 mb-1">Primary Goals (Short/Long Term)</label>
             <textarea
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none placeholder:text-slate-300 bg-white text-slate-900 resize-none"
              placeholder="e.g. Reach 1000 users in 6 months..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-8 py-3 bg-emerald-700 text-white rounded-lg font-semibold hover:bg-emerald-800 transition-colors flex items-center gap-2 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Icon name="loader" className="animate-spin" size={20} /> Analyzing...
                </>
              ) : (
                <>
                  <Icon name="zap" size={20} /> Generate Strategic Plan
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPlanTool;
