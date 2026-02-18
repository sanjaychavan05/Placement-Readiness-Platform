import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RoundMapping } from "@/lib/types";
import { GitBranch, Info } from "lucide-react";

interface Props {
  rounds: RoundMapping[];
}

export function RoundTimeline({ rounds }: Props) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          Expected Round Flow
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-1 bottom-1 w-0.5 bg-primary/20" />

          <div className="space-y-5">
            {rounds.map((round, i) => (
              <div key={round.round} className="relative">
                {/* Dot */}
                <div className="absolute -left-6 top-1 flex h-5 w-5 items-center justify-center">
                  <div className={`h-3 w-3 rounded-full border-2 border-primary ${
                    i === 0 ? "bg-primary" : "bg-background"
                  }`} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-primary">{round.round}</p>
                  <p className="text-sm font-medium text-foreground">{round.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    💡 {round.why}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Demo Mode: Round mapping generated heuristically based on company size and detected skills.
        </p>
      </CardContent>
    </Card>
  );
}
