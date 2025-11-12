package paystack

import (
	"fmt"

	"github.com/borderlesshq/paystack-go"
)

// Client wraps the Paystack SDK client
type Client struct {
	*paystack.Client
}

// NewClient creates a new Paystack client
func NewClient(apiKey string) *Client {
	return &Client{
		Client: paystack.NewClient(apiKey, nil),
	}
}

// SafeCheckBalance wraps CheckBalance with proper error handling
func (c *Client) SafeCheckBalance() (paystack.Response, error) {
	// Recover from SDK panic
	defer func() {
		if r := recover(); r != nil {
			// Return empty response on panic
		}
	}()

	resp := paystack.Response{}
	err := c.Call("GET", "balance", nil, &resp)
	if err != nil {
		return nil, err
	}

	// Safely extract balance data
	data, ok := resp["data"]
	if !ok {
		return nil, fmt.Errorf("invalid response: missing 'data' field")
	}

	// Handle both array and object responses
	switch v := data.(type) {
	case []interface{}:
		if len(v) > 0 {
			if balance, ok := v[0].(map[string]interface{}); ok {
				return balance, nil
			}
		}
		return nil, fmt.Errorf("invalid response: empty or malformed data array")
	case map[string]interface{}:
		return v, nil
	default:
		return nil, fmt.Errorf("invalid response: unexpected data type")
	}
}
