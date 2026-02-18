import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "DSA", value: 75 },
  { subject: "System Design", value: 60 },
  { subject: "Communication", value: 80 },
  { subject: "Resume", value: 85 },
  { subject: "Aptitude", value: 70 },
];

const SkillBreakdown = () => (
  <ResponsiveContainer width="100%" height={280}>
    <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
      <PolarGrid stroke="hsl(var(--border))" />
      <PolarAngleAxis
        dataKey="subject"
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
      />
      <PolarRadiusAxis
        angle={90}
        domain={[0, 100]}
        tick={false}
        axisLine={false}
      />
      <Radar
        dataKey="value"
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
        fillOpacity={0.2}
        strokeWidth={2}
      />
    </RadarChart>
  </ResponsiveContainer>
);

export default SkillBreakdown;
