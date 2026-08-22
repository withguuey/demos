/**
 * Orders — Orderly's product canvas: today's queue at the storefront,
 * stats row over the live order table. Everything is fixture data
 * (`../lib/orderly-fixtures`); the "mock data" tag keeps that honest on
 * screen, not just in comments.
 *
 * Responsive contract: the table scrolls horizontally inside its own
 * `.table-scroll` container — the page itself never overflows on a phone.
 *
 * The agent rail swaps this whole canvas for the generated UI; the
 * "refunded by agent" chip on #1039 is the demo's punchline — a refund the
 * agent walked lands back in this very queue. The "Review refund"
 * affordance is deliberately a SPAN, not a button: in this demo, decisions
 * that move money only happen on explicit agent-rendered review surfaces
 * (a hallucinated button is how a card gets charged).
 */
import { ORDERS, STATS, STATUS_LABELS, STOREFRONT_NAME } from "../lib/orderly-fixtures";

export function Orders() {
  return (
    <div className="page">
      <header className="ord-header">
        <div>
          <h1>Orders</h1>
          <p className="calm">Today · {STOREFRONT_NAME}</p>
        </div>
        <div className="ord-header-actions">
          <span className="tag-mock">mock data</span>
          {/* Decorative, like the rest of the mock chrome — not a live form. */}
          <span aria-hidden className="btn btn-accent">
            + New order
          </span>
        </div>
      </header>

      <section className="ord-card">
        {/* Stats row */}
        <div className="ord-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="ord-stat">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* The live queue — newest first; scrolls inside its own container
            on a phone. */}
        <div className="ord-queue-bar">
          <p className="micro">Live queue · newest first</p>
        </div>
        <div className="table-scroll">
          <table className="orders-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Customer</th>
                <th scope="col">Items</th>
                <th scope="col">Total</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.items}</td>
                  <td className="num">{order.total}</td>
                  <td>
                    <span className={`chip chip-${order.status}`}>{STATUS_LABELS[order.status]}</span>
                    {order.byAgent === true ? <span className="agent-chip">refunded by agent</span> : null}
                    {order.status === "refund-requested" ? (
                      /* An affordance, not a control — the decision itself
                         only renders as the agent's explicit review surface. */
                      <span className="review-link">Review refund</span>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="hint">
        The order tagged &ldquo;refunded by agent&rdquo; was settled through the agent in the rail —
        ask it to review a refund, chase the late shipment, or walk today&rsquo;s revenue.
      </p>
    </div>
  );
}
