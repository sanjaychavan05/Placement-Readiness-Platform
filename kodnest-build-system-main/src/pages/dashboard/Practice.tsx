import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { analyzeJD } from "@/lib/jd-analyzer";
import { saveEntry } from "@/lib/history";
import type { AnalysisEntry } from "@/lib/types";
import { Search, AlertTriangle } from "lucide-react";
import { AnalysisResults } from "@/components/dashboard/AnalysisResults";

const JD_MIN_LENGTH = 200;

const Practice = () => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [jdText, setJdText] = useState("");
  const [result, setResult] = useState<AnalysisEntry | null>(null);

  const isShortJD = jdText.trim().length > 0 && jdText.trim().length < JD_MIN_LENGTH;

  const handleAnalyze = () => {
    if (!jdText.trim()) return;
    const entry = analyzeJD(company, role, jdText);
    saveEntry(entry);
    setResult(entry);
  };

  const handleEntryUpdate = (updated: AnalysisEntry) => {
    setResult(updated);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">JD Analyzer</h1>
        <p className="mt-1 text-muted-foreground">
          Paste a job description to get a personalized preparation plan.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                placeholder="e.g. Software Engineer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <Label htmlFor="jd">
              Job Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="jd"
              placeholder="Paste the full job description here..."
              className="min-h-[160px]"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
            />
            {isShortJD && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
                <p className="text-sm text-muted-foreground">
                  This JD is too short to analyze deeply. Paste the full JD for better output.
                </p>
              </div>
            )}
          </div>
          <Button className="mt-4" onClick={handleAnalyze} disabled={!jdText.trim()}>
            <Search className="mr-2 h-4 w-4" />
            Analyze JD
          </Button>
        </CardContent>
      </Card>

      {result && <AnalysisResults entry={result} onUpdate={handleEntryUpdate} />}
    </div>
  );
};

export default Practice;
