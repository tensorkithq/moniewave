.PHONY: build run clean test dev install

# Binary name
BINARY_NAME=moniewave
BUILD_DIR=bin

# Include .env file if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Build the application
build:
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

# Run the application (loads .env automatically)
run: build
	@echo "Running $(BINARY_NAME)..."
	@if [ ! -f .env ]; then \
		echo "WARNING: .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@./$(BUILD_DIR)/$(BINARY_NAME)

# Development mode (with auto-reload using air if installed, otherwise just run)
dev:
	@if [ ! -f .env ]; then \
		echo "WARNING: .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Air not found. Running normally..."; \
		$(MAKE) run; \
	fi

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@rm -f $(BINARY_NAME)

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

# Install dependencies
install:
	@echo "Installing dependencies..."
	@go mod download
	@go mod verify

# Format code
fmt:
	@echo "Formatting code..."
	@go fmt ./...

# Run linter (requires golangci-lint)
lint:
	@echo "Running linter..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run; \
	else \
		echo "golangci-lint not installed. Skipping..."; \
	fi

# Tidy go.mod
tidy:
	@echo "Tidying go.mod..."
	@go mod tidy
