package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"paystack.mpc.proxy/internal/paystack"
)

type SubAccountHandler struct {
	client *paystack.Client
}

func NewSubAccountHandler(client *paystack.Client) *SubAccountHandler {
	return &SubAccountHandler{client: client}
}

func (h *SubAccountHandler) List(w http.ResponseWriter, r *http.Request) {
	var req ListRequest
	if r.Body != http.NoBody {
		json.NewDecoder(r.Body).Decode(&req)
	}

	if req.Count > 0 {
		result, err := h.client.SubAccount.ListN(req.Count, req.Offset)
		if err != nil {
			WriteJSONError(w, err, http.StatusInternalServerError)
			return
		}
		WriteJSONSuccess(w, result)
		return
	}

	result, err := h.client.SubAccount.List()
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to list subaccounts: %w", err), http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, result)
}
