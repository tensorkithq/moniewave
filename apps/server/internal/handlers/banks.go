package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"paystack.mpc.proxy/internal/paystack"
)

type BankHandler struct {
	client *paystack.Client
}

func NewBankHandler(client *paystack.Client) *BankHandler {
	return &BankHandler{client: client}
}

type ResolveAccountRequest struct {
	AccountNumber string `json:"account_number"`
	BankCode      string `json:"bank_code"`
}

func (h *BankHandler) List(w http.ResponseWriter, r *http.Request) {
	result, err := h.client.Bank.List()
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to list banks: %w", err), http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, result)
}

func (h *BankHandler) ResolveAccount(w http.ResponseWriter, r *http.Request) {
	var req ResolveAccountRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteJSONBadRequest(w, "Invalid request body")
		return
	}

	if req.AccountNumber == "" || req.BankCode == "" {
		WriteJSONBadRequest(w, "account_number and bank_code are required")
		return
	}

	result, err := h.client.Bank.ResolveAccountNumber(req.AccountNumber, req.BankCode)
	if err != nil {
		WriteJSONError(w, err, http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, result)
}
