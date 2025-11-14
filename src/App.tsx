import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Mail, Phone, ExternalLink, Code2, Award, Users, ChevronDown, Terminal, Star, GitFork, Calendar, Trophy, Target, Book } from 'lucide-react';

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

const Portfolio = () => {
  const [isVisible, setIsVisible] = useState<VisibilityState>({});
  const [githubRepos, setGithubRepos] = useState<GithubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);

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
          .sort((a: GithubRepo, b: GithubRepo) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);
        setGithubRepos(filteredRepos);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching repos:', error);
        setLoading(false);
      }
    };

    fetchGithubRepos();
  }, []);

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

  const extracurriculars = [
    {
      title: 'Desi Sync Dance Team',
      desc: 'Performed in team dance competition at Culrav (university\'s cultural fest) in 2023 and 2024',
      icon: Star
    }
  ];

  const skills = {
    Languages: ['C++', 'Python', 'TypeScript'],
    Frontend: ['React', 'Next.js', 'Tailwind CSS', 'ShadCN UI'],
    Backend: ['Node.js', 'tRPC', 'REST APIs', 'MongoDB', 'Convex'],
    Tools: ['Git', 'GitHub', 'VS Code', 'Vercel', 'Claude']
  };

  return (
    <div className="bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white overflow-hidden">
      
      {/* Hero Section */}
      <section id="hero" className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 opacity-30">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%),
                               radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.3), transparent 50%),
                               radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3), transparent 50%)`,
            }}
          />
        </div>

        {/* Grid Pattern */}
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
          {/* Floating Badge */}
          <div className="mb-8 animate-fadeInDown">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full text-sm font-medium shadow-2xl">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Available for Opportunities
            </span>
          </div>
          
          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-none animate-fadeInUp">
            <div className="mb-4">
              <span className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                Swetabh
              </span>
            </div>
            <div>
              <span className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300">
                Salampuria
              </span>
            </div>
          </h1>
          
          {/* Subtitle */}
          <div className="flex items-center justify-center gap-3 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-purple-400"></div>
            <p className="text-lg md:text-xl text-gray-300 font-light">
              Full Stack Developer & Problem Solver
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-purple-400"></div>
          </div>

          <p className="text-base md:text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            B.Tech Civil Engineering with CS Minor @ MNNIT Allahabad<br />
            Building scalable web applications with modern technologies
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <a 
              href="mailto:swetabhsalampuria@gmail.com"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
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

          {/* Social Links */}
          <div className="flex gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            {[
              { Icon: Github, href: 'https://github.com/Swetabh48', label: 'GitHub' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/swetabh-salampuria', label: 'LinkedIn' },
              { Icon: Mail, href: 'mailto:swetabhsalampuria@gmail.com', label: 'Email' },
              { Icon: Phone, href: 'tel:+918544312081', label: 'Phone' }
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                className="group relative p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
                title={label}
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-purple-400" />
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.education ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Education</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6">
            {[
              { name: 'MNNIT Allahabad', degree: 'B.Tech. Civil Engineering + CS Minor', year: '2022 - 2026', score: 'CPI: 8.07', gradient: 'from-purple-500 to-blue-500' },
              { name: 'S.K.P. Vidya Vihar, Bhagalpur', degree: 'CBSE - Class XII', year: '2022', score: '93.4%', gradient: 'from-blue-500 to-cyan-500' },
              { name: 'Mount Assisi School, Bhagalpur', degree: 'ICSE - Class X', year: '2020', score: '97.4%', gradient: 'from-cyan-500 to-green-500' }
            ].map((edu, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${isVisible.education ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
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
      <section id="featured" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">Featured Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-pink-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredProjects.map((project, idx) => (
              <div
                key={idx}
                className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 ${isVisible.featured ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 0.2}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-opacity duration-500`} />
                
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">
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
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${project.gradient} mt-2 flex-shrink-0`} />
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

      {/* GitHub Projects Section */}
      <section id="projects" className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">All GitHub Projects</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-400 to-purple-400 mx-auto rounded-full"></div>
            <p className="text-gray-400 mt-4">Explore my open-source contributions and personal projects</p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Loading projects...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {githubRepos.map((repo, idx) => (
                <div
                  key={repo.id}
                  className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 ${isVisible.projects ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${idx * 0.1}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
                  
                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-1">
                        {repo.name}
                      </h3>
                      <a 
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-sm text-gray-400 mb-4 line-clamp-2 min-h-[40px]">
                      {repo.description || 'No description available'}
                    </p>

                    {repo.language && (
                      <div className="flex items-center gap-2 mb-4">
                        <span className="w-3 h-3 rounded-full bg-blue-400"></span>
                        <span className="text-sm text-gray-400">{repo.language}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{repo.stargazers_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks_count}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      </div>
                    </div>

                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {repo.topics.slice(0, 3).map((topic, i) => (
                          <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-md">
                            {topic}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">Technical Skills</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(skills).map(([category, items], idx) => (
              <div
                key={category}
                className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-orange-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-orange-500/10 ${isVisible.skills ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 0.1}s` }}
              >
                <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {category}
                </h3>
                <div className="space-y-2">
                  {items.map((skill, i) => (
                    <div
                      key={i}
                      className="px-3 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-orange-400/30"
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
      <section id="coding" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.coding ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">Coding Profiles</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {codingProfiles.map((profile, idx) => {
              const Icon = profile.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 ${isVisible.coding ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${profile.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
                  
                  <div className="relative text-center">
                    <div className={`inline-flex p-4 bg-gradient-to-br ${profile.color} rounded-2xl mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold mb-2">{profile.platform}</h3>
                    <p className="text-gray-400 text-sm mb-4">{profile.username}</p>
                    
                    <div className={`inline-block px-4 py-2 bg-gradient-to-r ${profile.color} rounded-full text-sm font-bold mb-3`}>
                      {profile.badge}
                    </div>
                    
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
      <section id="achievements" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">Achievements</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-purple-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {achievements.map((achievement, idx) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={idx}
                  className={`group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-purple-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 ${isVisible.achievements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
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
      <section id="responsibility" className="py-32 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className={`text-5xl md:text-6xl font-bold mb-4 transition-all duration-1000 ${isVisible.responsibility ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">Leadership & Responsibility</span>
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto rounded-full"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {responsibilities.map((resp, idx) => {
              const Icon = resp.icon;
              return (
                <div
                  key={idx}
                  className={`group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-green-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-green-500/10 ${isVisible.responsibility ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-green-400 to-teal-400 rounded-lg">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
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

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-white/10 bg-black/30">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Build Something Amazing
          </h3>
          <p className="text-gray-400 mb-8">Open to full-time opportunities and exciting projects</p>
          
          <div className="flex gap-4 justify-center mb-8">
            {[
              { Icon: Github, href: 'https://github.com/Swetabh48' },
              { Icon: Linkedin, href: 'https://linkedin.com/in/swetabh-salampuria' },
              { Icon: Mail, href: 'mailto:swetabhsalampuria@gmail.com' }
            ].map(({ Icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-purple-400/50 transition-all duration-300"
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
      `}</style>
    </div>
  );
};

export default Portfolio;