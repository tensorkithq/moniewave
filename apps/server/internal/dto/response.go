package dto

import (
	"time"
)

// Response is the base response structure for all API responses
type Response struct {
	Status  bool        `json:"status" toon:"status"`
	Message string      `json:"message" toon:"message"`
	Data    interface{} `json:"data,omitempty" toon:"data,omitempty"`
}

// ErrorResponse represents an error response
type ErrorResponse struct {
	Status  bool   `json:"status" toon:"status"`
	Message string `json:"message" toon:"message"`
	Error   string `json:"error,omitempty" toon:"error,omitempty"`
}

// BalanceResponse represents a balance check response
type BalanceResponse struct {
	Balance  float64 `json:"balance" toon:"balance"`
	Currency string  `json:"currency" toon:"currency"`
}

// CustomerResponse represents a customer
type CustomerResponse struct {
	ID           int64     `json:"id" toon:"id"`
	Email        string    `json:"email" toon:"email"`
	FirstName    string    `json:"first_name,omitempty" toon:"first_name,omitempty"`
	LastName     string    `json:"last_name,omitempty" toon:"last_name,omitempty"`
	Phone        string    `json:"phone,omitempty" toon:"phone,omitempty"`
	CustomerCode string    `json:"customer_code" toon:"customer_code"`
	CreatedAt    time.Time `json:"created_at" toon:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" toon:"updated_at"`
}

// TransactionResponse represents a transaction
type TransactionResponse struct {
	ID              int64     `json:"id" toon:"id"`
	Reference       string    `json:"reference" toon:"reference"`
	Amount          float64   `json:"amount" toon:"amount"`
	Currency        string    `json:"currency" toon:"currency"`
	Status          string    `json:"status" toon:"status"`
	Email           string    `json:"email" toon:"email"`
	AuthorizationURL string   `json:"authorization_url,omitempty" toon:"authorization_url,omitempty"`
	AccessCode      string    `json:"access_code,omitempty" toon:"access_code,omitempty"`
	CreatedAt       time.Time `json:"created_at" toon:"created_at"`
}

// TransferResponse represents a transfer
type TransferResponse struct {
	ID            int64     `json:"id" toon:"id"`
	Amount        float64   `json:"amount" toon:"amount"`
	Currency      string    `json:"currency" toon:"currency"`
	Status        string    `json:"status" toon:"status"`
	Reference     string    `json:"reference" toon:"reference"`
	Recipient     string    `json:"recipient" toon:"recipient"`
	TransferCode  string    `json:"transfer_code" toon:"transfer_code"`
	CreatedAt     time.Time `json:"created_at" toon:"created_at"`
}

// BankResponse represents a bank
type BankResponse struct {
	ID       int64  `json:"id" toon:"id"`
	Name     string `json:"name" toon:"name"`
	Code     string `json:"code" toon:"code"`
	Currency string `json:"currency" toon:"currency"`
	Country  string `json:"country" toon:"country"`
}

// PlanResponse represents a subscription plan
type PlanResponse struct {
	ID          int64  `json:"id" toon:"id"`
	Name        string `json:"name" toon:"name"`
	PlanCode    string `json:"plan_code" toon:"plan_code"`
	Amount      int64  `json:"amount" toon:"amount"`
	Interval    string `json:"interval" toon:"interval"`
	Currency    string `json:"currency" toon:"currency"`
	Description string `json:"description,omitempty" toon:"description,omitempty"`
}

// SubscriptionResponse represents a subscription
type SubscriptionResponse struct {
	ID                 int64     `json:"id" toon:"id"`
	SubscriptionCode   string    `json:"subscription_code" toon:"subscription_code"`
	EmailToken         string    `json:"email_token" toon:"email_token"`
	Amount             int64     `json:"amount" toon:"amount"`
	Status             string    `json:"status" toon:"status"`
	NextPaymentDate    time.Time `json:"next_payment_date" toon:"next_payment_date"`
	CreatedAt          time.Time `json:"created_at" toon:"created_at"`
}

// PaginatedResponse represents a paginated list response
type PaginatedResponse struct {
	Status  bool        `json:"status" toon:"status"`
	Message string      `json:"message" toon:"message"`
	Data    interface{} `json:"data" toon:"data"`
	Meta    MetaData    `json:"meta" toon:"meta"`
}

// MetaData represents pagination metadata
type MetaData struct {
	Total     int `json:"total" toon:"total"`
	Page      int `json:"page" toon:"page"`
	PageCount int `json:"page_count" toon:"page_count"`
}
