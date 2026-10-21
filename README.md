
# SignalBoard

A full-stack dashboard for exploring API integration, service health, and operational troubleshooting.

## Overview

SignalBoard uses a Go HTTP backend and a React/TypeScript frontend to demonstrate how application components communicate, how failures are surfaced, and how service behavior can be verified.

The project focuses on testable API behavior, reproducible troubleshooting, and incremental improvements to application reliability.

## Tech Stack

- **Backend:** Go, standard library `net/http`
- **Frontend:** React, TypeScript, Vite
- **API:** HTTP and JSON
- **Version control:** Git and GitHub

## Current Functionality

- **Health API:** `GET /health` returns a JSON response containing service status, service name, and a UTC timestamp.
- **Health dashboard:** Displays the backend service status and last successful check.
- **Development proxy:** Vite forwards `/api/health` requests to the Go backend's `/health` endpoint.
- **Error handling:** The dashboard displays an unavailable state when an API request fails.
- **Recovery:** Refreshing the browser after the backend is restored triggers a new health check.

The dashboard currently checks service health when the page loads. Automatic polling is not yet implemented.

## Architecture

```text
Browser
   |
   v
React + TypeScript
(Vite development server)
   |
   | GET /api/health
   v
Vite development proxy
   |
   | GET /health
   v
Go HTTP API
   |
   v
JSON health response
```

The frontend and backend run as separate processes during local development. Vite provides the development proxy; production hosting and routing are not yet configured.

## Running Locally

### Prerequisites

- Go
- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/D0tman/signalboard.git
cd signalboard
```

### 2. Start the Go backend

From the project root:

```bash
go run main.go
```

The backend listens on `http://localhost:8080`.

### 3. Start the React frontend

In a second terminal:

```bash
cd frontend
npm ci
npm run dev
```

Open the URL displayed by Vite, typically `http://localhost:5173`.

### 4. Verify the API

```bash
curl -i http://localhost:8080/health
```

Expected HTTP status: `200 OK`

Example JSON response:

```json
{
  "status": "ok",
  "service": "signalboard-api",
  "timestamp": "2026-10-20T12:00:00Z"
}
```

The timestamp above is illustrative. The API generates the current UTC timestamp for each response.

## Troubleshooting Exercise

A backend connectivity failure can be reproduced locally:

1. Start the Go backend and React frontend.
2. Confirm the dashboard displays **API connected**.
3. Stop the Go backend using `Ctrl + C`.
4. Refresh the browser.
5. Confirm the dashboard displays **API unavailable**.
6. Restart the Go backend.
7. Refresh the browser and confirm the dashboard reconnects.

The dashboard performs its health check when the page loads. Refreshing triggers a new request; automatic polling is not yet implemented.

This exercise demonstrates the difference between frontend availability and backend availability, along with the importance of clear error reporting and reproducible troubleshooting steps.

## Development Roadmap

- [x] Create a Go HTTP API
- [x] Build a React/TypeScript dashboard
- [x] Connect the frontend and backend
- [x] Handle unsuccessful API requests
- [x] Publish the source code to GitHub
- [ ] Add automated API tests
- [ ] Add automatic health polling
- [ ] Add continuous integration checks
- [ ] Containerize the application
- [ ] Deploy a working application
- [ ] Expand logging and observability

## Current Status

SignalBoard currently runs locally with separate frontend and backend processes. Automated tests, continuous integration, and public deployment are planned improvements.