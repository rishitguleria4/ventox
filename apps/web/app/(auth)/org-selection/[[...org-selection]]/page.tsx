import { OrgSelectionView } from "@/modules/auth/ui/views/org-select-view";

const page = async ({
    searchParams,
}: {
    searchParams: Promise<{ redirectUrl?: string }>
}) => 
{
    const { redirectUrl } = await searchParams;

    return <OrgSelectionView redirectUrl={redirectUrl}/>;
}

export default page;
