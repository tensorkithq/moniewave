package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"paystack.mpc.proxy/internal/paystack"
)

type SubscriptionHandler struct {
	client *paystack.Client
}

func NewSubscriptionHandler(client *paystack.Client) *SubscriptionHandler {
	return &SubscriptionHandler{client: client}
}

func (h *SubscriptionHandler) List(w http.ResponseWriter, r *http.Request) {
	var req ListRequest
	if r.Body != http.NoBody {
		json.NewDecoder(r.Body).Decode(&req)
	}

	if req.Count > 0 {
		result, err := h.client.Subscription.ListN(req.Count, req.Offset)
		if err != nil {
			WriteJSONError(w, err, http.StatusInternalServerError)
			return
		}
		WriteJSONSuccess(w, result)
		return
	}

	result, err := h.client.Subscription.List()
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to list subscriptions: %w", err), http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, result)
}
