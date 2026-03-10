"use client";

import { useAtomValue } from "jotai";
import { AlertTriangleIcon } from "lucide-react";
import { errorMessageAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget-header";
import { WidgetFooter } from "../components/widget-footer";

export const WidgetErrorScreen= () => {
    const errorMessage = useAtomValue(errorMessageAtom);

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
                <AlertTriangleIcon/>
                <p className="text-sm">
                    {errorMessage || "invalid configuration"}
                </p>
            </div>
            <WidgetFooter />
        </>
    )
}