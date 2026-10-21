package main

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type HealthResponse struct {
	Status    string    `json:"status"`
	Service   string    `json:"service"`
	Timestamp time.Time `json:"timestamp"`
}

func newHandler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		response := HealthResponse{
			Status:    "ok",
			Service:   "signalboard-api",
			Timestamp: time.Now().UTC(),
		}

		w.Header().Set("Content-Type", "application/json")

		if err := json.NewEncoder(w).Encode(response); err != nil {
			log.Printf("failed to encode health response: %v", err)
		}
	})

	return mux
}

func main() {
	server := &http.Server{
		Addr:              ":8080",
		Handler:           newHandler(),
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("SignalBoard API listening on %s", server.Addr)
	log.Fatal(server.ListenAndServe())
}
