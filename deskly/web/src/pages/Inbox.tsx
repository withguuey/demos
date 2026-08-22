/**
 * Inbox — Deskly's product canvas: the open ticket queue, breach-ordered,
 * ported from the Deskly product mock (stats row + queue table). Everything
 * is fixture data (`../lib/deskly-fixtures`); the "mock data" tag keeps
 * that honest on screen, not just in comments.
 *
 * Responsive contract: the queue table needs ~720px to breathe, so it
 * scrolls horizontally inside its own `.queue-scroll` container — the page
 * itself never overflows on a phone.
 *
 * The agent rail swaps this whole canvas for the generated UI; the
 * "triaged by agent" chips are the demo's punchline — tickets the agent
 * worked land in this very queue.
 */
import { QUEUE_SCOPE, QUEUE_SORT, STATS, TICKETS } from "../lib/deskly-fixtures";

export function Inbox() {
  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Inbox</h1>
          <p className="calm">
            {QUEUE_SCOPE} · <span className="mono-soft">{QUEUE_SORT}</span>
          </p>
        </div>
        <div className="page-header-actions">
          <span className="tag-mock">mock data</span>
          {/* Decorative, like the rest of the mock chrome — not a live form. */}
          <span aria-hidden className="btn btn-accent">
            + New ticket
          </span>
        </div>
      </header>

      <section className="queue-card">
        {/* Stats row — the instrument panel. */}
        <div className="queue-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="queue-stat">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* The queue — scrolls inside its own container below ~720px. */}
        <div className="queue-scroll">
          <table className="queue-table">
            <thead>
              <tr>
                <th scope="col">Ticket</th>
                <th scope="col">Requester</th>
                <th scope="col">Priority</th>
                <th scope="col">SLA</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => (
                <tr key={t.id}>
                  <td>
                    <p className="t-subject">
                      {t.subject}
                      {t.byAgent === true ? <span className="agent-chip">triaged by agent</span> : null}
                    </p>
                    <p className="t-id">{t.id}</p>
                  </td>
                  <td>
                    <p className="t-requester">{t.requester}</p>
                    <p className="t-org">{t.org}</p>
                  </td>
                  <td>
                    <span className={`prio prio-${t.priority}`}>{t.priority}</span>
                  </td>
                  <td>
                    {t.sla !== null ? (
                      <span className={t.atRisk === true ? "sla-chip sla-risk" : "sla-chip"}>
                        {t.sla}
                        {t.atRisk === true ? <span className="sr-only"> (at risk)</span> : null}
                      </span>
                    ) : (
                      <span className="t-nosla">—</span>
                    )}
                  </td>
                  <td className="t-updated">{t.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="hint">
        Tickets tagged &ldquo;triaged by agent&rdquo; were worked by the agent in the rail — ask it
        what&rsquo;s about to breach, to draft a reply to #4228, or to hand the SSO loop to Ava.
      </p>
    </div>
  );
}
