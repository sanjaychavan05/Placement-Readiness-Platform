import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  getStepStatuses,
  getSavedLinks,
  saveLinks,
  submissionSchema,
  isShipped,
  generateSubmissionText,
  allLinksProvided,
  allStepsCompleted,
} from "@/lib/proof-submission";
import { allTestsPassed, getCheckedTests } from "@/lib/test-checklist";
import {
  CheckCircle2,
  XCircle,
  Copy,
  Rocket,
  Link as LinkIcon,
  Shield,
  Trophy,
} from "lucide-react";
import { toast } from "sonner";

const Proof = () => {
  const steps = getStepStatuses();
  const stepsComplete = allStepsCompleted();
  const testsPass = allTestsPassed(getCheckedTests());

  const saved = getSavedLinks();
  const [lovableLink, setLovableLink] = useState(saved.lovableLink ?? "");
  const [githubLink, setGithubLink] = useState(saved.githubLink ?? "");
  const [deployedLink, setDeployedLink] = useState(saved.deployedLink ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [shipped, setShipped] = useState(isShipped());

  const validateAndSave = useCallback(() => {
    const result = submissionSchema.safeParse({ lovableLink, githubLink, deployedLink });
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return false;
    }
    setErrors({});
    saveLinks(result.data);
    setShipped(isShipped());
    toast.success("Links saved!");
    return true;
  }, [lovableLink, githubLink, deployedLink]);

  const handleCopySubmission = () => {
    const result = submissionSchema.safeParse({ lovableLink, githubLink, deployedLink });
    if (!result.success) {
      toast.error("Please fix URL errors before copying.");
      return;
    }
    const text = generateSubmissionText(result.data);
    navigator.clipboard.writeText(text);
    toast.success("Final submission copied to clipboard!");
  };

  // Re-check shipped status when links change
  useEffect(() => {
    setShipped(isShipped());
  }, [lovableLink, githubLink, deployedLink]);

  const linksValid = allLinksProvided();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Proof & Submission</h1>
        <p className="mt-1 text-muted-foreground">
          Complete all steps, pass all tests, and provide your links to ship.
        </p>
      </div>

      {/* Project Status Badge */}
      <Card className={shipped ? "border-primary/40 bg-primary/5" : ""}>
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            {shipped ? (
              <Trophy className="h-6 w-6 text-primary" />
            ) : (
              <Rocket className="h-6 w-6 text-muted-foreground" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-foreground">Project Status:</span>
                <Badge variant={shipped ? "success" : "secondary"} className="text-sm">
                  {shipped ? "Shipped ✓" : "In Progress"}
                </Badge>
              </div>
              {!shipped && (
                <p className="text-sm text-muted-foreground mt-1">
                  Complete all requirements below to unlock Shipped status.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shipped celebration */}
      {shipped && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center">
            <Trophy className="h-12 w-12 text-primary mx-auto mb-4" />
            <p className="text-lg font-bold text-foreground mb-2">You built a real product.</p>
            <p className="text-muted-foreground leading-relaxed">
              Not a tutorial. Not a clone.<br />
              A structured tool that solves a real problem.<br />
              <span className="font-semibold text-foreground">This is your proof of work.</span>
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step Completion Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Step Completion Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2">
            {steps.map((step) => (
              <div key={step.label} className="flex items-center gap-2.5 py-1.5">
                {step.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-destructive shrink-0" />
                )}
                <span
                  className={`text-sm ${
                    step.completed ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
                <Badge
                  variant={step.completed ? "success" : "secondary"}
                  className="ml-auto text-xs"
                >
                  {step.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            ))}
          </div>

          {/* Condition summary */}
          <div className="mt-4 pt-4 border-t space-y-1.5">
            <div className="flex items-center gap-2 text-sm">
              {stepsComplete ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              <span className={stepsComplete ? "text-foreground" : "text-muted-foreground"}>
                All 8 steps completed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {testsPass ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              <span className={testsPass ? "text-foreground" : "text-muted-foreground"}>
                All 10 test checklist items passed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {linksValid ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              <span className={linksValid ? "text-foreground" : "text-muted-foreground"}>
                All 3 proof links provided
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Artifact Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-primary" />
            Artifact Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lovable-link">
                Lovable Project Link <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lovable-link"
                type="url"
                placeholder="https://lovable.dev/projects/..."
                value={lovableLink}
                onChange={(e) => setLovableLink(e.target.value)}
              />
              {errors.lovableLink && (
                <p className="text-xs text-destructive">{errors.lovableLink}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="github-link">
                GitHub Repository Link <span className="text-destructive">*</span>
              </Label>
              <Input
                id="github-link"
                type="url"
                placeholder="https://github.com/..."
                value={githubLink}
                onChange={(e) => setGithubLink(e.target.value)}
              />
              {errors.githubLink && (
                <p className="text-xs text-destructive">{errors.githubLink}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deployed-link">
                Deployed URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="deployed-link"
                type="url"
                placeholder="https://your-app.lovable.app"
                value={deployedLink}
                onChange={(e) => setDeployedLink(e.target.value)}
              />
              {errors.deployedLink && (
                <p className="text-xs text-destructive">{errors.deployedLink}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <Button onClick={validateAndSave}>
                Save Links
              </Button>
              <Button
                variant="outline"
                onClick={handleCopySubmission}
                disabled={!lovableLink || !githubLink || !deployedLink}
              >
                <Copy className="mr-1 h-4 w-4" />
                Copy Final Submission
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground text-center">
        Submission data stored in localStorage under <code>prp_final_submission</code>.
      </p>
    </div>
  );
};

export default Proof;
