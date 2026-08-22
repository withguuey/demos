/**
 * Reports — Deskly's numbers page: SLA attainment by priority, CSAT, the
 * first-response trend, and the team roster — from the same fixture data
 * the Inbox draws its queue from (`../lib/deskly-fixtures`), so the two
 * pages never disagree. Static numeric panels, set in mono like an
 * instrument readout — no chart library, on purpose.
 */
import {
  CSAT_DETAIL,
  RESPONSE_TREND,
  SLA_ROWS,
  STATS,
  TEAM,
} from "../lib/deskly-fixtures";

export function Reports() {
  // The trend panel leads with the current median — the same number the
  // Inbox stats row shows, read from the same fixture entry.
  const currentMedian = STATS[1].value;

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Reports</h1>
          <p className="calm">Last 30 days · {STATS[0].value} open right now</p>
        </div>
        <span className="tag-mock">mock data</span>
      </header>

      <section className="card">
        <h2>First-response SLA</h2>
        <div className="report-scroll">
          <table className="report-table">
            <thead>
              <tr>
                <th scope="col">Priority</th>
                <th scope="col">Target</th>
                <th scope="col">Attained</th>
                <th scope="col">Tickets</th>
              </tr>
            </thead>
            <tbody>
              {SLA_ROWS.map((row) => (
                <tr key={row.priority}>
                  <td>
                    <span className={`prio prio-${row.priority}`}>{row.priority}</span>
                  </td>
                  <td className="report-num">{row.target}</td>
                  <td className="report-num report-strong">{row.attained}</td>
                  <td className="report-num">{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="report-grid">
        <section className="card report-panel">
          <p className="stat-label">CSAT</p>
          <p className="panel-value">{CSAT_DETAIL.value}</p>
          <p className="panel-meta">{CSAT_DETAIL.meta}</p>
        </section>

        <section className="card report-panel">
          <p className="stat-label">Median first response</p>
          <p className="panel-value">{currentMedian}</p>
          <div className="trend-rows">
            {RESPONSE_TREND.map((point) => (
              <p key={point.week} className="trend-row">
                <span className="trend-week">{point.week}</span>
                <span className="trend-value">{point.median}</span>
              </p>
            ))}
          </div>
        </section>
      </div>

      <section className="card">
        <h2>Team</h2>
        <div className="team-grid">
          {TEAM.map((member) => (
            <div key={member.name} className="team-card">
              <span aria-hidden className="team-avatar">
                {member.initials}
              </span>
              <div>
                <p className="team-name">{member.name}</p>
                <p className="team-meta">
                  {member.role} · <span className="team-load">{member.thisWeek}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
