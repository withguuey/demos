/**
 * Base-template chrome: brand header + nav + auth affordance. Pages render
 * inside via the router outlet.
 */
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { appConfig } from "../config";
import { CHAT_PATH, HOME_PATH } from "../routes";
import { currentIdentityMode, logOut } from "../lib/identity";
import { oidcConfigured, signOutOidc } from "../lib/oidc";

// guuey#1063 — the demo's one exit to Guuey. Visitors who like what they see had
// no door back (HN, 2026-09-08: 34 arrivals, 0 continued). UTM = growth's
// evergreen-link taxonomy; utm_content names this shell.
const GUUEY_EXIT_URL =
  "https://guuey.com/hire-a-rep?utm_source=demo&utm_medium=referral&utm_campaign=channel&utm_content=dealio-shell";

export function Shell() {
  const navigate = useNavigate();
  // Subscribing to the location re-renders this chrome on every navigation,
  // so the render-time read below stays fresh after login/logout. (A
  // `storage` listener would NOT work — that event only fires in OTHER
  // tabs, never the one that wrote the change.)
  useLocation();
  const mode = currentIdentityMode();

  async function handleLogOut() {
    if (mode === "oidc" && oidcConfigured()) await signOutOidc();
    logOut();
    navigate("/");
  }

  return (
    <div className="shell">
      <header className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark">{appConfig.brand.logoText}</span>
          <span>{appConfig.brand.name}</span>
        </Link>
        <nav>
          <a className="guuey-exit" href={GUUEY_EXIT_URL} target="_blank" rel="noopener noreferrer">
            Built with Guuey →
          </a>
          <NavLink to={CHAT_PATH}>Chat</NavLink>
          <NavLink to={HOME_PATH}>Home</NavLink>
          {mode === null ? (
            // No sign-in affordance until OIDC is configured (guuey#928): a
            // guest gets a thread from the chat itself, so an unconfigured
            // deployment shows no dead door on its front page.
            oidcConfigured() ? (
              <NavLink to="/login" className="btn btn-accent">
                Sign in
              </NavLink>
            ) : null
          ) : (
            <button type="button" className="btn" onClick={() => void handleLogOut()}>
              Log out{mode === "guest" ? " (guest)" : ""}
            </button>
          )}
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
