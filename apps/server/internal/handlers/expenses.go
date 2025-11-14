package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"paystack.mpc.proxy/internal/database"

	"github.com/go-chi/chi/v5"
)

type ExpenseHandler struct{}

func NewExpenseHandler() *ExpenseHandler {
	return &ExpenseHandler{}
}

// Expense represents an expense record
type Expense struct {
	ID            int       `json:"id"`
	RecipientCode string    `json:"recipient_code"`
	RecipientName string    `json:"recipient_name"`
	Amount        int       `json:"amount"`
	Currency      string    `json:"currency"`
	Category      string    `json:"category"`
	Description   string    `json:"description"`
	Reference     string    `json:"reference"`
	Status        string    `json:"status"`
	PaymentDate   *time.Time `json:"payment_date"`
	Notes         string    `json:"notes"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type CreateExpenseRequest struct {
	RecipientCode string `json:"recipient_code"`
	Amount        int    `json:"amount"`
	Currency      string `json:"currency,omitempty"`
	Category      string `json:"category,omitempty"`
	Description   string `json:"description"`
	Reference     string `json:"reference,omitempty"`
	Notes         string `json:"notes,omitempty"`
}

type UpdateExpenseRequest struct {
	Category    string     `json:"category,omitempty"`
	Description string     `json:"description,omitempty"`
	Status      string     `json:"status,omitempty"`
	PaymentDate *time.Time `json:"payment_date,omitempty"`
	Notes       string     `json:"notes,omitempty"`
}

type ListExpensesRequest struct {
	RecipientCode string `json:"recipient_code,omitempty"`
	Category      string `json:"category,omitempty"`
	Status        string `json:"status,omitempty"`
	From          string `json:"from,omitempty"`
	To            string `json:"to,omitempty"`
	Count         int    `json:"count,omitempty"`
	Offset        int    `json:"offset,omitempty"`
}

// Create creates a new expense
func (h *ExpenseHandler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateExpenseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteJSONBadRequest(w, "Invalid request body")
		return
	}

	// Validate required fields
	if req.RecipientCode == "" {
		WriteJSONBadRequest(w, "recipient_code is required")
		return
	}

	if req.Amount <= 0 {
		WriteJSONBadRequest(w, "amount must be greater than 0")
		return
	}

	if req.Description == "" {
		WriteJSONBadRequest(w, "description is required")
		return
	}

	// Set default currency
	if req.Currency == "" {
		req.Currency = "NGN"
	}

	// Verify recipient exists
	var recipientName string
	err := database.DB.QueryRow("SELECT name FROM recipients WHERE recipient_code = ?", req.RecipientCode).Scan(&recipientName)
	if err != nil {
		WriteJSONError(w, fmt.Errorf("recipient not found: %s", req.RecipientCode), http.StatusNotFound)
		return
	}

	// Generate reference if not provided
	reference := req.Reference
	if reference == "" {
		reference = fmt.Sprintf("EXP_%d", time.Now().Unix())
	}

	// Insert expense
	query := `
		INSERT INTO expenses (recipient_code, recipient_name, amount, currency, category, description, reference, status, notes, created_at, updated_at)
		VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
	`

	now := time.Now()
	result, err := database.DB.Exec(
		query,
		req.RecipientCode,
		recipientName,
		req.Amount,
		req.Currency,
		req.Category,
		req.Description,
		reference,
		req.Notes,
		now,
		now,
	)

	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to create expense: %w", err), http.StatusInternalServerError)
		return
	}

	id, _ := result.LastInsertId()

	// Return created expense
	expense := Expense{
		ID:            int(id),
		RecipientCode: req.RecipientCode,
		RecipientName: recipientName,
		Amount:        req.Amount,
		Currency:      req.Currency,
		Category:      req.Category,
		Description:   req.Description,
		Reference:     reference,
		Status:        "pending",
		Notes:         req.Notes,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	WriteJSONSuccess(w, expense)
}

// List lists expenses with optional filters
func (h *ExpenseHandler) List(w http.ResponseWriter, r *http.Request) {
	var req ListExpensesRequest
	if r.Body != http.NoBody {
		json.NewDecoder(r.Body).Decode(&req)
	}

	// Build query with filters
	query := `SELECT id, recipient_code, recipient_name, amount, currency, category, description, reference, status, payment_date, notes, created_at, updated_at FROM expenses WHERE 1=1`
	args := []interface{}{}

	// Add filters
	if req.RecipientCode != "" {
		query += " AND recipient_code = ?"
		args = append(args, req.RecipientCode)
	}

	if req.Category != "" {
		query += " AND category = ?"
		args = append(args, req.Category)
	}

	if req.Status != "" {
		query += " AND status = ?"
		args = append(args, req.Status)
	}

	if req.From != "" {
		query += " AND created_at >= ?"
		args = append(args, req.From)
	}

	if req.To != "" {
		query += " AND created_at <= ?"
		args = append(args, req.To)
	}

	// Add ordering
	query += " ORDER BY created_at DESC"

	// Add pagination
	if req.Count > 0 {
		query += " LIMIT ? OFFSET ?"
		args = append(args, req.Count, req.Offset)
	}

	rows, err := database.DB.Query(query, args...)
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to query expenses: %w", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	expenses := []Expense{}
	for rows.Next() {
		var expense Expense
		var category, notes sql.NullString
		var paymentDate sql.NullTime

		err := rows.Scan(
			&expense.ID,
			&expense.RecipientCode,
			&expense.RecipientName,
			&expense.Amount,
			&expense.Currency,
			&category,
			&expense.Description,
			&expense.Reference,
			&expense.Status,
			&paymentDate,
			&notes,
			&expense.CreatedAt,
			&expense.UpdatedAt,
		)
		if err != nil {
			WriteJSONError(w, fmt.Errorf("failed to scan expense: %w", err), http.StatusInternalServerError)
			return
		}

		if category.Valid {
			expense.Category = category.String
		}
		if notes.Valid {
			expense.Notes = notes.String
		}
		if paymentDate.Valid {
			expense.PaymentDate = &paymentDate.Time
		}

		expenses = append(expenses, expense)
	}

	if err = rows.Err(); err != nil {
		WriteJSONError(w, fmt.Errorf("error iterating expenses: %w", err), http.StatusInternalServerError)
		return
	}

	WriteJSONSuccess(w, expenses)
}

// Get retrieves a specific expense by ID
func (h *ExpenseHandler) Get(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		WriteJSONBadRequest(w, "id is required")
		return
	}

	query := `
		SELECT id, recipient_code, recipient_name, amount, currency, category, description, reference, status, payment_date, notes, created_at, updated_at
		FROM expenses
		WHERE id = ?
	`

	var expense Expense
	var category, notes sql.NullString
	var paymentDate sql.NullTime

	err := database.DB.QueryRow(query, id).Scan(
		&expense.ID,
		&expense.RecipientCode,
		&expense.RecipientName,
		&expense.Amount,
		&expense.Currency,
		&category,
		&expense.Description,
		&expense.Reference,
		&expense.Status,
		&paymentDate,
		&notes,
		&expense.CreatedAt,
		&expense.UpdatedAt,
	)

	if err != nil {
		WriteJSONError(w, fmt.Errorf("expense not found: %s", id), http.StatusNotFound)
		return
	}

	if category.Valid {
		expense.Category = category.String
	}
	if notes.Valid {
		expense.Notes = notes.String
	}
	if paymentDate.Valid {
		expense.PaymentDate = &paymentDate.Time
	}

	WriteJSONSuccess(w, expense)
}

// Update updates an existing expense
func (h *ExpenseHandler) Update(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")
	if id == "" {
		WriteJSONBadRequest(w, "id is required")
		return
	}

	var req UpdateExpenseRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		WriteJSONBadRequest(w, "Invalid request body")
		return
	}

	// Build dynamic update query
	updates := []string{}
	args := []interface{}{}

	if req.Category != "" {
		updates = append(updates, "category = ?")
		args = append(args, req.Category)
	}

	if req.Description != "" {
		updates = append(updates, "description = ?")
		args = append(args, req.Description)
	}

	if req.Status != "" {
		updates = append(updates, "status = ?")
		args = append(args, req.Status)
	}

	if req.PaymentDate != nil {
		updates = append(updates, "payment_date = ?")
		args = append(args, req.PaymentDate)
	}

	if req.Notes != "" {
		updates = append(updates, "notes = ?")
		args = append(args, req.Notes)
	}

	if len(updates) == 0 {
		WriteJSONBadRequest(w, "no fields to update")
		return
	}

	// Add updated_at
	updates = append(updates, "updated_at = ?")
	args = append(args, time.Now())

	// Add id to args
	args = append(args, id)

	query := fmt.Sprintf("UPDATE expenses SET %s WHERE id = ?", joinStrings(updates, ", "))

	result, err := database.DB.Exec(query, args...)
	if err != nil {
		WriteJSONError(w, fmt.Errorf("failed to update expense: %w", err), http.StatusInternalServerError)
		return
	}

	rowsAffected, _ := result.RowsAffected()
	if rowsAffected == 0 {
		WriteJSONError(w, fmt.Errorf("expense not found: %s", id), http.StatusNotFound)
		return
	}

	// Retrieve updated expense
	h.Get(w, r)
}


// Helper function to join strings
func joinStrings(strs []string, sep string) string {
	if len(strs) == 0 {
		return ""
	}
	result := strs[0]
	for i := 1; i < len(strs); i++ {
		result += sep + strs[i]
	}
	return result
}
