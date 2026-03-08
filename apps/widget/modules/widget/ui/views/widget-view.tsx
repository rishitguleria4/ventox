"use client"

import { Sparkles } from "lucide-react"

import { Card } from "@workspace/ui/components/card"

import { WidgetFooter } from "../components/widget-footer"
import { WidgetHeader } from "../components/widget-header"

interface Props {
  organizationId: string
}

export const WidgetView = ({ organizationId }: Props) => {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-3 py-4">
      <Card className="w-full overflow-hidden rounded-2xl border border-white/35 bg-white/75 py-0 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
        <WidgetHeader>
          <div className="mt-5 space-y-3 px-2 pb-6">
            <p className="text-3xl font-semibold tracking-tight">Hi there</p>
            <p className="max-w-xs text-sm text-white/90">How can we help you today?</p>
          </div>
        </WidgetHeader>

        <div className="flex min-h-80 flex-1 flex-col gap-4 bg-linear-to-b from-background/80 to-background/45 p-4">
          <div className="self-start rounded-2xl rounded-tl-sm border border-border/60 bg-background/85 px-3 py-2 text-sm shadow-sm">
            Ask about orders, refunds, or account support.
          </div>
          <div className="self-end rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground shadow-sm">
            Connect me to sales.
          </div>
          <div className="mt-auto flex items-center gap-2 rounded-xl border border-dashed border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Organization: {organizationId}
          </div>
        </div>

        <WidgetFooter />
      </Card>
    </main>
  )
}
