
export interface LifestyleParams {
    type: 'wedding' | 'birthday' | 'meal' | 'fitness' | 'relationship' | 'parenting';
    data: any;
}

export interface MealPlanResult {
    overview: string;
    schedule: { day: string; meals: string[] }[];
    shoppingList: string[];
}

export interface FitnessPlanResult {
    goal: string;
    schedule: { day: string; focus: string; exercises: string[] }[];
}

export interface RelationshipGuideResult {
    title: string;
    introduction: string;
    steps: { title: string; description: string }[];
    closing: string;
}

export interface ParentingTemplateResult {
    title: string;
    columns: string[];
    rows: string[];
    tips: string[];
}

export interface CoverLetterParams {
  candidateName: string;
  candidateTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  address: string;
  jobRole: string;
  companyName: string;
  experience: string;
  skills: string;
  whyJob: string;
  tone: string;
  length: string;
  style: string;
  focus: string;
  careerLevel: string;
  keywords: string;
  customInstructions: string;
}

export interface InterviewParams {
  jobRole: string;
  industry: string;
  experienceLevel: string;
  questionType: string;
  jobDescription: string;
  resume?: {
    data: string;
    mimeType: string;
  };
}

export interface LinkedInParams {
  currentRole: string;
  industry: string;
  skills: string;
  achievements: string;
  tone: string;
}

export interface OfferLetterParams {
  type: string;
  candidateName: string;
  hiringManagerName: string;
  companyName: string;
  jobTitle: string;
  offerDetails: string;
  targetCompensation: string;
  negotiationFocus: string;
  declineReason: string;
  tone: string;
}

export interface HRPolicyParams {
  policyType: string;
  companyName: string;
  industry: string;
  jurisdiction: string;
  customRules: string;
}

export interface SalaryScriptParams {
  jobRole: string;
  companyName: string;
  currentOffer: string;
  targetSalary: string;
  experience: string;
  negotiationStage: string;
  leverage: string;
}

export interface ResumeParams {
  careerLevel: string;
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  linkedin: string;
  education: string;
  experience: string;
  skills: string;
}

export interface PitchDeckParams {
  companyName: string;
  rawData: string;
}

export interface PitchDeckSlide {
  title: string;
  content: string[];
  visualIdea: string;
}

export interface PitchDeckResult {
  slides: PitchDeckSlide[];
}

export interface FinancialModelResult {
  executiveSummary: string;
  keyAssumptions: string[];
  financialForecast: {
    category: string;
    year1: string;
    year2: string;
    year3: string;
    year4: string;
    year5: string;
  }[];
  revenueModel: string;
  costStructure: string;
  unitEconomics: string;
  fundingRequirements: string;
  valuation: string;
}

export interface LegalAgreementParams {
  agreementType: string;
  partyA: string;
  partyB: string;
  jurisdiction: string;
  keyTerms: string;
}

export interface BrandingKitParams {
  brandName: string;
  industry: string;
  description: string;
  audience: string;
  values: string;
  designPreferences: string;
}

export interface BrandingKitResult {
  overview: {
    mission: string;
    vision: string;
    values: string[];
    personality: string;
  };
  logo: {
    primaryConcept: string;
    secondaryConcept: string;
    usage: string;
  };
  colors: {
    name: string;
    hex: string;
    usage: string;
  }[];
  typography: {
    headings: string;
    body: string;
    usage: string;
  };
  imagery: {
    style: string;
    guidelines: string;
  };
  voice: {
    tone: string;
    messaging: string[];
  };
  applications: string;
}

export interface MarketingPlanParams {
  productName: string;
  targetAudience: string;
  goals: string;
  budget: string;
  channels: string;
  rawContext: string;
}

export interface MarketingPlanResult {
  executiveSummary: string;
  marketResearch: string;
  goalsKPIs: string[];
  brandPositioning: string;
  marketingStrategy: string[];
  budgetAllocation: string;
  timelineRoadmap: string;
  metricsReporting: string;
  risksMitigation: string;
}

export interface SOPParams {
  procedureName: string;
  department: string;
  rawProcess: string;
}

export interface SOPResult {
  title: string;
  purpose: string;
  scope: string;
  definitions: string;
  responsibilities: string;
  procedureSteps: string[];
  toolsResources: string;
  complianceSafety: string;
  references: string;
  revisionHistory: string;
}

export interface PersonaParams {
  productDescription: string;
  targetAudience: string;
}

export interface PersonaResult {
  name: string;
  demographics: string;
  psychographics: string;
  goalsChallenges: string;
  painPoints: string;
  buyingBehavior: string;
  messaging: string;
  visualStyle: string;
}
