import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

const Page = () => (
  <div className="dashboard-page">
    <div className="dashboard-inner">
      <section className="glass-panel p-6 md:p-8">
        <p className="page-eyebrow">Knowledge Base</p>
        <h1 className="page-title mt-3">Files</h1>
        <p className="page-subtitle mt-3">Centralize docs, policies, and product references your assistant can reason over.</p>
      </section>

      <Card className="glass-panel py-0">
        <CardHeader>
          <CardTitle>Content repository</CardTitle>
          <CardDescription>Upload management and retrieval dashboards can be added in this container.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {["PDF", "Notion", "Website"].map((source) => (
              <div key={source} className="rounded-xl border border-border/70 bg-background/50 p-4 text-sm">
                <p className="font-medium">{source}</p>
                <p className="mt-1 text-muted-foreground">Connector placeholder</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
)

export default Page
