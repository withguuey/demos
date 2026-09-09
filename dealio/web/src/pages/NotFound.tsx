/**
 * Not found — a real page for unknown paths (guuey#1146). The shells are
 * marketing surfaces: a visitor who mistypes or follows a stale link must
 * never meet React Router's developer error screen ("Hey developer 👋").
 * Mounted twice: as the catch-all `*` route (unknown path) and as each
 * route group's `errorElement` (a render error lands here too, quietly).
 */
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";
import { appConfig } from "../config";

export function NotFound() {
  const error = useRouteError();
  const notFound =
    error === undefined || error === null || (isRouteErrorResponse(error) && error.status === 404);
  return (
    <main className="page notfound">
      <p className="calm notfound-code">{notFound ? "404" : "Something went wrong"}</p>
      <h1>{notFound ? "There\u2019s nothing at this address." : "This page hit an error."}</h1>
      <p className="calm">
        {notFound
          ? "The link may be old, or the address mistyped."
          : "Nothing was lost. Start again from the front page."}
      </p>
      <Link to="/" className="btn btn-primary">
        Back to {appConfig.brand.name}
      </Link>
    </main>
  );
}
