import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CompanyIntel } from "@/lib/types";
import { Building2, Briefcase, Users, Target, Info } from "lucide-react";

interface Props {
  intel: CompanyIntel;
}

const sizeBadgeVariant = (size: string) => {
  switch (size) {
    case "Enterprise": return "default" as const;
    case "Mid-size": return "secondary" as const;
    default: return "outline" as const;
  }
};

export function CompanyIntelCard({ intel }: Props) {
  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          Company Intel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2">
            <Briefcase className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Company</p>
              <p className="text-sm font-semibold text-foreground">{intel.name}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Target className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Industry</p>
              <p className="text-sm font-medium text-foreground">{intel.industry}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Users className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Estimated Size</p>
              <Badge variant={sizeBadgeVariant(intel.size)} className="mt-0.5">
                {intel.sizeLabel}
              </Badge>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-secondary/30 p-3">
          <p className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1">
            <Target className="h-3 w-3" /> Typical Hiring Focus
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {intel.hiringFocus}
          </p>
        </div>

        <p className="text-[11px] text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          Demo Mode: Company intel generated heuristically.
        </p>
      </CardContent>
    </Card>
  );
}
