package handlers

import (
	"context"
	"fmt"

	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
)

type CoreHandler struct {
	client *paystack.Client
}

func NewCoreHandler(client *paystack.Client) *CoreHandler {
	return &CoreHandler{client: client}
}

func (h *CoreHandler) CheckBalance(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	resp, err := h.client.SafeCheckBalance()
	if err != nil {
		return ErrorResult(fmt.Errorf("failed to check balance: %w", err)), nil
	}
	return SuccessResult(resp)
}
