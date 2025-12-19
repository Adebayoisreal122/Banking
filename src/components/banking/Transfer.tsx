import React, { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle, User } from "lucide-react";
import { transactionAPI, accountAPI } from "../../services/api";

export default function Transfer() {
  const [recipientAccount, setRecipientAccount] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
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
        console.error("Error fetching accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = (accountId: string) => {
    setSelectedAccount(accountId);
    const account = accounts.find((acc) => acc._id === accountId);
    if (account) {
      setCurrentBalance(account.balance);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const transferAmount = parseFloat(amount);

    // Validation
    if (transferAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (transferAmount > currentBalance) {
      setError("Insufficient funds");
      return;
    }

    if (!selectedAccount) {
      setError("Please select an account");
      return;
    }

    if (!recipientAccount.trim()) {
      setError("Please enter recipient account number");
      return;
    }

    if (!recipientName.trim()) {
      setError("Please enter recipient name");
      return;
    }

    // Check if trying to transfer to own account
    const ownAccount = accounts.find(
      (acc) => acc.accountNumber === recipientAccount
    );
    if (ownAccount) {
      setError("Cannot transfer to your own account");
      return;
    }

    setLoading(true);

    try {
      const transferDescription = description.trim()
        ? `${description} (To: ${recipientName})`
        : `Transfer to ${recipientName}`;

      const response = await transactionAPI.transfer({
        fromAccountId: selectedAccount,
        toAccountNumber: recipientAccount,
        amount: transferAmount,
        description: transferDescription,
      });

      setCurrentBalance(response.newBalance);
      setSuccess(true);
      setRecipientAccount("");
      setRecipientName("");
      setAmount("");
      setDescription("");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Transfer error:", err);

      if (err.response?.status === 404) {
        setError(
          "Recipient account not found. Please check the account number."
        );
      } else if (err.response?.status === 400) {
        setError(err.response.data.error || "Invalid transfer details.");
      } else {
        setError(
          err.response?.data?.error || "Transfer failed. Please try again."
        );
      }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Transfer Successful!
          </h2>
          <p className="text-gray-600 mb-2">
            Your transfer of ${amount} to <strong>{recipientName}</strong> has
            been processed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            New Balance: ${currentBalance.toLocaleString()}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Transfer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <ArrowUpRight className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Transfer Money</h1>
            <p className="text-gray-600">
              Send money to another account instantly
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Available Balance:</strong> $
            {currentBalance.toLocaleString()}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Transfer from Account
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => handleAccountChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.accountNumber} - {account.accountType} ($
                  {account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="recipientAccount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Account Number
              </label>
              <input
                type="text"
                id="recipientAccount"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 10-digit account number"
                required
              />
            </div>

            <div>
              <label
                htmlFor="recipientName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Recipient Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="recipientName"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter recipient's name"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Amount ($)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum transfer amount: $0.01
            </p>
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="What's this transfer for? (e.g., Rent payment, Gift, Loan repayment)"
            />
          </div>

          {/* Transfer Summary */}
          {amount && recipientName && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Transfer Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Sending to:</span>
                  <span className="font-medium">{recipientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ${parseFloat(amount || "0").toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-gray-600">Balance after transfer:</span>
                  <span className="font-bold text-blue-600">
                    $
                    {(
                      currentBalance - parseFloat(amount || "0")
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Transfers are instant and available
              immediately in the recipient's account.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Processing Transfer..." : "Transfer Money"}
          </button>
        </form>
      </div>
    </div>
  );
}
