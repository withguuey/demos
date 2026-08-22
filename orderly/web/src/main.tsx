import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@guuey/chat/styles.css";
import "./styles.css";
import "./styles-app.css";
import { appConfig } from "./config";
import { BootstrapGate } from "./components/BootstrapGate";
import { Shell } from "./components/Shell";
import { AppShell } from "./components/AppShell";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Home } from "./pages/Home";
import { Orders } from "./pages/Orders";
import { Refunds } from "./pages/Refunds";
import { TalkOnMobile } from "./pages/TalkOnMobile";

document.documentElement.dataset.mode = appConfig.theme.mode;
document.documentElement.style.setProperty("--app-accent", appConfig.theme.accent);
document.title = appConfig.brand.name;

// The demo-tour slot (guuey#303): a PRIVATE, env-injected bundle — the
// URL arrives at build time via VITE_DEMO_TOUR_SRC (set on the demo
// hosting branch, never in this repo). Unset ⇒ no request, no tour.
const tourSrc = import.meta.env.VITE_DEMO_TOUR_SRC;
if (tourSrc !== undefined && tourSrc !== "") {
  const s = document.createElement("script");
  s.src = tourSrc;
  s.defer = true;
  document.head.append(s);
}

const router = createBrowserRouter([
  {
    // Marketing chrome: landing + login.
    element: <Shell />,
    children: [
      { path: "/", element: <Landing /> },
      { path: "/login", element: <Login /> },
    ],
  },
  {
    // The product: chat-rail shell — the agent rail in the lower
    // sidebar, generated UI on the main canvas (guuey#303).
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Orders /> },
      { path: "refunds", element: <Refunds /> },
      { path: "setup", element: <Home /> },
      { path: "mobile", element: <TalkOnMobile /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BootstrapGate>
      <RouterProvider router={router} />
    </BootstrapGate>
  </StrictMode>,
);
