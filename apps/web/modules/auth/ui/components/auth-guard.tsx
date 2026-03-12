"use client";

import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";

import { AuthLayout } from "../layouts/auth-layout";
import { SignInView } from "../views/sign-in-view";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkLoading>
        <AuthLayout>
          <p>Loading...</p>
        </AuthLayout>
      </ClerkLoading>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <AuthLayout>
          <SignInView />
        </AuthLayout>
      </SignedOut>
    </>
  );
};
