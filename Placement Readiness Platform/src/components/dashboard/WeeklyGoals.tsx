import { Progress } from "@/components/ui/progress";

const days = [
  { label: "M", active: true },
  { label: "T", active: true },
  { label: "W", active: true },
  { label: "T", active: false },
  { label: "F", active: true },
  { label: "S", active: false },
  { label: "S", active: false },
];

const WeeklyGoals = () => (
  <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Problems Solved</span>
        <span className="font-medium text-foreground">12 / 20 this week</span>
      </div>
      <Progress value={60} className="h-2" />
    </div>
    <div>
      <p className="mb-2 text-sm text-muted-foreground">Activity</p>
      <div className="flex items-center gap-2">
        {days.map((day, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium ${
                day.active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {day.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default WeeklyGoals;
