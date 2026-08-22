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
import {
  UI_SEMANTIC_ACTION_TOOLS,
  unavailableToolCallResult,
  type McpToolCallResult,
  type McpToolStructuredContent,
  type UiActionRequest,
} from "@guuey/mcp-apps-host";
import { appConfig } from "../config";
import { AgentChat } from "../components/AgentChat";
import { currentIdentityMode, logOut } from "../lib/identity";
import { oidcConfigured, signOutOidc } from "../lib/oidc";
import { hideWidget, showWidget } from "../lib/widget";

/**
 * The theme announce for canvas-mounted generated UI (#302): one spec
 * key, `hostContext.theme` — without it a render defaults its own way
 * and a dark card lands on the cream app (caught live). Module scope
 * for identity stability. Mode only by design: the palette-variable
 * bridge (ggui#572) has no sender yet — when it does, tokens join here.
 */
const VIEW_HOST_CONTEXT = { theme: appConfig.theme.mode };

/**
 * A human-readable projection of a SEMANTIC card action for composer
 * staging (#198/#218's widget pattern, ported per guuey#356's interim
 * guidance). Only ever called for tools in UI_SEMANTIC_ACTION_TOOLS —
 * the set that carries a user gesture — so nothing plumbing-shaped can
 * reach the composer. Picks the first obvious label-ish string from the
 * action's arguments; generic fallback otherwise.
 */
/** The widget's exact staged-answer text (WidgetView.ACTION_STAGED_MSG) —
 * byte-matched so every layer that recognizes the known-good widget
 * answer treats the canvas identically. */
const ACTION_STAGED_MSG = "Queued — press Send to continue.";

/** Wire-envelope fields that are protocol plumbing, never user meaning —
 * round 2 staged "kind dispatch" because the projection read the ENVELOPE
 * instead of the action's own params (exec's verbatim catch). */
const ENVELOPE_KEYS = new Set(["kind", "type", "version", "schema", "id", "requestId", "resourceUri"]);

function humanizeActionName(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase().trim();
}

/**
 * The widget's stagedActionText, ported + extended for the shape this
 * layer sees: widget-style flat envelopes carry `actionId` + params;
 * the canvas relay can also receive a dispatch envelope ({kind:
 * "dispatch", …}) with the action nested one level down. Envelope keys
 * never reach the projection; only primitive param values are printed
 * (complex values are omitted, not serialized — the #218 no-raw-payload
 * discipline), capped at three pairs.
 */
function projectSemanticAction(args: McpToolStructuredContent | undefined): string | null {
  let verb: string | null = null;
  let params: Record<string, unknown> = {};
  if (args !== undefined) {
    let core: Record<string, unknown> = args as Record<string, unknown>;
    // Dispatch envelope: descend into the first object-valued non-envelope
    // field (the action body).
    if (typeof core["actionId"] !== "string" && core["kind"] !== undefined) {
      for (const [k, v] of Object.entries(core)) {
        if (!ENVELOPE_KEYS.has(k) && typeof v === "object" && v !== null && !Array.isArray(v)) {
          core = v as Record<string, unknown>;
          break;
        }
      }
    }
    const actionId = core["actionId"] ?? core["name"] ?? core["action"];
    if (typeof actionId === "string" && actionId !== "") verb = actionId;
    for (const [k, v] of Object.entries(core)) {
      if (k === "actionId" || k === "name" || k === "action" || ENVELOPE_KEYS.has(k)) continue;
      params[k] = v;
    }
    // Params may sit one level deeper still ({actionId, params: {...}}).
    const nested = params["params"] ?? params["payload"] ?? params["arguments"];
    if (typeof nested === "object" && nested !== null && !Array.isArray(nested)) {
      params = nested as Record<string, unknown>;
    }
  }
  // Reference detection: a hex-hash "verb" is a dispatch token, not a
  // human action name — the payload lives iframe-side and CANNOT be
  // projected. `intent` is runtime routing, never a user-meaningful pair.
  const verbIsReference = verb !== null && /^[0-9a-f]{6,}$/i.test(verb);
  const pairs: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (ENVELOPE_KEYS.has(k) || k === "intent") continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
      const s = String(v);
      if (s !== "" && s.length <= 60 && !/^[0-9a-f]{6,}$/i.test(s)) pairs.push(`${k} ${s}`);
    }
    if (pairs.length >= 3) break;
  }
  // Nothing human to stage → null: the caller delivers via the relay
  // instead (the backend can dereference what we cannot).
  if (pairs.length === 0) return null;
  const title = verb !== null && !verbIsReference ? humanizeActionName(verb) : "my selection";
  return `I picked ${title}: ${pairs.join(", ")} — please continue.`;
}

