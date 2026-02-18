import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ContinuePractice = () => (
  <div className="flex flex-col gap-4">
    <div>
      <p className="text-sm text-muted-foreground">Last Topic</p>
      <p className="text-lg font-semibold text-foreground">Dynamic Programming</p>
    </div>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Progress</span>
        <span className="font-medium text-foreground">3 / 10</span>
      </div>
      <Progress value={30} className="h-2" />
    </div>
    <Button className="w-full">Continue</Button>
  </div>
);

export default ContinuePractice;
