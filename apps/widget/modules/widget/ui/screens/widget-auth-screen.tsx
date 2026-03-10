"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@workspace/ui/components/form";
import { useSearchParams } from "next/navigation";
import { WidgetHeader } from "../components/widget-header";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@workspace/backend/convex/_generated/api";
import { Card } from "@workspace/ui/components/card";
import { Sparkles } from "lucide-react";
import { useMutation } from "convex/react";
import { WidgetFooter } from "../components/widget-footer";
import { useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, organizationIdAtom } from "../../atoms/widget-atoms";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid Email Address"),
});

export const WidgetAuthScreen = () => {
  const organizationId = useAtomValue(organizationIdAtom);
  const setContactSessionID = useSetAtom(
    contactSessionIdAtomFamily(organizationId || "")
  );
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
      console.error("Missing organizationId");
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
    const contactSessionId = await createContactSession({
      ...values,
       organizationId: organizationId,
       metadata,
    });
    setContactSessionID(contactSessionId);
  };

  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-white/35 bg-white/75 py-0 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">

      <WidgetHeader>
        <div className="mt-5 space-y-3 px-2 pb-6">
          <p className="text-3xl font-semibold tracking-tight">Hi there</p>
          <p className="max-w-xs text-sm text-white/90">
            Let&apos;s get you started
          </p>
        </div>
      </WidgetHeader>

      <div className="flex min-h-80 flex-1 flex-col gap-4 bg-gradient-to-b from-background/80 to-background/45 p-4">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Your name" type="text" {...field} />
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
                    <Input placeholder="Your email" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              size="lg"
              disabled={form.formState.isSubmitting}
            >
              Continue
            </Button>

          </form>
        </Form>

        <div className="mt-auto flex items-center gap-2 rounded-xl border border-dashed border-border/70 bg-background/40 p-3 text-xs text-muted-foreground">
          <Sparkles className="size-3.5 text-primary" />
          Hi! please enter your Name and Email-id to continue
        </div>
      </div>
      <WidgetFooter/>
    </Card>
  );
};
