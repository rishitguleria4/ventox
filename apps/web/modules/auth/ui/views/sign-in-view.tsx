import Image from "next/image"
import { SignIn } from "@clerk/nextjs"

export const SignInView = () => {
  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
      <section className="hidden rounded-2xl border border-white/40 bg-white/70 p-10 backdrop-blur-2xl md:block dark:border-white/10 dark:bg-white/5">
        <div className="inline-flex rounded-2xl border border-white/50 bg-white/80 p-3 shadow-lg shadow-slate-950/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
          <Image
            src="/VENTOX-logo.png"
            alt="Ventox"
            width={2026}
            height={380}
            className="h-12 w-auto"
            priority
          />
        </div>
        <p className="page-eyebrow mt-6">Ventox Platform</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Operate support with a premium customer experience.</h1>
        <p className="mt-4 text-muted-foreground">
          Unified conversations, voice automation, and branded widget control in one workspace.
        </p>
      </section>
      <section className="glass-panel flex items-center justify-center p-4 md:p-8">
        <SignIn
          fallbackRedirectUrl="/"
          appearance={{
            elements: {
              card: "!shadow-none !bg-transparent !border-0",
              rootBox: "w-full",
            },
          }}
        />
      </section>
    </div>
  )
}
