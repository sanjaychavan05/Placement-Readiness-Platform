import { useMemo, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { updateEntry } from "@/lib/history";
import { computeFinalScore } from "@/lib/jd-analyzer";
import type { AnalysisEntry, SkillConfidence } from "@/lib/types";
import { CompanyIntelCard } from "./CompanyIntelCard";
import { RoundTimeline } from "./RoundTimeline";
import {
  CheckCircle2,
  FileText,
  CalendarDays,
  HelpCircle,
  ArrowRight,
  Copy,
  Download,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  entry: AnalysisEntry;
  onUpdate?: (entry: AnalysisEntry) => void;
}

export function AnalysisResults({ entry, onUpdate }: Props) {
  const liveScore = entry.finalScore;

  const persist = useCallback(
    (updated: AnalysisEntry) => {
      updateEntry(updated);
      onUpdate?.(updated);
    },
    [onUpdate]
  );

  const toggleSkill = useCallback(
    (skill: string) => {
      const map = { ...(entry.skillConfidenceMap ?? {}) };
      const current: SkillConfidence = map[skill] ?? "practice";
      map[skill] = current === "know" ? "practice" : "know";
      const updated: AnalysisEntry = {
        ...entry,
        skillConfidenceMap: map,
        updatedAt: new Date().toISOString(),
      };
      updated.finalScore = computeFinalScore(updated);
      persist(updated);
    },
    [entry, persist]
  );

  // --- Export helpers ---
  const copyPlan = () => {
    const text = entry.plan7Days
      .map((d) => `${d.day}: ${d.title}\n${d.tasks.map((t) => `  • ${t}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("7-day plan copied!");
  };

  const copyChecklist = () => {
    const text = entry.checklist
      .map((r) => `${r.round}: ${r.title}\n${r.items.map((i) => `  ☐ ${i}`).join("\n")}`)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    toast.success("Checklist copied!");
  };

  const copyQuestions = () => {
    const text = entry.questions.map((q, i) => `${i + 1}. ${q}`).join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Questions copied!");
  };

  const downloadTxt = () => {
    const sections = [
      `=== Analysis: ${entry.company || "Company"} — ${entry.role || "Role"} ===`,
      `Readiness Score: ${liveScore}/100\n`,
      "--- Key Skills ---",
      ...Object.entries(entry.extractedSkills).map(
        ([cat, skills]) => `${cat}: ${skills.join(", ")}`
      ),
      "",
      "--- 7-Day Plan ---",
      ...entry.plan7Days.map(
        (d) => `${d.day}: ${d.title}\n${d.tasks.map((t) => `  • ${t}`).join("\n")}`
      ),
      "",
      "--- Round-wise Checklist ---",
      ...entry.checklist.map(
        (r) => `${r.round}: ${r.title}\n${r.items.map((i) => `  ☐ ${i}`).join("\n")}`
      ),
      "",
      "--- 10 Interview Questions ---",
      ...entry.questions.map((q, i) => `${i + 1}. ${q}`),
    ];
    const blob = new Blob([sections.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prep-plan-${entry.company || "analysis"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Weak skills for Action Next
  const weakSkills = useMemo(() => {
    const map = entry.skillConfidenceMap ?? {};
    return Object.entries(map)
      .filter(([, v]) => v === "practice")
      .map(([k]) => k)
      .slice(0, 3);
  }, [entry]);

  return (
    <div className="flex flex-col gap-6">
      {/* Company Intel */}
      {entry.companyIntel && <CompanyIntelCard intel={entry.companyIntel} />}

      {/* Round Timeline */}
      {entry.companyIntel?.rounds && <RoundTimeline rounds={entry.companyIntel.rounds} />}

      {/* Readiness Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Readiness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-primary">{liveScore}</div>
            <div className="flex-1">
              <Progress value={liveScore} className="h-3" />
              <p className="mt-1 text-sm text-muted-foreground">
                {liveScore >= 75
                  ? "Great coverage! Focus on depth now."
                  : liveScore >= 50
                  ? "Good start. Mark skills you know to boost your score."
                  : "Toggle skills you're confident in to see your score rise."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Extracted Skills with Toggles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Key Skills Extracted
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            Click a skill to toggle between "I know this" and "Need practice".
          </p>
          <div className="space-y-3">
            {Object.entries(entry.extractedSkills).map(([category, skills]) => (
              <div key={category}>
                <p className="mb-1.5 text-sm font-medium text-foreground">{category}</p>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => {
                    const confidence = entry.skillConfidenceMap?.[skill] ?? "practice";
                    const isKnown = confidence === "know";
                    return (
                      <Badge
                        key={skill}
                        variant={isKnown ? "success" : "secondary"}
                        className="cursor-pointer select-none transition-colors"
                        onClick={() => toggleSkill(skill)}
                      >
                        {isKnown ? "✓ " : ""}
                        {skill}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-primary" />
            Export
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={copyPlan}>
              <Copy className="mr-1 h-3 w-3" />
              Copy 7-day plan
            </Button>
            <Button variant="outline" size="sm" onClick={copyChecklist}>
              <Copy className="mr-1 h-3 w-3" />
              Copy round checklist
            </Button>
            <Button variant="outline" size="sm" onClick={copyQuestions}>
              <Copy className="mr-1 h-3 w-3" />
              Copy 10 questions
            </Button>
            <Button variant="secondary" size="sm" onClick={downloadTxt}>
              <Download className="mr-1 h-3 w-3" />
              Download as TXT
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Round-wise Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Round-wise Preparation Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {entry.checklist.map((round) => (
              <AccordionItem key={round.round} value={round.round}>
                <AccordionTrigger className="text-sm font-semibold">
                  {round.round}: {round.title}
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="space-y-2">
                    {round.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Checkbox id={`${round.round}-${i}`} />
                        <label
                          htmlFor={`${round.round}-${i}`}
                          className="text-sm text-foreground leading-relaxed cursor-pointer"
                        >
                          {item}
                        </label>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* 7-Day Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            7-Day Preparation Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {entry.plan7Days.map((day) => (
              <div key={day.day} className="rounded-lg border p-4">
                <p className="text-sm font-semibold text-primary">{day.day}</p>
                <p className="mb-2 text-sm font-medium text-foreground">{day.title}</p>
                <ul className="space-y-1">
                  {day.tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interview Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            10 Likely Interview Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {entry.questions.map((q, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                  {i + 1}
                </span>
                <span className="text-foreground leading-relaxed">{q}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Action Next */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Action Next
          </CardTitle>
        </CardHeader>
        <CardContent>
          {weakSkills.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-2">
                Your top weak areas to focus on:
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {weakSkills.map((skill) => (
                  <Badge key={skill} variant="warning">
                    {skill}
                  </Badge>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground mb-3">
              All skills marked as known — great confidence!
            </p>
          )}
          <p className="text-sm font-medium text-foreground">
            👉 Start Day 1 plan now.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
