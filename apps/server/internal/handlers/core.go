package handlers

import (
	"fmt"
	"net/http"

	"paystack.mpc.proxy/internal/paystack"
)

type CoreHandler struct {
	client *paystack.Client
}

func NewCoreHandler(client *paystack.Client) *CoreHandler {
	return &CoreHandler{client: client}
}

func (h *CoreHandler) CheckBalance(w http.ResponseWriter, r *http.Request) {
	resp, err := h.client.SafeCheckBalance()
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to check balance: %w", err), http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, resp)
}
