"use client"
import { useOrganization } from "@clerk/nextjs";
import { usePathname, useSearchParams } from "next/navigation";
import { AuthLayout } from "../layouts/auth-layout";
import { OrgSelectionView } from "../views/org-select-view";
export const OrganizationGuard = ({ children }: { children: React.ReactNode }) => {
    const { isLoaded, organization } = useOrganization();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const search = searchParams.toString();
    const redirectUrl = search ? `${pathname}?${search}` : pathname;

    if (!isLoaded) {
        return (
            <AuthLayout>
                <p>Loading...</p>
            </AuthLayout>
        );
    }

    if (!organization)
    {
        return (
            <AuthLayout>
                <OrgSelectionView redirectUrl={redirectUrl}/>
            </AuthLayout>
        );
    }

    return <>{children}</>;
};
