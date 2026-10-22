
import { useEffect, useState } from "react";
import "./App.css";

type View = "health" | "hangout";

type HealthResponse = {
  status: string;
  service: string;
  timestamp: string;
};

function App() {
  const [view, setView] = useState<View>("health");
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: HealthResponse = await response.json();
        setHealth(data);
        setError(null);
      } catch (err) {
        setHealth(null);
        setError(
          err instanceof Error ? err.message : "Unknown error"
        );
      } finally {
        setLoading(false);
      }
    }

    void checkHealth();
  }, []);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">SignalBoard</div>
        <p className="sidebar-label">WORKSPACE</p>

        <nav aria-label="Main navigation">
          <button
            className={`nav-item ${view === "health" ? "active" : ""}`}
            onClick={() => setView("health")}
            aria-current={view === "health" ? "page" : undefined}
          >
            System Health
          </button>

          <button
            className={`nav-item ${view === "hangout" ? "active" : ""}`}
            onClick={() => setView("hangout")}
            aria-current={view === "hangout" ? "page" : undefined}
          >
            The Hangout
          </button>
        </nav>

        <p className="sidebar-footer">Built to learn. Built to grow.</p>
      </aside>

      <main className="main-content">
        {view === "health" ? (
          <section>
            <p className="eyebrow">SYSTEM OVERVIEW</p>
            <h1>System Health</h1>
            <p className="description">
              API connectivity and application diagnostics.
            </p>

            <div className="panel">
              <h2>API Status</h2>

              {loading ? (
                <p>Checking API connection...</p>
              ) : error ? (
                <p className="status-error">
                  API unavailable: {error}
                </p>
              ) : (
                <>
                  <p className="status-success">
                    Connected — {health?.status}
                  </p>

                  <dl className="details">
                    <dt>Service</dt>
                    <dd>{health?.service}</dd>

                    <dt>Last response</dt>
                    <dd>
                      {health?.timestamp
                        ? new Date(health.timestamp).toLocaleString()
                        : "Unavailable"}
                    </dd>
                  </dl>
                </>
              )}
            </div>

            <p className="note">
              Health is checked when the application loads.
              Automatic polling is a future enhancement.
            </p>
          </section>
        ) : (
          <section>
            <p className="eyebrow">PRODUCT PREVIEW</p>
            <h1>The Hangout</h1>
            <p className="description">
              A future home for friends to choose the music and
              find a time to get together.
            </p>

            <div className="preview-grid">
              <article className="panel">
                <span className="coming-soon">COMING SOON</span>
                <h2>Music</h2>
                <p>
                  Pick a playlist for the group and set the mood.
                </p>

                <div className="placeholder">
                  🎵 Insert AUX cable here
                </div>

                <p className="note">
                  Planned: Spotify integration and shared playlist
                  selection. No account connection is active.
                </p>
              </article>

              <article className="panel">
                <span className="coming-soon">COMING SOON</span>
                <h2>Calendar</h2>
                <p>
                  Find a time that works and plan your next hangout.
                </p>

                <div className="placeholder">
                  📅 Your next hangout starts here
                </div>

                <p className="note">
                  Planned: availability and scheduling.
                  No calendar integration is active.
                </p>
              </article>
            </div>

            <div className="panel roadmap">
              <h2>Release roadmap</h2>
              <p>
                These features are interface previews only.
                A future release could use a LaunchDarkly
                feature flag to control access during internal
                testing, pilot rollout, and general availability.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;