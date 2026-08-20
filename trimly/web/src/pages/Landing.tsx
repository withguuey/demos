/**
 * Landing — a REAL product site whose hero has one job: getting the
 * visitor INTO the demo (spec §2.3). The widget launcher mounts in the
 * corner on a linked app; before linking, an honest placeholder explains
 * what will appear here.
 *
 * Look: Salon Editorial (founder-picked direction B) — serif display over
 * a printed-menu panel; the menu is drawn straight from the same fixtures
 * the agent talks about.
 */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appConfig, isLinked } from "../config";
import { CHAT_PATH, HOME_PATH } from "../routes";
import { mountWidget, type WidgetOutcome } from "../lib/widget";
import { QrLink } from "../components/QrLink";
import { SERVICES, STUDIO_NAME } from "../lib/trimly-fixtures";

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
          <p className="micro">{STUDIO_NAME} · booking, by conversation</p>
          <h1 className="display">{appConfig.copy.landing.headline}</h1>
          <p className="hero-sub">{appConfig.copy.landing.sub}</p>
          <div className="hero-asks" aria-label="Example things to ask">
            <span className="ask-chip">&ldquo;Book Dana for a balayage on Thursday morning&rdquo;</span>
            <span className="ask-chip">&ldquo;Move L. Chen&rsquo;s cut to Friday at 2pm&rdquo;</span>
            <span className="ask-chip">&ldquo;What&rsquo;s my chair utilization this week?&rdquo;</span>
          </div>
          <div className="hero-actions">
            <Link to={CHAT_PATH} className="btn btn-primary">
              {appConfig.demoMode ? "Enter the demo" : "Open the chat"}
            </Link>
            <a href="#menu" className="btn">
              The menu
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
        <aside className="hero-menu" id="menu" aria-label="Service menu">
          <p className="micro">The menu</p>
          <ul className="menu-list">
            {SERVICES.map((s) => (
              <li key={s.name}>
                <span className="menu-name display">{s.name}</span>
                <span className="menu-meta">
                  {s.price} · {s.duration}
                </span>
              </li>
            ))}
          </ul>
          <p className="menu-quote display">&ldquo;book me a balayage with Dana on Thursday&rdquo;</p>
        </aside>
      </section>
      {appConfig.demoMode ? (
        <p className="demo-strip">
          Trimly is a fictional product — a live demo of an agentic app built on guuey. Every
          booking, name, and number on this site is mock data.
        </p>
      ) : null}
    </main>
  );
}
