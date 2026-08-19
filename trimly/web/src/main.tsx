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
import { Calendar } from "./pages/Calendar";
import { Services } from "./pages/Services";
import { AgentCanvas } from "./pages/AgentCanvas";
import { TalkOnMobile } from "./pages/TalkOnMobile";

document.documentElement.dataset.mode = appConfig.theme.mode;
document.documentElement.style.setProperty("--app-accent", appConfig.theme.accent);
document.title = appConfig.brand.name;

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
    // The product: split sidebar, fullscreen-swap agent canvas.
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <Calendar /> },
      { path: "services", element: <Services /> },
      { path: "setup", element: <Home /> },
      { path: "agent", element: <AgentCanvas /> },
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
