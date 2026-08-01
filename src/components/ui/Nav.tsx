import { Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { navLinks } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';

interface NavProps {
  theme: Theme;
}

export function Nav({ theme }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#07090f]/80 backdrop-blur-xl border-b border-white/8'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        <a href="#hero" className="display-title text-lg font-semibold tracking-tight">
          <span className={`bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}>
            Swetabh
          </span>
          <span className="ml-1 text-[10px] align-top text-white/35">®</span>
        </a>

        <div className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1.5">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 text-sm text-slate-300 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="hidden lg:inline-flex studio-btn studio-btn-primary !py-2 !px-4 !text-sm"
        >
          Start a conversation
        </a>

        <button
          type="button"
          className="md:hidden p-2 rounded-full border border-white/10 bg-white/5"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-[#07090f]/95 backdrop-blur-xl px-6 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-3 py-3 text-sm text-slate-300 hover:text-white rounded-xl hover:bg-white/5"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
