import { SignUp } from "@clerk/nextjs"

export const SignUpview = () => {
  return (
    <div className="grid gap-6 md:grid-cols-[1.1fr_1fr]">
      <section className="hidden rounded-2xl border border-white/40 bg-white/70 p-10 backdrop-blur-2xl md:block dark:border-white/10 dark:bg-white/5">
        <p className="page-eyebrow">Create Account</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Launch your workspace in minutes.</h1>
        <p className="mt-4 text-muted-foreground">
          Invite your team, connect channels, and ship an assistant that feels native to your product.
        </p>
      </section>
      <section className="glass-panel flex items-center justify-center p-4 md:p-8">
        <SignUp
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
