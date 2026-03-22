import {
  FileTextIcon,
  GlobeIcon,
  LayoutGridIcon,
  NotebookTabsIcon,
  SearchCheckIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

const sources = [
  {
    title: "PDF Library",
    detail: "Policy docs, onboarding guides, and release summaries.",
    icon: FileTextIcon,
  },
  {
    title: "Notion Sync",
    detail: "Product decisions, internal notes, and support runbooks.",
    icon: NotebookTabsIcon,
  },
  {
    title: "Website Capture",
    detail: "Public pricing, docs, changelog, and marketing pages.",
    icon: GlobeIcon,
  },
] as const;

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="hero-panel">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[20rem] bg-gradient-to-l from-cyan-300/14 via-primary/10 to-transparent" />
        <div className="relative grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem] xl:items-end">
          <div>
            <p className="page-eyebrow">Knowledge Base</p>
            <h1 className="page-title mt-3">Files</h1>
            <p className="page-subtitle mt-4 max-w-3xl">
              Centralize docs, policies, and product references your assistant
              can reason over, cite from, and use during support replies.
            </p>
          </div>
          <div className="metric-card">
            <div className="flex items-center gap-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <SearchCheckIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">Retrieval posture</p>
                <p className="text-sm text-muted-foreground">
                  Sources organized for fast support recall
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {sources.map((source) => (
          <Card key={source.title} className="feature-card py-0">
            <CardHeader className="px-5 pt-5 pb-3">
              <div className="rounded-[1rem] border border-white/65 bg-white/74 p-3 dark:border-white/10 dark:bg-white/6">
                <source.icon className="size-5 text-primary" />
              </div>
              <CardTitle className="text-lg">{source.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-5 pb-5 text-sm leading-6 text-muted-foreground">
              {source.detail}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Content repository</CardTitle>
            <CardDescription>
              The upload and connector management UI can live in these polished
              containers.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 px-5 pb-5 md:grid-cols-3 md:px-6 md:pb-6">
            {[
              [
                "Structured docs",
                "Ideal for policies, FAQs, and release notes.",
              ],
              [
                "Product references",
                "Keep feature and pricing answers current.",
              ],
              [
                "Searchable snippets",
                "Surface quick answers during live conversations.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="metric-card">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="glass-panel py-0">
          <CardHeader className="px-5 py-5 md:px-6">
            <CardTitle>Source map</CardTitle>
            <CardDescription>
              A lightweight preview of the content lanes you can activate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 px-5 pb-5 md:px-6 md:pb-6">
            {[
              [
                "Connector status",
                "Ready for PDF, Notion, and website ingestion.",
              ],
              [
                "Chunk strategy",
                "Balanced for fast retrieval and readable citations.",
              ],
              [
                "Coverage",
                "Supports both public docs and internal support memory.",
              ],
            ].map(([title, description]) => (
              <div key={title} className="metric-card">
                <div className="flex items-center gap-3">
                  <LayoutGridIcon className="size-4 text-primary" />
                  <p className="text-sm font-semibold">{title}</p>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  </div>
);

export default Page;
