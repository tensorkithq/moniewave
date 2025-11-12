package handlers

import (
	"context"
	"fmt"

	"paystack.mpc.proxy/internal/paystack"

	paystackSDK "github.com/borderlesshq/paystack-go"
	"github.com/mark3labs/mcp-go/mcp"
)

type CustomerHandler struct {
	client *paystack.Client
}

func NewCustomerHandler(client *paystack.Client) *CustomerHandler {
	return &CustomerHandler{client: client}
}

func (h *CustomerHandler) Create(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	email := request.GetString("email", "")
	if email == "" {
		return ErrorResult(fmt.Errorf("email is required")), nil
	}

	customer := &paystackSDK.Customer{
		Email:     email,
		FirstName: request.GetString("first_name", ""),
		LastName:  request.GetString("last_name", ""),
		Phone:     request.GetString("phone", ""),
	}

	result, err := h.client.Customer.Create(customer)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}

func (h *CustomerHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := h.client.Customer.ListN(count, offset)
		if err != nil {
			return ErrorResult(err), nil
		}
		return SuccessResult(result)
	}

	result, err := h.client.Customer.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
