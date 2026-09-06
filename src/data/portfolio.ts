export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    glow: string;
  };
  gradient: string;
}

export interface FeaturedProject {
  title: string;
  description: string;
  tech: string[];
  highlights: string[];
  github: string;
  live?: string;
  gradient: string;
  source: 'resume' | 'github';
  role: string;
}

export const contact = {
  name: 'Swetabh Salampuria',
  email: 'swetabhsalampuria@gmail.com',
  phone: '+91-9250668412',
  whatsapp: '+91-8544312081',
  github: 'https://github.com/Swetabh48',
  githubUser: 'Swetabh48',
  linkedin: 'https://www.linkedin.com/in/swetabh-salampuria-baa112284/',
  resume:
    'https://drive.google.com/file/d/1xETpBfPwY5vwmN1fOM_9bLwxrjthz-SS/view?usp=sharing',
  tagline: 'Software Engineer · Full Stack & AI Systems',
  availability: 'Open to full-time software engineering roles',
};

export const about = {
  paragraphs: [
    'I am a Software Engineer focused on building production systems that blend modern web architecture, practical AI, and clean interfaces. Currently at Wavexcel Technologies on a Siemens Energy engagement, I work on proposal workflows, document intelligence, and client-facing delivery systems.',
    'My background combines a B.Tech at MNNIT Allahabad with a Computer Science minor, competitive programming discipline, and hands-on product building across marketplaces, ML visualization, real-time collaboration, and regulated-domain platforms.',
    'I care about clarity, measurable outcomes, and software that survives contact with real users and not just demos that look good in slides.',
  ],
};

export const education = [
  {
    name: 'MNNIT Allahabad',
    degree: 'B.Tech. Civil Engineering · Minor in Computer Science & Technology',
    year: '2022 – 2026',
    score: 'CPI: 8.05',
  },
  {
    name: 'S.K.P. Vidya Vihar, Bhagalpur',
    degree: 'CBSE — Class XII',
    year: '2022',
    score: '93.4%',
  },
  {
    name: 'Mount Assisi School, Bhagalpur',
    degree: 'ICSE — Class X',
    year: '2020',
    score: '97.4%',
  },
];

export const coursework = [
  'Data Structures',
  'Database Management',
  'Computer Networks',
  'Operating Systems',
  'Machine Learning',
  'OOPs',
];

export const experience = [
  {
    role: 'Software Engineer',
    company: 'Wavexcel Technologies Pvt. Ltd.',
    client: 'Siemens Energy Ltd.',
    location: 'Gurugram, Haryana',
    period: 'January 2026 – July 2026',
    bullets: [
      'Designed a few-shot Azure OpenAI extraction pipeline (Python/FastAPI) that inferred a 95-field schema from 15–20 labeled samples, replacing a brittle hardcoded field catalog.',
      'Shipped async FastAPI job APIs with SSE progress streaming and Excel/HTML/PDF export for a production .NET MAUI Windows client, keeping long-running work off the request path.',
      'Built an iterative OCR + AI-vision correction loop (PaddleOCR, Hermes) that reconstructed structured HTML layouts from unstructured PDFs.',
      'Implemented a formula-driven computation engine mapping 31 input drivers to 179 dependent outputs; validated with a 17-case suite at 100% pass rate.',
      'Built a multi-agent LOS GenAI pipeline (planning agent → doc/extract agent → formula backbone): the planner acts as a readiness gate and writes a project plan of record; the doc agent extracts only bound drivers from staged sources, then calculates and fills HTML/Excel/PDF datasheets.',
      'Shipped a confidence-gated review UI that surfaced low-certainty extractions first, cutting manual scan time by letting reviewers jump straight to uncertain fields.',
      'Built versioned client configuration (schema + computation profiles) so new Siemens project templates could be onboarded without redeploying the Windows app.',
      'Added end-to-end job observability (queued → OCR → extract → compute → export) with retryable stages and actionable failure states in the MAUI client.',
    ],
  },
];

