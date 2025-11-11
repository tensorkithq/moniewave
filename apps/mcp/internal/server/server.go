package server

import (
	"log"

	"paystack.mpc.proxy/internal/config"
	"paystack.mpc.proxy/internal/paystack"
	"paystack.mpc.proxy/internal/tools"

	"github.com/mark3labs/mcp-go/server"
)

// Server wraps the MCP server
type Server struct {
	mcp    *server.MCPServer
	config *config.Config
}

// New creates a new MCP server instance
func New(cfg *config.Config) *Server {
	// Create Paystack client
	client := paystack.NewClient(cfg.PaystackSecretKey)

	// Create MCP server
	mcpServer := server.NewMCPServer(
		"Paystack MCP Server",
		"1.0.0",
		server.WithToolCapabilities(true),
		server.WithLogging(),
	)

	// Register all tools
	registry := tools.NewRegistry(client)
	registry.RegisterAll(mcpServer)

	return &Server{
		mcp:    mcpServer,
		config: cfg,
	}
}

// Start starts the SSE server
func (s *Server) Start() error {
	sse := server.NewSSEServer(s.mcp)
	addr := ":" + s.config.ServerPort
	log.Printf("Starting Paystack MCP Server on %s", addr)
	return sse.Start(addr)
}
