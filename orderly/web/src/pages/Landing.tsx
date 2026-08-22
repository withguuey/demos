/**
 * Landing — a REAL product site whose hero has one job: getting the
 * visitor INTO the demo (spec §2.3). The widget launcher mounts in the
 * corner on a linked app; before linking, an honest placeholder explains
 * what will appear here.
 *
 * Look: Fresh Air (founder-mapped to Orderly) — light, calm, airy; the
 * hero board is the day's four stat cards, drawn straight from the same
 * fixtures the agent talks about.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appConfig, isLinked } from "../config";
import { CHAT_PATH, HOME_PATH } from "../routes";
import { mountWidget, type WidgetOutcome } from "../lib/widget";
import { QrLink } from "../components/QrLink";
import { STATS, STOREFRONT_NAME } from "../lib/orderly-fixtures";

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
          <p className="micro">{STOREFRONT_NAME} · operations, by conversation</p>
          <h1 className="display">{appConfig.copy.landing.headline}</h1>
          <p className="hero-sub">{appConfig.copy.landing.sub}</p>
          <div className="hero-asks" aria-label="Example things to ask">
            <span className="ask-chip">&ldquo;Which refunds are waiting for review?&rdquo;</span>
            <span className="ask-chip">&ldquo;Chase the late shipment&rdquo;</span>
            <span className="ask-chip">&ldquo;What&rsquo;s driving today&rsquo;s revenue?&rdquo;</span>
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
        <aside className="hero-board" id="board" aria-label="Today at the storefront">
          <p className="micro">Today at {STOREFRONT_NAME}</p>
          <div className="board-stats">
            {STATS.map((stat) => (
              <div key={stat.label} className="board-stat">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
              </div>
            ))}
          </div>
          <p className="board-quote">&ldquo;chase the late shipment on #1043&rdquo;</p>
        </aside>
      </section>
      {appConfig.demoMode ? (
        <p className="demo-strip">
          Orderly is a fictional product — a live demo of an agentic app built on guuey. Every
          order, name, and number on this site is mock data.
        </p>
      ) : null}
    </main>
  );
}
