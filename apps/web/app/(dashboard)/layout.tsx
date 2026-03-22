import { DashboardLayout } from "@/modules/dashboard/ui/layouts/dashboard-layout";

export const dynamic = "force-dynamic";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardLayout>
            { children }
        </DashboardLayout>
    );
};

export default Layout;
