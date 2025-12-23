
import { GoogleGenAI } from "@google/genai";
import { 
    LifestyleParams,
    CoverLetterParams,
    InterviewParams,
    LinkedInParams,
    ResumeParams,
    OfferLetterParams,
    HRPolicyParams,
    SalaryScriptParams,
    PitchDeckParams,
    FinancialModelResult,
    LegalAgreementParams,
    BrandingKitParams,
    MarketingPlanParams,
    SOPParams,
    PersonaParams
} from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const cleanJson = (text: string) => {
    if (!text) return "{}";
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
};

// --- CAREER SUITE ---

export const generateCoverLetter = async (params: CoverLetterParams) => {
    const prompt = `Write a professional cover letter.
    Candidate: ${params.candidateName}, ${params.candidateTitle}.
    Role: ${params.jobRole} at ${params.companyName}.
    Experience: ${params.experience}.
    Skills: ${params.skills}.
    Tone: ${params.tone}. Style: ${params.style}.
    Why this job: ${params.whyJob}.
    Custom: ${params.customInstructions}.
    Output Format: HTML formatted string (use <br> for newlines, <b> for bold). Do NOT output JSON. Just the letter body.`;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text || "";
};

export const generateInterviewPrep = async (params: InterviewParams) => {
    const promptText = `Generate 7 interview questions and answers for a ${params.jobRole} role in ${params.industry}.
    Level: ${params.experienceLevel}. Type: ${params.questionType}.
    Context from Job Description: ${params.jobDescription}.
    ${params.resume ? "IMPORTANT: A resume is provided. Analyze it to identify the candidate's soft skills (e.g., leadership, communication, adaptability) and key experiences. Tailor the questions to specifically probe these soft skills and experiences based on the resume content." : ""}
    Output JSON Array: [{ "question": "...", "tip": "Analysis of why this is asked (mentioning specific resume soft skill if applicable)...", "answer": "Key talking points..." }]`;

    let contents: any = promptText;

    if (params.resume) {
        contents = {
            parts: [
                { text: promptText },
                { inlineData: { mimeType: params.resume.mimeType, data: params.resume.data } }
            ]
        };
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: contents,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

export const generateLinkedInBios = async (params: LinkedInParams) => {
    const prompt = `Generate 3 LinkedIn Bios for: ${params.currentRole} in ${params.industry}.
    Skills: ${params.skills}. Achievements: ${params.achievements}. Tone: ${params.tone}.
    Output JSON Array: [{ "style": "Professional/Creative/Short", "headline": "...", "content": "...", "hashtags": ["#..."] }]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

export const generatePortfolioContent = async (params: any) => {
    const prompt = `Polish this portfolio content.
    Bio: ${params.bio}
    Projects: ${JSON.stringify(params.projects)}
    Output JSON: { "bio": "Improved bio...", "projects": [{ "id": "...", "description": "Improved description..." }] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateOfferLetter = async (params: OfferLetterParams) => {
    const prompt = `Write a ${params.type} email for a job offer.
    Me: ${params.candidateName}. Company: ${params.companyName}. Role: ${params.jobTitle}.
    Details: ${params.offerDetails}.
    Negotiation Focus: ${params.negotiationFocus}. Target Comp: ${params.targetCompensation}.
    Decline Reason: ${params.declineReason}.
    Tone: ${params.tone}.
    Output plain text email draft.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text || "";
};

export const generateHRPolicy = async (params: HRPolicyParams) => {
    const prompt = `Write a comprehensive HR Policy for ${params.policyType}.
    Company: ${params.companyName} (${params.industry}).
    Jurisdiction: ${params.jurisdiction}.
    Rules: ${params.customRules}.
    Output Markdown formatted text. Use headers, bullets.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text || "";
};

export const generateSalaryNegotiation = async (params: SalaryScriptParams) => {
    const prompt = `Create a salary negotiation script.
    Role: ${params.jobRole}. Current Offer: ${params.currentOffer}. Target: ${params.targetSalary}.
    Stage: ${params.negotiationStage}. Leverage: ${params.leverage}.
    Output JSON: { "script": "The exact words to say...", "tips": ["Tip 1", "Tip 2"], "reasoning": "Why this approach works..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateResume = async (params: ResumeParams) => {
    const prompt = `Create a resume structure.
    Name: ${params.fullName}, Title: ${params.jobTitle}.
    Info: ${params.email}, ${params.phone}, ${params.linkedin}.
    Level: ${params.careerLevel}.
    Experience Input: ${params.experience}.
    Education Input: ${params.education}.
    Skills Input: ${params.skills}.
    Output JSON: { 
        "fullName": "...", "jobTitle": "...", 
        "contactInfo": { "email": "...", "phone": "...", "linkedin": "..." },
        "professionalSummary": "...", 
        "experience": [{ "role": "...", "company": "...", "duration": "...", "achievements": ["..."] }],
        "education": [{ "degree": "...", "institution": "...", "year": "...", "details": "..." }],
        "skills": ["..."]
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

// --- BUSINESS SUITE ---

export const generateBusinessContent = async (topic: string, details: any) => {
    const prompt = `Generate content for ${topic}. Details: ${JSON.stringify(details)}. Output formatted text.`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text || "";
};

export const analyzeBusinessPlan = async (data: any) => {
    const prompt = `Analyze this business idea and create a plan.
    Title: ${data.ideaTitle}. Industry: ${data.industry}.
    Desc: ${data.description}. Market: ${data.targetMarket}. Goals: ${data.goals}.
    Output JSON: { 
        "title": "...", "executiveSummary": "...", "marketAnalysis": "...", 
        "pros": ["..."], "cons": ["..."], 
        "financialOutlook": "...", "futureRoadmap": "...", "conclusion": "..." 
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generatePitchDeck = async (params: PitchDeckParams) => {
    const prompt = `Create a 10-12 slide investor pitch deck structure for ${params.companyName}.
    Raw Context: ${params.rawData}.
    Output JSON: { "slides": [{ "title": "Slide Title", "content": ["Bullet 1", "Bullet 2"], "visualIdea": "Description of image/chart" }] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateFinancialModel = async (params: { rawInput: string }) => {
    const prompt = `Create a financial forecast model.
    Input: ${params.rawInput}.
    Output JSON: { 
        "executiveSummary": "...", "keyAssumptions": ["..."],
        "financialForecast": [{ "category": "Revenue/Expense Item", "year1": "100k", "year2": "...", "year3": "...", "year4": "...", "year5": "..." }],
        "revenueModel": "...", "costStructure": "...", "unitEconomics": "...", 
        "fundingRequirements": "...", "valuation": "..." 
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateLegalAgreement = async (params: LegalAgreementParams) => {
    const prompt = `Draft a legal agreement. Type: ${params.agreementType}.
    Party A: ${params.partyA}. Party B: ${params.partyB}.
    Jurisdiction: ${params.jurisdiction}. Key Terms: ${params.keyTerms}.
    Output Markdown text.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
    });
    return response.text || "";
};

export const generateBrandingKit = async (params: BrandingKitParams) => {
    const prompt = `Create a brand identity kit.
    Brand: ${params.brandName}. Industry: ${params.industry}. Desc: ${params.description}.
    Audience: ${params.audience}. Values: ${params.values}. Preferences: ${params.designPreferences}.
    Output JSON: { 
        "overview": { "mission": "...", "vision": "...", "values": ["..."], "personality": "..." },
        "logo": { "primaryConcept": "...", "secondaryConcept": "...", "usage": "..." },
        "colors": [{ "name": "...", "hex": "...", "usage": "..." }],
        "typography": { "headings": "...", "body": "...", "usage": "..." },
        "imagery": { "style": "...", "guidelines": "..." },
        "voice": { "tone": "...", "messaging": ["..."] },
        "applications": "..."
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateMarketingPlan = async (params: MarketingPlanParams) => {
    const prompt = `Create a marketing plan.
    Product: ${params.productName}. Target: ${params.targetAudience}. Goals: ${params.goals}.
    Budget: ${params.budget}. Channels: ${params.channels}. Context: ${params.rawContext}.
    Output JSON: { 
        "executiveSummary": "...", "marketResearch": "...", "goalsKPIs": ["..."], "brandPositioning": "...", 
        "marketingStrategy": ["..."], "budgetAllocation": "...", "timelineRoadmap": "...", 
        "metricsReporting": "...", "risksMitigation": "..." 
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateSOP = async (params: SOPParams) => {
    const prompt = `Create a Standard Operating Procedure (SOP).
    Procedure: ${params.procedureName}. Dept: ${params.department}. Raw Process: ${params.rawProcess}.
    Output JSON: { 
        "title": "...", "purpose": "...", "scope": "...", "definitions": "...", 
        "responsibilities": "...", "procedureSteps": ["..."], "toolsResources": "...", 
        "complianceSafety": "...", "references": "...", "revisionHistory": "..." 
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generatePersonas = async (params: PersonaParams) => {
    const prompt = `Generate 3 customer personas for: ${params.productDescription}.
    Target Audience: ${params.targetAudience}.
    Output JSON Array: [{ 
        "name": "...", "demographics": "...", "psychographics": "...", 
        "goalsChallenges": "...", "painPoints": "...", "buyingBehavior": "...", 
        "messaging": "...", "visualStyle": "..." 
    }]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

// --- FINANCE SUITE ---

export const generateTaxComputation = async (params: any) => {
    const prompt = `Estimate tax liability and provide breakdown.
    Status: ${params.status}. Income: ${params.income}. Deductions: ${params.deductions}. Region: ${params.region}.
    Output JSON: { "estimatedTax": "...", "breakdown": ["..."], "recommendations": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateInvestmentAnalysis = async (params: any) => {
    const prompt = `Analyze this investment portfolio. Assets: ${params.assets}. Goals: ${params.goals}.
    Output JSON: { "portfolioHealth": "...", "projectedGrowth": "...", "assetAllocation": "Markdown Table string...", "analysis": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateBudgetPlan = async (params: any) => {
    const prompt = `Create a budget plan. Income: ${params.income}. Expenses: ${params.expenses}. Goal: ${params.goal}.
    Output JSON: { "summary": "...", "allocationTable": "Markdown Table string...", "savingsRate": "...", "tips": ["..."] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateComplianceChecklist = async (entity: string, region: string) => {
    const prompt = `Generate annual compliance checklist for ${entity} in ${region}.
    Output JSON: { "checklist": [{ "category": "...", "item": "...", "dueDate": "...", "formName": "..." }] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateAuditChecklist = async (type: string, context: string) => {
    const prompt = `Create an audit checklist for ${type}. Context: ${context}.
    Output JSON: { "title": "...", "scope": "...", "checklist": ["..."] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateInvoiceTemplate = async (params: any) => {
    const prompt = `Generate invoice data.
    From: ${params.from}. To: ${params.to}. Items: ${params.items}. Notes: ${params.notes}.
    Output JSON: { 
        "invoiceNumber": "INV-...", "date": "...", "dueDate": "...", 
        "from": "...", "to": "...", 
        "items": [{ "description": "...", "quantity": 1, "rate": 100, "amount": 100 }], 
        "subtotal": 100, "taxLabel": "Tax", "tax": 10, "total": 110, "notes": "..." 
    }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

// --- CODING SUITE ---

export const generateCodeSnippets = async (params: any) => {
    const prompt = `Generate 3 useful code snippets for ${params.language}. Topic: ${params.topic}.
    Output JSON Array: [{ "title": "...", "explanation": "...", "code": "..." }]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

export const generateMicroApp = async (params: any) => {
    const prompt = `Create a micro app for ${params.type}. Features: ${params.features}.
    Output JSON: { "files": [{ "name": "index.html", "content": "...", "language": "html" }, { "name": "script.js", "content": "...", "language": "javascript" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateApiConnector = async (params: any) => {
    const prompt = `Create an API connector code for ${params.url} using ${params.method} in ${params.language}.
    Output JSON: { "files": [{ "name": "api.js", "content": "...", "language": "javascript" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateAutomationScript = async (params: any) => {
    const prompt = `Create an automation script. Task: ${params.taskType}. Language: ${params.language}. Details: ${params.details}.
    Output JSON: { "files": [{ "name": "script.py", "content": "...", "language": "python" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateWireframe = async (params: any) => {
    const prompt = `Generate a UI wireframe structure code (HTML/Tailwind) for ${params.platform}. Desc: ${params.description}.
    Output JSON: { "files": [{ "name": "layout.html", "content": "...", "language": "html" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateAppTemplate = async (params: any) => {
    const prompt = `Generate mobile app boilerplate for ${params.framework}. Name: ${params.appName}. Type: ${params.type}.
    Output JSON: { "files": [{ "name": "App.js", "content": "...", "language": "javascript" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateWebsiteTemplate = async (params: any) => {
    const prompt = `Generate website template code. Style: ${params.style}. Stack: ${params.techStack}. Desc: ${params.description}.
    Output JSON: { "files": [{ "name": "index.html", "content": "...", "language": "html" }, { "name": "style.css", "content": "...", "language": "css" }], "instructions": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

// --- PRODUCTIVITY SUITE ---

export const generateNotionTemplate = async (category: string, focus: string) => {
    const prompt = `Create a Notion template structure for ${category}. Focus: ${focus}. Output formatted Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateStudyPlanner = async (input: string) => {
    const prompt = `Create a study plan based on: ${input}. Output formatted Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateQuickStudyTable = async (subjects: string, hours: string) => {
    const prompt = `Create a weekly study timetable. Subjects: ${subjects}. Hours/Day: ${hours}. Output Markdown Table.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateDigitalPlanner = async (context: string) => {
    const prompt = `Create a digital planner structure/outline. Context: ${context}. Output Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateHabitTracker = async (prefs: string) => {
    const prompt = `Create a habit tracker routine. Preferences: ${prefs}. Output Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generatePersonalFinanceTracker = async (input: string) => {
    const prompt = `Create a personal finance plan/tracker. Input: ${input}. Output Markdown with tables.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateTimeBlocker = async (hours: string, priorities: string, tasks: string) => {
    const prompt = `Create a time-blocked schedule. Hours: ${hours}. Priorities: ${priorities}. Tasks: ${tasks}. Output Markdown Table.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateMeetingMinutes = async (rawNotes: string) => {
    const prompt = `Format these meeting notes into professional Minutes. Raw: ${rawNotes}. Output Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

// --- EDUCATION SUITE ---

export const generateCheatSheet = async (input: string | { name: string, data: string, mimeType: string }) => {
    let contents: any[] = [];
    if (typeof input === 'string') {
        contents = [{ role: 'user', parts: [{ text: `Create a comprehensive cheat sheet summary for: ${input}. Output Markdown.` }] }];
    } else {
        contents = [{ role: 'user', parts: [
            { text: "Create a comprehensive cheat sheet summary based on this document/image. Output Markdown." },
            { inlineData: { mimeType: input.mimeType, data: input.data } }
        ]}];
    }
    // Note: generateContent takes "contents" which can be a string or array of parts. 
    // The library signature is flexible but strict on types. 
    // Best way for single request:
    const payload = typeof input === 'string' 
        ? `Create a comprehensive cheat sheet summary for: ${input}. Output Markdown.`
        : { parts: [{ text: "Create a comprehensive cheat sheet summary based on this document/image. Output Markdown." }, { inlineData: { mimeType: input.mimeType, data: input.data } }] };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: payload as any
    });
    return response.text || "";
};

export const generateStudyNotes = async (input: string | { name: string, data: string, mimeType: string }) => {
    const payload = typeof input === 'string' 
        ? `Create detailed study notes for: ${input}. Use bullet points and headers. Output Markdown.`
        : { parts: [{ text: "Create detailed study notes based on this document/image. Use bullet points and headers. Output Markdown." }, { inlineData: { mimeType: input.mimeType, data: input.data } }] };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: payload as any
    });
    return response.text || "";
};

export const generateExamGuide = async (input: string | { name: string, data: string, mimeType: string }) => {
    const payload = typeof input === 'string' 
        ? `Create an exam preparation guide and timeline for: ${input}. Output Markdown.`
        : { parts: [{ text: "Create an exam preparation guide and timeline based on this syllabus. Output Markdown." }, { inlineData: { mimeType: input.mimeType, data: input.data } }] };

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: payload as any
    });
    return response.text || "";
};

export const generateQuestionBank = async (subject: string, chapter: string, type: string, count: string) => {
    const prompt = `Generate a question bank. Subject: ${subject}. Chapter: ${chapter}. Type: ${type}. Count: ${count}. Include Answers at the end. Output Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateAssignmentTemplate = async (type: string, topic: string) => {
    const prompt = `Create an assignment outline/structure for a ${type} on the topic: ${topic}. Output Markdown.`;
    const response = await ai.models.generateContent({ model: "gemini-2.5-flash", contents: prompt });
    return response.text || "";
};

export const generateFlashcards = async (topic: string, count: string) => {
    const prompt = `Generate ${count} flashcards for ${topic}. Output JSON Array: [{ "front": "Question/Term", "back": "Answer/Definition" }]`;
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

// --- CREATIVITY SUITE ---

export const generateReelsScript = async (params: any) => {
    const prompt = `Write a Reels/TikTok script. Topic: ${params.topic}. Niche: ${params.niche}. Tone: ${params.tone}.
    Output JSON: { "hook": "...", "body": ["Scene 1", "Scene 2"], "cta": "...", "visualCues": "...", "caption": "...", "hashtags": ["..."] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateContentCalendar = async (params: any) => {
    const prompt = `Generate a content calendar. Month: ${params.month}. Niche: ${params.niche}. Platform: ${params.platform}.
    Output JSON Array: [{ "day": "Day 1", "idea": "...", "format": "Reel/Post/Story" }]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "[]"));
};

export const generateMediaKitData = async (params: any) => {
    const prompt = `Generate media kit content. Name: ${params.name}. Niche: ${params.niche}.
    Bio: ${params.bio}. Stats: ${params.followers} followers, ${params.engagement} engagement.
    Output JSON: { "bio": "Professional Bio...", "audienceDemographics": "...", "collaborationIdeas": ["..."] }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

export const generateDesignConcept = async (params: any) => {
    const prompt = `Create a design concept for a ${params.type}. Style: ${params.style}. Text: ${params.text}. Colors: ${params.colors}.
    Output JSON: { "headline": "...", "colorPalette": ["#hex", "#hex"], "layoutDescription": "..." }`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};

// --- LIFESTYLE SUITE ---

export const generateLifestyleContent = async (params: LifestyleParams): Promise<any> => {
    let prompt = "";
    
    if (params.type === 'meal') {
        prompt = `Create a ${params.data.duration}-day meal plan. Goal: ${params.data.goal}. Diet: ${params.data.diet || 'Standard'}.
        Output JSON: { "overview": "...", "schedule": [{ "day": "Day 1", "meals": ["Breakfast:...", "Lunch:...", "Dinner:..."] }], "shoppingList": ["Item 1", "Item 2"] }`;
    } 
    else if (params.type === 'fitness') {
        prompt = `Create a weekly workout routine. Level: ${params.data.level}. Goal: ${params.data.goal}.
        Output JSON: { "goal": "...", "schedule": [{ "day": "Monday", "focus": "Upper Body", "exercises": ["Pushups 3x10", "..."] }] }`;
    }
    else if (params.type === 'relationship') {
        prompt = `Provide relationship advice for: ${params.data.situation}. Context: ${params.data.context}.
        Output JSON: { "title": "...", "introduction": "...", "steps": [{ "title": "Step 1", "description": "..." }], "closing": "..." }`;
    }
    else if (params.type === 'parenting') {
        prompt = `Create a parenting chart structure for: ${params.data.chartType}. Child Age: ${params.data.age}.
        Output JSON: { "title": "...", "columns": ["Mon", "Tue"...], "rows": ["Brush Teeth", "Clean Room"...], "tips": ["Tip 1..."] }`;
    }
    else if (params.type === 'wedding') {
        prompt = `Create a wedding invitation text. Couple: ${params.data.couple}. Date: ${params.data.date}. Venue: ${params.data.venue}. Style: ${params.data.style}.
        Output JSON: { "headline": "...", "body": "...", "rsvp": "..." }`;
    }
    else if (params.type === 'birthday') {
        prompt = `Create a birthday invitation text. Name: ${params.data.name}. Age: ${params.data.age}. Date: ${params.data.date}. Location: ${params.data.location}. Theme: ${params.data.theme}.
        Output JSON: { "headline": "...", "body": "...", "details": "..." }`;
    }

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
    });
    return JSON.parse(cleanJson(response.text || "{}"));
};
