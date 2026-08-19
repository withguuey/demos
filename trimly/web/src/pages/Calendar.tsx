/**
 * Calendar — Trimly's product canvas: the week's bookings for the studio,
 * ported from the Trimly product mock (stats row + week grid). Everything
 * is fixture data (`../lib/trimly-fixtures`); the "mock data" tag keeps
 * that honest on screen, not just in comments.
 *
 * Responsive contract: the grid needs ~640px to breathe, so it scrolls
 * horizontally inside its own `.cal-scroll` container — the page itself
 * never overflows on a phone.
 *
 * The agent dock swaps this whole canvas for the fullscreen agent; the
 * "booked by agent" badges are the demo's punchline — bookings the agent
 * made land on this very grid.
 */
import { Fragment } from "react";
import {
  APPOINTMENTS,
  DAYS,
  GRID_START_HOUR,
  HOURS,
  STATS,
  STUDIO_NAME,
  WEEK_LABEL,
} from "../lib/trimly-fixtures";

export function Calendar() {
  return (
    <div className="page">
      <header className="cal-header">
        <div>
          <h1>Calendar</h1>
          <p className="calm">
            {WEEK_LABEL} · {STUDIO_NAME}
          </p>
        </div>
        <div className="cal-header-actions">
          <span className="tag-mock">mock data</span>
          {/* Decorative, like the rest of the mock chrome — not a live form. */}
          <span aria-hidden className="btn btn-accent">
            + New booking
          </span>
        </div>
      </header>

      <section className="cal-card">
        {/* Stats row */}
        <div className="cal-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="cal-stat">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Week grid — scrolls inside its own container below ~640px */}
        <div className="cal-scroll">
          <div className="cal-grid">
            {/* Header row */}
            <div className="cal-corner" />
            {DAYS.map((day) => (
              <div key={day.label} className="cal-head">
                <span>{day.label}</span>
                <span className="cal-date">{day.date}</span>
              </div>
            ))}

            {/* Body cells */}
            {HOURS.map((hour) => (
              <Fragment key={hour}>
                <div className="cal-hour">{hour}</div>
                {DAYS.map((day) => (
                  <div key={day.label} className="cal-cell" />
                ))}
              </Fragment>
            ))}

            {/* Appointment blocks — placed on the same grid, over the
                cells. Placement is data-driven, so it rides inline styles. */}
            {APPOINTMENTS.map((appt) => (
              <div
                key={`${appt.day}-${appt.start}`}
                style={{
                  gridColumnStart: appt.day + 1,
                  gridRow: `${appt.start - GRID_START_HOUR + 2} / span ${appt.span}`,
                }}
                className={`appt appt-${appt.tone}`}
              >
                <p className="appt-service">{appt.service}</p>
                <p className="appt-who">{appt.who}</p>
                {appt.byAgent === true ? <span className="appt-badge">booked by agent</span> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <p className="hint">
        Bookings tagged &ldquo;booked by agent&rdquo; came in through the agent in the dock — ask it
        to find a slot, move a booking, or fill this afternoon&rsquo;s cancellation.
      </p>
    </div>
  );
}
