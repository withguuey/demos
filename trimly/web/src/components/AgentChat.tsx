/**
 * The configured `<GuueyChat>` for this app — distribution way #2, the
 * embedded chat SDK. One place wires endpoint, history, identity and theme;
 * every chat surface (the /chat page here, the fullscreen agent canvas in
 * the agentic-app template) renders this.
 *
 * Identity rule: ONE mode per surface. When OIDC is configured AND a
 * session exists, the bearer wins; otherwise the client-minted guest
 * secret. Never both.
 */
import { useEffect, useState, type CSSProperties } from "react";
import { GuueyChat, type GuueyChatHandle } from "@guuey/chat/react";
import type { GuueyChatTheme, PlanViewSummary, ViewRefItem } from "@guuey/chat";
import { agentEndpointUrl, appConfig, historyBaseUrl } from "../config";
import { currentIdentityMode, ensureGuestSecret } from "../lib/identity";
import { getBearerToken, currentUser, oidcConfigured } from "../lib/oidc";

/**
 * The chat-rail bridge (agentic-app shell): with `viewsBridge` set, the
 * chat runs the kit's CHIPS presentation — generative views collapse to
 * compact chips in the rail, the full renders belong to the host's main
 * canvas (fed by `onViewsChange`), and chip clicks re-select
 * (`onViewRef` → `promotedViewKey`, the browser-history mechanic).
 */
export interface ViewsBridge {
  promotedViewKey?: string | undefined;
  onViewRef: (item: ViewRefItem) => void;
  onViewsChange: (views: PlanViewSummary[]) => void;
}

/**
 * Referentially STABLE policy override. The kit memoizes its policy on
 * this object's identity — an inline literal here re-mints the policy
 * every render, which recomputes the plan, which re-fires the views
 * emission, which re-renders the host: an infinite setState loop
 * ("Maximum update depth exceeded"). Module scope keeps one identity
 * for the component's whole life.
 */
const RAIL_POLICY = { view: { timeoutMs: 8000, presentation: "chips" as const } };

/** Stable identity callbacks — same rule as RAIL_POLICY: the kit's
 * reader memo keys on these, so fresh arrows per render churn it. */
const getGuestSecretStable = () => ensureGuestSecret();
const getAccessTokenStable = () => getBearerToken();

/**
 * Salon Editorial, projected onto the chat kit's token schema (#302:
 * one theme drives site chrome, the rail, and the generated UI). Same
 * values as styles.css's :root — keep the two in step by hand; the
 * platform-data delivery of this object rides `guuey apps update
 * --chat-theme-file` when guuey#283 lands. Module scope: theme objects
 * are identity-compared upstream (the no-inline-closures caveat).
 */
const SALON_EDITORIAL_CHAT_THEME: GuueyChatTheme = {
  name: "salon-editorial",
  colors: {
    light: {
      accent: "#2b211a",
      onAccent: "#f6f1e7",
      ink: "#2b211a",
      inkMuted: "rgba(43, 33, 26, 0.65)",
      surface: "#fdfbf6",
      canvas: "#f6f1e7",
      canvasMuted: "#efe8d9",
      error: "#a33a24",
    },
    dark: {
      accent: "#f6f1e7",
      onAccent: "#2b211a",
      ink: "#f6f1e7",
      inkMuted: "rgba(246, 241, 231, 0.68)",
      surface: "#2b211a",
      canvas: "#201913",
      canvasMuted: "#1a140f",
      error: "#e08a6e",
    },
  },
  typography: {
    fontFamily: '"Archivo", "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    radius: "soft",
    density: "compact",
  },
};

export function AgentChat({
  className,
  style,
  viewsBridge,
  onReady,
}: {
  className?: string;
  style?: CSSProperties;
  viewsBridge?: ViewsBridge;
  /** The kit's imperative handle (send/prefill/threadId + 0.12's
   * viewSlotProps) — the shell's canvas mount and the guided tour's
   * fill-and-send both key on it. */
  onReady?: (handle: GuueyChatHandle) => void;
}) {
  // The user's CHOSEN mode wins: an explicit "Continue as guest" must never
  // be shadowed by a cached OIDC session. Only when no choice is recorded
  // does a live session imply oidc.
  const chosen = currentIdentityMode();
  const [identity, setIdentity] = useState<"resolving" | "guest" | "oidc">(
    chosen === "guest" || !oidcConfigured() ? "guest" : chosen === "oidc" ? "oidc" : "resolving",
  );

  useEffect(() => {
    if (identity !== "resolving") return;
    let cancelled = false;
    void currentUser().then((user) => {
      if (!cancelled) setIdentity(user ? "oidc" : "guest");
    });
    return () => {
      cancelled = true;
    };
  }, [identity]);

  if (identity === "resolving") return null;

  const shared = {
    endpointUrl: agentEndpointUrl(),
    appId: appConfig.link?.appId ?? "local",
    apiBaseUrl: historyBaseUrl(),
    mode: appConfig.theme.mode,
    theme: SALON_EDITORIAL_CHAT_THEME,
    className,
    style,
    ...(viewsBridge !== undefined
      ? {
          policy: RAIL_POLICY,
          promotedViewKey: viewsBridge.promotedViewKey,
          onViewRef: viewsBridge.onViewRef,
          onViewsChange: viewsBridge.onViewsChange,
        }
      : {}),
    ...(onReady !== undefined ? { onReady } : {}),
  };

  return identity === "oidc" ? (
    <GuueyChat {...shared} getAccessToken={getAccessTokenStable} />
  ) : (
    <GuueyChat {...shared} getGuestSecret={getGuestSecretStable} />
  );
}
