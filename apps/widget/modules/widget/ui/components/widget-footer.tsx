import { HomeIcon, InboxIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { screenAtom } from "../../atoms/widget-atoms";

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
] as const;

export const WidgetFooter = () => {
  const screen = useAtomValue(screenAtom);
  const setScreen = useSetAtom(screenAtom);

  return (
    <footer className="border-t border-white/14 bg-slate-950/90 px-4 py-3 text-slate-200 backdrop-blur-xl">
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2">
        {tabs.map((tab) => {
          const active = screen === tab.key;

          return (
            <Button
              key={tab.key}
              className={cn(
                "h-11 rounded-[1rem] border border-transparent text-slate-200 transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-primary via-blue-500 to-cyan-400 text-white shadow-[0_24px_48px_-30px_rgba(59,130,246,0.6)]"
                  : "bg-white/6 hover:bg-white/10",
              )}
              onClick={() => setScreen(tab.key)}
              variant="ghost"
            >
              <tab.icon className="size-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>
    </footer>
  );
};
