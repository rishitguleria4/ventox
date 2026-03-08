import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="glass-panel p-6 md:p-8">
        <p className="page-eyebrow">Configurations</p>
        <h1 className="page-title mt-3">Integrations</h1>
        <p className="page-subtitle mt-3">Connect channels and systems to keep your support assistant context-aware in real time.</p>
      </section>

      <Card className="glass-panel py-0">
        <CardHeader>
          <CardTitle>Connected services</CardTitle>
          <CardDescription>Link product analytics, CRMs, and communication platforms.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {["Slack", "HubSpot", "Zendesk"].map((name) => (
            <div key={name} className="rounded-xl border border-border/70 bg-background/50 p-4">
              <p className="font-medium">{name}</p>
              <p className="text-xs text-muted-foreground">Not connected</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
)

export default Page
