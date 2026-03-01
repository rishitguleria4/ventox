"use client";

import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";
import { Authenticated , AuthLoading, Unauthenticated } from "convex/react";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    return (
    <>
        <AuthLoading>
            <AuthLayout>
                <p>Loading...</p>
            </AuthLayout>
        </AuthLoading>
        <Authenticated>
            { children }
        </Authenticated>
        <Unauthenticated>
            <AuthLayout>
                <SignInView />
            </AuthLayout>
        </Unauthenticated>
    </>
    );
};