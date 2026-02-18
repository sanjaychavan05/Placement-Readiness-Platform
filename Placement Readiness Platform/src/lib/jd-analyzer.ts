import type { ExtractedSkills, ChecklistRound, DayPlan, AnalysisEntry } from "./types";
import { generateCompanyIntel } from "./company-intel";

const SKILL_MAP: Record<string, string[]> = {
  "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks"],
  Languages: ["Java", "Python", "JavaScript", "TypeScript", "C\\+\\+", "C#", "\\bGo\\b", "\\bC\\b"],
  Web: ["React", "Next\\.js", "Node\\.js", "Express", "REST", "GraphQL"],
  Data: ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
  Testing: ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"],
};

const DISPLAY_NAMES: Record<string, string> = {
  "C\\+\\+": "C++",
  "C#": "C#",
  "\\bGo\\b": "Go",
  "\\bC\\b": "C",
  "Next\\.js": "Next.js",
  "Node\\.js": "Node.js",
  "CI/CD": "CI/CD",
};

export function extractSkills(jdText: string): ExtractedSkills {
  const result: ExtractedSkills = {};

  for (const [category, patterns] of Object.entries(SKILL_MAP)) {
    const found: string[] = [];
    for (const pattern of patterns) {
      const regex = new RegExp(pattern.replace(/\\/g, "\\"), "i");
      if (regex.test(jdText)) {
        found.push(DISPLAY_NAMES[pattern] || pattern);
      }
    }
    if (found.length > 0) {
      result[category] = found;
    }
  }

  return result;
}

