/**
 * Landing — a REAL product site whose hero has one job: getting the
 * visitor INTO the demo (spec §2.3). The widget launcher mounts in the
 * corner on a linked app; before linking, an honest placeholder explains
 * what will appear here.
 *
 * Look: Velvet Ledger (drawn new for Dealio) — Space Grotesk display over
 * a deal-room stat board; the board is drawn straight from the same
 * fixtures the agent talks about.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appConfig, isLinked } from "../config";
import { CHAT_PATH, HOME_PATH } from "../routes";
import { mountWidget, type WidgetOutcome } from "../lib/widget";
import { QrLink } from "../components/QrLink";
import { SCOPE_LABEL, STATS, TEAM_LABEL } from "../lib/dealio-fixtures";

export function Landing() {
  const [widget, setWidget] = useState<WidgetOutcome | "unlinked" | "loading">(
    isLinked ? "loading" : "unlinked",
  );

  useEffect(() => {
    if (!isLinked) return;
    mountWidget((outcome) => setWidget(outcome));
  }, []);

  const portalTarget =
    appConfig.link !== null
      ? `${appConfig.link.portalUrl}/agent/${appConfig.link.slug ?? appConfig.link.appId}`
      : null;

  return (
    <main className="page landing">
      <section className="hero" data-tour="hero">
        <div className="hero-copy">
          <p className="micro">{TEAM_LABEL} · pipeline, by conversation</p>
          <h1 className="display">{appConfig.copy.landing.headline}</h1>
          <p className="hero-sub">{appConfig.copy.landing.sub}</p>
          <div className="hero-asks" aria-label="Example things to ask">
            <span className="ask-chip">&ldquo;Which deals need attention this week?&rdquo;</span>
            <span className="ask-chip">&ldquo;Draft a follow-up for Fernwood Clinics&rdquo;</span>
            <span className="ask-chip">&ldquo;What&rsquo;s stalling in Proposal?&rdquo;</span>
          </div>
          <div className="hero-actions">
            <Link to={CHAT_PATH} className="btn btn-primary">
              {appConfig.demoMode ? "Enter the demo" : "Open the chat"}
            </Link>
            <a href="#board" className="btn">
              The board
            </a>
            <Link to={HOME_PATH} className="btn btn-quiet">
              How this app is wired
            </Link>
          </div>
          {appConfig.demoMode && portalTarget !== null ? (
            <div className="hero-qr">
              <p className="hint">Or continue on your phone:</p>
              <QrLink url={portalTarget} size={140} />
            </div>
          ) : null}
          {widget === "unlinked" ? (
            <p className="hint">
              The floating agent launcher appears here once the app is bound to a
              deployed guuey agent — <code>pnpm bootstrap -- --link</code>.
            </p>
          ) : null}
          {widget === "offline" ? (
            <p className="hint">
              Widget script failed to load from this environment — check the app's
              Allowed Domains include this site.
            </p>
          ) : null}
        </div>
        <aside className="hero-board" id="board" aria-label="Pipeline at a glance">
          <p className="micro">{SCOPE_LABEL}, at a glance</p>
          <div className="hero-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="hero-stat">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>
          <p className="board-quote display">&ldquo;walk Prism Media Group to close&rdquo;</p>
        </aside>
      </section>
      {appConfig.demoMode ? (
        <p className="demo-strip">
          Dealio is a fictional product — a live demo of an agentic app built on guuey. Every
          deal, company, and number on this site is mock data.
        </p>
      ) : null}
    </main>
  );
}
