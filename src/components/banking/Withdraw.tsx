import React, { useState, useEffect } from "react";
import { ArrowDownLeft, CheckCircle, MapPin } from "lucide-react";
import { transactionAPI, accountAPI } from "../../services/api";

export default function Withdraw() {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("atm");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState(0);

  const quickAmounts = [20, 50, 100, 200, 500];

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

    const withdrawAmount = parseFloat(amount);

    if (withdrawAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > currentBalance) {
      setError("Insufficient funds");
      return;
    }

    if (!selectedAccount) {
      setError("Please select an account");
      return;
    }

    setLoading(true);

    try {
      const description =
        method === "atm"
          ? `ATM Withdrawal${location ? ` at ${location}` : ""}`
          : "Branch Withdrawal";

      const response = await transactionAPI.withdraw({
        accountId: selectedAccount,
        amount: withdrawAmount,
        description,
      });

      setCurrentBalance(response.newBalance);
      setSuccess(true);
      setAmount("");
      setLocation("");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Withdrawal error:", err);
      setError(
        err.response?.data?.error || "Withdrawal failed. Please try again."
      );
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
            Withdrawal Successful!
          </h2>
          <p className="text-gray-600 mb-4">
            Your withdrawal of ${amount} has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            New Balance: ${currentBalance.toLocaleString()}
          </p>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Make Another Withdrawal
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
            <h1 className="text-2xl font-bold text-gray-900">Withdraw Cash</h1>
            <p className="text-gray-600">Withdraw money from your account</p>
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
              Withdraw from Account
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
                  {account.accountNumber} - {account.accountType} ($
                  {account.balance.toLocaleString()})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Method
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="method"
                  value="atm"
                  checked={method === "atm"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium">ATM Withdrawal</p>
                  <p className="text-sm text-gray-500">
                    Use any ATM with your card
                  </p>
                </div>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
                <input
                  type="radio"
                  name="method"
                  value="branch"
                  checked={method === "branch"}
                  onChange={(e) => setMethod(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium">Branch Withdrawal</p>
                  <p className="text-sm text-gray-500">Visit a bank branch</p>
                </div>
              </label>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
            />

            <div className="mt-3">
              <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
              <div className="flex flex-wrap gap-2">
                {quickAmounts.map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    ${quickAmount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {method === "atm" && (
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Preferred ATM Location (Optional)
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter location or zip code"
                />
              </div>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              💡 <strong>Note:</strong>{" "}
              {method === "atm"
                ? "ATM withdrawals may have daily limits."
                : "Branch withdrawals may require ID verification."}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Processing Withdrawal..." : "Withdraw Cash"}
          </button>
        </form>
      </div>
    </div>
  );
}
