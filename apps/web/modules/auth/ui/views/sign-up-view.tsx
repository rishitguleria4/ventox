import { SignUp } from "@clerk/nextjs";
import {
  BotIcon,
  PaintbrushVerticalIcon,
  RocketIcon,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";

export const SignUpview = () => {
  const metrics: Array<[LucideIcon, string, string]> = [
    [
      RocketIcon,
      "Fast setup",
      "Get from account creation to branded support flow quickly.",
    ],
    [
      PaintbrushVerticalIcon,
      "Brand control",
      "Tune the widget and dashboard with one visual language.",
    ],
    [
      BotIcon,
      "Assistant ready",
      "Prepare chat and voice surfaces for real customer conversations.",
    ],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="hero-panel hidden lg:block">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[18rem] bg-gradient-to-l from-emerald-300/14 via-primary/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-between gap-8">
          <div>
            <div className="inline-flex rounded-[1.4rem] border border-white/60 bg-white/76 p-3 shadow-[0_24px_54px_-40px_rgba(15,23,42,0.42)] backdrop-blur-xl dark:border-white/10 dark:bg-white/6">
              <Image
                src="/VENTOX-logo.png"
                alt="Ventox"
                width={2026}
                height={380}
                className="h-11 w-auto"
                priority
              />
            </div>
            <p className="page-eyebrow mt-8">Create Account</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight xl:text-5xl">
              Launch a support workspace that already looks production-ready.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-8 text-muted-foreground">
              Invite your team, connect channels, and ship an assistant
              experience that feels native to your product and brand.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {metrics.map(([Icon, title, copy]) => (
              <div key={title} className="metric-card p-4">
                <Icon className="size-4 text-primary" />
                <p className="mt-3 text-sm font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-panel flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <p className="page-eyebrow">New workspace</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">
            Create your Ventox account
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Start with a cleaner, more intentional control center for support,
            automation, and brand-led customer interactions.
          </p>
          <div className="mt-6 rounded-[1.6rem] border border-white/60 bg-white/62 p-3 shadow-[0_24px_54px_-40px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/6">
            <SignUp
              fallbackRedirectUrl="/"
              appearance={{
                elements: {
                  card: "!shadow-none !bg-transparent !border-0",
                  rootBox: "w-full",
                  headerTitle: "!hidden",
                  headerSubtitle: "!hidden",
                  socialButtonsBlockButton:
                    "!rounded-2xl !border !border-border/70 !bg-background/70 !shadow-none",
                  formButtonPrimary:
                    "!rounded-2xl !bg-primary !shadow-[0_24px_48px_-28px_rgba(59,130,246,0.55)]",
                  formFieldInput:
                    "!rounded-2xl !border-border/70 !bg-background/72 !shadow-none",
                  footerActionLink: "!text-primary !font-medium",
                },
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};
