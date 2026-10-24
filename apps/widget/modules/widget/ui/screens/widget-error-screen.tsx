"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { AlertTriangleIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";

import {
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetErrorScreen = () => {
  const errorMessage = useAtomValue(errorMessageAtom);
  const currentOrgId = useAtomValue(organizationIdAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const [orgInput, setOrgInput] = useState(currentOrgId ?? "");

  const handleConnectOrg = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = orgInput.trim();
    if (!trimmed) {
      return;
    }
    setOrganizationId(trimmed);
    setErrorMessage(null);
    const url = new URL(window.location.href);
    url.searchParams.set("organizationId", trimmed);
    window.history.replaceState({}, "", url.toString());
    setScreen("loading");
  };

  return (
    <>
      <WidgetHeader>
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight">
            System Configuration Error
          </p>
          <p className="max-w-sm text-xs leading-5 text-white/85">
            Initialization sequence halted due to invalid session parameters.
          </p>
        </div>
      </WidgetHeader>
      <div className="widget-main items-center justify-center gap-4 px-4 py-4">
        <div className="widget-card w-full max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-destructive/12 text-destructive">
            <AlertTriangleIcon className="size-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold">
            Configuration Validation Failed
          </h2>
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
            {errorMessage || "Invalid configuration"}
          </p>

          <form className="mt-4 space-y-2.5 text-left" onSubmit={handleConnectOrg}>
            <Input
              className="h-10 rounded-[0.95rem] border-border/70 bg-background/70 text-sm"
              onChange={(e) => setOrgInput(e.target.value)}
              placeholder="Enter Clerk Organization ID (org_...)"
              value={orgInput}
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 rounded-full px-4"
                disabled={!orgInput.trim()}
                type="submit"
              >
                Connect
              </Button>
              <Button
                className="rounded-full px-4"
                onClick={() => window.location.reload()}
                type="button"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </form>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
