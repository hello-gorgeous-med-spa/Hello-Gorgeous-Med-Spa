export type PersonalizationContext = {
  visitorId: string;
  returningVisitor: boolean;
  recentTopics: string[];
  preferredContact?: "sms" | "email" | "call";
  lastFunnelSlug?: string;
};

// Future-ready hook: can be swapped for edge/session store later.
export function emptyPersonalizationContext(): PersonalizationContext {
  return {
    visitorId: "anonymous",
    returningVisitor: false,
    recentTopics: [],
  };
}

export function deriveRecommendationSeeds(context: PersonalizationContext): string[] {
  return context.recentTopics.slice(0, 3);
}
