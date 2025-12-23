
import React, { useState, useRef, useEffect } from 'react';
import { generateCoverLetter } from '../services/geminiService.js';
import { Icon } from './Icon.jsx';

const INITIAL_PARAMS = {
  careerLevel: 'Experienced',
  candidateName: '',
  candidateTitle: '',
  email: '',
  phone: '',
  linkedin: '',
  address: '',
  jobRole: '',
  companyName: '',
  experience: '',
  skills: '',
  whyJob: '',
  tone: 'Confident',
  length: 'Standard',
  style: 'Modern/Tech',
  focus: 'Balanced',
  keywords: '',
  customInstructions: ''
};

const TEMPLATES = [
    { id: 'modern', name: 'Modern Split', color: 'bg-navy' },
    { id: 'corporate', name: 'Corporate Bold', color: 'bg-blue-800' },
    { id: 'classic', name: 'Classic Serif', color: 'bg-gray-700' },
    { id: 'minimal', name: 'Clean Minimal', color: 'bg-teal-600' },
];

export const CoverLetterTool = () => {
  const [params, setParams] = useState(INITIAL_PARAMS);
  const [generatedHtml, setGeneratedHtml] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  
  // Ref for the editable body div
  const editorRef = useRef(null);

  // Sync generated HTML to editor ONLY when AI updates it.
  useEffect(() => {
    if (editorRef.current && generatedHtml) {
        editorRef.current.innerHTML = generatedHtml;
    }
  }, [generatedHtml]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setParams(prev => ({ ...prev, [name]: value }));
  };

  const handleLevelChange = (level) => {
    setParams(prev => ({ ...prev, careerLevel: level }));
  };

  const handleGenerate = async () => {
    if (!params.jobRole || !params.experience) {
      setError("Please fill in at least the Job Role and Experience fields.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedHtml(''); 
    
    try {
      const text = await generateCoverLetter(params);
      
      // Parse Markdown-like syntax from AI
      let formattedHtml = text;

      // 1. Bold: **text** -> <b>text</b>
      formattedHtml = formattedHtml.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

      // 2. Bullets: * text or - text at start of line (handling newlines)
      // Replaces "* " or "- " with a styled bullet point
      formattedHtml = formattedHtml.replace(/(\n|^)[*-] /g, '$1&bull; ');

      // 3. Convert newlines to HTML breaks
      formattedHtml = formattedHtml.replace(/\n/g, '<br/>');
      
      // Auto-replace placeholder if name is provided
      if (params.candidateName) {
        formattedHtml = formattedHtml.replace(/\[Your Name\]/gi, params.candidateName);
      }

      setGeneratedHtml(formattedHtml);
      
      // Scroll to preview after generation
      setTimeout(() => {
        document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormat = (command) => {
    document.execCommand(command, false);
    editorRef.current?.focus();
  };

  const handleInsertBullet = () => {
    // Insert a text bullet point at cursor position
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const bulletNode = document.createTextNode("• ");
        range.deleteContents();
        range.insertNode(bulletNode);
        range.collapse(false); // Move cursor after bullet
    }
    editorRef.current?.focus();
  };

  const handleCopy = () => {
    // Construct full text for clipboard
    const bodyText = editorRef.current?.innerText || '';
    const headerText = `${params.candidateName}\n${params.candidateTitle}\n${params.email} | ${params.phone}\n\n`;
    navigator.clipboard.writeText(headerText + bodyText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportPDF = () => {
    if (!editorRef.current) return;
    
    const bodyText = editorRef.current.innerText;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // --- Helper: Draw Icons ---
    const drawIcon = (type, x, y, color = [13, 148, 136]) => {
        doc.setDrawColor(color[0], color[1], color[2]);
        doc.setFillColor(color[0], color[1], color[2]);
        doc.setLineWidth(0.3);
        const iconSize = 3.5;

        if (type === 'mail') {
            doc.rect(x, y, iconSize, iconSize * 0.7, 'S');
            doc.line(x, y, x + iconSize/2, y + iconSize*0.4);
            doc.line(x + iconSize, y, x + iconSize/2, y + iconSize*0.4);
        } else if (type === 'phone') {
            doc.roundedRect(x + 0.8, y, iconSize - 1.6, iconSize, 0.5, 0.5, 'S');
            doc.line(x + 1.2, y + 0.5, x + iconSize - 1.2, y + 0.5);
            doc.circle(x + iconSize/2, y + iconSize - 0.5, 0.2, 'F');
        } else if (type === 'linkedin') {
            doc.roundedRect(x, y, iconSize, iconSize, 0.5, 0.5, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(7);
            doc.text("in", x + 0.6, y + iconSize - 0.8);
        } else if (type === 'pin') {
            const r = iconSize/2.5;
            const cx = x + iconSize/2;
            const cy = y + r;
            doc.circle(cx, cy, r, 'F');
            doc.triangle(cx - r, cy + 0.1, cx + r, cy + 0.1, cx, y + iconSize, 'F');
            doc.setFillColor(255, 255, 255);
            doc.circle(cx, cy, r/2.5, 'F');
        }
    };

    let startY = 20;

    // --- TEMPLATE SPECIFIC HEADER ---
    if (selectedTemplate === 'modern') {
        // Modern Split Header
        doc.setFillColor(0, 31, 63); // #001F3F
        doc.rect(0, 0, pageWidth * 0.60, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text((params.candidateName || "YOUR NAME").toUpperCase(), 15, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(params.candidateTitle || (params.careerLevel === 'Fresher' ? "Recent Graduate" : "Professional Title"), 15, 28);

        // Right side contacts
        doc.setTextColor(54, 69, 79);
        doc.setFontSize(9);
        const contactX = (pageWidth * 0.60) + 10;
        let contactY = 15;
        
        const addLine = (icon, txt) => {
            if(!txt) return;
            drawIcon(icon, contactX, contactY - 2.5);
            doc.text(txt, contactX + 6, contactY);
            contactY += 6;
        };
        addLine("mail", params.email);
        addLine("phone", params.phone);
        addLine("linkedin", params.linkedin);
        addLine("pin", params.address);

        doc.setDrawColor(200, 200, 200);
        doc.line(15, 55, pageWidth - 15, 55);
        startY = 70;

    } else if (selectedTemplate === 'corporate') {
        // Corporate: Full width top bar
        doc.setFillColor(30, 58, 138); // Blue-800
        doc.rect(0, 0, pageWidth, 35, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text((params.candidateName || "YOUR NAME").toUpperCase(), 15, 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(200, 220, 255);
        doc.text(params.candidateTitle || "Professional Title", 15, 26);

        // Contacts in a row below name
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        
        // Simplified row for corporate to fit PDF simplicity
        if(params.email) doc.text(params.email, pageWidth - 15, 15, { align: 'right' });
        if(params.phone) doc.text(params.phone, pageWidth - 15, 20, { align: 'right' });
        if(params.linkedin) doc.text("LinkedIn Profile", pageWidth - 15, 25, { align: 'right' });

        startY = 55;

    } else if (selectedTemplate === 'classic') {
        // Classic: Centered, Serif font
        doc.setTextColor(0, 0, 0);
        doc.setFont("times", "bold");
        doc.setFontSize(24);
        doc.text((params.candidateName || "Your Name").toUpperCase(), pageWidth / 2, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.setFont("times", "normal");
        doc.text(params.candidateTitle || "Title", pageWidth / 2, 28, { align: 'center' });

        doc.setFontSize(10);
        const contactLine = [params.email, params.phone, params.linkedin, params.address].filter(Boolean).join("  |  ");
        doc.text(contactLine, pageWidth / 2, 36, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.line(20, 42, pageWidth - 20, 42);
        
        startY = 60;

    } else if (selectedTemplate === 'minimal') {
        // Minimal: Left aligned, very clean, teal accents
        doc.setTextColor(30, 30, 30);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text(params.candidateName || "Your Name", 20, 25);

        doc.setFontSize(12);
        doc.setTextColor(13, 148, 136); // Teal
        doc.text(params.candidateTitle || "Title", 20, 33);

        // Contacts top right, small
        doc.setTextColor(80, 80, 80);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        let cy = 20;
        [params.email, params.phone, params.linkedin, params.address].filter(Boolean).forEach((txt) => {
            doc.text(txt, pageWidth - 20, cy, { align: 'right' });
            cy += 5;
        });

        doc.setDrawColor(220, 220, 220);
        doc.line(20, 45, pageWidth - 20, 45);
        startY = 65;
    }


    // --- Body Text Processing ---
    doc.setTextColor(0, 0, 0);
    const fontSize = 11;
    doc.setFontSize(fontSize);
    const isClassic = selectedTemplate === 'classic';
    doc.setFont(isClassic ? "times" : "helvetica", "normal");

    const margin = 20;
    const maxLineWidth = pageWidth - (margin * 2);
    let cursorY = startY;
    
    // Dynamic line height calculations
    // 1pt = 0.3528mm
    const ptToMm = 0.3528;
    const lineHeightFactor = 1.4; 
    const singleLineHeightMm = fontSize * lineHeightFactor * ptToMm;

    const paragraphs = bodyText.split(/\r?\n/);

    paragraphs.forEach((para) => {
      // Clean up placeholder text if present
      if (para.includes("Generated cover letter content")) return;
      
      const trimmed = para.trim();
      if (!trimmed) {
        cursorY += singleLineHeightMm; 
        return;
      }

      const bulletRegex = /^([-\u2022*]|\d+\.)\s/;
      const isBullet = bulletRegex.test(trimmed);
      const isHeader = /^(subject:|re:|dear\s|to:|application for|sincerely,)/i.test(trimmed);

      let finalPara = trimmed;
      let indent = 0;
      
      if (isHeader) {
         doc.setFont(isClassic ? "times" : "helvetica", "bold");
      } else {
         doc.setFont(isClassic ? "times" : "helvetica", "normal");
      }

      let bulletMarker = "";
      if (isBullet) {
        const match = trimmed.match(bulletRegex);
        bulletMarker = match ? match[0].trim() : "•";
        finalPara = trimmed.replace(bulletRegex, "").trim();
        indent = 8;
      }

      const contentWidth = maxLineWidth - indent;
      const lines = doc.splitTextToSize(finalPara, contentWidth);
      const blockHeight = lines.length * singleLineHeightMm;

      // Page Break Check
      if (cursorY + blockHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }

      if (isBullet) {
        // Draw the bullet marker slightly indented from margin, aligned with first line
        doc.text(bulletMarker, margin + 2, cursorY);
        // Draw the text lines with hanging indent
        doc.text(lines, margin + indent, cursorY);
      } else {
        doc.text(lines, margin + indent, cursorY);
      }

      cursorY += blockHeight;
      
      // Add extra spacing after paragraphs (unless it's a tight list, but usually cover letters have spacing)
      if (!isBullet) {
          cursorY += (singleLineHeightMm * 0.5);
      } else {
          // Smaller gap between list items
           cursorY += (singleLineHeightMm * 0.2);
      }
    });

    const safeName = params.candidateName.trim().replace(/[^a-z0-9]/gi, '_');
    const safeRole = params.jobRole.trim().replace(/[^a-z0-9]/gi, '_') || 'Cover_Letter';
    doc.save(`${safeName}_${safeRole}.pdf`);
  };

  const FormatButton = ({ cmd, icon, label, onClick }) => (
    <button
        onMouseDown={(e) => {
            e.preventDefault(); 
            if (onClick) onClick();
            else if (cmd) handleFormat(cmd);
        }}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-600 dark:text-gray-300 transition-colors"
        title={label}
    >
        <Icon name={icon} size={18} />
    </button>
  );

  const isFresher = params.careerLevel === 'Fresher';

  // --- Dynamic Preview Header Renderer ---
  const renderPreviewHeader = () => {
      const name = params.candidateName || "Your Name";
      const title = params.candidateTitle || (isFresher ? "Recent Graduate" : "Professional Title");
      const { email, phone, linkedin, address } = params;
      const contacts = [
        { icon: 'mail', val: email }, 
        { icon: 'phone', val: phone }, 
        { icon: 'linkedin', val: linkedin }, 
        { icon: 'map-pin', val: address }
      ].filter(c => c.val && c.val.trim().length > 0);

      switch(selectedTemplate) {
          case 'corporate':
              return (
                  <div className="bg-blue-900 text-white p-8">
                      <div className="flex justify-between items-end">
                          <div>
                            <h1 className="text-4xl font-bold uppercase tracking-wide break-words">{name}</h1>
                            <p className="text-blue-200 text-lg mt-1">{title}</p>
                          </div>
                          <div className="text-right text-sm text-blue-100 space-y-1">
                              {contacts.map((c, i) => (
                                  <div key={i} className="flex items-center justify-end gap-2">
                                      <span>{c.val}</span>
                                      <Icon name={c.icon} size={14} />
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              );
          case 'classic':
              return (
                  <div className="bg-white text-charcoal p-8 text-center border-b-2 border-gray-800">
                      <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2 break-words">{name}</h1>
                      <p className="text-gray-600 font-serif italic text-lg mb-4">{title}</p>
                      <div className="flex justify-center gap-4 text-sm font-serif text-gray-700 flex-wrap">
                          {contacts.map((c, i) => (
                              <React.Fragment key={i}>
                                  <span className="flex items-center gap-1">
                                      {c.val}
                                  </span>
                                  {i < contacts.length - 1 && <span>|</span>}
                              </React.Fragment>
                          ))}
                      </div>
                  </div>
              );
           case 'minimal':
              return (
                  <div className="bg-white text-charcoal p-10 pb-4 border-b border-gray-200 flex justify-between items-start">
                      <div>
                          <h1 className="text-4xl font-bold text-gray-800 tracking-tight break-words">{name}</h1>
                          <p className="text-teal-600 font-medium text-lg mt-1">{title}</p>
                      </div>
                      <div className="text-right text-sm text-gray-500 space-y-1.5">
                          {contacts.map((c, i) => (
                               <div key={i}>{c.val}</div>
                          ))}
                      </div>
                  </div>
              );
          case 'modern':
          default:
              return (
                <div className="flex min-h-40 shrink-0">
                    <div className="w-[60%] bg-navy p-8 flex flex-col justify-center text-white">
                        <h1 className="text-3xl font-bold uppercase tracking-wider leading-tight break-words">{name}</h1>
                        <p className="text-blue-100 text-lg mt-1 font-medium break-words">{title}</p>
                    </div>
                    <div className="w-[40%] bg-white p-6 flex flex-col justify-center gap-2 text-sm text-gray-700 border-b border-gray-100">
                        {contacts.map((c, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-5 shrink-0 flex justify-center"><Icon name={c.icon} size={16} className="text-teal-600" /></div>
                                <span className="truncate font-medium min-w-0">{c.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
              );
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Input Section */}
      <div className="space-y-8">
        
        {/* Career Level Toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg w-fit">
            <button
                onClick={() => handleLevelChange('Fresher')}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${params.careerLevel === 'Fresher' ? 'bg-white dark:bg-gray-700 shadow text-navy dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
                <Icon name="file-text" size={16} /> Fresher / Graduate
            </button>
            <button
                onClick={() => handleLevelChange('Experienced')}
                className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all flex items-center gap-2 ${params.careerLevel === 'Experienced' ? 'bg-white dark:bg-gray-700 shadow text-navy dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
            >
                <Icon name="briefcase" size={16} /> Experienced
            </button>
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy dark:text-blue-200 flex items-center gap-2">
                <Icon name="file-text" size={20} /> Personal Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <input name="candidateName" value={params.candidateName} onChange={handleChange} placeholder="Full Name *" className="input-field" />
                <input 
                    name="candidateTitle" 
                    value={params.candidateTitle} 
                    onChange={handleChange} 
                    placeholder={isFresher ? "Degree / Major (e.g. BS Computer Science)" : "Current Job Title"} 
                    className="input-field" 
                />
                <input name="email" value={params.email} onChange={handleChange} placeholder="Email Address" className="input-field" />
                <input name="phone" value={params.phone} onChange={handleChange} placeholder="Phone Number" className="input-field" />
                <input name="linkedin" value={params.linkedin} onChange={handleChange} placeholder="LinkedIn URL" className="input-field" />
                <input name="address" value={params.address} onChange={handleChange} placeholder="City, State" className="input-field" />
            </div>
        </div>

        {/* Job Details */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-navy dark:text-blue-200 flex items-center gap-2">
                <Icon name="briefcase" size={20} /> Target Job
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
                <input name="jobRole" value={params.jobRole} onChange={handleChange} placeholder="Target Job Role *" className="input-field" />
                <input name="companyName" value={params.companyName} onChange={handleChange} placeholder="Company Name" className="input-field" />
            </div>
            
            <textarea
                name="experience"
                value={params.experience}
                onChange={handleChange}
                rows={4}
                placeholder={isFresher 
                    ? "Academic Highlights, Internships, Capstone Projects & GPA (if high) *" 
                    : "Experience & Achievements (e.g., Led a team of 5, increased revenue by 20%) *"}
                className="input-field resize-none"
            />
            <div className="grid md:grid-cols-2 gap-4">
                <textarea 
                    name="skills" 
                    value={params.skills} 
                    onChange={handleChange} 
                    rows={2} 
                    placeholder="Key Skills (Technical & Soft Skills)" 
                    className="input-field resize-none" 
                />
                <textarea 
                    name="whyJob" 
                    value={params.whyJob} 
                    onChange={handleChange} 
                    rows={2} 
                    placeholder="Why this company?" 
                    className="input-field resize-none" 
                />
            </div>
        </div>

        {/* AI Config */}
        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl space-y-4 border dark:border-gray-700">
          <h4 className="font-semibold text-navy dark:text-blue-200 flex items-center gap-2">
            <Icon name="sparkles" size={18} /> AI Customization
          </h4>
          <div className="grid md:grid-cols-4 gap-4">
            {['tone', 'length', 'style', 'focus'].map((field) => (
              <select key={field} name={field} 
                value={params[field]} onChange={handleChange} 
                className="p-3 border border-gray-300 bg-white text-charcoal rounded-lg focus:ring-2 focus:ring-navy outline-none">
                {field === 'tone' && <><option>Confident</option><option>Formal</option><option>Enthusiastic</option><option>Warm</option></>}
                {field === 'length' && <><option>Standard</option><option>Short</option><option>Detailed</option></>}
                {field === 'style' && <><option>Corporate</option><option>Modern/Tech</option><option>Creative</option></>}
                {field === 'focus' && <><option>Balanced</option><option>Achievements</option><option>Skills</option><option>Culture</option></>}
              </select>
            ))}
          </div>
          <input name="keywords" value={params.keywords} onChange={handleChange} placeholder="ATS Keywords (comma-separated)" className="w-full p-3 border border-gray-300 bg-white text-charcoal rounded-lg outline-none" />
          <textarea name="customInstructions" value={params.customInstructions} onChange={handleChange} rows={2} placeholder="Custom Instructions (e.g., 'Mention my hackathon win')" className="w-full p-3 border border-gray-300 bg-white text-charcoal rounded-lg outline-none resize-none" />
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">{error}</div>}

        <button onClick={handleGenerate} disabled={isLoading} className="w-full bg-navy hover:bg-navy-light text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isLoading ? <Icon name="loader" className="animate-spin" /> : <Icon name="sparkles" />}
            {isLoading ? 'Writing Professional Letter...' : 'Generate with AI'}
        </button>
      </div>

      {/* Preview Section */}
      <div id="preview-section" className="flex flex-col gap-6">
        
        {/* Template Selector */}
        <div>
            <h3 className="text-lg font-semibold text-navy dark:text-white mb-4 flex items-center gap-2">
                <Icon name="layout" size={20} /> Choose Template
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TEMPLATES.map(t => (
                    <button
                        key={t.id}
                        onClick={() => setSelectedTemplate(t.id)}
                        className={`p-4 rounded-xl border transition-all text-left group ${selectedTemplate === t.id ? 'ring-2 ring-navy border-navy dark:border-blue-500 dark:ring-blue-500' : 'border-gray-200 hover:border-gray-400 dark:border-gray-700'}`}
                    >
                        <div className={`w-full h-24 mb-3 rounded-lg shadow-sm ${t.color} opacity-80 group-hover:opacity-100`}>
                            {/* Mini visual representation */}
                            <div className="w-full h-full bg-white opacity-20 transform scale-[0.8] rounded"></div>
                        </div>
                        <span className={`font-medium ${selectedTemplate === t.id ? 'text-navy dark:text-white' : 'text-gray-500'}`}>{t.name}</span>
                    </button>
                ))}
            </div>
        </div>

        <div className="bg-gray-200 dark:bg-gray-800 rounded-xl border dark:border-gray-700 shadow-inner flex flex-col overflow-hidden">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-950 border-b dark:border-gray-700 shadow-sm z-20">
                <h4 className="font-bold text-navy dark:text-white flex items-center gap-2 text-sm uppercase">Preview</h4>
                <div className="flex gap-2">
                     <button onClick={handleCopy} disabled={!generatedHtml || isLoading} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-all ${isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-100 hover:bg-gray-200 text-charcoal'}`}>
                        <Icon name={isCopied ? "check" : "copy"} size={14} /> {isCopied ? 'Copied' : 'Copy'}
                    </button>
                    <button onClick={handleExportPDF} disabled={!generatedHtml || isLoading} className="flex items-center gap-2 text-xs font-medium bg-navy hover:bg-navy-light text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50">
                        <Icon name="download" size={14} /> PDF
                    </button>
                </div>
            </div>

            {/* Editor Toolbar */}
            {generatedHtml && !isLoading && (
                <div className="bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700 px-4 py-2 flex gap-1 z-10 overflow-x-auto sticky top-0">
                    <FormatButton cmd="bold" icon="bold" label="Bold" />
                    <FormatButton cmd="italic" icon="italic" label="Italic" />
                    <FormatButton cmd="underline" icon="underline" label="Underline" />
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 self-center"></div>
                    <FormatButton onClick={handleInsertBullet} icon="list" label="Bullet List" />
                    <div className="w-px h-6 bg-gray-300 dark:bg-gray-700 mx-2 self-center"></div>
                    <FormatButton cmd="undo" icon="undo" label="Undo" />
                    <FormatButton cmd="redo" icon="redo" label="Redo" />
                </div>
            )}

            {/* Document Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-300 dark:bg-gray-900/50">
                {isLoading ? (
                    <div className="animate-pulse bg-white p-8 shadow-lg min-h-[600px] w-full mx-auto max-w-[210mm]">
                         <div className="h-32 bg-gray-100 mb-8 w-full flex">
                             <div className="w-7/12 bg-gray-200 h-full"></div>
                         </div>
                         <div className="space-y-4 px-4">
                            <div className="h-4 bg-gray-100 w-1/4"></div>
                            <div className="h-4 bg-gray-100 w-full"></div>
                            <div className="h-4 bg-gray-100 w-full"></div>
                            <div className="h-4 bg-gray-100 w-3/4"></div>
                         </div>
                    </div>
                ) : (
                    <div className={`bg-white shadow-2xl w-full mx-auto max-w-[210mm] min-h-[297mm] flex flex-col text-charcoal transition-all duration-300`}>
                        {/* Dynamic Header */}
                        {renderPreviewHeader()}

                        {/* Editable Body */}
                        <div className={`p-10 flex-1 relative ${selectedTemplate === 'classic' ? 'font-serif' : 'font-sans'}`}>
                            {generatedHtml ? (
                                <div 
                                    ref={editorRef}
                                    contentEditable
                                    suppressContentEditableWarning={true}
                                    className={`text-[11pt] leading-relaxed text-gray-800 focus:outline-none focus:bg-blue-50/20 p-2 -ml-2 rounded ${selectedTemplate === 'classic' ? 'font-serif' : 'font-sans'}`}
                                />
                            ) : (
                                <div className="text-gray-400 text-center mt-20 italic">
                                    Generated cover letter content will appear here...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <style>{`
        .input-field {
            width: 100%;
            padding: 1rem;
            border: 1px solid #e5e7eb;
            background-color: white;
            color: #1f2937;
            border-radius: 0.5rem;
            outline: none;
            transition: all 0.2s;
        }
        .input-field:focus {
            ring: 2px;
            ring-color: #001F3F;
            border-color: #001F3F;
        }
      `}</style>
    </div>
  );
};
