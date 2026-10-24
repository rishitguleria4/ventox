import type React from "react";

import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
  children,
  className,
  compact = false,
}: {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
}) => {
  return (
    <header
      className={cn(
        "relative shrink-0 overflow-hidden border-b border-white/18 bg-gradient-to-br from-slate-950 via-blue-900 to-sky-700 text-primary-foreground",
        compact ? "px-4 py-2.5" : "px-5 py-3.5",
        className,
      )}
    >
      <div className="pointer-events-none absolute -top-16 -right-4 size-40 rounded-full bg-white/14 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-white/20" />
      <div className="relative z-10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Image
            src="/VENTOX-logo.png"
            alt="Ventox"
            width={2026}
            height={380}
            className={cn(
              "w-auto object-contain drop-shadow-md",
              compact ? "h-5 max-w-[7rem]" : "h-6 max-w-[7.5rem]",
            )}
            priority
          />
          <div className="widget-pill border-white/30 bg-white/20 px-2.5 py-0.5 text-[11px] shadow-sm backdrop-blur-md">
            Assistant
          </div>
        </div>
        {compact ? <div className="flex items-center gap-2">{children}</div> : null}
      </div>
      {!compact ? <div className="relative z-10 mt-2.5">{children}</div> : null}
    </header>
  );
};
