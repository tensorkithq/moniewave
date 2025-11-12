package handlers

import (
	"context"

	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
)

type PlanHandler struct {
	client *paystack.Client
}

func NewPlanHandler(client *paystack.Client) *PlanHandler {
	return &PlanHandler{client: client}
}

func (h *PlanHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := h.client.Plan.ListN(count, offset)
		if err != nil {
			return ErrorResult(err), nil
		}
		return SuccessResult(result)
	}

	result, err := h.client.Plan.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
