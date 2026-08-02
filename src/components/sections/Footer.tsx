import { useState } from 'react';
import type { FormEvent } from 'react';
import { FileText, Github, Linkedin, Mail, Phone, Send } from 'lucide-react';
import { contact } from '../../data/portfolio';
import type { Theme } from '../../data/portfolio';

interface Props {
  theme: Theme;
}

type MailStatus = 'idle' | 'sending' | 'sent' | 'error';

export function Footer({ theme }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<MailStatus>('idle');

  const links = [
    { Icon: Github, href: contact.github, label: 'GitHub' },
    { Icon: Linkedin, href: contact.linkedin, label: 'LinkedIn' },
    { Icon: Mail, href: `mailto:${contact.email}`, label: 'Email' },
    { Icon: Phone, href: `tel:${contact.phone}`, label: 'Phone' },
    { Icon: FileText, href: contact.resume, label: 'Resume' },
  ];

  const openMailto = () => {
    const subject = encodeURIComponent(
      name.trim() ? `Portfolio inquiry from ${name.trim()}` : 'Portfolio inquiry',
    );
    const body = encodeURIComponent(
      [`Name: ${name.trim() || '—'}`, `Email: ${email.trim() || '—'}`, '', message.trim()].join(
        '\n',
      ),
    );
    window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setStatus('sending');
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${contact.email}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          _subject: `Portfolio inquiry from ${name.trim()}`,
          _template: 'table',
        }),
      });

      if (!response.ok) throw new Error('send failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      // No backend required — fall back to the visitor's mail client.
      openMailto();
      setStatus('error');
    }
  };

  return (
    <footer id="contact" className="studio-section border-t border-white/8 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <div className="section-kicker mb-4">Contact</div>
            <h3 className="display-title mb-4 text-4xl font-semibold tracking-tight text-white md:text-6xl">
              Let's build something
              <br />
              <span className={`bg-gradient-to-r ${theme.colors.accent} bg-clip-text text-transparent`}>
                worth shipping
              </span>
            </h3>
            <p className="mb-2 max-w-xl text-slate-400">
              Open to full-time software engineering roles and ambitious product challenges.
            </p>
            <p className="mb-8 text-sm text-slate-500">
              {contact.email} · {contact.phone}
            </p>

            <div className="mb-10 flex gap-3">
              {links.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="studio-icon"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-[1.75rem] border border-white/10 bg-[#080b12]/72 p-6 shadow-2xl backdrop-blur-xl md:p-7"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-200/70">Mailbox</p>
                <h4 className="mt-1 display-title text-2xl text-white">Send a note</h4>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-white/40">
                Direct
              </span>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Name
                </span>
                <input
                  required
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-300/40"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Email
                </span>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-300/40"
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-[10px] uppercase tracking-[0.16em] text-white/35">
                  Message
                </span>
                <textarea
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={5}
                  className="w-full resize-y rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-cyan-300/40"
                  placeholder="What are you building, and how can I help?"
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                disabled={status === 'sending'}
                className="studio-btn studio-btn-primary inline-flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {status === 'sending' ? 'Sending…' : 'Send message'}
              </button>
              <button
                type="button"
                onClick={openMailto}
                className="text-left text-[11px] text-white/40 transition-colors hover:text-cyan-200 sm:text-center"
              >
                Or open in your mail app
              </button>
            </div>

            <p className="mt-4 text-[11px] leading-relaxed text-white/35">
              {status === 'sent' && 'Message sent — I’ll get back to you soon.'}
              {status === 'error' &&
                'Opened your mail app as a fallback. If nothing opened, email me directly.'}
              {status === 'idle' &&
                `Messages go straight to ${contact.email}. First FormSubmit send may ask you to confirm once.`}
              {status === 'sending' && 'Delivering your note…'}
            </p>
          </form>
        </div>

        <p className="mt-14 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} Swetabh Salampuria
        </p>
      </div>
    </footer>
  );
}
