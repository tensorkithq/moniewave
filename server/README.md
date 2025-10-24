# Paystack MCP Server

A Model Context Protocol (MCP) server implementation for the Paystack payment API. This server provides MCP tools for core Paystack operations with correct handler signatures using `mcp.CallToolRequest`.

## Features

- ✅ **Core Operations**: Customer, Transaction, Transfer, Plan, Subscription, Bank, and SubAccount operations
- ✅ **Type-Safe**: Built with Go using the official `paystack-go` SDK
- ✅ **Correct MCP Types**: Uses proper `mcp.CallToolRequest` handler signatures
- ✅ **Production-Ready**: Proper error handling and JSON response formatting
- ✅ **Easy Integration**: Standard MCP protocol over stdio
- ✅ **Extensible**: Easy to add more tools following the established pattern

## Installation

### Prerequisites

- Go 1.23.0 or higher
- A Paystack account with API keys

### Setup

1. Clone this repository:
```bash
git clone <your-repo-url>
cd paystack-mpc-proxy
```

2. Install dependencies:
```bash
go mod download
```

3. Set your Paystack API key:
```bash
export PAYSTACK_SECRET_KEY="sk_test_your_secret_key_here"
```

4. Build the server:
```bash
go build -o paystack-mcp-server main.go
```

## Usage

### Running the Server

```bash
PAYSTACK_SECRET_KEY="sk_test_your_secret_key" ./paystack-mcp-server
```

The server communicates over SSE using the MCP protocol.
### Using The API

Visit https://BASE_URL/sse

```shell
go run main.go
```

## Available Tools (14 Currently Implemented)

### Core Operations (1 tool)
- `paystack_check_balance` - Check account balance

### Customer Operations (2 tools)
- `paystack_customer_create` - Create a new customer
- `paystack_customer_list` - List customers with pagination

### Transaction Operations (3 tools)
- `paystack_transaction_initialize` - Initialize a transaction
- `paystack_transaction_verify` - Verify transaction status
- `paystack_transaction_list` - List transactions

### Transfer Operations (2 tools)
- `paystack_transfer_recipient_create` - Create transfer recipient
- `paystack_transfer_initiate` - Initiate a transfer

### Plan Operations (1 tool)
- `paystack_plan_list` - List subscription plans

### Subscription Operations (1 tool)
- `paystack_subscription_list` - List subscriptions

### Bank Operations (2 tools)
- `paystack_bank_list` - List all supported banks
- `paystack_bank_resolve_account` - Resolve account details

### SubAccount Operations (1 tool)
- `paystack_subaccount_list` - List subaccounts

**Note**: Additional tools can be easily added following the same pattern established in the code.

## Example Usage

### Initialize a Transaction

```json
{
  "tool": "paystack_transaction_initialize",
  "parameters": {
    "email": "customer@example.com",
    "amount": 500000,
    "currency": "NGN",
    "callback_url": "https://example.com/callback"
  }
}
```

### Create a Customer

```json
{
  "tool": "paystack_customer_create",
  "parameters": {
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+2348012345678"
  }
}
```

### Create Transfer Recipient

```json
{
  "tool": "paystack_transfer_recipient_create",
  "parameters": {
    "type": "nuban",
    "name": "John Doe",
    "account_number": "0123456789",
    "bank_code": "058",
    "currency": "NGN"
  }
}
```

### List Transactions with Pagination

```json
{
  "tool": "paystack_transaction_list",
  "parameters": {
    "count": 50,
    "offset": 0
  }
}
```

## Architecture

The server is built with:
- **Go 1.23.0** - Modern, type-safe implementation
- **paystack-go SDK** - Official Paystack Go client
- **mcp-go** - MCP protocol implementation
- **Stdio Transport** - Standard MCP communication

### Project Structure

```
paystack-mpc-proxy/
├── main.go           # MCP server implementation
├── go.mod            # Go module dependencies
├── go.sum            # Dependency checksums
└── README.md         # This file
```

## Development

### Adding New Tools

1. Add tool registration in the appropriate `register*Tools()` function
2. Implement the handler function following the pattern:
   ```go
   func handleToolName(ctx context.Context, args map[string]interface{}) (*mcp.CallToolResult, error) {
       // Extract parameters
       // Call Paystack SDK
       // Return result
   }
   ```

### Testing

To test the server locally:

```bash
# Run the server
PAYSTACK_SECRET_KEY="sk_test_xxx" go run main.go

# The server will wait for MCP protocol messages on stdin
```

## Security Notes

- **Never commit your API keys** - Always use environment variables
- Use **test keys** (`sk_test_*`) during development
- Use **live keys** (`sk_live_*`) only in production
- Validate all input parameters before making API calls
- Monitor API usage to prevent abuse

## Error Handling

All tools return errors in a standard format:

```json
{
  "error": "Error: detailed error message from Paystack API",
  "isError": true
}
```

Successful responses contain the full Paystack API response as JSON.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Resources

- [Paystack API Documentation](https://paystack.com/docs/api/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [paystack-go SDK](https://github.com/borderlesshq/paystack-go)
- [mcp-go Library](https://github.com/mark3labs/mcp-go)

## Support

For issues related to:
- **This MCP server**: Open an issue in this repository
- **Paystack API**: Contact [Paystack Support](https://paystack.com/support)
- **MCP Protocol**: See [MCP Documentation](https://modelcontextprotocol.io/)

---

Built with ❤️ using Go and the Model Context Protocol
