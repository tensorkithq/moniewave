package handlers

import (
	"context"
	"fmt"

	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
)

type BankHandler struct {
	client *paystack.Client
}

func NewBankHandler(client *paystack.Client) *BankHandler {
	return &BankHandler{client: client}
}

func (h *BankHandler) List(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	result, err := h.client.Bank.List()
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}

func (h *BankHandler) ResolveAccount(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	accountNumber := request.GetString("account_number", "")
	bankCode := request.GetString("bank_code", "")

	if accountNumber == "" || bankCode == "" {
		return ErrorResult(fmt.Errorf("account_number and bank_code are required")), nil
	}

	result, err := h.client.Bank.ResolveAccountNumber(accountNumber, bankCode)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
