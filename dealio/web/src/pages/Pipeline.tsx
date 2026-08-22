/**
 * Pipeline — Dealio's product canvas: the quarter's deal board for the
 * west-coast team (stats row + four stage columns). Everything is fixture
 * data (`../lib/dealio-fixtures`); the "mock data" tag keeps that honest
 * on screen, not just in comments.
 *
 * Responsive contract: the board needs ~880px to breathe, so it scrolls
 * horizontally inside its own `.board-scroll` container — the page itself
 * never overflows on a phone.
 *
 * The agent rail lives beside this canvas; the lilac "follow-up drafted
 * by agent" chip is the demo's punchline — work the agent did lands on
 * this very board.
 */
import { SCOPE_LABEL, STAGES, STATS, TEAM_LABEL } from "../lib/dealio-fixtures";

export function Pipeline() {
  return (
    <div className="page">
      <header className="board-header">
        <div>
          <h1>Pipeline</h1>
          <p className="calm">
            {SCOPE_LABEL} · {TEAM_LABEL}
          </p>
        </div>
        <div className="board-header-actions">
          <span className="tag-mock">mock data</span>
          {/* Decorative, like the rest of the mock chrome — not a live form. */}
          <span aria-hidden className="btn btn-accent">
            + New deal
          </span>
        </div>
      </header>

      <section className="board-card">
        {/* Stats row */}
        <div className="board-stats">
          {STATS.map((stat) => (
            <div key={stat.label} className="board-stat">
              <p className="stat-label">{stat.label}</p>
              <p className="stat-value">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Stage columns — scroll inside their own container below ~880px */}
        <div className="board-scroll">
          <div className="board">
            {STAGES.map((stage) => (
              <section key={stage.name} className="stage-col" aria-label={`${stage.name} stage`}>
                <header className="stage-head">
                  <span className="stage-name">{stage.name}</span>
                  <span className="stage-meta">
                    {stage.deals.length} {stage.deals.length === 1 ? "deal" : "deals"} ·{" "}
                    {stage.total}
                  </span>
                </header>
                {stage.deals.map((deal) => (
                  <article key={deal.company} className="deal-card">
                    <p className="deal-company">{deal.company}</p>
                    <p className="deal-value">{deal.value}</p>
                    <div className="deal-chips">
                      <span className="chip chip-days">{deal.daysInStage}d in stage</span>
                      {deal.quiet !== undefined ? (
                        <span className="chip chip-quiet">{deal.quiet}</span>
                      ) : null}
                      {deal.agentChip !== undefined ? (
                        <span className="chip chip-agent">{deal.agentChip}</span>
                      ) : null}
                    </div>
                  </article>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>

      <p className="hint">
        The lilac chip on Atlas Rowing Club is work the agent in the rail already did — ask it to
        chase a stalled deal, draft the next follow-up, or walk Prism Media Group to close.
      </p>
    </div>
  );
}
