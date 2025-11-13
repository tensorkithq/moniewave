package database

import (
	"log"
)

// runMigrations runs all database migrations
func runMigrations() error {
	// Create users table
	createUsersTable := `
	CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		username TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL,
		full_name TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
	);`

	if _, err := DB.Exec(createUsersTable); err != nil {
		return err
	}

	log.Println("Users table created successfully")

	// Insert default user if not exists
	insertDefaultUser := `
	INSERT OR IGNORE INTO users (username, password, full_name)
	VALUES ('president', '20201103', 'Presi Dent');`

	if _, err := DB.Exec(insertDefaultUser); err != nil {
		return err
	}

	log.Println("Default user migration completed")

	return nil
}
