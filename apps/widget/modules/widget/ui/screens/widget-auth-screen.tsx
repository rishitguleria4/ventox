"use client";

import { useMutation } from "convex/react";
import { useAtomValue, useSetAtom } from "jotai";
import { MailIcon, SparklesIcon, UserRoundIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@workspace/backend/convex/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";

import {
  contactSessionIdAtomFamily,
  errorMessageAtom,
  organizationIdAtom,
  screenAtom,
} from "../../atoms/widget-atoms";
import { WidgetFooter } from "../components/widget-footer";
import { WidgetHeader } from "../components/widget-header";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email Address"),
});

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionID = useSetAtom(
    contactSessionIdAtomFamily(organizationId || ""),
  );
  const setErrorMessage = useSetAtom(errorMessageAtom);
  const setScreen = useSetAtom(screenAtom);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const createContactSession = useMutation(api.public.contactSessions.create);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!organizationId) {
      setErrorMessage("Missing organization ID");
      setScreen("error");
      return;
    }

    const metadata = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages?.join(",") ?? "",
      platform: navigator.platform,
      vendor: navigator.vendor,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset(),
      cookieEnabled: navigator.cookieEnabled,
      referrer: document.referrer || "direct",
      currentUrl: window.location.href,
    };

    try {
      const contactSessionId = await createContactSession({
        ...values,
        organizationId,
        metadata,
      });

      setErrorMessage(null);
      setContactSessionID(contactSessionId);
      setScreen("selection");
    } catch {
      setErrorMessage("Unable to start your session right now");
      setScreen("error");
    }
  };

  return (
    <>
      <WidgetHeader>
        <div className="space-y-1">
          <p className="text-xl font-semibold tracking-tight">
            Identity Verification
          </p>
          <p className="max-w-sm text-xs leading-5 text-white/85">
            Authenticate your session for persistent access to your support
            history.
          </p>
        </div>
      </WidgetHeader>

      <div className="widget-main min-h-0 gap-3 overflow-y-auto px-4 py-3.5">
        <div className="widget-card">
          <Form {...form}>
            <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <UserRoundIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="h-11 rounded-[1rem] border-border/70 bg-background/70 pl-11"
                          placeholder="Your name"
                          type="text"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <MailIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="h-11 rounded-[1rem] border-border/70 bg-background/70 pl-11"
                          placeholder="Your email"
                          type="email"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="h-11 w-full rounded-[1rem]"
                disabled={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>

        <div className="widget-soft-card flex items-start gap-3 py-3">
          <SparklesIcon className="mt-0.5 size-4 text-primary" />
          <p className="text-xs leading-5 text-foreground/82">
            Your support history remains securely attached to your profile and
            isolated from unauthorized access.
          </p>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
