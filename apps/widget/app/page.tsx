"use client";
import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface Props {
  searchParams : Promise<{
    organizationId?: string | string[],
  }>
};

const Page = ({ searchParams } : Props) =>
{
  const { organizationId: rawOrganizationId } = use(searchParams);
  const organizationId = Array.isArray(rawOrganizationId)
    ? rawOrganizationId[0] ?? null
    : rawOrganizationId ?? null;

  return (
    <WidgetView organizationId={organizationId}/>
  );
};

export default Page;
