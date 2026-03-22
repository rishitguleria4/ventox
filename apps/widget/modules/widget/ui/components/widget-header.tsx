import type React from "react";

import Image from "next/image";

import { cn } from "@workspace/ui/lib/utils";

export const WidgetHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "relative overflow-hidden border-b border-white/18 bg-gradient-to-br from-slate-950 via-blue-900 to-sky-700 px-6 pb-6 pt-6 text-primary-foreground",
        className,
      )}
    >
      <div className="absolute -top-16 -right-4 size-40 rounded-full bg-white/14 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-px w-full bg-white/20 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image
            src="/VENTOX-logo.png"
            alt="Ventox"
            width={2026}
            height={380}
            className="h-8 w-auto max-w-[9rem] object-contain drop-shadow-md"
            priority
          />
          <div className="widget-pill shadow-sm bg-white/20 border-white/30 backdrop-blur-md">
            Assistant
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-6">{children}</div>
    </header>
  );
};
