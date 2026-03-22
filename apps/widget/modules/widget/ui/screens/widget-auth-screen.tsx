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
        <div className="space-y-3">
          <p className="text-3xl font-semibold tracking-tight">
            Identity Verification
          </p>
          <p className="max-w-sm text-sm leading-6 text-white/88">
            Please authenticate your session to ensure persistent access to your
            support history and secure communications.
          </p>
        </div>
      </WidgetHeader>

      <div className="widget-main gap-4 px-4 py-4 min-h-0 overflow-y-auto">
        <div className="widget-card">
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <UserRoundIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="h-12 rounded-[1.15rem] border-border/70 bg-background/70 pl-11"
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
                        <MailIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          className="h-12 rounded-[1.15rem] border-border/70 bg-background/70 pl-11"
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
                className="h-12 w-full rounded-[1.15rem]"
                disabled={form.formState.isSubmitting}
                size="lg"
                type="submit"
              >
                Continue
              </Button>
            </form>
          </Form>
        </div>

        <div className="widget-soft-card flex items-start gap-3">
          <SparklesIcon className="mt-0.5 size-4 text-primary" />
          <p className="text-sm leading-6 text-foreground/82">
            This protocol ensures your support history remains securely attached
            to your organizational profile and isolated from unauthorized access.
          </p>
        </div>
      </div>
      <WidgetFooter />
    </>
  );
};
