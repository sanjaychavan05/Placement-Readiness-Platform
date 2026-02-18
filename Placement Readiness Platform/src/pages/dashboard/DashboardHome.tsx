import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ReadinessScore from "@/components/dashboard/ReadinessScore";
import SkillBreakdown from "@/components/dashboard/SkillBreakdown";
import ContinuePractice from "@/components/dashboard/ContinuePractice";
import WeeklyGoals from "@/components/dashboard/WeeklyGoals";
import UpcomingAssessments from "@/components/dashboard/UpcomingAssessments";

const DashboardHome = () => (
  <div className="flex flex-col gap-6">
    <div>
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Welcome back! Here's your placement prep overview.</p>
    </div>

    <div className="grid gap-6 md:grid-cols-2">
      {/* Overall Readiness */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Readiness</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <ReadinessScore score={72} />
          </div>
        </CardContent>
      </Card>

      {/* Skill Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <SkillBreakdown />
        </CardContent>
      </Card>

      {/* Continue Practice */}
      <Card>
        <CardHeader>
          <CardTitle>Continue Practice</CardTitle>
        </CardHeader>
        <CardContent>
          <ContinuePractice />
        </CardContent>
      </Card>

      {/* Weekly Goals */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyGoals />
        </CardContent>
      </Card>

      {/* Upcoming Assessments — full width */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Upcoming Assessments</CardTitle>
        </CardHeader>
        <CardContent>
          <UpcomingAssessments />
        </CardContent>
      </Card>
    </div>
  </div>
);

export default DashboardHome;
