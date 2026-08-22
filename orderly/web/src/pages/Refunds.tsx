/**
 * Refunds — Orderly's review desk: the refund requests waiting for a
 * decision, the refunds already settled, and the rate panel — all from the
 * same fixture data the Orders queue draws (`../lib/orderly-fixtures`), so
 * the two pages never disagree.
 *
 * Nothing on this page approves anything. Money moves through explicit
 * agent-rendered review surfaces (Approve / Deny / Partial as controls ON
 * the surface) — that is the demo's whole point, and the copy on each card
 * says so out loud.
 */
import { RECENT_REFUNDS, REFUND_RATE, REFUND_REQUESTS, STOREFRONT_NAME } from "../lib/orderly-fixtures";

export function Refunds() {
  return (
    <div className="page">
      <header className="ord-header">
        <div>
          <h1>Refunds</h1>
          <p className="calm">The review desk · {STOREFRONT_NAME}</p>
        </div>
        <span className="tag-mock">mock data</span>
      </header>

      <section className="card">
        <h2>Waiting for review</h2>
        <div className="refund-grid">
          {REFUND_REQUESTS.map(({ order, reason }) => (
            <article key={order.id} className="refund-card">
              <header className="refund-card-top">
                <p className="refund-order">
                  {order.id} · {order.customer}
                </p>
                <p className="refund-amount">{order.total}</p>
              </header>
              <p className="refund-meta">
                {order.items} · <span className="chip chip-refund-requested">Refund requested</span>
              </p>
              <p className="refund-reason">{reason}</p>
              <p className="refund-note">
                Decisions happen as explicit review surfaces the agent renders — Approve, Deny, or
                Partial as controls on the surface. Ask the agent to walk this refund.
              </p>
            </article>
          ))}
        </div>
      </section>

      <div className="refund-row">
        <section className="card">
          <h2>Recently refunded</h2>
          <ul className="recent-list">
            {RECENT_REFUNDS.map((order) => (
              <li key={order.id}>
                <span className="recent-order">
                  {order.id} · {order.customer}
                </span>
                <span className="recent-meta">
                  {order.items} · {order.total}
                </span>
                {order.byAgent === true ? <span className="agent-chip">refunded by agent</span> : null}
              </li>
            ))}
          </ul>
          <p className="hint">
            Settled through the agent&rsquo;s review surface — the confirmation screen, not a claim
            in prose, is what closed it.
          </p>
        </section>

        <section className="card rate-panel">
          <h2>Refund rate</h2>
          <p className="rate-value">{REFUND_RATE.current}</p>
          <p className="rate-compare">
            vs {REFUND_RATE.lastWeek} last week · {REFUND_RATE.delta}
          </p>
        </section>
      </div>
    </div>
  );
}
