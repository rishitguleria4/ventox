"use client";

import { WidgetView } from "@/modules/widget/ui/views/widget-view";
import { use } from "react";

interface SearchParams {
  organizationId?: string | string[];
  orgId?: string | string[];
  orgID?: string | string[];
  organization_id?: string | string[];
  org_id?: string | string[];
  org?: string | string[];
}

interface Props {
  searchParams: Promise<SearchParams>;
}

const firstParam = (value?: string | string[]): string | null => {
  if (Array.isArray(value)) {
    return value[0]?.trim() || null;
  }
  return value?.trim() || null;
};

const Page = ({ searchParams }: Props) => {
  const params = use(searchParams);

  const organizationId =
    firstParam(params.organizationId) ??
    firstParam(params.orgId) ??
    firstParam(params.orgID) ??
    firstParam(params.organization_id) ??
    firstParam(params.org_id) ??
    firstParam(params.org) ??
    process.env.NEXT_PUBLIC_DEFAULT_ORGANIZATION_ID?.trim() ??
    null;

  return <WidgetView organizationId={organizationId} />;
};

export default Page;
