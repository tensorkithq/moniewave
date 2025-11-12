.PHONY: build run clean test dev install fmt lint tidy help
.PHONY: test-coverage test-race test-bench vet check
.PHONY: build-all build-linux build-darwin build-windows
.PHONY: setup env-check deps-install deps-update deps-verify
.PHONY: docker-build docker-run docker-stop docker-clean
.PHONY: release install-tools

# Binary name
BINARY_NAME=moniewave
BUILD_DIR=bin
MODULE_NAME=paystack.mpc.proxy

# Version and build info
VERSION?=$(shell git describe --tags --always --dirty 2>/dev/null || echo "dev")
BUILD_TIME=$(shell date -u '+%Y-%m-%d_%H:%M:%S')
COMMIT_HASH=$(shell git rev-parse --short HEAD 2>/dev/null || echo "unknown")

# Build flags
LDFLAGS=-ldflags "-X main.Version=$(VERSION) -X main.BuildTime=$(BUILD_TIME) -X main.CommitHash=$(COMMIT_HASH)"

# Include .env file if it exists
ifneq (,$(wildcard .env))
    include .env
    export
endif

# Default target
.DEFAULT_GOAL := help

## help: Show this help message
help:
	@echo "Available targets:"
	@echo ""
	@echo "  Development:"
	@echo "    make dev          - Run in development mode with auto-reload (requires air)"
	@echo "    make run          - Build and run the application"
	@echo "    make build        - Build the application binary"
	@echo ""
	@echo "  Testing:"
	@echo "    make test         - Run all tests"
	@echo "    make test-coverage - Run tests with coverage report"
	@echo "    make test-race    - Run tests with race detection"
	@echo "    make test-bench   - Run benchmarks"
	@echo ""
	@echo "  Code Quality:"
	@echo "    make fmt          - Format code with go fmt"
	@echo "    make lint         - Run linter (golangci-lint)"
	@echo "    make vet          - Run go vet"
	@echo "    make check        - Run all checks (fmt, vet, lint, test)"
	@echo ""
	@echo "  Dependencies:"
	@echo "    make install      - Download and verify dependencies"
	@echo "    make tidy         - Tidy and verify go.mod"
	@echo "    make deps-update  - Update all dependencies"
	@echo "    make deps-verify  - Verify dependencies"
	@echo ""
	@echo "  Build Variants:"
	@echo "    make build-all    - Build for all platforms"
	@echo "    make build-linux  - Build for Linux"
	@echo "    make build-darwin - Build for macOS"
	@echo "    make build-windows - Build for Windows"
	@echo ""
	@echo "  Setup & Utilities:"
	@echo "    make setup        - Initial project setup"
	@echo "    make env-check    - Verify environment variables"
	@echo "    make clean        - Remove build artifacts"
	@echo "    make install-tools - Install development tools"
	@echo ""
	@echo "  Docker:"
	@echo "    make docker-build - Build Docker image"
	@echo "    make docker-run   - Run Docker container"
	@echo "    make docker-stop  - Stop Docker container"
	@echo "    make docker-clean - Remove Docker image and containers"
	@echo ""

## build: Build the application
build:
	@echo "Building $(BINARY_NAME) $(VERSION)..."
	@mkdir -p $(BUILD_DIR)
	@go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server

## run: Run the application (loads .env automatically)
run: build
	@echo "Running $(BINARY_NAME)..."
	@if [ ! -f .env ]; then \
		echo "WARNING: .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@./$(BUILD_DIR)/$(BINARY_NAME)

## dev: Development mode (with auto-reload using air if installed, otherwise just run)
dev:
	@if [ ! -f .env ]; then \
		echo "WARNING: .env file not found. Copy .env.example to .env and configure it."; \
		exit 1; \
	fi
	@if command -v air > /dev/null; then \
		air; \
	else \
		echo "Air not found. Install with: go install github.com/cosmtrek/air@latest"; \
		echo "Running normally..."; \
		$(MAKE) run; \
	fi

## clean: Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -rf $(BUILD_DIR)
	@rm -f $(BINARY_NAME)
	@rm -f coverage.out coverage.html
	@find . -type f -name '*.test' -delete

## test: Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

## test-coverage: Run tests with coverage
test-coverage:
	@echo "Running tests with coverage..."
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "Coverage report saved to coverage.html"

## test-race: Run tests with race detection
test-race:
	@echo "Running tests with race detection..."
	@go test -v -race ./...

## test-bench: Run benchmarks
test-bench:
	@echo "Running benchmarks..."
	@go test -bench=. -benchmem ./...

## install: Install dependencies
install:
	@echo "Installing dependencies..."
	@go mod download
	@go mod verify

