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
    <footer className="grid grid-cols-2 border-t border-border/60 bg-background/80 p-2 backdrop-blur-xl">
      {tabs.map((tab) => {
        const active = screen === tab.key

        return (
          <Button
            key={tab.key}
            className={cn(
              "h-11 rounded-xl text-muted-foreground",
              active && "bg-primary/10 text-primary"
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
