package handlers

import (
	"context"

	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
)

type SubAccountHandler struct {
	client *paystack.Client
}

func NewSubAccountHandler(client *paystack.Client) *SubAccountHandler {
	return &SubAccountHandler{client: client}
}

func (h *SubAccountHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := h.client.SubAccount.ListN(count, offset)
		if err != nil {
			return ErrorResult(err), nil
		}
		return SuccessResult(result)
	}

	result, err := h.client.SubAccount.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
