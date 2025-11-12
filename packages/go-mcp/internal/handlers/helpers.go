package handlers

import (
	"fmt"

	"paystack.mpc.proxy/internal/dto"

	"github.com/mark3labs/mcp-go/mcp"
)

var encoder = dto.NewEncoder()

// SuccessResult creates a successful MCP tool result with both structured JSON and TOON-encoded text
func SuccessResult(data interface{}) (*mcp.CallToolResult, error) {
	// Create structured response
	response := dto.Response{
		Status:  true,
		Message: "Success",
		Data:    data,
	}

	// Encode to TOON for human-readable fallback
	toonData, err := encoder.Encode(response)
	if err != nil {
		// Fallback to basic text if TOON encoding fails
		toonData = fmt.Sprintf("Success: %+v", data)
	}

	return &mcp.CallToolResult{
		// Structured content for programmatic access (JSON)
		StructuredContent: response,
		// TOON-encoded text for LLM consumption (token efficient)
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: toonData,
			},
		},
	}, nil
}

// ErrorResult creates an error MCP tool result with both structured JSON and TOON-encoded text
func ErrorResult(err error) *mcp.CallToolResult {
	// Create structured error response
	errResponse := dto.ErrorResponse{
		Status:  false,
		Message: "Error",
		Error:   err.Error(),
	}

	// Encode to TOON for human-readable fallback
	toonData, encErr := encoder.Encode(errResponse)
	if encErr != nil {
		// Fallback to plain text if TOON encoding fails
		toonData = fmt.Sprintf("Error: %v", err)
	}

	return &mcp.CallToolResult{
		// Structured content for programmatic access (JSON)
		StructuredContent: errResponse,
		// TOON-encoded text for LLM consumption (token efficient)
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: toonData,
			},
		},
		IsError: true,
	}
}
