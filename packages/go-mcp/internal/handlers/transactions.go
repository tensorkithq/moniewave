package handlers

import (
	"context"
	"fmt"

	"paystack.mpc.proxy/internal/paystack"

	paystackSDK "github.com/borderlesshq/paystack-go"
	"github.com/mark3labs/mcp-go/mcp"
)

type TransactionHandler struct {
	client *paystack.Client
}

func NewTransactionHandler(client *paystack.Client) *TransactionHandler {
	return &TransactionHandler{client: client}
}

func (h *TransactionHandler) Initialize(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	email := request.GetString("email", "")
	amount := request.GetInt("amount", 0)

	if email == "" || amount == 0 {
		return ErrorResult(fmt.Errorf("email and amount are required")), nil
	}

	txn := &paystackSDK.TransactionRequest{
		Email:       email,
		Amount:      float64(amount),
		Reference:   request.GetString("reference", ""),
		CallbackURL: request.GetString("callback_url", ""),
		Currency:    request.GetString("currency", ""),
	}

	result, err := h.client.Transaction.Initialize(txn)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}

func (h *TransactionHandler) Verify(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	reference := request.GetString("reference", "")
	if reference == "" {
		return ErrorResult(fmt.Errorf("reference is required")), nil
	}

	result, err := h.client.Transaction.Verify(reference)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}

func (h *TransactionHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := h.client.Transaction.ListN(count, offset)
		if err != nil {
			return ErrorResult(err), nil
		}
		return SuccessResult(result)
	}

	result, err := h.client.Transaction.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
