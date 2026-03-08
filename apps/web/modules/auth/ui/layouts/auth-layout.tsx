export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-10">
      <div className="ambient-orb -top-20 -left-20 size-72 bg-blue-300/30 dark:bg-blue-500/20" />
      <div className="ambient-orb -right-20 bottom-0 size-80 bg-cyan-300/20 [animation-delay:1.6s] dark:bg-cyan-400/20" />
      <div className="glass-panel relative z-10 w-full max-w-5xl p-3 md:p-6">{children}</div>
    </div>
  )
}
