import type { CompanyIntel, CompanySize, ExtractedSkills, RoundMapping } from "./types";

const ENTERPRISE_COMPANIES = [
  "amazon", "google", "microsoft", "meta", "apple", "netflix", "infosys",
  "tcs", "wipro", "hcl", "cognizant", "accenture", "ibm", "oracle",
  "salesforce", "adobe", "uber", "flipkart", "paytm", "deloitte",
  "capgemini", "tech mahindra", "mindtree", "mphasis", "l&t infotech",
  "walmart", "goldman sachs", "jpmorgan", "morgan stanley", "samsung",
];

const MIDSIZE_COMPANIES = [
  "zomato", "swiggy", "razorpay", "cred", "meesho", "phonepe",
  "groww", "zerodha", "freshworks", "zoho", "postman", "browserstack",
  "hasura", "chargebee", "clevertap", "druva", "icertis",
];

function inferSize(company: string): CompanySize {
  const lower = company.toLowerCase().trim();
  if (ENTERPRISE_COMPANIES.some((c) => lower.includes(c))) return "Enterprise";
  if (MIDSIZE_COMPANIES.some((c) => lower.includes(c))) return "Mid-size";
  return "Startup";
}

function sizeLabel(size: CompanySize): string {
  switch (size) {
    case "Enterprise": return "Enterprise (2000+ employees)";
    case "Mid-size": return "Mid-size (200–2000 employees)";
    case "Startup": return "Startup (<200 employees)";
  }
}

function inferIndustry(company: string, jdText: string): string {
  const text = `${company} ${jdText}`.toLowerCase();
  if (/fintech|banking|payment|finance/.test(text)) return "Financial Technology";
  if (/health|medical|pharma/.test(text)) return "Healthcare & Life Sciences";
  if (/ecommerce|e-commerce|retail|shopping/.test(text)) return "E-Commerce & Retail";
  if (/edtech|education|learning/.test(text)) return "Education Technology";
  if (/gaming|game/.test(text)) return "Gaming & Entertainment";
  if (/logistics|supply chain|delivery/.test(text)) return "Logistics & Supply Chain";
  return "Technology Services";
}

function hiringFocus(size: CompanySize): string {
  switch (size) {
    case "Enterprise":
      return "Structured DSA rounds, core CS fundamentals, standardized aptitude tests, and behavioral interviews. Expect well-defined evaluation rubrics.";
    case "Mid-size":
      return "Mix of DSA and practical problem-solving. Strong emphasis on system design basics and technology stack familiarity.";
    case "Startup":
      return "Practical problem-solving, stack depth, and culture fit. Expect hands-on coding tasks, project discussions, and real-world scenario questions.";
  }
}

function generateRounds(size: CompanySize, skills: ExtractedSkills): RoundMapping[] {
  const hasDSA = !!skills["Core CS"] || Object.values(skills).flat().includes("DSA");
  const hasWeb = !!skills["Web"];
  const hasData = !!skills["Data"];

  if (size === "Enterprise") {
    return [
      {
        round: "Round 1",
        title: "Online Test (DSA + Aptitude)",
        why: "Filters candidates at scale using standardized coding and aptitude assessments. Focus on time-bound problem solving.",
      },
      {
        round: "Round 2",
        title: hasDSA ? "Technical (DSA + Core CS)" : "Technical (Coding + Fundamentals)",
        why: "Deep-dives into data structures, algorithms, and CS fundamentals. Expect whiteboard-style problem solving.",
      },
      {
        round: "Round 3",
        title: "Tech + Projects Discussion",
        why: "Evaluates how you apply knowledge in real projects. Be ready to explain architecture decisions and tradeoffs.",
      },
      {
        round: "Round 4",
        title: "HR / Managerial",
        why: "Assesses cultural fit, communication skills, and long-term career alignment with the organization.",
      },
    ];
  }

  if (size === "Mid-size") {
    const rounds: RoundMapping[] = [
      {
        round: "Round 1",
        title: "Online Assessment",
        why: "Tests coding ability and logical thinking. Usually a mix of MCQs and coding problems.",
      },
      {
        round: "Round 2",
        title: hasWeb ? "Technical (Stack + Problem Solving)" : "Technical (DSA + System Basics)",
        why: "Evaluates practical coding skills and understanding of the technology stack mentioned in the JD.",
      },
      {
        round: "Round 3",
        title: "Project Deep-dive + System Design",
        why: "Explores your project experience and ability to think about systems at a higher level.",
      },
    ];
    if (hasData) {
      rounds.push({
        round: "Round 4",
        title: "Database & Backend Discussion",
        why: "Probes your understanding of data modeling, query optimization, and backend architecture.",
      });
    }
    rounds.push({
      round: `Round ${rounds.length + 1}`,
      title: "HR / Culture Fit",
      why: "Checks alignment with company values, team dynamics, and growth mindset.",
    });
    return rounds;
  }

  // Startup
  const rounds: RoundMapping[] = [
    {
      round: "Round 1",
      title: hasWeb ? "Practical Coding (Live)" : "Take-home / Coding Challenge",
      why: "Startups value builders. This round tests if you can write real, working code under practical constraints.",
    },
    {
      round: "Round 2",
      title: "System Discussion + Architecture",
      why: "Evaluates how you think about building products end-to-end. Expect questions on tradeoffs and scalability.",
    },
    {
      round: "Round 3",
      title: "Culture Fit + Founder Chat",
      why: "Startups hire for mindset. This checks if you're adaptable, self-driven, and aligned with the mission.",
    },
  ];
  return rounds;
}

export function generateCompanyIntel(
  company: string,
  jdText: string,
  skills: ExtractedSkills
): CompanyIntel | undefined {
  if (!company.trim()) return undefined;

  const size = inferSize(company);
  return {
    name: company.trim(),
    industry: inferIndustry(company, jdText),
    size,
    sizeLabel: sizeLabel(size),
    hiringFocus: hiringFocus(size),
    rounds: generateRounds(size, skills),
  };
}