export function calculateReadinessScore(
  skills: ExtractedSkills,
  company: string,
  role: string,
  jdText: string
): number {
  let score = 35;
  const categoryCount = Object.keys(skills).length;
  score += Math.min(categoryCount * 5, 30);
  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

export function generateChecklist(skills: ExtractedSkills): ChecklistRound[] {
  const allSkills = Object.values(skills).flat();
  const hasCategory = (cat: string) => !!skills[cat];

  const round1: string[] = [
    "Review quantitative aptitude basics",
    "Practice logical reasoning puzzles",
    "Brush up on verbal ability",
    "Solve 2 previous year aptitude papers",
    "Review basic probability and statistics",
  ];
  if (hasCategory("Core CS")) {
    round1.push("Revise OS process scheduling concepts");
    round1.push("Review DBMS normalization forms");
    round1.push("Practice networking MCQs (TCP/IP, OSI)");
  }

  const round2: string[] = [
    "Solve 5 easy array/string problems",
    "Practice 3 medium tree/graph problems",
    "Review time & space complexity analysis",
    "Implement sorting algorithms from scratch",
    "Practice dynamic programming patterns",
  ];
  if (allSkills.includes("DSA")) {
    round2.push("Solve 3 hard DP problems");
    round2.push("Practice sliding window & two pointer");
    round2.push("Review greedy algorithm strategies");
  }

  const round3: string[] = [
    "Prepare 2-minute project walkthrough",
    "Review system design fundamentals",
    "Practice explaining technical decisions",
    "Prepare answers for 'Why this technology?'",
    "Review your resume projects in depth",
  ];
  if (hasCategory("Web")) {
    round3.push("Explain React component lifecycle or hooks");
    round3.push("Discuss REST vs GraphQL tradeoffs");
    round3.push("Review frontend performance optimization");
  }
  if (hasCategory("Data")) {
    round3.push("Practice SQL query optimization");
    round3.push("Explain database indexing strategies");
  }
  if (hasCategory("Cloud/DevOps")) {
    round3.push("Review CI/CD pipeline concepts");
    round3.push("Explain containerization benefits");
  }

  const round4: string[] = [
    "Prepare 'Tell me about yourself' (2 min)",
    "Practice 'Why do you want to join us?'",
    "Prepare examples of teamwork & leadership",
    "Review company values and recent news",
    "Practice salary/expectations discussion",
    "Prepare thoughtful questions for interviewer",
  ];

  // If "Other" (general fresher), add soft-skill items
  if (hasCategory("Other")) {
    round1.push("Practice communication exercises");
    round2.push("Solve basic coding problems (FizzBuzz, palindrome)");
    round3.push("Prepare project presentation for non-technical audience");
  }

  return [
    { round: "Round 1", title: "Aptitude & Basics", items: round1 },
    { round: "Round 2", title: "DSA + Core CS", items: round2 },
    { round: "Round 3", title: "Technical Interview", items: round3.slice(0, 8) },
    { round: "Round 4", title: "Managerial / HR", items: round4 },
  ];
}

export function generatePlan(skills: ExtractedSkills): DayPlan[] {
  const hasCategory = (cat: string) => !!skills[cat];

  const day1Tasks = [
    "Review OOP principles (SOLID, design patterns)",
    "Revise OS concepts (deadlocks, memory management)",
    "Brush up on DBMS (ACID, normalization, joins)",
  ];
  if (hasCategory("Core CS")) day1Tasks.push("Practice 10 Core CS MCQs");
  if (hasCategory("Other")) day1Tasks.push("Review basic programming concepts");

  const day2Tasks = [
    "Review networking basics (HTTP, DNS, TCP)",
    "Study computer architecture fundamentals",
    "Practice aptitude questions (30 min)",
  ];
  if (hasCategory("Languages")) day2Tasks.push("Revise language-specific features & gotchas");

  const day3Tasks = [
    "Solve 5 easy DSA problems (arrays, strings)",
    "Practice linked list & stack problems",
    "Review recursion & backtracking patterns",
  ];
  if (hasCategory("Data")) day3Tasks.push("Write complex SQL queries (joins, subqueries, window functions)");
  if (hasCategory("Other")) day3Tasks.push("Practice basic coding problems (loops, conditionals)");

  const day4Tasks = [
    "Solve 3 medium DSA problems (trees, graphs)",
    "Practice dynamic programming (2 problems)",
    "Review sorting & searching algorithms",
  ];
  if (hasCategory("Web")) day4Tasks.push("Build a small React component from scratch");

  const day5Tasks = [
    "Align resume with JD keywords",
    "Prepare 2-min walkthrough for each project",
    "Review and update GitHub/portfolio",
  ];
  if (hasCategory("Cloud/DevOps")) day5Tasks.push("Review deployment & DevOps practices for projects");
  if (hasCategory("Testing")) day5Tasks.push("Add testing examples to project discussions");

  const day6Tasks = [
    "Practice behavioral interview questions (STAR method)",
    "Do a mock technical interview (45 min)",
    "Practice 'Tell me about yourself' variations",
    "Review common HR questions and prepare answers",
  ];

  const day7Tasks = [
    "Revisit weak areas identified during the week",
    "Solve 3 random difficulty problems",
    "Review all notes and key concepts",
    "Get proper rest before the interview",
  ];

  return [
    { day: "Day 1", title: "Core CS Fundamentals", tasks: day1Tasks },
    { day: "Day 2", title: "Basics & Aptitude", tasks: day2Tasks },
    { day: "Day 3", title: "DSA – Easy Level", tasks: day3Tasks },
    { day: "Day 4", title: "DSA – Medium + Coding", tasks: day4Tasks },
    { day: "Day 5", title: "Projects & Resume", tasks: day5Tasks },
    { day: "Day 6", title: "Mock Interviews", tasks: day6Tasks },
    { day: "Day 7", title: "Revision & Rest", tasks: day7Tasks },
  ];
}

export function generateQuestions(skills: ExtractedSkills): string[] {
  const questions: string[] = [];
  const allSkills = Object.values(skills).flat();

  const skillQuestions: Record<string, string[]> = {
    DSA: [
      "How would you optimize search in a sorted rotated array?",
      "Explain the difference between BFS and DFS with use cases.",
      "How would you detect a cycle in a linked list?",
    ],
    OOP: [
      "Explain SOLID principles with real-world examples.",
      "What is the difference between composition and inheritance?",
    ],
    DBMS: [
      "Explain normalization up to 3NF with examples.",
      "What are ACID properties and why do they matter?",
    ],
    OS: [
      "Explain deadlock conditions and how to prevent them.",
      "What is the difference between a process and a thread?",
    ],
    SQL: [
      "Explain indexing and when it helps query performance.",
      "Write a query using window functions to rank employees by salary.",
    ],
    React: [
      "Explain state management options in React (useState, Context, Redux).",
      "What are React hooks and why were they introduced?",
    ],
    "Next.js": ["Explain the difference between SSR, SSG, and ISR in Next.js."],
    "Node.js": [
      "Explain the event loop in Node.js.",
      "How does middleware work in Express?",
    ],
    Python: [
      "Explain decorators in Python with an example.",
      "What is the GIL and how does it affect multithreading?",
    ],
    Java: [
      "Explain the difference between HashMap and ConcurrentHashMap.",
      "What is the Java Memory Model?",
    ],
    JavaScript: [
      "Explain closures and their practical applications.",
      "What is the difference between == and === in JavaScript?",
    ],
    TypeScript: ["Explain generics in TypeScript with a practical example."],
    MongoDB: ["When would you choose MongoDB over a relational database?"],
    Docker: ["Explain the difference between a Docker image and container."],
    Kubernetes: ["What problem does Kubernetes solve in microservices?"],
    AWS: ["Explain the difference between EC2, Lambda, and ECS."],
    GraphQL: ["Compare GraphQL vs REST – when would you pick each?"],
    Redis: ["What are common use cases for Redis in production?"],
    "CI/CD": ["Describe a CI/CD pipeline you would set up for a web app."],
    PostgreSQL: ["Explain MVCC in PostgreSQL."],
  };

  for (const skill of allSkills) {
    const qs = skillQuestions[skill];
    if (qs) questions.push(...qs);
  }

  const generals = [
    "Walk me through a project you're most proud of.",
    "How do you approach debugging a complex issue?",
    "Explain a time you had to learn a new technology quickly.",
    "What is your approach to writing clean, maintainable code?",
    "How do you handle disagreements in a team?",
  ];

  while (questions.length < 10) {
    const g = generals.shift();
    if (!g) break;
    questions.push(g);
  }

  return questions.slice(0, 10);
}

export function computeFinalScore(entry: AnalysisEntry): number {
  let delta = 0;
  for (const conf of Object.values(entry.skillConfidenceMap ?? {})) {
    delta += conf === "know" ? 2 : -2;
  }
  return Math.max(0, Math.min(100, entry.baseScore + delta));
}

export function analyzeJD(company: string, role: string, jdText: string): AnalysisEntry {
  const extractedSkills = extractSkills(jdText);

  // Default behavior if no skills detected
  if (Object.keys(extractedSkills).length === 0) {
    extractedSkills["Other"] = ["Communication", "Problem solving", "Basic coding", "Projects"];
  }

  const baseScore = calculateReadinessScore(extractedSkills, company, role, jdText);
  const checklist = generateChecklist(extractedSkills);
  const plan7Days = generatePlan(extractedSkills);
  const questions = generateQuestions(extractedSkills);

  const skillConfidenceMap: Record<string, "know" | "practice"> = {};
  for (const skills of Object.values(extractedSkills)) {
    for (const skill of skills) {
      skillConfidenceMap[skill] = "practice";
    }
  }

  const companyIntel = generateCompanyIntel(company, jdText, extractedSkills);
  const now = new Date().toISOString();

  const entry: AnalysisEntry = {
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    company: company || "",
    role: role || "",
    jdText,
    extractedSkills,
    plan7Days,
    checklist,
    questions,
    baseScore,
    finalScore: baseScore,
    skillConfidenceMap,
    companyIntel,
  };

  // Compute finalScore based on initial confidence (all practice)
  entry.finalScore = computeFinalScore(entry);

  return entry;
}
