// Central API configuration.
//
// The whole frontend points at the backend through these two values so the same
// build works locally and in production. Set VITE_API_URL at build time:
//   - local dev:   http://localhost:8000  (see .env)
//   - production:  https://<your-backend-host>
export const API_URL: string = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

// WebSocket base derived from the API URL (http -> ws, https -> wss), used by
// the live interview endpoints. Override with VITE_WS_URL if the WS host differs.
export const WS_URL: string =
  import.meta.env.VITE_WS_URL || API_URL.replace(/^http/, "ws");
