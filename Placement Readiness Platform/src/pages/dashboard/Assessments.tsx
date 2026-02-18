import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getHistory, deleteEntry, getCorruptedCount } from "@/lib/history";
import type { AnalysisEntry } from "@/lib/types";
import { AnalysisResults } from "@/components/dashboard/AnalysisResults";
import { History, Trash2, ArrowLeft, AlertTriangle } from "lucide-react";

const Assessments = () => {
  const [history, setHistory] = useState<AnalysisEntry[]>([]);
  const [selected, setSelected] = useState<AnalysisEntry | null>(null);
  const [corrupted, setCorrupted] = useState(0);

  useEffect(() => {
    setHistory(getHistory());
    setCorrupted(getCorruptedCount());
  }, []);

  const handleDelete = (id: string) => {
    deleteEntry(id);
    setHistory(getHistory());
    if (selected?.id === id) setSelected(null);
  };

  const handleEntryUpdate = (updated: AnalysisEntry) => {
    setSelected(updated);
    setHistory((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  if (selected) {
    return (
      <div className="flex flex-col gap-6">
        <Button variant="ghost" className="w-fit" onClick={() => setSelected(null)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {selected.company || "Unknown Company"} — {selected.role || "Unknown Role"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyzed on {new Date(selected.createdAt).toLocaleDateString()}
          </p>
        </div>
        <AnalysisResults entry={selected} onUpdate={handleEntryUpdate} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analysis History</h1>
        <p className="mt-1 text-muted-foreground">
          View your past JD analyses. Data persists across refreshes.
        </p>
      </div>

      {corrupted > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <p className="text-sm text-destructive">
              {corrupted === 1
                ? "One saved entry couldn't be loaded. Create a new analysis."
                : `${corrupted} saved entries couldn't be loaded. Create a new analysis.`}
            </p>
          </CardContent>
        </Card>
      )}

      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center">
            <History className="h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No analyses yet. Go to <span className="font-medium text-primary">Practice</span> to analyze a JD.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((entry) => (
            <Card
              key={entry.id}
              className="cursor-pointer transition-colors hover:bg-secondary/30"
              onClick={() => setSelected(entry)}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">{entry.finalScore}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {entry.company || "Unknown Company"} — {entry.role || "Unknown Role"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(entry.createdAt).toLocaleDateString()} ·{" "}
                      {Object.values(entry.extractedSkills).flat().length} skills detected
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Score: {entry.finalScore}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(entry.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessments;
