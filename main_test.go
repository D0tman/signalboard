package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"
)

func TestHealthEndpoint(t *testing.T) {
	request := httptest.NewRequest(http.MethodGet, "/health", nil)
	recorder := httptest.NewRecorder()

	newHandler().ServeHTTP(recorder, request)

	if recorder.Code != http.StatusOK {
		t.Fatalf("expected HTTP 200, got %d", recorder.Code)
	}

	if got := recorder.Header().Get("Content-Type"); got != "application/json" {
		t.Errorf("expected application/json, got %q", got)
	}

	var response HealthResponse

	if err := json.Unmarshal(recorder.Body.Bytes(), &response); err != nil {
		t.Fatalf("could not decode JSON response: %v", err)
	}

	if response.Status != "ok" {
		t.Errorf("expected status ok, got %q", response.Status)
	}

	if response.Service != "signalboard-api" {
		t.Errorf("expected service signalboard-api, got %q", response.Service)
	}

	if response.Timestamp.IsZero() {
		t.Fatal("expected a non-zero timestamp")
	}

	if response.Timestamp.Location() != time.UTC {
		t.Errorf("expected UTC timestamp, got %v", response.Timestamp.Location())
	}
}

func TestHealthEndpointRejectsPost(t *testing.T) {
	request := httptest.NewRequest(http.MethodPost, "/health", nil)
	recorder := httptest.NewRecorder()

	newHandler().ServeHTTP(recorder, request)

	if recorder.Code != http.StatusMethodNotAllowed {
		t.Errorf(
			"expected HTTP 405 for POST /health, got %d",
			recorder.Code,
		)
	}
}
