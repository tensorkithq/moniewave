package handlers

import (
	"context"
	"fmt"

	"paystack.mpc.proxy/internal/paystack"

	paystackSDK "github.com/borderlesshq/paystack-go"
	"github.com/mark3labs/mcp-go/mcp"
)

type TransferHandler struct {
	client *paystack.Client
}

func NewTransferHandler(client *paystack.Client) *TransferHandler {
	return &TransferHandler{client: client}
}

func (h *TransferHandler) CreateRecipient(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	recipientType := request.GetString("type", "")
	name := request.GetString("name", "")
	accountNumber := request.GetString("account_number", "")
	bankCode := request.GetString("bank_code", "")

	if recipientType == "" || name == "" || accountNumber == "" || bankCode == "" {
		return ErrorResult(fmt.Errorf("type, name, account_number, and bank_code are required")), nil
	}

	recipient := &paystackSDK.TransferRecipient{
		Type:          recipientType,
		Name:          name,
		AccountNumber: accountNumber,
		BankCode:      bankCode,
		Currency:      request.GetString("currency", "NGN"),
	}

	result, err := h.client.Transfer.CreateRecipient(recipient)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}

func (h *TransferHandler) Initiate(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	source := request.GetString("source", "")
	amount := request.GetInt("amount", 0)
	recipient := request.GetString("recipient", "")

	if source == "" || amount == 0 || recipient == "" {
		return ErrorResult(fmt.Errorf("source, amount, and recipient are required")), nil
	}

	req := &paystackSDK.TransferRequest{
		Source:    source,
		Amount:    float32(amount),
		Recipient: recipient,
		Reason:    request.GetString("reason", ""),
	}

	result, err := h.client.Transfer.Initiate(req)
	if err != nil {
		return ErrorResult(err), nil
	}
	return SuccessResult(result)
}