export function AppShell() {
  const navigate = useNavigate();
  const mode = currentIdentityMode();

  // The landing mounts the real widget launcher (distribution way #1);
  // SPA navigation keeps its DOM alive, so inside the app shell it would
  // float redundantly beside the agent rail. Hide it with the v1 verbs
  // (guuey#315): idempotent and queue-shim safe, so this is correct even
  // if the loader has not finished (or never loads on an unlinked build).
  useEffect(() => {
    hideWidget();
    return () => {
      showWidget();
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
  const chatRef = useRef<GuueyChatHandle | null>(null);
  chatRef.current = chat;

  // Post-turn card actions (the founder's in-card Confirm): the kit's
  // relay delivers a click only while its turn can still hear it — past
  // that, the pod 404s BY DESIGN and the raw failure surfaced in-card
  // ("agent not listening", warm-up 2026-08-22). The widget solved this
  // beat with #198/#218 composer STAGING; until guuey#356 makes that a
  // kit seam, this shell ports the policy: try the kit's delivery first,
  // and when a SEMANTIC action comes back errored, stage its projection
  // into the composer instead — the click becomes the visitor's next
  // message, one Send away. Stable identity (ref-read), per the
  // no-churn rule.
  const stagedCallTool = useCallback(
    async (req: UiActionRequest): Promise<McpToolCallResult> => {
      // SEMANTIC actions stage into the composer ONLY when the wire
      // carries real, human-projectable params. The ggui dispatch shape
      // can instead carry a REFERENCE ({actionId: <hash>, intent:
      // "selectSlot"} — the payload stays inside the iframe, resolved
      // backend-side): staging a hash actively misleads (round-4 receipt:
      // the agent replied "which time works?" to a hash it can never
      // resolve), so reference-shaped actions go to the kit relay — the
      // pod/persisted doors are the only parties that can dereference
      // them (guuey#356's design axis). Params-shaped actions stage; the
      // kit's non-error degrade makes result inspection useless (#215),
      // so the split keys on the REQUEST shape, the one honest signal.
      if (UI_SEMANTIC_ACTION_TOOLS.has(req.name)) {
        const projection = projectSemanticAction(req.arguments);
        if (projection !== null) {
          chatRef.current?.prefill(projection, { focus: true });
          return { content: [{ type: "text", text: ACTION_STAGED_MSG }] };
        }
      }
      const kit = chatRef.current?.viewSlotProps().onCallTool;
      return kit !== undefined ? kit(req) : unavailableToolCallResult();
    },
    [],
  );

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
    // Browser-history forward-navigation: a NEW **live** render takes the
    // canvas. Provenance matters: on thread hydration the roster replays
    // persisted HISTORY cards, and treating those as "the agent just drew
    // UI" both hijacked the canvas on load and fired the tour's
    // render-complete hook before any live turn (exec's 2/2 repro on a
    // history-bearing browser — the tour skipped its rail step). History
    // cards stay reachable through their chips; only origin:"live" mounts
    // auto-promote or notify.
    const newest = [...next]
      .reverse()
      .find((v) => v.origin === "live" && v.mount !== null && v.phase !== "expired");
    if (newest !== undefined && newest.key !== newestKeyRef.current) {
      newestKeyRef.current = newest.key;
      setSelectedKey(newest.key);
      setCanvasShowsView(true);
      // The demo-tour hook (guuey#303): step machines outside the app can
      // key on "the agent just drew UI" — live renders only, by the same
      // provenance rule.
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
                  onCallTool={stagedCallTool}
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
