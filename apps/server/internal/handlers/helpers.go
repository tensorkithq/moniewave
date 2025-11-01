package handlers

import (
	"encoding/json"
	"fmt"

	"github.com/mark3labs/mcp-go/mcp"
)

// SuccessResult creates a successful MCP tool result
func SuccessResult(data interface{}) (*mcp.CallToolResult, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return ErrorResult(err), nil
	}

	return &mcp.CallToolResult{
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: string(jsonData),
			},
		},
	}, nil
}

// ErrorResult creates an error MCP tool result
func ErrorResult(err error) *mcp.CallToolResult {
	return &mcp.CallToolResult{
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: fmt.Sprintf("Error: %v", err),
			},
		},
		IsError: true,
	}
}
