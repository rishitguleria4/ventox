import { Building2Icon, SparklesIcon, Users2Icon } from "lucide-react";
import { OrganizationList } from "@clerk/nextjs";

const isValidRedirectUrl = (url: string): boolean => {
  return url.startsWith("/") && !url.startsWith("//");
};

export const OrgSelectionView = ({
  redirectUrl = "/",
}: {
  redirectUrl?: string;
}) => {
  const safeRedirectUrl = isValidRedirectUrl(redirectUrl) ? redirectUrl : "/";
  const completionUrl = `/org-selection/complete?redirectUrl=${encodeURIComponent(safeRedirectUrl)}`;

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="hero-panel hidden lg:block">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[16rem] bg-gradient-to-l from-sky-300/14 via-primary/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-between gap-8">
          <div>
            <p className="page-eyebrow">Workspace</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">
              Choose the organization you want to manage right now.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-8 text-muted-foreground">
              Keep multiple teams cleanly separated while preserving the same
              refined dashboard and widget experience across accounts.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              [
                Building2Icon,
                "Multi-org friendly",
                "Switch cleanly between workspaces without visual clutter.",
              ],
              [
                Users2Icon,
                "Team-aware",
                "Land in the right support environment before you start.",
              ],
              [
                SparklesIcon,
                "Consistent UX",
                "The same polished control center follows each org.",
              ],
            ].map(([Icon, title, copy]) => (
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

      <section className="glass-panel flex flex-col gap-5 p-6 md:p-8">
        <div>
          <p className="page-eyebrow">Select organization</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Pick your active workspace
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Choose the team you want to manage and continue directly into that
            organization&apos;s dashboard.
          </p>
        </div>
        <div className="rounded-[1.55rem] border border-white/60 bg-white/62 p-4 shadow-[0_24px_54px_-40px_rgba(15,23,42,0.38)] dark:border-white/10 dark:bg-white/6">
          <OrganizationList
            afterCreateOrganizationUrl={completionUrl}
            afterSelectOrganizationUrl={completionUrl}
            hidePersonal
            skipInvitationScreen
          />
        </div>
      </section>
    </div>
  );
};
