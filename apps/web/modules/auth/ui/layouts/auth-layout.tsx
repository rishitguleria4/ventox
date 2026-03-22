export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-6 md:px-8 md:py-8">
      <div className="ambient-orb glow-orb -top-20 -left-20 size-72 bg-blue-300/30 dark:bg-blue-500/20" />
      <div className="ambient-orb -right-20 bottom-0 size-80 bg-cyan-300/20 [animation-delay:1.6s] dark:bg-cyan-400/20" />
      <div className="ambient-orb bottom-[-7rem] left-[22%] size-72 bg-emerald-300/18 [animation-delay:2.2s] dark:bg-emerald-400/12" />
      <div className="relative z-10 w-full max-w-6xl">{children}</div>
    </div>
  );
};
