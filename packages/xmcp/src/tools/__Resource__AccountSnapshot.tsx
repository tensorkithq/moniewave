/**
 * Resource Widget Example: Account Snapshot
 *
 * Demonstrates a read-only resource widget that displays account information
 */

import { createToolMetadata, WidgetType } from '../types';

export const metadata = createToolMetadata(
  '__Resource__AccountSnapshot',
  'Displays a read-only snapshot of account balance and recent activity',
  {
    type: WidgetType.Resource,
    version: '1.0.0',
    capabilities: {
      refreshable: true,
      supportsDarkMode: true,
      supportsPiP: true,
      requiresAuth: true,
    },
    resourceConfig: {
      autoRefresh: true,
      refreshInterval: 30, // Auto-refresh every 30 seconds
      dataSource: 'paystack.accounts',
      filterable: false,
      sortable: false,
      pageable: false,
    },
    tags: ['account', 'balance', 'finance', 'read-only'],
    author: 'Moniewave Team',
  },
  {
    widgetAccessible: true,
    widgetPrefersBorder: true,
    invokingMessage: 'Loading account snapshot...',
    invokedMessage: 'Account snapshot loaded',
    widgetState: {
      lastRefresh: null,
    },
  }
);

interface AccountData {
  balance: number;
  currency: string;
  accountNumber: string;
  accountName: string;
  recentTransactions?: Array<{
    id: string;
    amount: number;
    type: 'credit' | 'debit';
    description: string;
    date: string;
  }>;
}

export default function handler() {
  // In a real implementation, this would come from tool output or widget props
  const accountData: AccountData = {
    balance: 150000.0,
    currency: 'NGN',
    accountNumber: '1234567890',
    accountName: 'John Doe',
    recentTransactions: [
      {
        id: '1',
        amount: 5000,
        type: 'credit',
        description: 'Payment received',
        date: '2025-11-13T10:30:00Z',
      },
      {
        id: '2',
        amount: 2000,
        type: 'debit',
        description: 'Transfer to savings',
        date: '2025-11-12T15:45:00Z',
      },
      {
        id: '3',
        amount: 10000,
        type: 'credit',
        description: 'Salary payment',
        date: '2025-11-11T09:00:00Z',
      },
    ],
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* Account Header */}
      <div
        style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '20px',
        }}
      >
        <h2 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#333' }}>
          Account Balance
        </h2>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2563eb', margin: '12px 0' }}>
          {formatCurrency(accountData.balance, accountData.currency)}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <div>{accountData.accountName}</div>
          <div>{accountData.accountNumber}</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h3 style={{ fontSize: '16px', color: '#333', marginBottom: '12px' }}>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {accountData.recentTransactions?.map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                borderLeft: `4px solid ${transaction.type === 'credit' ? '#10b981' : '#ef4444'}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '14px', color: '#333' }}>
                  {transaction.description}
                </div>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  {formatDate(transaction.date)}
                </div>
              </div>
              <div
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: transaction.type === 'credit' ? '#10b981' : '#ef4444',
                }}
              >
                {transaction.type === 'credit' ? '+' : '-'}
                {formatCurrency(transaction.amount, accountData.currency)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resource Widget Footer */}
      <div
        style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          fontSize: '12px',
          color: '#0369a1',
          textAlign: 'center',
        }}
      >
        🔒 Read-only view • Auto-refreshes every 30 seconds
      </div>
    </div>
  );
}
