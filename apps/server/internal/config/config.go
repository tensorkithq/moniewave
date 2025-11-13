package config

import (
	"log"
	"os"
)

// Config holds application configuration
type Config struct {
	PaystackSecretKey string
	ServerPort        string
	DatabasePath      string
}

// Load loads configuration from environment variables
func Load() *Config {
	apiKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if apiKey == "" {
		log.Fatal("PAYSTACK_SECRET_KEY environment variable is required")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "4000"
	}

	dbPath := os.Getenv("DATABASE_PATH")
	if dbPath == "" {
		dbPath = "./data/moniewave.db"
	}

	return &Config{
		PaystackSecretKey: apiKey,
		ServerPort:        port,
		DatabasePath:      dbPath,
	}
}
