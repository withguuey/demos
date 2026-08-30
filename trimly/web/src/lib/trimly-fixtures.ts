/**
 * Trimly fixture data — the fictional salon behind the demo. Every value
 * here is mock data (the pages say so on screen, not just in comments):
 * one studio, three chairs, one believable week.
 *
 * Shared by the Calendar page (week grid + stats) and the Services page
 * (catalog + staff), so the two never disagree about who does what.
 */

export const WEEK_LABEL = "Week of Mar 9–13";
export const STUDIO_NAME = "Lock & Lune studio";

export const DAYS = [
  { label: "Mon", date: "9" },
  { label: "Tue", date: "10" },
  { label: "Wed", date: "11" },
  { label: "Thu", date: "12" },
  { label: "Fri", date: "13" },
] as const;

/** Hour-row labels, 09:00–16:00 — eight one-hour slots. */
export const HOURS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
] as const;

/** First hour on the grid; grid row = start − GRID_START_HOUR + 2. */
export const GRID_START_HOUR = 9;

export const STATS = [
  { label: "Bookings this week", value: "38" },
  { label: "Chair utilization", value: "82%" },
  { label: "No-shows", value: "1" },
  { label: "Week revenue", value: "$6,180" },
] as const;

export type AppointmentTone = "accent" | "muted";

export interface Appointment {
  /** 1 = Mon … 5 = Fri. */
  day: 1 | 2 | 3 | 4 | 5;
  /** Start hour, 24h — between 9 and 16. */
  start: number;
  /** Duration in hours (grid rows spanned). */
  span: number;
  service: string;
  who: string;
  tone: AppointmentTone;
  /** Marks a booking the embedded agent made — the demo's punchline. */
  byAgent?: boolean;
}

export const APPOINTMENTS: readonly Appointment[] = [
  { day: 1, start: 9, span: 1, service: "Cut & finish", who: "Maya · L. Chen", tone: "accent" },
  { day: 1, start: 13, span: 1, service: "Beard trim", who: "Sam · walk-in", tone: "accent" },
  { day: 2, start: 10, span: 2, service: "Full color", who: "Dana · J. Ortiz", tone: "accent" },
  { day: 3, start: 11, span: 1, service: "Cut & finish", who: "Maya · P. Singh", tone: "accent" },
  { day: 3, start: 15, span: 1, service: "Team standup", who: "All staff", tone: "muted" },
  { day: 4, start: 10, span: 2, service: "Balayage", who: "Dana · R. Fontaine", tone: "accent", byAgent: true },
  { day: 5, start: 9, span: 1, service: "Color consult", who: "Dana · new client", tone: "accent" },
  { day: 5, start: 14, span: 1, service: "Cut & finish", who: "Sam · T. Okafor", tone: "accent", byAgent: true },
];

export interface Service {
  name: string;
  duration: string;
  price: string;
  staff: string;
}

export const SERVICES: readonly Service[] = [
  { name: "Cut & finish", duration: "45 min", price: "$65", staff: "Maya, Sam" },
  { name: "Beard trim", duration: "20 min", price: "$25", staff: "Sam" },
  { name: "Full color", duration: "2 hr", price: "$160", staff: "Dana" },
  { name: "Balayage", duration: "2 hr", price: "$210", staff: "Dana" },
  { name: "Color consult", duration: "30 min", price: "Free", staff: "Dana" },
];

export interface StaffMember {
  initials: string;
  name: string;
  role: string;
  thisWeek: string;
}

export const STAFF: readonly StaffMember[] = [
  { initials: "MK", name: "Maya Kwon", role: "Stylist", thisWeek: "14 bookings" },
  { initials: "SR", name: "Sam Reyes", role: "Barber", thisWeek: "12 bookings" },
  { initials: "DK", name: "Dana Kovač", role: "Colorist", thisWeek: "12 bookings" },
];
