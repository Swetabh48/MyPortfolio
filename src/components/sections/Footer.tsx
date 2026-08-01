import { FileText, Github, Linkedin, Mail, Phone } from 'lucide-react';
import { contact } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';

interface Props {
  theme: Theme;
}

export function Footer({ theme }: Props) {
  const links = [
    { Icon: Github, href: contact.github, label: 'GitHub' },
    { Icon: Linkedin, href: contact.linkedin, label: 'LinkedIn' },
    { Icon: Mail, href: `mailto:${contact.email}`, label: 'Email' },
    { Icon: Phone, href: `tel:${contact.phone}`, label: 'Phone' },
    { Icon: FileText, href: contact.resume, label: 'Resume' },
  ];

  return (
    <footer id="contact" className="studio-section py-24 px-6 md:px-10 border-t border-white/8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="section-kicker mb-4">Contact</div>
        <h3 className="display-title text-4xl md:text-6xl font-semibold mb-4 tracking-tight text-white">
          Let's build something
          <br />
          <span className={`bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}>
            worth shipping
          </span>
        </h3>
        <p className="text-slate-400 mb-2 max-w-xl mx-auto">
          Open to full-time software engineering roles and ambitious product challenges.
        </p>
        <p className="text-sm text-slate-500 mb-8">
          {contact.email} · {contact.phone}
        </p>

        <div className="flex gap-3 justify-center mb-10">
          {links.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="studio-icon"
              aria-label={label}
            >
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>

        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} Swetabh Salampuria
        </p>
      </div>
    </footer>
  );
}
