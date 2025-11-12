package tools

import (
	"paystack.mpc.proxy/internal/handlers"
	"paystack.mpc.proxy/internal/paystack"

	"github.com/mark3labs/mcp-go/mcp"
	"github.com/mark3labs/mcp-go/server"
)

// Registry manages all MCP tools
type Registry struct {
	coreHandler         *handlers.CoreHandler
	customerHandler     *handlers.CustomerHandler
	transactionHandler  *handlers.TransactionHandler
	transferHandler     *handlers.TransferHandler
	planHandler         *handlers.PlanHandler
	subscriptionHandler *handlers.SubscriptionHandler
	bankHandler         *handlers.BankHandler
	subAccountHandler   *handlers.SubAccountHandler
}

// NewRegistry creates a new tool registry
func NewRegistry(client *paystack.Client) *Registry {
	return &Registry{
		coreHandler:         handlers.NewCoreHandler(client),
		customerHandler:     handlers.NewCustomerHandler(client),
		transactionHandler:  handlers.NewTransactionHandler(client),
		transferHandler:     handlers.NewTransferHandler(client),
		planHandler:         handlers.NewPlanHandler(client),
		subscriptionHandler: handlers.NewSubscriptionHandler(client),
		bankHandler:         handlers.NewBankHandler(client),
		subAccountHandler:   handlers.NewSubAccountHandler(client),
	}
}

// RegisterAll registers all tools with the MCP server
func (r *Registry) RegisterAll(s *server.MCPServer) {
	r.registerCoreTools(s)
	r.registerCustomerTools(s)
	r.registerTransactionTools(s)
	r.registerTransferTools(s)
	r.registerPlanTools(s)
	r.registerSubscriptionTools(s)
	r.registerBankTools(s)
	r.registerSubAccountTools(s)
}

func (r *Registry) registerCoreTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_check_balance",
		Description: "Check available balance on your integration",
		InputSchema: mcp.ToolInputSchema{
			Type:       "object",
			Properties: map[string]interface{}{},
		},
	}, r.coreHandler.CheckBalance)
}

func (r *Registry) registerCustomerTools(s *server.MCPServer) {
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
	}, r.customerHandler.Create)

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
	}, r.customerHandler.List)
}

func (r *Registry) registerTransactionTools(s *server.MCPServer) {
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
	}, r.transactionHandler.Initialize)

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
	}, r.transactionHandler.Verify)

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
	}, r.transactionHandler.List)
}

func (r *Registry) registerTransferTools(s *server.MCPServer) {
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
	}, r.transferHandler.CreateRecipient)

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
	}, r.transferHandler.Initiate)
}

func (r *Registry) registerPlanTools(s *server.MCPServer) {
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
	}, r.planHandler.List)
}

func (r *Registry) registerSubscriptionTools(s *server.MCPServer) {
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
	}, r.subscriptionHandler.List)
}

func (r *Registry) registerBankTools(s *server.MCPServer) {
	s.AddTool(mcp.Tool{
		Name:        "paystack_bank_list",
		Description: "List all supported banks",
		InputSchema: mcp.ToolInputSchema{
			Type:       "object",
			Properties: map[string]interface{}{},
		},
	}, r.bankHandler.List)

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
	}, r.bankHandler.ResolveAccount)
}

func (r *Registry) registerSubAccountTools(s *server.MCPServer) {
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
	}, r.subAccountHandler.List)
}
