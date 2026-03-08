import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="glass-panel p-6 md:p-8">
        <p className="page-eyebrow">Customer Support</p>
        <h1 className="page-title mt-3">Conversations</h1>
        <p className="page-subtitle mt-3">Track every thread across channels with fast triage and smart context handoff.</p>
      </section>

      <Card className="glass-panel py-0">
        <CardHeader>
          <CardTitle>Inbox is ready</CardTitle>
          <CardDescription>Conversation list and filters can be connected here next.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-dashed border-border/80 bg-background/40 p-8 text-sm text-muted-foreground">
            No active conversation UI yet. This page is now styled and prepared for feature wiring.
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default Page
