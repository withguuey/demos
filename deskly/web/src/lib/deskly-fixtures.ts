/**
 * Deskly fixture data — the fictional helpdesk behind the demo. Every value
 * here is mock data (the pages say so on screen, not just in comments):
 * one support desk, three reps, one believable open queue.
 *
 * Shared by the Inbox page (stats + ticket queue) and the Reports page
 * (SLA attainment + roster), so the two never disagree about who owns
 * what — and by the landing's board panel, so the site never contradicts
 * the agent's own numbers (prompts/system.md carries the same cast).
 */

export const QUEUE_SCOPE = "All open";
export const QUEUE_SORT = "Sorted by SLA — closest breach first";

export const STATS = [
  { label: "Open tickets", value: "47" },
  { label: "Median first response", value: "26m" },
  { label: "CSAT", value: "94%" },
  { label: "About to breach", value: "2" },
] as const;

export type TicketPriority = "urgent" | "high" | "normal";

export interface Ticket {
  /** Public ticket id, printed in mono — "#4231". */
  id: string;
  subject: string;
  /** Requester + their company, as the queue prints them. */
  requester: string;
  org: string;
  priority: TicketPriority;
  /** The SLA clock as shown; null = no clock (feature requests). */
  sla: string | null;
  /** Inside the final hour — the amber-bordered rows. */
  atRisk?: boolean;
  /** Marks a ticket the embedded agent triaged — the demo's punchline. */
  byAgent?: boolean;
  /** Last activity, relative — "8m ago". */
  updated: string;
}

/** The open queue, in SLA order — closest breach first, no clock last. */
export const TICKETS: readonly Ticket[] = [
  {
    id: "#4231",
    subject: "Export to CSV times out on large workspaces",
    requester: "P. Singh",
    org: "Fernwood Labs",
    priority: "urgent",
    sla: "breaches in 42m",
    atRisk: true,
    updated: "8m ago",
  },
  {
    id: "#4228",
    subject: "SSO login loops back to the sign-in page",
    requester: "L. Chen",
    org: "Bramblewick",
    priority: "urgent",
    sla: "breaches in 1h 05m",
    atRisk: true,
    byAgent: true,
    updated: "14m ago",
  },
  {
    id: "#4226",
    subject: "Webhook retries firing twice per event",
    requester: "T. Okafor",
    org: "Quillhaven",
    priority: "high",
    sla: "3h 20m left",
    updated: "31m ago",
  },
  {
    id: "#4224",
    subject: "Billing page shows last month's seat count",
    requester: "R. Fontaine",
    org: "Larkspur & Co",
    priority: "high",
    sla: "5h 40m left",
    byAgent: true,
    updated: "52m ago",
  },
  {
    id: "#4219",
    subject: "How do I add a teammate to a shared inbox?",
    requester: "M. Alvarez",
    org: "Toftwood",
    priority: "normal",
    sla: "tomorrow 09:00",
    updated: "1h ago",
  },
  {
    id: "#4212",
    subject: "Attachment previews blank for .heic files",
    requester: "D. Kowalski",
    org: "Mossgate",
    priority: "normal",
    sla: "tomorrow 12:00",
    updated: "3h ago",
  },
  {
    id: "#4217",
    subject: "Feature request: dark mode for the reports view",
    requester: "J. Ortiz",
    org: "Pinebarrow",
    priority: "normal",
    sla: null,
    updated: "2h ago",
  },
];

export interface SlaRow {
  priority: TicketPriority;
  /** The response target — "1 h", "next business day". */
  target: string;
  /** Attainment over the last 30 days. */
  attained: string;
  /** Ticket volume behind the attainment number. */
  volume: string;
}

/** FIRST-RESPONSE SLA targets + last-30-days attainment, by priority.
    (The Inbox queue's countdown chips are RESOLUTION deadlines — urgent
    resolves within 4 h — which is why an urgent row can read "breaches
    in 1h 05m" under a 1 h response target; the prompt states the same
    policy so the agent and the pages tell one story.) */
export const SLA_ROWS: readonly SlaRow[] = [
  { priority: "urgent", target: "1 h", attained: "92%", volume: "118" },
  { priority: "high", target: "4 h", attained: "96%", volume: "203" },
  { priority: "normal", target: "next business day", attained: "99%", volume: "412" },
];

/** Median first response by week — the trend the 26m headline sits on. */
export const RESPONSE_TREND = [
  { week: "W31", median: "34m" },
  { week: "W32", median: "31m" },
  { week: "W33", median: "29m" },
  { week: "W34", median: "26m" },
] as const;

export const CSAT_DETAIL = { value: "94%", meta: "318 ratings · last 30 days" } as const;

export interface TeamMember {
  initials: string;
  name: string;
  role: string;
  /** This week's load — open counts sum to the 47 on the board. */
  thisWeek: string;
}

export const TEAM: readonly TeamMember[] = [
  { initials: "AM", name: "Ava Marsh", role: "Escalations", thisWeek: "15 open · 34 resolved" },
  { initials: "TL", name: "Theo Lindqvist", role: "Integrations", thisWeek: "18 open · 29 resolved" },
  { initials: "NH", name: "Noor Haddad", role: "Billing & accounts", thisWeek: "14 open · 37 resolved" },
];
