/**
 * Reports — Dealio's numbers page: the quarter's headline figures, stage
 * totals, the stale picture, and the closing-this-month list, from the
 * same fixture data the Pipeline draws its board from
 * (`../lib/dealio-fixtures`), so the two pages never disagree.
 */
import {  CLOSING_THIS_MONTH,
  CLOSING_THIS_MONTH_TOTAL,
  LOUDEST_STALLS,
  SCOPE_LABEL,
  STAGE_BAR_MAX_K,
  STAGE_TOTALS_K,
  STAGES,
  TEAM_LABEL,
  STATS,
} from "../lib/dealio-fixtures";

export function Reports() {
  return (
    <div className="page">
      <header className="board-header">
        <div>
          <h1>Reports</h1>
          <p className="calm">
            {SCOPE_LABEL} · {TEAM_LABEL} — the numbers behind the board.
          </p>
        </div>
        <span className="tag-mock">mock data</span>
      </header>

      <div className="report-pair">
        <section className="card report-hero">
          <p className="micro">Open pipeline</p>
          <p className="report-figure">{STATS[0].value}</p>
          <p className="report-note">across four stages, {TEAM_LABEL.toLowerCase()}</p>
        </section>
        <section className="card report-hero">
          <p className="micro">Win rate</p>
          <p className="report-figure">{STATS[3].value}</p>
          <p className="report-note">{SCOPE_LABEL}, {TEAM_LABEL.toLowerCase()}</p>
        </section>
      </div>

      <section className="card">
        <h2>By stage</h2>
        <div className="stage-rows">
          {STAGES.map((stage, i) => (
            <div key={stage.name} className="stage-row">
              <span className="stage-row-name">{stage.name}</span>
              <span className="stage-row-count">
                {stage.deals.length} {stage.deals.length === 1 ? "deal" : "deals"}
              </span>
              <span className="stage-row-bar-track">
                <span
                  className="stage-row-bar"
                  style={{ width: `${((STAGE_TOTALS_K[i] ?? 0) / STAGE_BAR_MAX_K) * 100}%` }}
                />
              </span>
              <span className="stage-row-total">{stage.total}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card report-stale">
        <p className="micro">Stale</p>
        <p className="report-figure">{STATS[2].value}</p>
        <p className="report-note">
          {STATS[2].value} stale across the pipeline — loudest: {LOUDEST_STALLS}
        </p>
      </section>

      <section className="card">
        <h2>Closing this month</h2>
        <p className="calm">{STATS[1].value} deals, by expected close.</p>
        <div className="table-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th scope="col">Company</th>
                <th scope="col">Stage</th>
                <th scope="col">Value</th>
                <th scope="col">Expected close</th>
              </tr>
            </thead>
            <tbody>
              {CLOSING_THIS_MONTH.map((deal) => (
                <tr key={deal.company}>
                  <td>{deal.company}</td>
                  <td>{deal.stage}</td>
                  <td className="report-table-value">{deal.value}</td>
                  <td>{deal.expectedClose}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="hint">Combined value {CLOSING_THIS_MONTH_TOTAL}.</p>
      </section>
    </div>
  );
}
