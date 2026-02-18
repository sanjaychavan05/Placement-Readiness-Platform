import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TEST_ITEMS,
  getCheckedTests,
  setCheckedTests,
  resetChecklist,
  getPassedCount,
  allTestsPassed,
} from "@/lib/test-checklist";
import { CheckCircle2, AlertTriangle, RotateCcw, HelpCircle, ShieldCheck } from "lucide-react";

const Testing = () => {
  const [checked, setChecked] = useState<Record<string, boolean>>(getCheckedTests);

  const passed = getPassedCount(checked);
  const total = TEST_ITEMS.length;
  const allPassed = allTestsPassed(checked);

  const toggle = useCallback(
    (id: string) => {
      const next = { ...checked, [id]: !checked[id] };
      setChecked(next);
      setCheckedTests(next);
    },
    [checked]
  );

  const handleReset = () => {
    resetChecklist();
    setChecked({});
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Test Checklist</h1>
        <p className="mt-1 text-muted-foreground">
          Verify all platform features before shipping.
        </p>
      </div>

      {/* Summary */}
      <Card className={allPassed ? "border-primary/40 bg-primary/5" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {allPassed ? (
                <ShieldCheck className="h-5 w-5 text-primary" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-warning" />
              )}
              <span className="text-lg font-semibold text-foreground">
                Tests Passed: {passed} / {total}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCcw className="mr-1 h-3 w-3" />
              Reset checklist
            </Button>
          </div>
          <Progress value={(passed / total) * 100} className="h-2.5" />
          {!allPassed && (
            <p className="mt-2 text-sm text-destructive font-medium">
              Fix issues before shipping.
            </p>
          )}
          {allPassed && (
            <p className="mt-2 text-sm text-primary font-medium">
              All tests passed — ready to ship! ✓
            </p>
          )}
        </CardContent>
      </Card>

      {/* Checklist items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Platform Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {TEST_ITEMS.map((item) => {
              const isChecked = !!checked[item.id];
              return (
                <li key={item.id} className="flex items-start gap-3">
                  <Checkbox
                    id={item.id}
                    checked={isChecked}
                    onCheckedChange={() => toggle(item.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={item.id}
                      className={`text-sm font-medium cursor-pointer ${
                        isChecked ? "text-muted-foreground line-through" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </label>
                    <div className="flex items-start gap-1.5 mt-1">
                      <HelpCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{item.hint}</p>
                    </div>
                    {isChecked && (
                      <Badge variant="success" className="mt-1.5 text-xs">
                        Passed
                      </Badge>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Checklist state is stored in localStorage and persists across sessions.
      </p>
    </div>
  );
};

export default Testing;
