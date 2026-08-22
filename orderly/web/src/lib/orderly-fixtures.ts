/**
 * Orderly fixture data — the fictional e-commerce operations product behind
 * the demo. Every value here is mock data (the pages say so on screen, not
 * just in comments): one storefront, one believable day on the orders desk.
 *
 * Shared by the Orders page (queue + stats) and the Refunds page (review
 * desk), so the two never disagree about which order carries what. The
 * numbers and the cast match `prompts/system.md` exactly — the agent talks
 * about the same queue these pages draw.
 */

export const STOREFRONT_NAME = "Harbor Lane storefront";

export const STATS = [
  { label: "Orders today", value: "142" },
  { label: "Refund rate", value: "1.8%" },
  { label: "Late shipments", value: "6" },
  { label: "Revenue today", value: "$12,940" },
] as const;

export type OrderStatus = "processing" | "shipped" | "late" | "refund-requested" | "refunded";

/** On-screen chip text per status — one place, so every page prints the
 * same words for the same state. */
export const STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  shipped: "Shipped",
  late: "Late",
  "refund-requested": "Refund requested",
  refunded: "Refunded",
};

export interface Order {
  /** Display id, e.g. "#1045". */
  id: string;
  customer: string;
  /** e.g. "2 items". */
  items: string;
  /** e.g. "$148.00". */
  total: string;
  status: OrderStatus;
  /** Marks an order the embedded agent resolved — the demo's punchline. */
  byAgent?: boolean;
}

/** The two orders waiting at the review desk — named so the Refunds page
 * shows the SAME objects the queue renders, never a diverging copy. */
const ORDER_1042: Order = { id: "#1042", customer: "Elena", items: "1 item", total: "$76.40", status: "refund-requested" };
const ORDER_1040: Order = { id: "#1040", customer: "Amara", items: "3 items", total: "$210.75", status: "refund-requested" };

/** The live queue, newest first (descending id). */
export const ORDERS: readonly Order[] = [
  { id: "#1045", customer: "Priya", items: "2 items", total: "$148.00", status: "processing" },
  { id: "#1044", customer: "Marcus", items: "1 item", total: "$89.50", status: "shipped" },
  { id: "#1043", customer: "Sofia", items: "4 items", total: "$312.20", status: "late" },
  ORDER_1042,
  { id: "#1041", customer: "Tomas", items: "2 items", total: "$54.90", status: "shipped" },
  ORDER_1040,
  { id: "#1039", customer: "Jonas", items: "1 item", total: "$67.10", status: "refunded", byAgent: true },
  { id: "#1038", customer: "Nadia", items: "2 items", total: "$129.90", status: "shipped" },
];

export interface RefundRequest {
  order: Order;
  /** The customer's stated reason — plausible desk color, mock like the rest. */
  reason: string;
}

/** The review desk, in queue order (newest first, same as ORDERS). */
export const REFUND_REQUESTS: readonly RefundRequest[] = [
  {
    order: ORDER_1042,
    reason: "Arrived damaged — the ceramic carafe cracked in transit; photos attached to the ticket.",
  },
  {
    order: ORDER_1040,
    reason: "Wrong size on two of the three items; return label already issued, parcel scanned back in.",
  },
];

/** Refunds already settled from today's queue — currently just the one the
 * agent handled, which is exactly the demo's punchline. */
export const RECENT_REFUNDS: readonly Order[] = ORDERS.filter((o) => o.status === "refunded");

/** The refund-rate panel: today's 1.8% beside last week's mark. */
export const REFUND_RATE = {
  current: "1.8%",
  lastWeek: "2.6%",
  delta: "down 0.8 pts",
} as const;
