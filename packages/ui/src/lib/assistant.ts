export const AI_SUPPORT_AGENT_NAME = "AI Support";
export const SUPPORT_UPDATES_AGENT_NAME = "Support Updates";

export const getAssistantDisplayName = (agentName?: string | null) => {
  const normalized = agentName?.trim();

  if (!normalized) {
    return AI_SUPPORT_AGENT_NAME;
  }

  if (normalized === "supportAgent" || normalized === AI_SUPPORT_AGENT_NAME) {
    return AI_SUPPORT_AGENT_NAME;
  }

  return normalized;
};

export const getAssistantDisplayTone = (agentName?: string | null) => {
  const label = getAssistantDisplayName(agentName);

  if (label === SUPPORT_UPDATES_AGENT_NAME) {
    return "update" as const;
  }

  if (label === AI_SUPPORT_AGENT_NAME) {
    return "ai" as const;
  }

  return "human" as const;
};
