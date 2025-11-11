package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/borderlesshq/paystack-go"
	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

var paystackClient *paystack.Client

func main() {
	apiKey := os.Getenv("PAYSTACK_SECRET_KEY")
	if apiKey == "" {
		log.Fatal("PAYSTACK_SECRET_KEY environment variable is required")
	}

	paystackClient = paystack.NewClient(apiKey, nil)

	s := server.NewMCPServer(
		"Paystack MCP Server",
		"1.0.0",
		server.WithToolCapabilities(true),
		server.WithLogging(),
	)

	registerAllTools(s)

	sse := server.NewSSEServer(s)
	if err := sse.Start(":4000"); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}

func registerAllTools(s *server.MCPServer) {
	registerCoreTools(s)
	registerCustomerTools(s)
	registerTransactionTools(s)
	registerTransferTools(s)
	registerPlanTools(s)
	registerSubscriptionTools(s)
	registerBankTools(s)
	registerChargeTools(s)
	registerSubAccountTools(s)
	registerSettlementTools(s)
	registerVirtualAccountTools(s)
	registerBulkChargeTools(s)
	registerPageTools(s)
}

func registerCoreTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_check_balance",
		Description: "Check available balance on your integration",
		InputSchema: mcp.ToolInputSchema{
			Type:       "object",
			Properties: map[string]interface{}{},
		},
	}, handleCheckBalance)
}

func registerCustomerTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_customer_create",
		Description: "Create a new customer",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"email": map[string]interface{}{
					"type":        "string",
					"description": "Customer email address",
				},
				"first_name": map[string]interface{}{
					"type":        "string",
					"description": "Customer first name",
				},
				"last_name": map[string]interface{}{
					"type":        "string",
					"description": "Customer last name",
				},
				"phone": map[string]interface{}{
					"type":        "string",
					"description": "Customer phone number",
				},
			},
			Required: []string{"email"},
		},
	}, handleCustomerCreate)

	s.AddTool(mcp.Tool{
		Name:        "paystack_customer_list",
		Description: "List customers with optional pagination",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"count": map[string]interface{}{
					"type":        "number",
					"description": "Number of customers to return (optional)",
				},
				"offset": map[string]interface{}{
					"type":        "number",
					"description": "Number of customers to skip (optional)",
				},
			},
		},
	}, handleCustomerList)
}

func registerTransactionTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_transaction_initialize",
		Description: "Initialize a transaction",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"email": map[string]interface{}{
					"type":        "string",
					"description": "Customer email",
				},
				"amount": map[string]interface{}{
					"type":        "number",
					"description": "Amount in kobo (NGN) or lowest currency unit",
				},
				"reference": map[string]interface{}{
					"type":        "string",
					"description": "Unique transaction reference (optional)",
				},
				"callback_url": map[string]interface{}{
					"type":        "string",
					"description": "Callback URL after payment",
				},
				"currency": map[string]interface{}{
					"type":        "string",
					"description": "Currency (NGN, USD, etc.)",
				},
			},
			Required: []string{"email", "amount"},
		},
	}, handleTransactionInitialize)

	s.AddTool(mcp.Tool{
		Name:        "paystack_transaction_verify",
		Description: "Verify a transaction",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"reference": map[string]interface{}{
					"type":        "string",
					"description": "Transaction reference",
				},
			},
			Required: []string{"reference"},
		},
	}, handleTransactionVerify)

	s.AddTool(mcp.Tool{
		Name:        "paystack_transaction_list",
		Description: "List transactions with optional pagination",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"count": map[string]interface{}{
					"type":        "number",
					"description": "Number of transactions to return (optional)",
				},
				"offset": map[string]interface{}{
					"type":        "number",
					"description": "Number of transactions to skip (optional)",
				},
			},
		},
	}, handleTransactionList)
}

func registerTransferTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_transfer_recipient_create",
		Description: "Create transfer recipient",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"type": map[string]interface{}{
					"type":        "string",
					"description": "Recipient type (nuban, mobile_money, etc.)",
				},
				"name": map[string]interface{}{
					"type":        "string",
					"description": "Recipient name",
				},
				"account_number": map[string]interface{}{
					"type":        "string",
					"description": "Account number",
				},
				"bank_code": map[string]interface{}{
					"type":        "string",
					"description": "Bank code",
				},
				"currency": map[string]interface{}{
					"type":        "string",
					"description": "Currency code",
				},
			},
			Required: []string{"type", "name", "account_number", "bank_code"},
		},
	}, handleTransferRecipientCreate)

	s.AddTool(mcp.Tool{
		Name:        "paystack_transfer_initiate",
		Description: "Initiate a transfer",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"source": map[string]interface{}{
					"type":        "string",
					"description": "Source of funds (balance)",
				},
				"amount": map[string]interface{}{
					"type":        "number",
					"description": "Amount in kobo",
				},
				"recipient": map[string]interface{}{
					"type":        "string",
					"description": "Recipient code",
				},
				"reason": map[string]interface{}{
					"type":        "string",
					"description": "Transfer reason/narration",
				},
			},
			Required: []string{"source", "amount", "recipient"},
		},
	}, handleTransferInitiate)
}

func registerPlanTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_plan_list",
		Description: "List subscription plans with optional pagination",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"count": map[string]interface{}{
					"type":        "number",
					"description": "Number of plans to return (optional)",
				},
				"offset": map[string]interface{}{
					"type":        "number",
					"description": "Number of plans to skip (optional)",
				},
			},
		},
	}, handlePlanList)
}

func registerSubscriptionTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_subscription_list",
		Description: "List subscriptions with optional pagination",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"count": map[string]interface{}{
					"type":        "number",
					"description": "Number of subscriptions to return (optional)",
				},
				"offset": map[string]interface{}{
					"type":        "number",
					"description": "Number of subscriptions to skip (optional)",
				},
			},
		},
	}, handleSubscriptionList)
}

func registerBankTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_bank_list",
		Description: "List all supported banks",
		InputSchema: mcp.ToolInputSchema{
			Type:       "object",
			Properties: map[string]interface{}{},
		},
	}, handleBankList)

	s.AddTool(mcp.Tool{
		Name:        "paystack_bank_resolve_account",
		Description: "Resolve account number to get account details",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"account_number": map[string]interface{}{
					"type":        "string",
					"description": "Account number",
				},
				"bank_code": map[string]interface{}{
					"type":        "string",
					"description": "Bank code",
				},
			},
			Required: []string{"account_number", "bank_code"},
		},
	}, handleBankResolveAccount)
}

func registerChargeTools(s *server.MCPServer) {
	// Placeholder for charge tools
}

func registerSubAccountTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_subaccount_list",
		Description: "List subaccounts with optional pagination",
		InputSchema: mcp.ToolInputSchema{
			Type: "object",
			Properties: map[string]interface{}{
				"count": map[string]interface{}{
					"type":        "number",
					"description": "Number of subaccounts to return (optional)",
				},
				"offset": map[string]interface{}{
					"type":        "number",
					"description": "Number of subaccounts to skip (optional)",
				},
			},
		},
	}, handleSubAccountList)
}

func registerSettlementTools(s *server.MCPServer) {
	// Placeholder for settlement tools
}

func registerVirtualAccountTools(s *server.MCPServer) {
	// Placeholder for virtual account tools
}

func registerBulkChargeTools(s *server.MCPServer) {
	// Placeholder for bulk charge tools
}

func registerPageTools(s *server.MCPServer) {
	// Placeholder for page tools
}

// ============================================================================
// HANDLERS
// ============================================================================

func handleCheckBalance(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	resp, err := paystackClient.CheckBalance()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(resp)
}

