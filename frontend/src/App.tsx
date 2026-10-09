
import { useEffect, useState } from 'react'
import './App.css'

type HealthResponse = {
  status: string
  service: string
  timestamp: string
}

type ConnectionStatus = 'checking' | 'healthy' | 'unavailable'

function App() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [connectionStatus, setConnectionStatus] =
    useState<ConnectionStatus>('checking')
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function checkHealth() {
      try {
        const response = await fetch('/api/health', {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error(`API returned HTTP ${response.status}`)
        }

        const data: HealthResponse = await response.json()

        setHealth(data)
        setConnectionStatus('healthy')
        setError('')
      } catch (err) {
        if (controller.signal.aborted) return

        setConnectionStatus('unavailable')
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        )
      }
    }

    void checkHealth()

    return () => controller.abort()
  }, [])

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">PERSONAL OPERATIONS DASHBOARD</p>
          <h1>SignalBoard</h1>
          <p className="subtitle">
            Your day, your signals, all in one place.
          </p>
        </div>
        <span className={`status-badge ${connectionStatus}`}>
          <span className="status-dot" />
          {connectionStatus === 'checking'
            ? 'Checking connection'
            : connectionStatus === 'healthy'
              ? 'API connected'
              : 'API unavailable'}
        </span>
      </header>

      <section className="dashboard-grid">
        <article className="panel">
          <p className="panel-label">SYSTEM HEALTH</p>
          <h2>
            {connectionStatus === 'checking'
              ? 'Checking...'
              : connectionStatus === 'healthy'
                ? 'All systems go'
                : 'Connection issue'}
          </h2>
          <p className="panel-description">
            {connectionStatus === 'healthy'
              ? 'SignalBoard successfully received a response from its backend.'
              : connectionStatus === 'checking'
                ? 'Contacting the SignalBoard API.'
                : 'The dashboard could not retrieve a healthy response.'}
          </p>
        </article>

        <article className="panel">
          <p className="panel-label">BACKEND SERVICE</p>
          <h2>{health?.service ?? 'Waiting for response'}</h2>
          <p className="panel-description">
            {health
              ? `Reported status: ${health.status}`
              : 'Service details will appear when the API responds.'}
          </p>
        </article>

        <article className="panel">
          <p className="panel-label">LAST SUCCESSFUL CHECK</p>
          <h2 className="timestamp">
            {health
              ? new Date(health.timestamp).toLocaleString()
              : 'Not available'}
          </h2>
          <p className="panel-description">
            Timestamp supplied by the Go backend.
          </p>
        </article>
      </section>

      {error && (
        <section className="error-panel" role="alert">
          <h2>Unable to reach the API</h2>
          <p>{error}</p>
          <p>
            Check that the Go server is running and that the Vite proxy is
            configured correctly.
          </p>
        </section>
      )}

      <footer className="dashboard-footer">
        SignalBoard · Early build · Backend integration
      </footer>
    </main>
  )
}

export default App