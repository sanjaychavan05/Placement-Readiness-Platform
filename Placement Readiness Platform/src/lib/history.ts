import type { AnalysisEntry } from "./types";

const STORAGE_KEY = "placement-analysis-history";

function isValidEntry(e: unknown): e is AnalysisEntry {
  if (!e || typeof e !== "object") return false;
  const obj = e as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.createdAt === "string" &&
    typeof obj.jdText === "string" &&
    typeof obj.baseScore === "number" &&
    typeof obj.finalScore === "number" &&
    Array.isArray(obj.plan7Days) &&
    Array.isArray(obj.checklist) &&
    Array.isArray(obj.questions)
  );
}

let _corruptedCount = 0;

export function getCorruptedCount(): number {
  return _corruptedCount;
}

export function getHistory(): AnalysisEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    _corruptedCount = 0;
    const valid: AnalysisEntry[] = [];
    for (const item of parsed) {
      if (isValidEntry(item)) {
        valid.push(item);
      } else {
        _corruptedCount++;
      }
    }
    return valid;
  } catch {
    _corruptedCount = 1;
    return [];
  }
}

export function saveEntry(entry: AnalysisEntry): void {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateEntry(entry: AnalysisEntry): void {
  const history = getHistory().map((e) => (e.id === entry.id ? entry : e));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getEntryById(id: string): AnalysisEntry | undefined {
  return getHistory().find((e) => e.id === id);
}

export function deleteEntry(id: string): void {
  const history = getHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}
