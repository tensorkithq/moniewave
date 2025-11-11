package dto

import (
	"fmt"

	"github.com/alpkeskin/gotoon"
)

// Encoder handles TOON encoding/decoding
type Encoder struct{}

// NewEncoder creates a new TOON encoder
func NewEncoder() *Encoder {
	return &Encoder{}
}

// Encode encodes data to TOON format
func (e *Encoder) Encode(data interface{}) (string, error) {
	toonData, err := gotoon.Encode(data)
	if err != nil {
		return "", fmt.Errorf("failed to encode to TOON: %w", err)
	}
	return toonData, nil
}

// EncodeResponse encodes a Response struct to TOON
func (e *Encoder) EncodeResponse(status bool, message string, data interface{}) (string, error) {
	resp := Response{
		Status:  status,
		Message: message,
		Data:    data,
	}
	return e.Encode(resp)
}

// EncodeError encodes an error response to TOON
func (e *Encoder) EncodeError(message string, err error) (string, error) {
	errResp := ErrorResponse{
		Status:  false,
		Message: message,
		Error:   err.Error(),
	}
	return e.Encode(errResp)
}

// EncodeSuccess encodes a success response to TOON
func (e *Encoder) EncodeSuccess(message string, data interface{}) (string, error) {
	return e.EncodeResponse(true, message, data)
}
