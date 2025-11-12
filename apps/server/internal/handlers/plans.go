package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"

	"paystack.mpc.proxy/internal/paystack"
)

type PlanHandler struct {
	client *paystack.Client
}

func NewPlanHandler(client *paystack.Client) *PlanHandler {
	return &PlanHandler{client: client}
}

func (h *PlanHandler) List(w http.ResponseWriter, r *http.Request) {
	var req ListRequest
	if r.Body != http.NoBody {
		json.NewDecoder(r.Body).Decode(&req)
	}

	if req.Count > 0 {
		result, err := h.client.Plan.ListN(req.Count, req.Offset)
		if err != nil {
			WriteJSONError(w, err, http.StatusInternalServerError)
			return
		}
		WriteJSONSuccess(w, result)
		return
	}

	result, err := h.client.Plan.List()
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to list plans: %w", err), http.StatusInternalServerError)
		return
	}
	WriteJSONSuccess(w, result)
}
