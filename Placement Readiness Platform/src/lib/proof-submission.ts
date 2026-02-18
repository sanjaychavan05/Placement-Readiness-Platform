import { z } from "zod";
import { allTestsPassed, getCheckedTests } from "./test-checklist";

const STORAGE_KEY = "prp_final_submission";

const urlSchema = z.string().trim().url({ message: "Must be a valid URL" });

export const submissionSchema = z.object({
  lovableLink: urlSchema,
  githubLink: urlSchema,
  deployedLink: urlSchema,
});

export type SubmissionLinks = z.infer<typeof submissionSchema>;

export interface StepStatus {
  label: string;
  completed: boolean;
}

const STEPS: { label: string; check: () => boolean }[] = [
  { label: "JD Analyzer built", check: () => true },
  { label: "Skill extraction engine", check: () => true },
  { label: "Round mapping engine", check: () => true },
  { label: "7-day prep plan generator", check: () => true },
  { label: "Interactive readiness scoring", check: () => true },
  { label: "History persistence", check: () => true },
  { label: "Company intel layer", check: () => true },
  { label: "Test checklist passed", check: () => allTestsPassed(getCheckedTests()) },
];

export function getStepStatuses(): StepStatus[] {
  return STEPS.map((s) => ({ label: s.label, completed: s.check() }));
}

export function allStepsCompleted(): boolean {
  return STEPS.every((s) => s.check());
}

export function getSavedLinks(): Partial<SubmissionLinks> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLinks(links: SubmissionLinks): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
}

export function allLinksProvided(): boolean {
  const links = getSavedLinks();
  const result = submissionSchema.safeParse(links);
  return result.success;
}

export function isShipped(): boolean {
  return allStepsCompleted() && allTestsPassed(getCheckedTests()) && allLinksProvided();
}

export function generateSubmissionText(links: SubmissionLinks): string {
  return `------------------------------------------
Placement Readiness Platform — Final Submission

Lovable Project: ${links.lovableLink}
GitHub Repository: ${links.githubLink}
Live Deployment: ${links.deployedLink}

Core Capabilities:
- JD skill extraction (deterministic)
- Round mapping engine
- 7-day prep plan
- Interactive readiness scoring
- History persistence
------------------------------------------`;
}
