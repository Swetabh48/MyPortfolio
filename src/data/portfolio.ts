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
  linkedin: 'https://linkedin.com/in/swetabh-salampuria',
  resume:
    'https://drive.google.com/file/d/1Tyjy5hwghXVmXtLOp7ivPEfmwdZr00S6/view?usp=sharing',
  tagline: 'Software Engineer · Full Stack & AI Systems',
  availability: 'Open to full-time software engineering roles',
};

export const about = {
  paragraphs: [
    'I am a Software Engineer focused on building production systems that blend modern web architecture, practical AI, and clean interfaces. Currently at Wavexcel Technologies on a Siemens Energy engagement, I work on proposal workflows, document intelligence, and client-facing delivery systems.',
    'My background combines a B.Tech at MNNIT Allahabad with a Computer Science minor, competitive programming discipline, and hands-on product building across marketplaces, ML visualization, real-time collaboration, and regulated-domain platforms.',
    'I care about clarity, measurable outcomes, and software that survives contact with real users—not just demos that look good in slides.',
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
    period: 'January 2026 – Present',
    bullets: [
      'Designed a stage-aware proposal workflow that replaced conflicting state with a single reliable source of truth.',
      'Converted configuration inputs into structured BOM outputs, removing a manual and error-prone compilation step.',
      'Rebuilt domain fields around shared model references so future changes propagate instead of breaking hardcoded paths.',
      'Owned six execution-domain capabilities end-to-end, from interface behavior to backend business rules.',
      'Turned a rigid 95-field catalog into an AI-learned schema pipeline using FastAPI and Azure OpenAI.',
      'Built a formula cascade that computes 179 datasheet cells from 31 drivers and passed all 17 validation scenarios.',
      'Shipped asynchronous jobs, live SSE progress, and Excel/HTML/PDF exports to a production .NET MAUI client.',
      'Combined PaddleOCR and Hermes vision loops to reconstruct editable HTML datasheets from real-world PDFs.',
    ],
  },
];

export const featuredProjects: FeaturedProject[] = [
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
  {
    title: 'IdeaFlow',
    role: 'Real-time collaboration',
    description:
      'A collaborative whiteboard for teams to sketch and plan together with low-latency sync, layered canvas tools, and secure authentication.',
    tech: ['Next.js', 'TypeScript', 'Liveblocks', 'Convex', 'Clerk', 'Zustand'],
    highlights: [
      '8 Convex API endpoints with sub-110ms responses',
      'Sync latency under 50ms with reduced load times',
      '7-tool canvas with 100-layer collaboration support',
      'Enterprise authentication with Clerk',
    ],
    github: 'https://github.com/Swetabh48/IdeaFlow',
    live: 'https://idea-flow-theta.vercel.app',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    source: 'github',
  },
  {
    title: 'MealDeal',
    role: 'AI product experience',
    description:
      'A personalized nutrition product that turns goals and medical constraints into meals, groceries, workouts, and contextual AI guidance.',
    tech: ['Next.js', 'TypeScript', 'Gemini', 'MongoDB', 'NextAuth'],
    highlights: [
      'Personalized plans from user constraints',
      'AI doctor chat for menu-related guidance',
      'Grocery and workout planning in one workflow',
      'Production deploy with auth and persistence',
    ],
    github: 'https://github.com/Swetabh48/MealDeal',
    live: 'https://meal-deal-zeta.vercel.app',
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    source: 'github',
  },
  {
    title: 'HirePath',
    role: 'Voice AI platform',
    description:
      'A voice-first interview practice platform that creates realistic conversation pressure and turns sessions into actionable evaluation feedback.',
    tech: ['TypeScript', 'Vapi', 'Firebase', 'AI SDK', 'Next.js'],
    highlights: [
      'Real-time AI voice interview sessions',
      'Firebase-backed candidate and session flow',
      'Modern AI SDKs for conversational evaluation',
      'Live end-to-end interview practice demo',
    ],
    github: 'https://github.com/Swetabh48/HirePath',
    live: 'https://hire-path-three.vercel.app/',
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    source: 'github',
  },
  {
    title: 'Fuel-Machine',
    role: 'Domain engineering',
    description:
      'A compliance engine for FuelEU Maritime regulation—modeling emissions, compliance balance, banking, and pooling with maintainable architecture.',
    tech: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    highlights: [
      'Models EU Maritime Regulation (EU) 2023/1805',
      'Route GHG and compliance balance calculations',
      'Banking and pooling workflows',
      'Hexagonal architecture for evolving domain rules',
    ],
    github: 'https://github.com/Swetabh48/Fuel-Machine',
    gradient: 'from-sky-400 via-indigo-500 to-blue-700',
    source: 'github',
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
  'MealDeal',
  'HirePath',
  'Fuel-Machine',
  'MedLog',
  'Chopus',
  '6-DOF-Robotic-Arm',
  'HealthGuru',
  'PropertyHub',
  'IdeaFlow',
  'BitHaven',
  'Audio-CNN',
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

export const navLinks = [
  { href: '#featured', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
];
