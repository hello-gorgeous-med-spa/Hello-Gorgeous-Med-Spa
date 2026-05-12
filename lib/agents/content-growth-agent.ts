import { createAdminSupabaseClient } from "@/lib/hgos/supabase";
import { CONTENT_COLLECTIONS } from "@/lib/content-os";
import { CONCERN_PAGES } from "@/lib/concern-pages";
import { FUNNEL_DEFINITIONS } from "@/lib/funnels";
import { NURTURE_WORKFLOWS } from "@/lib/nurture-workflows";
import { TREATMENT_HUB_SLUGS } from "@/lib/treatment-hubs";
import { VIDEO_LIBRARY } from "@/lib/video-library";

type AgentMode = "plan" | "execute";
type TaskChannel = "content" | "distribution" | "seo" | "conversion";

export type ContentGrowthTask = {
  id: string;
  title: string;
  channel: TaskChannel;
  reason: string;
  route: string;
  owner: "provider" | "marketing" | "seo" | "front-desk";
  dueBy: string;
  checklist: string[];
  priority: 1 | 2 | 3;
};

export type ContentGrowthAgentResult = {
  ok: boolean;
  mode: AgentMode;
  runAt: string;
  tasks: ContentGrowthTask[];
  totals: Record<TaskChannel, number>;
  notes: string[];
  loggedToAutomationTable: boolean;
  errors: string[];
};

function addDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function buildWeeklyQueue(): ContentGrowthTask[] {
  const tasks: ContentGrowthTask[] = [];

  for (const slug of TREATMENT_HUB_SLUGS) {
    tasks.push({
      id: `hub-refresh-${slug}`,
      title: `Refresh ${slug} hub authority block`,
      channel: "content",
      reason: "Hub pages are your strongest AI + SEO authority nodes and need weekly freshness.",
      route: `/${slug}`,
      owner: "provider",
      dueBy: addDays(3),
      checklist: [
        "Add one provider perspective paragraph update",
        "Add one FAQ clarification with buyer-intent wording",
        "Confirm one natural internal link to a concern or comparison page",
      ],
      priority: 1,
    });
  }

  for (const concern of CONCERN_PAGES.slice(0, 4)) {
    tasks.push({
      id: `concern-refresh-${concern.slug}`,
      title: `Expand ${concern.title} concern page`,
      channel: "seo",
      reason: "Concern pages capture problem-intent searches before treatment-intent searches.",
      route: `/concerns/${concern.slug}`,
      owner: "seo",
      dueBy: addDays(4),
      checklist: [
        "Add one local-intent sentence",
        "Add one FAQ entry tied to candidacy, downtime, or timeline",
        "Link to one relevant service and one comparison page",
      ],
      priority: 2,
    });
  }

  for (const funnel of FUNNEL_DEFINITIONS.slice(0, 3)) {
    tasks.push({
      id: `funnel-opt-${funnel.slug}`,
      title: `Optimize funnel: ${funnel.title}`,
      channel: "conversion",
      reason: "Funnels are your conversion engine and should be tuned weekly.",
      route: `/funnels/${funnel.slug}`,
      owner: "marketing",
      dueBy: addDays(5),
      checklist: [
        "Tighten first screen headline for clarity",
        "Reduce one unnecessary friction point",
        "Confirm mapped nurture workflow coverage",
      ],
      priority: 1,
    });
  }

  tasks.push({
    id: "video-transcript-refresh",
    title: "Publish one transcripted educational video",
    channel: "distribution",
    reason: "Videos with transcripts increase indexable educational coverage and social repurposing output.",
    route: "/videos",
    owner: "marketing",
    dueBy: addDays(2),
    checklist: [
      "Add one new clip or transcript expansion",
      "Tag by concern + service",
      "Generate repurpose pack and add one FAQ candidate",
    ],
    priority: 1,
  });

  tasks.push({
    id: "ai-graph-sync",
    title: "Sync AI visibility graph after weekly updates",
    channel: "seo",
    reason: "AI visibility depends on keeping llms files and profile graph aligned with fresh assets.",
    route: "/api/public/ai-profile",
    owner: "seo",
    dueBy: addDays(6),
    checklist: [
      "Confirm new priority routes in ai-profile",
      "Update llms.txt and llms-full.txt if any new major URLs shipped",
      "Validate sitemap includes new production routes",
    ],
    priority: 1,
  });

  const latestContent = CONTENT_COLLECTIONS.slice(0, 2);
  for (const entry of latestContent) {
    tasks.push({
      id: `content-amplify-${entry.id}`,
      title: `Distribute content update: ${entry.title}`,
      channel: "distribution",
      reason: "Each published asset should be distributed into social, nurture, and internal links.",
      route: "/admin/content-os",
      owner: "marketing",
      dueBy: addDays(3),
      checklist: [
        "Create one short-form caption draft",
        "Insert one cross-link from a relevant hub/concern page",
        "Map one nurture message reference",
      ],
      priority: 2,
    });
  }

  return tasks.sort((a, b) => a.priority - b.priority);
}

function channelTotals(tasks: ContentGrowthTask[]): Record<TaskChannel, number> {
  return tasks.reduce<Record<TaskChannel, number>>(
    (acc, task) => {
      acc[task.channel] += 1;
      return acc;
    },
    { content: 0, distribution: 0, seo: 0, conversion: 0 },
  );
}

export async function runContentGrowthAgent(options?: { mode?: AgentMode; maxTasks?: number }): Promise<ContentGrowthAgentResult> {
  const mode = options?.mode ?? "plan";
  const maxTasks = options?.maxTasks ?? 15;
  const runAt = new Date().toISOString();
  const tasks = buildWeeklyQueue().slice(0, maxTasks);
  const totals = channelTotals(tasks);
  const notes: string[] = [
    `${VIDEO_LIBRARY.length} videos available for transcript repurposing.`,
    `${NURTURE_WORKFLOWS.length} nurture workflows currently mapped.`,
    "Use this queue as your weekly operating sprint. Complete priority-1 items first.",
  ];
  const result: ContentGrowthAgentResult = {
    ok: true,
    mode,
    runAt,
    tasks,
    totals,
    notes,
    loggedToAutomationTable: false,
    errors: [],
  };

  if (mode !== "execute") return result;

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    result.errors.push("Supabase admin client unavailable; queue returned without logging.");
    return result;
  }

  const { error } = await supabase.from("automation_logs").insert({
    automation_type: "content_growth_agent",
    step: "weekly_queue",
    channel: "system",
    success: true,
    metadata: {
      runAt,
      totals,
      taskCount: tasks.length,
      taskIds: tasks.map((task) => task.id),
    },
  });

  if (error) {
    result.errors.push(`Unable to log automation run: ${error.message}`);
    return result;
  }

  result.loggedToAutomationTable = true;
  return result;
}
