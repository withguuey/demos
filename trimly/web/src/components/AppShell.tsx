/**
 * The CHAT-RAIL shell (guuey#303, founder-confirmed):
 *
 *   ┌──────────┬────────────────────────┐
 *   │ ☰ Menu 1 │                        │
 *   │ ☰ Menu 2 │   MAIN CANVAS          │
 *   │ ☰ Menu 3 │   your pages — or the  │
 *   ├──────────┤   full generated UI    │
 *   │ AGENT    │   when the agent draws │
 *   │ RAIL     │   one                  │
 *   │ (chat)   │                        │
 *   └──────────┴────────────────────────┘
 *
 * Upper sidebar = your product's menus. LOWER sidebar = the embed-SDK
 * agent rail — the visitor TYPES THERE; generative views collapse to
 * compact CHIPS in the rail (the kit's chips presentation) and the full
 * render takes the MAIN canvas. Chips are the history: clicking one
 * re-selects its render onto the canvas ("just like a web browser's
 * history"); a new render navigates forward automatically; picking a
 * menu swaps the canvas back to your pages.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import type { PlanViewSummary, ViewRefItem } from "@guuey/chat";
import type { GuueyChatHandle } from "@guuey/chat/react";
import { GuueyView } from "@guuey/mcp-apps-host/react";
import { appConfig } from "../config";
import { AgentChat } from "../components/AgentChat";
import { currentIdentityMode, logOut } from "../lib/identity";
import { oidcConfigured, signOutOidc } from "../lib/oidc";

/**
 * The theme announce for canvas-mounted generated UI (#302): one spec
 * key, `hostContext.theme` — without it a render defaults its own way
 * and a dark card lands on the cream app (caught live). Module scope
 * for identity stability. Mode only by design: the palette-variable
 * bridge (ggui#572) has no sender yet — when it does, tokens join here.
 */
const VIEW_HOST_CONTEXT = { theme: appConfig.theme.mode };

export function AppShell() {
  const navigate = useNavigate();
  const mode = currentIdentityMode();

  // The landing mounts the real widget launcher (distribution way #1);
  // SPA navigation keeps its DOM alive, so inside the app shell it would
  // float redundantly beside the agent rail. No hide verb exists in the
  // frozen v1 widget vocabulary (guuey#315 tracks the real API) — until
  // it lands, the sanctioned seam is the stable `.guuey-widget` class,
  // toggled via a body flag while the shell is mounted (styles-app.css).
  useEffect(() => {
    document.body.dataset.appShell = "true";
    return () => {
      delete document.body.dataset.appShell;
    };
  }, []);

  // The rail↔canvas bridge: the kit's view roster (mount material lives
  // here, the rail shows only chips), the selected key, and whether the
  // canvas currently shows a view or the routed pages.
  const [views, setViews] = useState<PlanViewSummary[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | undefined>(undefined);
  const [canvasShowsView, setCanvasShowsView] = useState(false);
  const newestKeyRef = useRef<string | undefined>(undefined);
  // The kit's imperative handle (0.12): `viewSlotProps()` gives the canvas
  // mount the SAME wiring the kit's inline mounts run with — theme
  // announce, the default action relay, the model-context sink — so a
  // rendered card's Confirm works on the host canvas too (guuey#335).
  const [chat, setChat] = useState<GuueyChatHandle | null>(null);

  // The demo-tour ask hook (guuey#303 family, public contract like
  // `demo:render-complete`): an external step machine dispatches
  // `demo:ask` with {text} and the shell sends it through the rail's
  // own composer gate — the tour's "Fill the input" button.
  useEffect(() => {
    const onAsk = (e: Event) => {
      const text = (e as CustomEvent<{ text?: string }>).detail?.text;
      if (typeof text === "string" && text !== "" && chat !== null) {
        chat.send(text);
      }
    };
    window.addEventListener("demo:ask", onAsk);
    return () => window.removeEventListener("demo:ask", onAsk);
  }, [chat]);

  const onViewsChange = useCallback((next: PlanViewSummary[]) => {
    setViews(next);
    // Browser-history forward-navigation: a NEW live render takes the
    // canvas. (Reversed find = newest mountable; live entries sit after
    // history in the roster's transcript order.)
    const newest = [...next].reverse().find((v) => v.mount !== null && v.phase !== "expired");
    if (newest !== undefined && newest.key !== newestKeyRef.current) {
      newestKeyRef.current = newest.key;
      setSelectedKey(newest.key);
      setCanvasShowsView(true);
      // The demo-tour hook (guuey#303): step machines outside the app can
      // key on "the agent just drew UI".
      window.dispatchEvent(
        new CustomEvent("demo:render-complete", {
          detail: { key: newest.key, title: newest.title },
        }),
      );
    }
  }, []);

  const onViewRef = useCallback((item: ViewRefItem) => {
    setSelectedKey(item.key);
    setCanvasShowsView(true);
  }, []);

  const selected = views.find((v) => v.key === selectedKey && v.mount !== null);

  async function handleLogOut() {
    if (mode === "oidc" && oidcConfigured()) await signOutOidc();
    logOut();
    navigate("/");
  }

  return (
    <div className="app-shell">
      <div className="app-body">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <span className="brand-mark">{appConfig.brand.logoText}</span>
            <span>{appConfig.brand.name}</span>
          </div>
          <nav className="sidebar-menus">
            {/* Picking a menu swaps the canvas back to your pages. */}
            <NavLink to="/app" end onClick={() => setCanvasShowsView(false)}>
              Calendar
            </NavLink>
            <NavLink to="/app/services" onClick={() => setCanvasShowsView(false)}>
              Services
            </NavLink>
            <NavLink to="/app/setup" onClick={() => setCanvasShowsView(false)}>
              Setup
            </NavLink>
            <NavLink to="/app/mobile" data-tour="mobile" onClick={() => setCanvasShowsView(false)}>
              📱 Talk on mobile
            </NavLink>
            <button type="button" className="dock-logout" onClick={() => void handleLogOut()}>
              Log out{mode === "guest" ? " (guest)" : ""}
            </button>
          </nav>
          <div className="agent-rail" data-tour="agent-rail">
            <AgentChat
              className="rail-chat"
              viewsBridge={{ promotedViewKey: selectedKey, onViewRef, onViewsChange }}
              onReady={setChat}
            />
          </div>
        </aside>
        <main className="canvas" data-tour="canvas">
          {canvasShowsView && selected !== undefined && selected.mount !== null ? (
            <div className="canvas-view">
              <header className="canvas-view-bar">
                <span>{selected.title}</span>
                <button type="button" className="btn" onClick={() => setCanvasShowsView(false)}>
                  Back to {appConfig.brand.name}
                </button>
              </header>
              {selected.mount.channel !== "locator" ? (
                <GuueyView
                  key={selected.key}
                  mount={selected.mount}
                  title={selected.title}
                  {...(chat !== null ? chat.viewSlotProps() : {})}
                  hostContext={VIEW_HOST_CONTEXT}
                  className="canvas-view-mount"
                />
              ) : (
                // A locator still resolving — the kit reads it and the next
                // roster emission carries the material (a FAILED read
                // surfaces as the chip's expired state instead).
                <p className="calm canvas-view-loading">Loading card…</p>
              )}
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
