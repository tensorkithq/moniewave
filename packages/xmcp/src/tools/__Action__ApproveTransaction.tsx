/**
 * Action Widget Example: Approve Transaction
 *
 * Demonstrates an interactive action widget that requires user approval/rejection
 */

import { useState } from 'react';
import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  '__Action__ApproveTransaction',
  'Interactive widget for approving or rejecting pending transactions',
  {
    type: WidgetType.Action,
    version: '1.0.0',
    capabilities: {
      refreshable: false,
      supportsDarkMode: true,
      supportsPiP: true,
      requiresAuth: true,
    },
    actionConfig: {
      actionType: 'approve-reject',
      requiresConfirmation: true,
      actionTimeout: 300, // 5 minutes to make decision
      defaultAction: null, // No default action if timeout
      actionLabels: {
        primary: 'Approve',
        secondary: 'Reject',
      },
    },
    tags: ['transaction', 'approval', 'action', 'interactive'],
    author: 'Moniewave Team',
  },
  {
    widgetAccessible: true,
    widgetPrefersBorder: true,
    invokingMessage: 'Loading transaction for approval...',
    invokedMessage: 'Transaction approval widget loaded',
    widgetState: {
      status: 'pending',
      decision: null,
    },
  }
);

interface TransactionData {
  id: string;
  amount: number;
  currency: string;
  recipient: {
    name: string;
    accountNumber: string;
    bank: string;
  };
  sender: {
    name: string;
    accountNumber: string;
  };
  description: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
}

export default function handler() {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<'approve' | 'reject' | null>(null);

  // In a real implementation, this would come from tool output or widget props
  const transactionData: TransactionData = {
    id: 'TXN-2025-11-13-001',
    amount: 50000.0,
    currency: 'NGN',
    recipient: {
      name: 'Jane Smith',
      accountNumber: '9876543210',
      bank: 'Access Bank',
    },
    sender: {
      name: 'John Doe',
      accountNumber: '1234567890',
    },
    description: 'Payment for services rendered',
    timestamp: '2025-11-13T14:30:00Z',
    riskLevel: 'low',
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low':
        return '#10b981';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const handleApprove = () => {
    setPendingAction('approve');
    setShowConfirmation(true);
  };

  const handleReject = () => {
    setPendingAction('reject');
    setShowConfirmation(true);
  };

  const confirmAction = () => {
    if (pendingAction === 'approve') {
      setStatus('approved');
      // In real implementation, would call API to approve transaction
      console.log('Transaction approved:', transactionData.id);
    } else if (pendingAction === 'reject') {
      setStatus('rejected');
      // In real implementation, would call API to reject transaction
      console.log('Transaction rejected:', transactionData.id);
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };

  const cancelAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };

  if (status === 'approved') {
    return (
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontSize: '24px', color: '#10b981', margin: '0 0 8px 0' }}>
          Transaction Approved
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Transaction {transactionData.id} has been approved successfully.
        </p>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '40px 20px',
          maxWidth: '600px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
        <h2 style={{ fontSize: '24px', color: '#ef4444', margin: '0 0 8px 0' }}>
          Transaction Rejected
        </h2>
        <p style={{ fontSize: '14px', color: '#666' }}>
          Transaction {transactionData.id} has been rejected.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Transaction Header */}
      <div
        style={{
          backgroundColor: '#fef3c7',
          borderLeft: '4px solid #f59e0b',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', color: '#92400e' }}>
          ⚠️ Approval Required
        </h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#78350f' }}>
          Please review and approve or reject this transaction
        </p>
      </div>

      {/* Transaction Amount */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>Transaction Amount</div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb' }}>
          {formatCurrency(transactionData.amount, transactionData.currency)}
        </div>
      </div>

      {/* Transaction Details */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '12px' }}>
          Transaction Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Transaction ID */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>Transaction ID:</span>
            <span style={{ fontSize: '14px', color: '#333', fontWeight: '500' }}>
              {transactionData.id}
            </span>
          </div>

          {/* From */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>From</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {transactionData.sender.name}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {transactionData.sender.accountNumber}
            </div>
          </div>

          {/* To */}
          <div
            style={{
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              padding: '12px',
            }}
          >
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>To</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>
              {transactionData.recipient.name}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {transactionData.recipient.accountNumber} • {transactionData.recipient.bank}
            </div>
          </div>

          {/* Description */}
          <div style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>Description</div>
            <div style={{ fontSize: '14px', color: '#333' }}>{transactionData.description}</div>
          </div>

          {/* Risk Level */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
            }}
          >
            <span style={{ fontSize: '14px', color: '#666' }}>Risk Level:</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: getRiskColor(transactionData.riskLevel),
                textTransform: 'uppercase',
                backgroundColor: `${getRiskColor(transactionData.riskLevel)}20`,
                padding: '4px 12px',
                borderRadius: '12px',
              }}
            >
              {transactionData.riskLevel}
            </span>
          </div>

          {/* Timestamp */}
          <div style={{ fontSize: '12px', color: '#999', textAlign: 'center', marginTop: '8px' }}>
            Requested on {formatDate(transactionData.timestamp)}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '400px',
              margin: '20px',
            }}
          >
            <h3 style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#333' }}>
              Confirm {pendingAction === 'approve' ? 'Approval' : 'Rejection'}
            </h3>
            <p style={{ fontSize: '14px', color: '#666', margin: '0 0 20px 0' }}>
              Are you sure you want to {pendingAction} this transaction of{' '}
              {formatCurrency(transactionData.amount, transactionData.currency)}?
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={cancelAction}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                style={{
                  flex: 1,
                  padding: '12px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: pendingAction === 'approve' ? '#10b981' : '#ef4444',
                  color: 'white',
                  cursor: 'pointer',
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        <button
          onClick={handleReject}
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            backgroundColor: 'white',
            color: '#ef4444',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#fef2f2';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          ✕ Reject
        </button>
        <button
          onClick={handleApprove}
          style={{
            flex: 1,
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#10b981',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#059669';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#10b981';
          }}
        >
          ✓ Approve
        </button>
      </div>

      {/* Action Widget Footer */}
      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#fef3c7',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#92400e',
          textAlign: 'center',
        }}
      >
        ⏱️ Action required within 5 minutes
      </div>
    </div>
  );
}
