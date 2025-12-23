
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ToolCard } from './ToolCard.jsx';
import { Modal } from './Modal.jsx';
import { CoverLetterTool } from './CoverLetterTool.jsx';
import { InterviewPrepTool } from './InterviewPrepTool.jsx';
import { LinkedInBioTool } from './LinkedInBioTool.jsx';
import { PortfolioTool } from './PortfolioTool.jsx';
import { OfferLetterTool } from './OfferLetterTool.jsx';
import { HRPolicyTool } from './HRPolicyTool.jsx';
import { SalaryScriptTool } from './SalaryScriptTool.jsx';
import { ResumeBuilderTool } from './ResumeBuilderTool.jsx';
import { CareerAnimation } from './CareerAnimation.jsx';
import { SubToolsAnimation } from './SubToolsAnimation.jsx';
import { Icon } from './Icon.jsx';

const TOOLS = [
  { id: 'cover', title: 'AI Cover Letter', description: 'Fully customizable AI-powered cover letters tailored to your dream job.', iconName: 'mail' },
  { id: 'resume', title: 'Resume Builder', description: 'Create professional resumes with real-time preview and corporate themes.', iconName: 'file-text' },
  { id: 'interview', title: 'Interview Prep', description: 'Role-specific Q&A generator to practice confidently.', iconName: 'message-square' },
  { id: 'linkedin', title: 'LinkedIn Bio', description: 'Generate 3 professional versions of your LinkedIn summary.', iconName: 'linkedin' },
  { id: 'portfolio', title: 'Portfolio Creator', description: 'Export a simple portfolio page as HTML or PDF.', iconName: 'briefcase' },
  { id: 'offer', title: 'Offer Letter', description: 'Professional templates for accepting or negotiating offers.', iconName: 'handshake' },
  { id: 'hr', title: 'HR Policies', description: 'Ready-to-use policy library for small businesses.', iconName: 'scroll-text' },
  { id: 'salary', title: 'Salary Script', description: 'Confident scripts for salary negotiation.', iconName: 'dollar-sign' },
];

export const CareerSuite = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderToolContent = (toolId) => {
    switch (toolId) {
        case 'cover': return <CoverLetterTool />;
        case 'resume': return <ResumeBuilderTool />;
        case 'interview': return <InterviewPrepTool />;
        case 'linkedin': return <LinkedInBioTool />;
        case 'portfolio': return <PortfolioTool />;
        case 'offer': return <OfferLetterTool />;
        case 'hr': return <HRPolicyTool />;
        case 'salary': return <SalaryScriptTool />;
        default: return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className="bg-white/90 dark:bg-gray-950/90 backdrop-blur sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
              <Link to="/" className="p-2 -ml-2 text-gray-400 hover:text-navy dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800" title="Back to Home">
                <Icon name="arrow-left" size={24} />
              </Link>
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-navy p-2 rounded-lg text-white group-hover:bg-blue-800 transition-colors">
                    <Icon name="sparkles" size={20} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-navy dark:text-white">Stratify AI</h1>
              </Link>
          </div>
          
          <div className="flex items-center gap-4">
              <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button className="px-4 py-1.5 text-sm font-bold bg-white dark:bg-gray-700 shadow-sm text-navy dark:text-white rounded-md cursor-default">Career</button>
                  <Link to="/business" className="px-4 py-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-navy dark:hover:text-white rounded-md transition-colors">Startup</Link>
              </div>
          </div>
        </nav>
      </header>

      <main className="flex-grow w-full relative">
        
        {/* Animated Hero Section */}
        <section className="relative overflow-hidden bg-navy text-white py-24 px-8 text-center shadow-2xl group animate-fade-in-up z-10">
            <CareerAnimation />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent pointer-events-none"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium text-blue-200 mb-6 border border-white/20 animate-float">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                    AI-Powered Career Intelligence
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight tracking-tight drop-shadow-sm">
                    Stratify AI <br /> 
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">
                        Intelligent Career Companion
                    </span>
                </h2>
                <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto drop-shadow-sm">
                    Accelerate your professional journey with our suite of corporate-grade AI agents. Build resumes, draft policies, and prep for interviews in seconds.
                </p>
                <button 
                    onClick={() => document.getElementById('tools')?.scrollIntoView({ behavior: 'smooth' })}
                    className="group relative bg-white text-navy px-8 py-4 rounded-full font-bold text-lg hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Explore CareerTools <Icon name="arrow-right" size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                </button>
            </div>
        </section>

        {/* Tools Section with Background */}
        <section id="tools" className="relative scroll-mt-24 py-16 px-6">
            {/* Full Screen Background Animation behind Grid */}
            <SubToolsAnimation />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                        <div className="bg-navy text-white p-3 rounded-xl shadow-lg shadow-blue-900/20">
                            <Icon name="briefcase" size={24} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-navy dark:text-white">CareerTools Pro</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Powered by Stratify AI</p>
                        </div>
                    </div>
                    <span className="hidden md:inline-block text-sm font-medium bg-white/80 dark:bg-gray-800/80 backdrop-blur border dark:border-gray-700 px-4 py-2 rounded-full text-gray-600 dark:text-gray-300 shadow-sm">
                        {TOOLS.length} specialized agents
                    </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                    {TOOLS.map((tool, index) => (
                        <div key={tool.id} className="opacity-0 animate-fade-in-up h-full" style={{ animationDelay: `${index * 100}ms` }}>
                            <ToolCard 
                                tool={tool} 
                                onClick={(t) => setActiveTool(t)} 
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-12 border-t border-gray-200 dark:border-gray-800 relative z-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="bg-navy p-1.5 rounded text-white">
                     <Icon name="sparkles" size={16} />
                </div>
                <span className="text-lg font-bold text-navy dark:text-white">Stratify AI</span>
            </div>
            <p className="text-sm">&copy; 2025 Stratify AI. All rights reserved.</p>
        </div>
      </footer>

      <button 
        onClick={() => setDarkMode(!darkMode)}
        className="fixed bottom-8 right-8 bg-white dark:bg-navy text-navy dark:text-white p-4 rounded-full shadow-2xl z-40 hover:scale-110 transition-transform border border-gray-200 dark:border-gray-700"
        aria-label="Toggle Dark Mode"
      >
        <Icon name={darkMode ? 'sun' : 'moon'} />
      </button>

      <Modal 
        isOpen={!!activeTool} 
        onClose={() => setActiveTool(null)}
        title={activeTool?.title}
      >
        {activeTool && renderToolContent(activeTool.id)}
      </Modal>

    </div>
  );
};
