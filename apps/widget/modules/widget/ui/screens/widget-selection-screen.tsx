"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIdAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/convex/_generated/api";
import { useState } from "react";
export const WidgetSelectionScreen = () => {

    const setScreen = useSetAtom(screenAtom);
    const organizationId  = useAtomValue(organizationIdAtom);
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const contactSessionId = useAtomValue(
        contactSessionIdAtomFamily(organizationId || "")
    )

    const createConversations = useMutation(api.public.conversations.create);
    const [isPending, setIsPending] = useState(false);
    const setConversationId = useSetAtom(conversationIdAtom);
    const handleNewConversation = async() =>{

        if (!organizationId){
            setScreen("error");
            setErrorMessage("Missing Organization Id");
            return;
        }
        if (!contactSessionId){
            setScreen("auth");
            return;
        }
        setIsPending(true);
        try{
            const conversationId = await createConversations({
                contactSessionId,
                organizationId,
            });
            setErrorMessage(null);
            setScreen("chat");
            setConversationId(conversationId);
        }catch{
            setScreen("auth");
        }
        finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <WidgetHeader>
            <div className="mt-5 space-y-3 px-2 pb-6">
                <p className="text-3xl font-semibold tracking-tight">Hi there</p>
                <p className="max-w-xs text-sm text-white/90">
                    Let&apos;s get you started
                </p>
            </div>
            </WidgetHeader>
            <div className="flex flex-col flex-1 items-center justify-center gap-y-4 p-4 text-muted-foreground">
                < Button className="w-full h-16 justify-between" onClick={handleNewConversation} disabled = {isPending}>
                    <div className="flex items-center gap-x-2">
                        <MessageSquareTextIcon className="size-4" />
                        <span> start chat </span>
                    </div>
                    <ChevronRightIcon />
                </Button>
            </div>
            <WidgetFooter />
        </>
    )
}
