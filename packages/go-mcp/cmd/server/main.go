package main

import (
	"log"

	"paystack.mpc.proxy/internal/config"
	"paystack.mpc.proxy/internal/server"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Create and start server
	srv := server.New(cfg)
	if err := srv.Start(); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
