import React, { useState, useEffect } from 'react';
import { ArrowDownLeft, CheckCircle } from 'lucide-react';
import { transactionAPI, accountAPI } from '../../services/api';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [currentBalance, setCurrentBalance] = useState(0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountAPI.getAccounts();
        setAccounts(data);
        if (data.length > 0) {
          setSelectedAccount(data[0]._id);
          setCurrentBalance(data[0].balance);
        }
      } catch (err) {
        console.error('Error fetching accounts:', err);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    const account = accounts.find(acc => acc._id === accountId);
    if (account) {
      setCurrentBalance(account.balance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const depositAmount = parseFloat(amount);

    if (depositAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    setLoading(true);

    try {
      const response = await transactionAPI.deposit({
        accountId: selectedAccount,
        amount: depositAmount,
        description: description || 'Cash Deposit'
      });

      setCurrentBalance(response.newBalance);
      setSuccess(true);
      setAmount('');
      setDescription('');

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Deposit error:', err);
      setError(err.response?.data?.error || 'Deposit failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Deposit Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your deposit of ${amount} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            New Balance: ${currentBalance.toLocaleString()}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Deposit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="bg-green-100 p-3 rounded-full mr-4">
            <ArrowDownLeft className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Deposit Money</h1>
            <p className="text-gray-600">Add funds to your account</p>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-green-800">
            <strong>Current Balance:</strong> ${currentBalance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
              Select Account
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountNumber} - {account.accountType} (${account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="What's this deposit for?"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Deposits are instant and available immediately in your account.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing Deposit...' : 'Deposit Money'}
          </button>
        </form>
      </div>
    </div>
  );
}