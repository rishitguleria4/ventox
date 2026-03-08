import type React from "react"

import { Sparkles } from "lucide-react"

import { cn } from "@workspace/ui/lib/utils"

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-t-2xl border-b border-white/25 bg-linear-to-br from-slate-900 via-blue-900 to-blue-700 p-4 text-primary-foreground",
        className
      )}
    >
      <div className="absolute -top-14 -right-6 size-36 rounded-full bg-white/15 blur-2xl" />
      <div className="relative z-10 flex items-center gap-2 text-xs tracking-[0.2em] uppercase opacity-80">
        <Sparkles className="size-3.5" />
        Ventox Assistant
      </div>
      <div className="relative z-10">{children}</div>
    </header>
  )
}
