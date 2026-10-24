"use client";

import { useEffect, useRef } from "react";
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

const LAST_ORG_STORAGE_KEY = "ventox_last_organization_id";

export const WidgetLoadingScreen = ({
  organizationId,
}: {
  organizationId: string | null;
}) => {
  const currentOrgId = useAtomValue(organizationIdAtom);
  const resolvedOrgId =
    organizationId ||
    currentOrgId ||
    (typeof window !== "undefined"
      ? window.localStorage.getItem(LAST_ORG_STORAGE_KEY)
      : null);

  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(resolvedOrgId || ""),
  );
  const contactSessionIdRef = useRef(contactSessionId);
  contactSessionIdRef.current = contactSessionId;

  const loadingMessage = useAtomValue(loadingMessageAtom);
  const setOrganizationId = useSetAtom(organizationIdAtom);
  const setContactSessionId = useSetAtom(
    contactSessionIdAtomFamily(resolvedOrgId || ""),
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
      if (!resolvedOrgId) {
        setErrorMessage(
          "Organization ID required. Pass ?organizationId=org_... in the URL or enter it below.",
        );
        setScreen("error");
        return;
      }

      setOrganizationId(resolvedOrgId);
      setLoadingMessage("Verifying organization...");
      let organizationResult: Awaited<ReturnType<typeof validateOrganization>>;

      try {
        organizationResult = await validateOrganization({
          organizationId: resolvedOrgId,
        });
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

      if (typeof window !== "undefined") {
        window.localStorage.setItem(LAST_ORG_STORAGE_KEY, resolvedOrgId);
      }

      setLoadingMessage("Finding contact session...");
      const sessionId = contactSessionIdRef.current;

      if (!sessionId) {
        setScreen("auth");
        return;
      }

      setLoadingMessage("Validating session...");
      try {
        const sessionResult = await validateContactSession({
          contactSessionId: sessionId as Id<"contactSessions">,
        });

        if (cancelled) {
          return;
        }

        if (!sessionResult.valid) {
          setContactSessionId(null);
          setScreen("auth");
          return;
        }

        setErrorMessage(null);
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
    resolvedOrgId,
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
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight">
            Initializing Secure Session
          </p>
          <p className="max-w-sm text-xs leading-5 text-white/85">
            Validating credentials and establishing encrypted connection.
          </p>
        </div>
      </WidgetHeader>
      <div className="widget-main items-center justify-center gap-4 px-4 py-4">
        <div className="widget-card w-full max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Loader2Icon className="size-5 animate-spin" />
          </div>
          <p className="mt-4 text-base font-semibold">Establishing Connection</p>
          <p className="mt-1.5 text-sm leading-5 text-muted-foreground">
            {loadingMessage || "Synchronizing session state..."}
          </p>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