## fmt: Format code
fmt:
	@echo "Formatting code..."
	@go fmt ./...
	@echo "Running goimports..."
	@if command -v goimports > /dev/null; then \
		goimports -w .; \
	else \
		echo "goimports not installed. Install with: go install golang.org/x/tools/cmd/goimports@latest"; \
	fi

## lint: Run linter (requires golangci-lint)
lint:
	@echo "Running linter..."
	@if command -v golangci-lint > /dev/null; then \
		golangci-lint run --timeout 5m; \
	else \
		echo "golangci-lint not installed. Install from: https://golangci-lint.run/usage/install/"; \
		exit 1; \
	fi

## vet: Run go vet
vet:
	@echo "Running go vet..."
	@go vet ./...

## check: Run all checks (fmt, vet, lint, test)
check: fmt vet lint test
	@echo "All checks passed!"

## tidy: Tidy go.mod
tidy:
	@echo "Tidying go.mod..."
	@go mod tidy
	@go mod verify

## deps-update: Update dependencies
deps-update:
	@echo "Updating dependencies..."
	@go get -u ./...
	@go mod tidy
	@go mod verify

## deps-verify: Verify dependencies
deps-verify:
	@echo "Verifying dependencies..."
	@go mod verify
	@go mod download

## build-all: Build for all platforms
build-all: build-linux build-darwin build-windows
	@echo "Built for all platforms!"

## build-linux: Build for Linux
build-linux:
	@echo "Building for Linux..."
	@mkdir -p $(BUILD_DIR)
	@GOOS=linux GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux-amd64 ./cmd/server
	@GOOS=linux GOARCH=arm64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-linux-arm64 ./cmd/server

## build-darwin: Build for macOS
build-darwin:
	@echo "Building for macOS..."
	@mkdir -p $(BUILD_DIR)
	@GOOS=darwin GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-amd64 ./cmd/server
	@GOOS=darwin GOARCH=arm64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-darwin-arm64 ./cmd/server

## build-windows: Build for Windows
build-windows:
	@echo "Building for Windows..."
	@mkdir -p $(BUILD_DIR)
	@GOOS=windows GOARCH=amd64 go build $(LDFLAGS) -o $(BUILD_DIR)/$(BINARY_NAME)-windows-amd64.exe ./cmd/server

## setup: Initial project setup
setup:
	@echo "Setting up project..."
	@if [ ! -f .env ]; then \
		echo "Creating .env from .env.example..."; \
		cp .env.example .env; \
		echo "Please edit .env and add your PAYSTACK_SECRET_KEY"; \
	else \
		echo ".env already exists"; \
	fi
	@$(MAKE) install
	@echo "Setup complete!"

## env-check: Verify environment variables
env-check:
	@echo "Checking environment variables..."
	@if [ -z "$(PAYSTACK_SECRET_KEY)" ]; then \
		echo "ERROR: PAYSTACK_SECRET_KEY is not set"; \
		echo "Please set it in your .env file or export it:"; \
		echo "  export PAYSTACK_SECRET_KEY=sk_test_your_key_here"; \
		exit 1; \
	else \
		echo "✓ PAYSTACK_SECRET_KEY is set"; \
	fi

## install-tools: Install development tools
install-tools:
	@echo "Installing development tools..."
	@echo "Installing air (hot reload)..."
	@go install github.com/cosmtrek/air@latest
	@echo "Installing golangci-lint..."
	@go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
	@echo "Installing goimports..."
	@go install golang.org/x/tools/cmd/goimports@latest
	@echo "Installing staticcheck..."
	@go install honnef.co/go/tools/cmd/staticcheck@latest
	@echo "All tools installed!"

## docker-build: Build Docker image
docker-build:
	@echo "Building Docker image..."
	@docker build -t $(BINARY_NAME):$(VERSION) -t $(BINARY_NAME):latest .

## docker-run: Run Docker container
docker-run:
	@echo "Running Docker container..."
	@docker run -d --name $(BINARY_NAME) \
		-p 4000:4000 \
		-e PAYSTACK_SECRET_KEY=$(PAYSTACK_SECRET_KEY) \
		$(BINARY_NAME):latest

## docker-stop: Stop Docker container
docker-stop:
	@echo "Stopping Docker container..."
	@docker stop $(BINARY_NAME) || true
	@docker rm $(BINARY_NAME) || true

## docker-clean: Remove Docker image and containers
docker-clean: docker-stop
	@echo "Cleaning Docker images..."
	@docker rmi $(BINARY_NAME):latest $(BINARY_NAME):$(VERSION) || true
