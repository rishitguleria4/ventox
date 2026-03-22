"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";

import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);

  return (
    <>
      <WidgetHeader>
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight">
            System Configuration Error
          </p>
          <p className="max-w-sm text-sm leading-6 text-white/88">
            Initialization sequence halted due to invalid session parameters.
          </p>
        </div>
      </WidgetHeader>
      <div className="widget-main items-center justify-center gap-4 px-4 py-4">
        <div className="widget-card w-full max-w-sm text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/12 text-destructive">
            <AlertTriangleIcon className="size-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold">Configuration Validation Failed</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {errorMessage || "Invalid configuration"}
          </p>
          <Button
            className="mt-5 rounded-full px-4"
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