export const featuredProjects: FeaturedProject[] = [
  {
    title: 'SpeakEasy',
    role: 'AI speech & interview practice',
    description:
      'A browser-based speech and essay practice studio with Whisper transcription, a tiered evaluator, combinatorial topics across eight modes, and a FastAPI board-interview agent loop—zero-account, local-storage-only.',
    tech: ['Next.js', 'React', 'TypeScript', 'FastAPI', 'SQLite', 'PostgreSQL'],
    highlights: [
      'In-browser Whisper + tiered evaluator (hosted LLM → Ollama → heuristic grader)',
      'Combinatorial topic engine across 8 practice modes with local fingerprinting',
      'UPSC/IES/IFS board-interview agents with RSS current-affairs and adaptive cross-questioning',
      'Client-side proctoring and growth dashboard on local-storage-only architecture',
    ],
    github: 'https://github.com/Swetabh48/SpeakEasy',
    live: 'https://speakeasy-two-peach.vercel.app',
    gradient: 'from-amber-400 via-orange-500 to-rose-500',
    source: 'resume',
  },
  {
    title: 'MealDeal',
    role: 'AI product experience',
    description:
      'A personalized nutrition product that turns goals and medical constraints into meals, groceries, workouts, and contextual AI guidance—with async Gemini jobs and a hardened QA suite.',
    tech: ['Next.js', 'TypeScript', 'Gemini', 'MongoDB', 'NextAuth', 'Zod'],
    highlights: [
      'Two-stage async Gemini pipeline with job-polling off the request path',
      'Menu OCR, doctor chat, meal swaps, and Zod-enforced LLM output',
      'NextAuth (credentials + Google), MongoDB, and Zod-validated APIs',
      '746-assertion QA suite: 84/84 feature checks, 97.7% pass under 100-user load',
    ],
    github: 'https://github.com/Swetabh48/MealDeal',
    live: 'https://meal-deal-zeta.vercel.app',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    source: 'resume',
  },
  {
    title: 'Attest',
    role: 'Grounded RAG over SEC filings',
    description:
      'A Dockerized ingest and query pipeline over SEC 10-K / 10-Q filings with hybrid retrieval, claim-level grounding, and an evaluation harness so answers cite source sections instead of improvising.',
    tech: ['Python', 'FastAPI', 'PostgreSQL', 'pgvector', 'Docker'],
    highlights: [
      'Postgres job queues with SKIP LOCKED workers over ~38 SEC filings',
      'Hybrid retrieval (FTS + vector via RRF) with reranking and a weak-context gate',
      '40-question eval harness; Hit@5 improved 57.5% → 60.0% vs vector-only',
      'Claim-level grounding classifier (93.3% accuracy) with citation-constrained generation',
    ],
    github: 'https://github.com/Swetabh48/Attest',
    gradient: 'from-sky-400 via-indigo-500 to-blue-700',
    source: 'resume',
  },
  {
    title: 'BitHaven',
    role: 'Full-stack marketplace',
    description:
      'A multi-vendor commerce platform with type-safe APIs, synchronized carts, Stripe Connect payouts, and performance tuned for large catalog browsing.',
    tech: ['React', 'Next.js', 'MongoDB', 'Zustand', 'Stripe', 'PayloadCMS'],
    highlights: [
      '17+ type-safe API endpoints for users, products, and payments',
      '98% reduced initial load with infinite scroll',
      '44% faster page loads via intelligent prefetching',
      'Multi-tenant architecture supporting 1,000+ vendors',
    ],
    github: 'https://github.com/Swetabh48/BitHaven',
    live: 'https://salampuria-vendors-d48b.vercel.app/',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    source: 'resume',
  },
  {
    title: 'Audio-CNN Visualizer',
    role: 'ML systems + interface',
    description:
      'An interactive visualization layer over a ResNet-inspired audio classifier—waveforms, mel spectrograms, and feature maps rendered after cloud inference.',
    tech: ['Next.js', 'TypeScript', 'PyTorch', 'Modal', 'FastAPI', 'Tailwind'],
    highlights: [
      'Competitive ESC-50 accuracy with residual layer groups',
      'Modal serverless GPU inference via FastAPI',
      'Real-time waveform and feature-map exploration',
      'Augmentation pipeline with masking and mixup',
    ],
    github: 'https://github.com/Swetabh48/Audio-CNN',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    source: 'resume',
  },
];

export const skills: Record<string, string[]> = {
  Languages: ['TypeScript', 'JavaScript', 'Python', 'C++', 'C#'],
  Frontend: ['React', 'Next.js', 'Tailwind CSS', 'shadcn/ui', 'HTML5', 'CSS3', 'XAML'],
  Backend: ['Node.js', 'REST APIs', 'tRPC', 'FastAPI', 'ASP.NET Core'],
  '.NET': ['.NET', '.NET MAUI'],
  Databases: ['MongoDB', 'PostgreSQL', 'Prisma ORM'],
  'AI / ML': ['PyTorch', 'TensorFlow', 'Azure OpenAI'],
  Tools: ['Git', 'GitHub', 'GitLab', 'VS Code', 'Visual Studio', 'Modal', 'Vercel', 'Azure'],
};

