export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ExtractedSkills {
  [category: string]: string[];
}

export interface ChecklistRound {
  round: string;
  title: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  title: string;
  tasks: string[];
}

export type SkillConfidence = "know" | "practice";

export interface SkillConfidenceMap {
  [skill: string]: SkillConfidence;
}

export type CompanySize = "Startup" | "Mid-size" | "Enterprise";

export interface RoundMapping {
  round: string;
  title: string;
  why: string;
}

export interface CompanyIntel {
  name: string;
  industry: string;
  size: CompanySize;
  sizeLabel: string;
  hiringFocus: string;
  rounds: RoundMapping[];
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  updatedAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: ExtractedSkills;
  plan7Days: DayPlan[];
  checklist: ChecklistRound[];
  questions: string[];
  baseScore: number;
  finalScore: number;
  skillConfidenceMap: SkillConfidenceMap;
  companyIntel?: CompanyIntel;
}
