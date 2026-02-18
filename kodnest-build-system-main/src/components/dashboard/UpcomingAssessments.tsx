import { CalendarClock } from "lucide-react";

const assessments = [
  { title: "DSA Mock Test", date: "Tomorrow", time: "10:00 AM" },
  { title: "System Design Review", date: "Wed", time: "2:00 PM" },
  { title: "HR Interview Prep", date: "Friday", time: "11:00 AM" },
];

const UpcomingAssessments = () => (
  <div className="flex flex-col gap-3">
    {assessments.map((item) => (
      <div
        key={item.title}
        className="flex items-start gap-3 rounded-lg border bg-background p-3"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
          <CalendarClock className="h-4 w-4 text-secondary-foreground" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">{item.title}</p>
          <p className="text-xs text-muted-foreground">
            {item.date}, {item.time}
          </p>
        </div>
      </div>
    ))}
  </div>
);

export default UpcomingAssessments;
