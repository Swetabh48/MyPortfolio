import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink, Code2, Award, Users, ChevronDown, Terminal, Star, GitFork, Calendar, Trophy, Target, Book, FileText, ChevronLeft, ChevronRight, Moon, Sun, Zap, PartyPopper } from 'lucide-react';

interface GithubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
  fork: boolean;
}

interface VisibilityState {
  [key: string]: boolean;
}

interface Theme {
  name: string;
  icon: any;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  gradient: string;
}

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [currentTheme, setCurrentTheme] = useState(0);

  const themes: Theme[] = [
  {
    name: 'Batman',
    icon: Moon,
    colors: {
      primary: 'from-gray-950 via-gray-900 to-black',
      secondary: 'from-yellow-300 via-yellow-500 to-amber-600',
      accent: 'from-amber-400 via-yellow-500 to-amber-700',
      background: 'from-black via-gray-950 to-gray-900',
      text: 'text-amber-300'
    },
    gradient: 'from-black via-gray-900/70 to-amber-900/20'
  },

  {
    name: 'Hulk',
    icon: Zap,
    colors: {
      primary: 'from-green-950 via-green-800 to-emerald-900',
      secondary: 'from-lime-300 via-lime-500 to-green-700',
      accent: 'from-emerald-400 via-green-500 to-lime-600',
      background: 'from-emerald-950 via-green-950 to-black',
      text: 'text-lime-300'
    },
    gradient: 'from-green-950 via-emerald-800/50 to-lime-900/20'
  },

  {
    name: 'Iron Man',
    icon: Star,
    colors: {
      primary: 'from-red-950 via-red-800 to-yellow-800',
      secondary: 'from-red-400 via-amber-500 to-yellow-600',
      accent: 'from-red-500 via-amber-500 to-yellow-500',
      background: 'from-red-950 via-red-900 to-black',
      text: 'text-amber-400'
    },
    gradient: 'from-red-950 via-amber-900/40 to-yellow-900/10'
  },

  {
    name: 'Default',
    icon: Sun,
    colors: {
      primary: 'from-purple-950 via-purple-800 to-pink-900',
      secondary: 'from-purple-300 via-pink-400 to-rose-500',
      accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
      background: 'from-slate-950 via-purple-950 to-black',
      text: 'text-pink-300'
    },
    gradient: 'from-purple-950 via-pink-900/40 to-slate-950'
  }
];


  const theme = themes[currentTheme];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchGithubRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Swetabh48/repos?sort=updated&per_page=100');
        const data: GithubRepo[] = await response.json();
        const filteredRepos = data
          .filter((repo: GithubRepo) => !repo.fork && repo.stargazers_count >= 0)
          .sort((a: GithubRepo, b: GithubRepo) => b.stargazers_count - a.stargazers_count);
        setGithubRepos(filteredRepos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
        setLoading(false);
      }
    };

    fetchGithubRepos();
  }, []);

  const nextProject = () => {
    setCurrentProjectIndex((prev) => (prev + 2 >= githubRepos.length ? 0 : prev + 2));
  };

  const prevProject = () => {
    setCurrentProjectIndex((prev) => (prev - 2 < 0 ? Math.max(0, githubRepos.length - 2) : prev - 2));
  };

  const codingProfiles = [
    { 
      platform: 'LeetCode', 
      username: 'bully maguire', 
      badge: 'Knight', 
      rating: 1904,
      color: 'from-yellow-400 to-orange-500',
      icon: Code2,
      link: 'https://leetcode.com/bully_maguire'
    },
    { 
      platform: 'Codeforces', 
      username: 'SwetabhSalampuria', 
      badge: 'Specialist', 
      rating: 1418,
      color: 'from-blue-400 to-cyan-500',
      icon: Terminal,
      link: 'https://codeforces.com/profile/SwetabhSalampuria'
    },
    { 
      platform: 'CodeChef', 
      username: 'bulmeranaam', 
      badge: '3★', 
      rating: 1773,
      color: 'from-purple-400 to-pink-500',
      icon: Star,
      link: 'https://www.codechef.com/users/bulmeranaam'
    }
  ];

  const featuredProjects = [
    {
      title: 'IdeaFlow',
      description: 'A scalable real-time collaboration platform with enterprise-grade security',
      tech: ['Next.js', 'TypeScript', 'Liveblocks', 'Convex', 'Clerk', 'Zustand', 'ShadCN'],
      highlights: [
        '8 Convex API endpoints with <110ms response time',
        '40% reduced load time with <50ms sync latency',
        '7-tool canvas with 100-layer support for complex collaboration',
        'Enterprise-grade security with Clerk authentication'
      ],
      github: 'https://github.com/Swetabh48',
      gradient: 'from-purple-500 via-pink-500 to-red-500'
    },
    {
      title: 'BitHaven',
      description: 'Full-featured e-commerce platform with multi-tenant architecture',
      tech: ['React', 'Next.js', 'MongoDB', 'Zustand', 'Stripe', 'PayloadCMS'],
      highlights: [
        '17+ type-safe API endpoints for users, products, and payments',
        '98% reduced initial load with infinite scroll implementation',
        '44% faster page loads via intelligent prefetching',
        'Multi-tenant supporting 1,000+ vendors with Stripe Connect'
      ],
      github: 'https://github.com/Swetabh48',
      gradient: 'from-cyan-500 via-blue-500 to-purple-500'
    }
  ];

  const achievements = [
    { 
      icon: Trophy, 
      title: '1st Place - Cognizance Mock Placement', 
      desc: 'Avishkar 2024 - Competitive coding and interview simulation', 
      color: 'from-yellow-400 to-orange-400' 
    },
    { 
      icon: Target, 
      title: '1st Place - Botwars', 
      desc: 'Robotics Competition at Botrush 2023', 
      color: 'from-blue-400 to-cyan-400' 
    }
  ];

  const responsibilities = [
    {
      icon: Users,
      title: 'Departmental Representative',
      desc: 'Academic liaison for Civil Engineering students, addressing concerns and facilitating communication with faculty',
      period: '2023-Present'
    },
    {
      icon: Book,
      title: 'Student Mentor',
      desc: 'Guided first to third year students ensuring smooth transition into academic life and campus culture',
      period: '2023-Present'
    },
    {
      icon: Star,
      title: 'Co-Coordinator, Culrav 2024–25',
      desc: 'Co-coordinated KavyaSandhya, a poetry showcase event during the college\'s annual cultural festival',
      period: '2024-25'
    }
  ];

  const skills = {
    Languages: ['C++', 'Python', 'TypeScript'],
    Frontend: ['React', 'Next.js', 'Tailwind CSS', 'ShadCN UI'],
    Backend: ['Node.js', 'tRPC', 'REST APIs', 'MongoDB', 'Convex'],
    Tools: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Claude']
  };
  const DanceIcon = () => (
  <span className="text-3xl">🕺</span>
);

  const extracurricular={
    icon:DanceIcon,
    title:'Desi Sync',
    desc: 'Performed at Culrav 2024 and 2025 as part of a high-energy group dance team, blending synchronized choreography and stage presence to deliver an engaging performance.',
  }

  return (
    <div className={`bg-gradient-to-br ${theme.colors.background} text-white overflow-hidden transition-colors duration-700`}>
      
      {/* Theme Switcher */}
      <div className="fixed top-6 right-6 z-50 flex gap-2 bg-black/30 backdrop-blur-xl p-2 rounded-full border border-white/10">
        {themes.map((t, idx) => {
          const Icon = t.icon;
          return (
            <button
              key={idx}
              onClick={() => setCurrentTheme(idx)}
              className={`p-3 rounded-full transition-all duration-300 ${
                currentTheme === idx 
                  ? `bg-gradient-to-r ${t.colors.secondary} shadow-lg` 
                  : 'bg-white/5 hover:bg-white/10'
              }`}
              title={t.name}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}
          />
        </div>

        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <div className="mb-8 animate-fadeInDown">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm font-medium shadow-2xl">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Available for Opportunities
            </span>
          </div>
          
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none animate-fadeInUp">
            <div className="mb-4">
              <span className={`inline-block bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}>
                Swetabh
              </span>
            </div>
            <div>
              <span className={`inline-block bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}>
                Salampuria
              </span>
            </div>
          </h1>
          
          <div className="flex items-center justify-center gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className={`h-px w-12 bg-gradient-to-r from-transparent ${theme.colors.secondary.split(' ')[0]}`}></div>
            <p className="text-lg md:text-xl text-gray-300 font-light">
              Full Stack Developer & Competitive Programmer
            </p>
            <div className={`h-px w-12 bg-gradient-to-l from-transparent ${theme.colors.secondary.split(' ')[0]}`}></div>
          </div>

          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            B.Tech Civil Engineering with CS Minor @ MNNIT Allahabad<br />
            Building scalable web applications with modern technologies
          </p>

          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <a 
              href="mailto:swetabhsalampuria@gmail.com"
              className={`group px-8 py-4 bg-gradient-to-r ${theme.colors.secondary} rounded-full font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105`}
            >
              Get In Touch
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
            <a 
              href="https://github.com/Swetabh48"
              className="px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105"
            >
              View Projects
            </a>
          </div>

          <div className="flex gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            {[
              { Icon: Github, href: 'https://github.com/Swetabh48', label: 'GitHub' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/swetabh-salampuria', label: 'LinkedIn' },
              { Icon: Mail, href: 'mailto:swetabhsalampuria@gmail.com', label: 'Email' },
              { Icon: Phone, href: 'tel:+918544312081', label: 'Phone' },
              { Icon: FileText, href: 'https://drive.google.com/file/d/1ge3T340Fud-Zq9i4cQTwOXuVPIdiWPu5/view?usp=sharing', label: 'Resume' }
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className={`group relative p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-${theme.colors.secondary.split('-')[1]}-400/50 transition-all duration-300`}
                title={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className={theme.colors.text} />
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>About Me</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Hi,I’m Swetabh Salampuria, a final-year B.Tech student at MNNIT Allahabad, majoring in Civil Engineering with a minor in Computer Science. I love building things—whether it's efficient algorithms or sleek, modern web apps.
                I primarily work with C++, and I have hands-on experience in full-stack development using React, Next.js, TypeScript, and MongoDB. Competitive programming has strengthened my problem-solving approach and shaped the way I tackle complex challenges.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                I’m driven by curiosity, constant learning, and the excitement of turning ideas into real, functional products. Outside of coding, I enjoy fitness and exploring creative ways to grow personally and technically.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed">
                My goal is to work on impactful projects, collaborate with passionate teams, and continue pushing myself toward becoming a better engineer, creator, and innovator.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.education ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Education</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="space-y-6">
            {[
              { name: 'MNNIT Allahabad', degree: 'B.Tech. Civil Engineering + CS Minor', year: '2022 - 2026', score: 'CPI: 8.07', gradient: theme.colors.accent },
              { name: 'S.K.P. Vidya Vihar, Bhagalpur', degree: 'CBSE - Class XII', year: '2022', score: '93.4%', gradient: theme.colors.secondary },
              { name: 'Mount Assisi School, Bhagalpur', degree: 'ICSE - Class X', year: '2020', score: '97.4%', gradient: theme.colors.accent }
            ].map((edu, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl ${isVisible.education ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                style={{ transitionDelay: `${idx * 0.15}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${edu.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                
                <div className="relative flex justify-between items-start flex-wrap gap-4">
                  <div className="flex-1">
                    <h3 className={`text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r ${edu.gradient} bg-clip-text text-transparent`}>
                      {edu.name}
                    </h3>
                    <p className="text-lg text-gray-300 mb-1">{edu.degree}</p>
                    <p className="text-sm text-gray-500">{edu.year}</p>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold bg-gradient-to-r ${edu.gradient} bg-clip-text text-transparent`}>
                      {edu.score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="featured" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Featured Projects</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className={`text-3xl font-bold ${theme.colors.text} transition-colors`}>
                      {project.title}
                    </h3>
                    <a 
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  </div>

                  <p className="text-gray-300 mb-6">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {project.highlights.map((highlight, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${theme.colors.secondary} mt-2 flex-shrink-0`} />
                        <p className="text-sm text-gray-400">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Projects Carousel */}
      <section id="projects" className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>All GitHub Projects</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
            <p className="text-gray-400 mt-4">Explore my Projects Section</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className={`inline-block w-16 h-16 border-4 border-${theme.colors.secondary.split('-')[1]}-400 border-t-transparent rounded-full animate-spin`}></div>
              <p className="mt-4 text-gray-400">Loading projects...</p>
            </div>
          ) : (
            <div className="relative">
              {/* Navigation Buttons - Left */}
              <button
                onClick={prevProject}
                disabled={currentProjectIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 group p-4 bg-gradient-to-r ${theme.colors.secondary} backdrop-blur-xl rounded-full hover:shadow-2xl hover:shadow-${theme.colors.secondary.split('-')[1]}-500/50 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110`}
              >
                <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" />
              </button>

              {/* Cards Container with Smooth Animation */}
              <div className="overflow-hidden px-2">
                <div 
                  className="grid md:grid-cols-2 gap-8 transition-all duration-700 ease-in-out"
                  key={currentProjectIndex}
                >
                  {githubRepos.slice(currentProjectIndex, currentProjectIndex + 2).map((repo, idx) => (
                    <div
                      key={repo.id}
                      className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-${theme.colors.secondary.split('-')[1]}-500/20 hover:-translate-y-2 animate-slideIn ${isVisible.projects ? 'opacity-100' : 'opacity-0'}`}
                      style={{ 
                        animationDelay: `${idx * 0.15}s`,
                        minHeight: '380px'
                      }}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${theme.colors.primary} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                      
                      <div className="relative h-full flex flex-col">
                        <div className="flex items-start justify-between mb-6">
                          <h3 className={`text-2xl font-bold ${theme.colors.text} transition-colors line-clamp-2 flex-1 pr-4 group-hover:scale-105 transition-transform duration-300`}>
                            {repo.name}
                          </h3>
                          <a 
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-110 hover:rotate-12 flex-shrink-0"
                          >
                            <ExternalLink className="w-5 h-5" />
                          </a>
                        </div>

                        <p className="text-base text-gray-300 mb-6 line-clamp-3 flex-grow leading-relaxed">
                          {repo.description || 'No description available'}
                        </p>

                        {repo.language && (
                          <div className="flex items-center gap-3 mb-6">
                            <span className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.colors.secondary} animate-pulse shadow-lg shadow-${theme.colors.secondary.split('-')[1]}-500/50`}></span>
                            <span className="text-base text-gray-300 font-medium">{repo.language}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-6 text-base text-gray-400 mb-6">
                          <div className="flex items-center gap-2 hover:text-yellow-400 transition-all duration-300 hover:scale-110 cursor-default">
                            <Star className="w-5 h-5" />
                            <span className="font-semibold">{repo.stargazers_count}</span>
                          </div>
                          <div className="flex items-center gap-2 hover:text-blue-400 transition-all duration-300 hover:scale-110 cursor-default">
                            <GitFork className="w-5 h-5" />
                            <span className="font-semibold">{repo.forks_count}</span>
                          </div>
                          <div className="flex items-center gap-2 hover:text-green-400 transition-all duration-300 hover:scale-110 cursor-default">
                            <Calendar className="w-5 h-5" />
                            <span>{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>

                        {repo.topics && repo.topics.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {repo.topics.slice(0, 4).map((topic, i) => (
                              <span 
                                key={i} 
                                className={`px-3 py-1.5 bg-gradient-to-r ${theme.colors.secondary} bg-opacity-20 text-sm rounded-lg hover:scale-110 hover:bg-opacity-30 transition-all duration-300 border border-white/10 cursor-default`}
                                style={{ animationDelay: `${i * 0.05}s` }}
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons - Right */}
              <button
                onClick={nextProject}
                disabled={currentProjectIndex + 2 >= githubRepos.length}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 group p-4 bg-gradient-to-r ${theme.colors.secondary} backdrop-blur-xl rounded-full hover:shadow-2xl hover:shadow-${theme.colors.secondary.split('-')[1]}-500/50 transition-all duration-300 disabled:opacity-0 disabled:pointer-events-none hover:scale-110`}
              >
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              {/* Enhanced Dot Indicators */}
              <div className="flex justify-center items-center gap-3 mt-12">
                {Array.from({ length: Math.ceil(githubRepos.length / 2) }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentProjectIndex(idx * 2)}
                    className={`rounded-full transition-all duration-500 hover:scale-125 ${
                      currentProjectIndex === idx * 2 
                        ? `bg-gradient-to-r ${theme.colors.secondary} w-12 h-3 shadow-lg shadow-${theme.colors.secondary.split('-')[1]}-500/50` 
                        : 'bg-white/30 w-3 h-3 hover:bg-white/50'
                    }`}
                    aria-label={`Go to project ${idx * 2 + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Technical Skills</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <div
                key={category}
                className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-500 hover:shadow-2xl ${isVisible.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <h3 className={`text-xl font-bold mb-4 bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coding Profiles Section */}
      <section id="coding" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.coding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Coding Profiles</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {codingProfiles.map((profile, idx) => {
              const Icon = profile.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible.coding ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative text-center">
                    <a 
                      href={profile.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex p-4 bg-gradient-to-br ${profile.color} rounded-2xl mb-4 hover:opacity-90 transition`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </a>

                    <h3 className="text-2xl font-bold mb-2">{profile.platform}</h3>
                    <a 
                      href={profile.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 text-sm mb-4 block hover:text-white transition"
                    >
                      {profile.username}
                    </a>
                    <a
                      href={profile.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${profile.color} rounded-full text-sm font-bold mb-3 hover:opacity-90 transition`}
                    >
                      {profile.badge}
                    </a>

                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      {profile.rating}
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>


                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section id="achievements" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Achievements</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/30 transition-all duration-500 hover:shadow-2xl ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${achievement.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative flex items-start gap-4">
                    <div className={`p-3 bg-gradient-to-br ${achievement.color} rounded-xl flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">{achievement.title}</h3>
                      <p className="text-gray-400">{achievement.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Positions of Responsibility */}
      <section id="responsibility" className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.responsibility ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>Leadership & Responsibility</span>
            </h2>
            <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {responsibilities.map((resp, idx) => {
              const Icon = resp.icon;
              return (
                <div
                  key={idx}
                  className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-500 hover:shadow-2xl ${isVisible.responsibility ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2 bg-gradient-to-br ${theme.colors.secondary} rounded-lg`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className={`px-3 py-1 bg-gradient-to-r ${theme.colors.secondary} bg-opacity-20 text-xs rounded-full`}>
                        {resp.period}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-white">{resp.title}</h3>
                    <p className="text-sm text-gray-400">{resp.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
       {/* Extracurricular Section */}
      <section id="extracurricular" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${
            isVisible.extracurricular ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <span className={`bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>
              Extra-Curricular Activities
            </span>
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r ${theme.colors.secondary} mx-auto rounded-full`}></div>
        </div>
        <div className={`grid gap-6 ${[extracurricular].length === 1 ? 'md:grid-cols-1' : 'md:grid-cols-3'}`}>
          {[extracurricular].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-500 hover:shadow-2xl ${
                  isVisible.extracurricular ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 0.15}s` }}
              >
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon/>
                    <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>


      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10 bg-black/30">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${theme.colors.secondary} bg-clip-text text-transparent`}>
            Let's Build Something Amazing
          </h3>
          <p className="text-gray-400 mb-8">Open to full-time opportunities and exciting projects</p>
          
          <div className="flex gap-4 justify-center mb-8">
            {[
              { Icon: Github, href: 'https://github.com/Swetabh48' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/swetabh-salampuria' },
              { Icon: Mail, href: 'mailto:swetabhsalampuria@gmail.com' },
              { Icon: FileText, href: 'https://drive.google.com/file/d/1ge3T340Fud-Zq9i4cQTwOXuVPIdiWPu5/view?usp=sharing' }
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all duration-300"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
          
          <p className="text-sm text-gray-500">© 2024 Swetabh Salampuria. Crafted with passion.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInDown {
          animation: fadeInDown 1s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Portfolio;