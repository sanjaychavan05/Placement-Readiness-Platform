const STORAGE_KEY = "placement-test-checklist";

export interface TestItem {
  id: string;
  label: string;
  hint: string;
}

export const TEST_ITEMS: TestItem[] = [
  {
    id: "jd-required",
    label: "JD required validation works",
    hint: "Go to Practice, leave JD empty, verify Analyze button is disabled.",
  },
  {
    id: "short-jd-warning",
    label: "Short JD warning shows for <200 chars",
    hint: "Type a few words in the JD field — a warning banner should appear.",
  },
  {
    id: "skills-extraction",
    label: "Skills extraction groups correctly",
    hint: "Paste a JD mentioning React, Java, SQL — verify they appear under correct categories.",
  },
  {
    id: "round-mapping",
    label: "Round mapping changes based on company + skills",
    hint: "Analyze with 'Amazon' vs an unknown name — round timelines should differ.",
  },
  {
    id: "score-deterministic",
    label: "Score calculation is deterministic",
    hint: "Analyze the same JD twice — base score should be identical.",
  },
  {
    id: "skill-toggles",
    label: "Skill toggles update score live",
    hint: "After analysis, click skill badges — readiness score should change instantly.",
  },
  {
    id: "persist-refresh",
    label: "Changes persist after refresh",
    hint: "Toggle a skill, refresh the page, navigate back to the entry — change should remain.",
  },
  {
    id: "history-saves",
    label: "History saves and loads correctly",
    hint: "Analyze a JD, go to Assessments — the entry should appear in the list.",
  },
  {
    id: "export-buttons",
    label: "Export buttons copy the correct content",
    hint: "Click 'Copy 7-day plan' — paste into a text editor and verify content.",
  },
  {
    id: "no-console-errors",
    label: "No console errors on core pages",
    hint: "Open browser DevTools, navigate Dashboard → Practice → Assessments — no red errors.",
  },
];

export function getCheckedTests(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function setCheckedTests(state: Record<string, boolean>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetChecklist(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getPassedCount(state: Record<string, boolean>): number {
  return TEST_ITEMS.filter((t) => state[t.id] === true).length;
}

export function allTestsPassed(state: Record<string, boolean>): boolean {
  return getPassedCount(state) === TEST_ITEMS.length;
}