export const codingProfiles = [
  {
    platform: 'LeetCode',
    username: 'bully maguire',
    badge: 'Knight',
    rating: 1955,
    color: 'from-yellow-400 to-orange-500',
    link: 'https://leetcode.com/bully_maguire',
  },
  {
    platform: 'Codeforces',
    username: 'SwetabhSalampuria',
    badge: 'Specialist',
    rating: 1418,
    color: 'from-blue-400 to-cyan-500',
    link: 'https://codeforces.com/profile/SwetabhSalampuria',
  },
  {
    platform: 'CodeChef',
    username: 'bulmeranaam',
    badge: '4★',
    rating: 1812,
    color: 'from-purple-400 to-pink-500',
    link: 'https://www.codechef.com/users/bulmeranaam',
  },
];

export const achievements = [
  {
    title: '1st Place — Cognizance Mock Placement',
    desc: 'Avishkar 2024 — competitive coding and interview simulation',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    title: '1st Place — Botwars',
    desc: 'Robotics competition at Botrush 2023',
    color: 'from-blue-400 to-cyan-400',
  },
];

export const responsibilities = [
  {
    title: 'Departmental Representative',
    desc: 'Academic liaison for Civil Engineering students, facilitating faculty communication.',
    period: '2023 – Present',
  },
  {
    title: 'Student Mentor',
    desc: 'Guided 1st–3rd year students for a smooth transition into academic life and campus culture.',
    period: '2023 – Present',
  },
  {
    title: 'Co-Coordinator, Culrav 2024–25',
    desc: 'Co-coordinated KavyaSandhya, a poetry showcase featuring invited external guest artists.',
    period: '2024 – 25',
  },
  {
    title: 'Departmental Coordinator',
    desc: 'Directed execution of 8 technical events under Culrav-Avishkar, supervising event teams.',
    period: '2024 – 25',
  },
];

export const extracurricular = {
  title: 'Desi Sync',
  desc: 'Performed in the team dance competition at Culrav, the college cultural fest, in 2023 and 2024.',
};

export const githubPreferredOrder = [
  'SpeakEasy',
  'MealDeal',
  'Attest',
  'BitHaven',
  'Audio-CNN',
  'HirePath',
  'Fuel-Machine',
  'MedLog',
  'Chopus',
  '6-DOF-Robotic-Arm',
  'HealthGuru',
  'PropertyHub',
  'IdeaFlow',
  'WeConnect',
];

export const githubHiddenRepos = ['MyPortfolio', 'deepeval'];

export const themes: Theme[] = [
  {
    name: 'Studio',
    colors: {
      primary: 'from-neutral-950 via-neutral-900 to-black',
      secondary: 'from-white via-neutral-200 to-neutral-400',
      accent: 'from-sky-300 via-cyan-400 to-teal-300',
      background: 'from-[#07090f] via-[#0b1020] to-[#05070d]',
      text: 'text-sky-200',
      glow: 'shadow-sky-500/20',
    },
    gradient: 'from-[#0b1224] via-[#111827]/50 to-transparent',
  },
];

export interface UpcomingProject {
  title: string;
  status: 'Building now' | 'In progress' | 'Next up' | 'Expanding';
  blurb: string;
  focus: string[];
}

/** Active and upcoming builds — not all public yet. */
export const upcomingProjects: UpcomingProject[] = [
  {
    title: 'MatchCore',
    status: 'Building now',
    blurb:
      'A low-latency limit order book matching engine in modern C++. Price-time priority matching, multi-client binary TCP ingestion, and a measured path toward durability and market data — systems work with numbers attached, not just slides.',
    focus: ['C++', 'Networking', 'Order books', 'Systems'],
  },
  {
    title: 'Chopus',
    status: 'Building now',
    blurb:
      'An agent-style developer tool with streaming replies and tool calling. Bun monorepo spanning a CLI and server — still moving fast, aimed at feeling useful in a real terminal workflow rather than a demo chat box.',
    focus: ['TypeScript', 'Agents', 'Tool calling', 'Bun'],
  },
  {
    title: 'MailSender',
    status: 'In progress',
    blurb:
      'A practical outreach workflow for job applications — templated referral emails, resume attach, and delivery tracking across desktop and a companion Android app. Less flashy than most portfolio pieces, more useful day to day.',
    focus: ['APIs', 'Email', 'Automation', 'Capacitor'],
  },
  {
    title: 'YouKnowBall',
    status: 'Expanding',
    blurb:
      'Football match winner and scoreline prediction, built end-to-end for the FIFA World Cup with Elo, form, head-to-head, and Dixon–Coles / ML models. Next: extend the same pipeline to club football — Premier League, La Liga, and other top leagues.',
    focus: ['Python', 'XGBoost', 'FastAPI', 'Sports data'],
  },
];

export const navLinks = [
  { href: '#featured', label: 'Work' },
  { href: '#building', label: 'Now' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];
