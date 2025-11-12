package handlers

import (
	"context"

	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
)

type SubscriptionHandler struct {
	client *paystack.Client
}

func NewSubscriptionHandler(client *paystack.Client) *SubscriptionHandler {
	return &SubscriptionHandler{client: client}
}

func (h *SubscriptionHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := h.client.Subscription.ListN(count, offset)
		if err != nil {
			return ErrorResult(err), nil
		}
		return SuccessResult(result)
	}

	result, err := h.client.Subscription.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
