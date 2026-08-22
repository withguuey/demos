/**
 * Dealio fixture data — the fictional sales pipeline behind the demo.
 * Every value here is mock data (the pages say so on screen, not just in
 * comments): one quarter, one west-coast team, one believable board.
 *
 * Shared by the Pipeline page (stage columns + stats) and the Reports page
 * (totals + stale + closing list), so the two never disagree about which
 * deal sits where. The same cast is written into `prompts/system.md` —
 * keep all three in step.
 */

export const SCOPE_LABEL = "Q1 pipeline";
export const TEAM_LABEL = "West-coast team";

export const STATS = [
  { label: "Open pipeline", value: "$412K" },
  { label: "Closing this month", value: "7" },
  { label: "Stale deals", value: "5" },
  { label: "Win rate", value: "31%" },
] as const;

/**
 * The two loudest stalls — named on the Reports page's stale panel.
 * "Stale deals 5" counts the WHOLE pipeline; only these two carry a
 * visible "gone quiet" chip on the board.
 */
/* NOTE: Fernwood Clinics reads "gone quiet 12d" at 8d in Proposal — the
   quiet clock deliberately spans stage transitions (it went quiet in Demo
   and was moved anyway). Canon from the landing mock; not a typo. */
export const LOUDEST_STALLS = "Marigold Farms Co-op, Fernwood Clinics";

export interface Deal {
  company: string;
  /** Deal value, set in the display face on cards. */
  value: string;
  /** Whole days the deal has sat in its current stage. */
  daysInStage: number;
  /** Amber stall chip ("gone quiet 12d") — only the two loudest carry it. */
  quiet?: string;
  /** Lilac chip — the demo's punchline: the agent already drafted the follow-up. */
  agentChip?: string;
}

export interface Stage {
  name: string;
  /** Sum of the stage's deal values, precomputed so headers never drift. */
  total: string;
  deals: readonly Deal[];
}

export const STAGES: readonly Stage[] = [
  {
    name: "Qualified",
    total: "$118K",
    deals: [
      { company: "Northwind Dental", value: "$24K", daysInStage: 4 },
      { company: "Harbor & Vine Logistics", value: "$58K", daysInStage: 9 },
      { company: "Marigold Farms Co-op", value: "$36K", daysInStage: 16, quiet: "gone quiet 12d" },
    ],
  },
  {
    name: "Demo",
    total: "$97K",
    deals: [
      { company: "Bluepeak Labs", value: "$45K", daysInStage: 6 },
      { company: "Kettle & Crane Coffee", value: "$18K", daysInStage: 3 },
      { company: "Stonebridge Legal", value: "$34K", daysInStage: 11 },
    ],
  },
  {
    name: "Proposal",
    total: "$121K",
    deals: [
      { company: "Fernwood Clinics", value: "$72K", daysInStage: 8, quiet: "gone quiet 12d" },
      {
        company: "Atlas Rowing Club",
        value: "$49K",
        daysInStage: 5,
        agentChip: "follow-up drafted by the agent",
      },
    ],
  },
  {
    name: "Closing",
    total: "$76K",
    deals: [
      { company: "Prism Media Group", value: "$52K", daysInStage: 2 },
      { company: "Cobble Lane Bakeries", value: "$24K", daysInStage: 7 },
    ],
  },
];

export interface ClosingDeal {
  company: string;
  stage: string;
  value: string;
  /** Expected close, inside the demo month (March 2026). */
  expectedClose: string;
}

/**
 * The seven deals expected to close this month — the "Closing this month"
 * stat, itemized. Drawn from the board cast only (no invented companies),
 * kept in ascending expected-close order: the Reports list claims that
 * ordering on screen.
 */
export const CLOSING_THIS_MONTH: readonly ClosingDeal[] = [
  { company: "Prism Media Group", stage: "Closing", value: "$52K", expectedClose: "Mar 4" },
  { company: "Cobble Lane Bakeries", stage: "Closing", value: "$24K", expectedClose: "Mar 9" },
  { company: "Fernwood Clinics", stage: "Proposal", value: "$72K", expectedClose: "Mar 13" },
  { company: "Atlas Rowing Club", stage: "Proposal", value: "$49K", expectedClose: "Mar 17" },
  { company: "Bluepeak Labs", stage: "Demo", value: "$45K", expectedClose: "Mar 20" },
  { company: "Stonebridge Legal", stage: "Demo", value: "$34K", expectedClose: "Mar 25" },
  { company: "Harbor & Vine Logistics", stage: "Qualified", value: "$58K", expectedClose: "Mar 30" },
];

/** Sum of CLOSING_THIS_MONTH values — precomputed so the footer never drifts. */
export const CLOSING_THIS_MONTH_TOTAL = "$334K";

/**
 * Per-stage bar widths for the Reports page, relative to the largest
 * stage (Proposal, $121K = 100%). Purely visual — the rows print the
 * real totals beside the bars.
 */
export const STAGE_BAR_MAX_K = 121;

/** Numeric stage totals (in $K) for the bar widths above. */
export const STAGE_TOTALS_K: readonly number[] = [118, 97, 121, 76];