func handleCustomerCreate(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	email := request.GetString("email", "")
	if email == "" {
		return errorResult(fmt.Errorf("email is required")), nil
	}

	customer := &paystack.Customer{
		Email:     email,
		FirstName: request.GetString("first_name", ""),
		LastName:  request.GetString("last_name", ""),
		Phone:     request.GetString("phone", ""),
	}

	result, err := paystackClient.Customer.Create(customer)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleCustomerList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := paystackClient.Customer.ListN(count, offset)
		if err != nil {
			return errorResult(err), nil
		}
		return successResult(result)
	}

	result, err := paystackClient.Customer.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleTransactionInitialize(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	email := request.GetString("email", "")
	amount := request.GetInt("amount", 0)

	if email == "" || amount == 0 {
		return errorResult(fmt.Errorf("email and amount are required")), nil
	}

	txn := &paystack.TransactionRequest{
		Email:       email,
		Amount:      float64(amount),
		Reference:   request.GetString("reference", ""),
		CallbackURL: request.GetString("callback_url", ""),
		Currency:    request.GetString("currency", ""),
	}

	result, err := paystackClient.Transaction.Initialize(txn)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleTransactionVerify(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	reference := request.GetString("reference", "")
	if reference == "" {
		return errorResult(fmt.Errorf("reference is required")), nil
	}

	result, err := paystackClient.Transaction.Verify(reference)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleTransactionList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := paystackClient.Transaction.ListN(count, offset)
		if err != nil {
			return errorResult(err), nil
		}
		return successResult(result)
	}

	result, err := paystackClient.Transaction.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleTransferRecipientCreate(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	recipientType := request.GetString("type", "")
	name := request.GetString("name", "")
	accountNumber := request.GetString("account_number", "")
	bankCode := request.GetString("bank_code", "")

	if recipientType == "" || name == "" || accountNumber == "" || bankCode == "" {
		return errorResult(fmt.Errorf("type, name, account_number, and bank_code are required")), nil
	}

	recipient := &paystack.TransferRecipient{
		Type:          recipientType,
		Name:          name,
		AccountNumber: accountNumber,
		BankCode:      bankCode,
		Currency:      request.GetString("currency", "NGN"),
	}

	result, err := paystackClient.Transfer.CreateRecipient(recipient)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleTransferInitiate(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	source := request.GetString("source", "")
	amount := request.GetInt("amount", 0)
	recipient := request.GetString("recipient", "")

	if source == "" || amount == 0 || recipient == "" {
		return errorResult(fmt.Errorf("source, amount, and recipient are required")), nil
	}

	req := &paystack.TransferRequest{
		Source:    source,
		Amount:    float32(amount),
		Recipient: recipient,
		Reason:    request.GetString("reason", ""),
	}

	result, err := paystackClient.Transfer.Initiate(req)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handlePlanList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := paystackClient.Plan.ListN(count, offset)
		if err != nil {
			return errorResult(err), nil
		}
		return successResult(result)
	}

	result, err := paystackClient.Plan.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleSubscriptionList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := paystackClient.Subscription.ListN(count, offset)
		if err != nil {
			return errorResult(err), nil
		}
		return successResult(result)
	}

	result, err := paystackClient.Subscription.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleBankList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	result, err := paystackClient.Bank.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleBankResolveAccount(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	accountNumber := request.GetString("account_number", "")
	bankCode := request.GetString("bank_code", "")

	if accountNumber == "" || bankCode == "" {
		return errorResult(fmt.Errorf("account_number and bank_code are required")), nil
	}

	result, err := paystackClient.Bank.ResolveAccountNumber(accountNumber, bankCode)
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

func handleSubAccountList(_ context.Context, request mcp.CallToolRequest) (*mcp.CallToolResult, error) {
	count := request.GetInt("count", 0)
	offset := request.GetInt("offset", 0)

	if count > 0 {
		result, err := paystackClient.SubAccount.ListN(count, offset)
		if err != nil {
			return errorResult(err), nil
		}
		return successResult(result)
	}

	result, err := paystackClient.SubAccount.List()
	if err != nil {
		return errorResult(err), nil
	}
	return successResult(result)
}

// ============================================================================
// HELPERS
// ============================================================================

func successResult(data interface{}) (*mcp.CallToolResult, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return errorResult(err), nil
	}

	return &mcp.CallToolResult{
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: string(jsonData),
			},
		},
	}, nil
}

func errorResult(err error) *mcp.CallToolResult {
	return &mcp.CallToolResult{
		Content: []mcp.Content{
			mcp.TextContent{
				Type: "text",
				Text: fmt.Sprintf("Error: %v", err),
			},
		},
		IsError: true,
	}
}
