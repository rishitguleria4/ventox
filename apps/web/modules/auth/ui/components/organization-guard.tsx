"use client"
import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelecionView } from "../views/org-select-view";
export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { organization } = useOrganization();
    if (!organization)
    {
        return (
            <AuthLayout>
                <p className="forced-color-adjust-auto"> CREATE AN  ORGANIZATION TO START THE VENTOX!!</p>
                <OrgSelecionView/>
            </AuthLayout>
        );
    }
    return (
        <>
            {children}
        </>
    );
};