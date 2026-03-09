import { HomeIcon, InboxIcon } from "lucide-react"

import { Button } from "@workspace/ui/components/button"
import { cn } from "@workspace/ui/lib/utils"

const screen = "selection"

const tabs = [
  {
    icon: HomeIcon,
    label: "Home",
    key: "selection",
  },
  {
    icon: InboxIcon,
    label: "Inbox",
    key: "inbox",
  },
] as const

export const WidgetFooter = () => {
  return (
    <footer className="grid grid-cols-2 overflow-hidden rounded-b-2xl border-b border-white/25 bg-linear-to-br from-slate-900 via-blue-900 to-blue-700 p-4 text-blue-200 ">
      {tabs.map((tab) => {
        const active = screen === tab.key

        return (
          <Button
            key={tab.key}
            className={cn(
              "h-11 rounded-xl ",
              active && "bg-primary/10 "
            )}
            onClick={() => {}}
            variant="ghost"
          >
            <tab.icon className="size-4" />
            {tab.label}
          </Button>
        )
      })}
    </footer>
  )
}
