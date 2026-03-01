"use client"
import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectionView } from "../views/org-select-view";
export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();
    if (!organization)
    {
        return (
            <AuthLayout>
                <p className="text-center text-lg font-medium">Create an organization to get started with Ventox</p>
                <OrgSelectionView/>
            </AuthLayout>
        );
    }
    return (
        <>
            {children}
        </>
    );
};