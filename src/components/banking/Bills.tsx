import React, { useState, useEffect } from 'react';
import { Receipt, CheckCircle, Zap, Phone, Car, CreditCard } from 'lucide-react';
import { billAPI, accountAPI } from '../../services/api';

export default function Bills() {
  const [selectedBill, setSelectedBill] = useState('');
  const [amount, setAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
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

  const billCategories = [
    {
      id: 'utilities',
      name: 'Utilities',
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
      bills: [
        { id: 'electricity', name: 'Electricity', company: 'PowerCorp' },
        { id: 'gas', name: 'Natural Gas', company: 'GasUtility' },
        { id: 'water', name: 'Water & Sewer', company: 'WaterWorks' }
      ]
    },
    {
      id: 'telecom',
      name: 'Telecom',
      icon: Phone,
      color: 'bg-blue-100 text-blue-600',
      bills: [
        { id: 'mobile', name: 'Mobile Phone', company: 'MobileTech' },
        { id: 'internet', name: 'Internet', company: 'NetProvider' },
        { id: 'cable', name: 'Cable TV', company: 'CableVision' }
      ]
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: Car,
      color: 'bg-green-100 text-green-600',
      bills: [
        { id: 'auto', name: 'Auto Insurance', company: 'AutoInsure' },
        { id: 'home', name: 'Home Insurance', company: 'HomeProtect' },
        { id: 'health', name: 'Health Insurance', company: 'HealthCare' }
      ]
    },
    {
      id: 'credit',
      name: 'Credit Cards',
      icon: CreditCard,
      color: 'bg-purple-100 text-purple-600',
      bills: [
        { id: 'visa', name: 'Visa Card', company: 'Bank of America' },
        { id: 'mastercard', name: 'MasterCard', company: 'Chase Bank' },
        { id: 'amex', name: 'American Express', company: 'Amex' }
      ]
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const billAmount = parseFloat(amount);

    if (billAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (billAmount > currentBalance) {
      setError('Insufficient funds');
      return;
    }

    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    setLoading(true);

    try {
      const billInfo = getSelectedBillInfo();
      const response = await billAPI.pay({
        accountId: selectedAccount,
        billerName: billInfo?.company || 'Unknown Biller',
        amount: billAmount,
        referenceNumber: accountNumber
      });

      setCurrentBalance(response.newBalance);
      setSuccess(true);
      setAmount('');
      setAccountNumber('');

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error('Bill payment error:', err);
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getSelectedBillInfo = () => {
    for (const category of billCategories) {
      const bill = category.bills.find(b => b.id === selectedBill);
      if (bill) {
        return { ...bill, category };
      }
    }
    return null;
  };

  if (success) {
    const billInfo = getSelectedBillInfo();
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your ${amount} payment to {billInfo?.company} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            New Balance: ${currentBalance.toLocaleString()}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Pay Another Bill
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="bg-orange-100 p-3 rounded-full mr-4">
            <Receipt className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Pay Bills</h1>
            <p className="text-gray-600">Pay your utilities, insurance, and other bills</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Available Balance:</strong> ${currentBalance.toLocaleString()}
          </p>
        </div>

        {/* Account Selection */}
        <div className="mb-6">
          <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
            Pay from Account
          </label>
          <select
            id="account"
            value={selectedAccount}
            onChange={(e) => handleAccountChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            required
          >
            {accounts.map((account) => (
              <option key={account._id} value={account._id}>
                {account.accountNumber} - {account.accountType} (${account.balance.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Bill Categories */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Bill Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {billCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.id} className="border rounded-lg p-4 hover:border-orange-300 transition">
                  <div className={`${category.color} p-2 rounded-full w-fit mb-3`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <div className="space-y-1">
                    {category.bills.map((bill) => (
                      <label key={bill.id} className="flex items-center text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                        <input
                          type="radio"
                          name="bill"
                          value={bill.id}
                          checked={selectedBill === bill.id}
                          onChange={(e) => setSelectedBill(e.target.value)}
                          className="mr-2"
                        />
                        <span className="text-gray-700">{bill.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedBill && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Selected Bill</h3>
              <p className="text-sm text-gray-600">
                {getSelectedBillInfo()?.name} - {getSelectedBillInfo()?.company}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Account/Reference Number
                </label>
                <input
                  type="text"
                  id="accountNumber"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter your account number"
                  required
                />
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Processing Payment...' : 'Pay Bill'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}