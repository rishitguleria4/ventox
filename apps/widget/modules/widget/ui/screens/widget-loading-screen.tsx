"use client";

import { useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2Icon } from "lucide-react";

import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";

import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const validateOrganization = useAction(api.public.organizations.validate);
  const validateContactSession = useMutation(
    api.public.contactSessions.validate,
  );

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      setLoadingMessage("Finding organization ID...");
      if (!organizationId) {
        setErrorMessage("Organization ID required");
        setScreen("error");
        return;
      }

      setLoadingMessage("Verifying organization...");
      let organizationResult: Awaited<ReturnType<typeof validateOrganization>>;

      try {
        organizationResult = await validateOrganization({ organizationId });
      } catch {
        if (!cancelled) {
          setErrorMessage("Unable to verify organization");
          setScreen("error");
        }
        return;
      }

      if (cancelled) {
        return;
      }

      if (!organizationResult.valid) {
        setErrorMessage(organizationResult.reason || "Invalid configuration");
        setScreen("error");
        return;
      }

      setOrganizationId(organizationId);
      setLoadingMessage("Finding contact session...");

      if (!contactSessionId) {
        setScreen("auth");
        return;
      }

      setLoadingMessage("Validating session...");
      try {
        const sessionResult = await validateContactSession({
          contactSessionId: contactSessionId as Id<"contactSessions">,
        });

        if (cancelled) {
          return;
        }

        if (!sessionResult.valid) {
          setContactSessionId(null);
          setScreen("auth");
          return;
        }

        setScreen("selection");
      } catch {
        if (!cancelled) {
          setContactSessionId(null);
          setScreen("auth");
        }
      }
    };

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [
    contactSessionId,
    organizationId,
    setContactSessionId,
    setErrorMessage,
    setLoadingMessage,
    setOrganizationId,
    setScreen,
    validateContactSession,
    validateOrganization,
  ]);

  return (
    <>
      <WidgetHeader>
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight">
            Initializing Secure Session
          </p>
          <p className="max-w-sm text-sm leading-6 text-white/88">
            Validating enterprise credentials and establishing encrypted connection.
          </p>
        </div>
      </WidgetHeader>
      <div className="widget-main items-center justify-center gap-4 px-4 py-4">
        <div className="widget-card w-full max-w-sm text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2Icon className="size-6 animate-spin" />
          </div>
          <p className="mt-5 text-base font-semibold">Establishing Connection</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {loadingMessage || "Synchronizing session state..."}
          </p>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
