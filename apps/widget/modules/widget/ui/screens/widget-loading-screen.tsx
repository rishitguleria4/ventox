"use client";
import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  loadingMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { useAtomValue, useSetAtom } from "jotai";
import { Loader2Icon } from "lucide-react";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { useEffect } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { Id } from "@workspace/backend/convex/_generated/dataModel";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setContactSessionId = useSetAtom(contactSessionIdAtomFamily(organizationId || ""));
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setLoadingMessage = useSetAtom(loadingMessageAtom);
  const setScreen = useSetAtom(screenAtom);

  const validateOrganization = useAction(api.public.organizations.validate);
  const validateContactSession = useMutation(api.public.contactSessions.validate);

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      setLoadingMessage("Finding Organization ID...");
      if (!organizationId) {
        setErrorMessage("Organization ID required");
        setScreen("error");
        return;
      }

      setLoadingMessage("Verifying Organization...");
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
      setLoadingMessage("Finding contact session ID...");

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
        <div className="mt-5 space-y-3 px-2 pb-6">
          <p className="text-3xl font-semibold tracking-tight">Hi there</p>
          <p className="max-w-xs text-sm text-white/90">Let&apos;s get you started</p>
        </div>
      </WidgetHeader>
      <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
        <Loader2Icon className="animate-spin" />
        <p className="text-sm">{loadingMessage || "Loading.."}</p>
      </div>
      <WidgetFooter />
    </>
  );
};
