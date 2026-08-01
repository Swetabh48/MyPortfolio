export function HeroFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-sky-500/15 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-[280px] h-[280px] rounded-full bg-indigo-500/15 blur-3xl" />
      <div className="absolute top-1/3 right-1/4 w-[200px] h-[200px] rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-56 rounded-[2rem] border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] shadow-[0_30px_80px_rgba(0,0,0,0.35)]" />
      </div>
    </div>
  );
}
