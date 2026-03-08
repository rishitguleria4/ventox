import { OrganizationList } from "@clerk/nextjs"

export const OrgSelectionView = () => {
  return (
    <div className="glass-panel mx-auto flex w-full max-w-2xl flex-col gap-4 p-6 md:p-10">
      <p className="page-eyebrow">Workspace</p>
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Select your organization</h1>
      <p className="text-sm text-muted-foreground">Choose the team you want to manage right now.</p>
      <OrganizationList
        afterCreateOrganizationUrl="/"
        afterSelectOrganizationUrl="/"
        hidePersonal
        skipInvitationScreen
      />
    </div>
  )
}
