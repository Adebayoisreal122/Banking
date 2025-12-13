import React, { useState, useEffect } from 'react';
import { DollarSign, CheckCircle, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { loanAPI, accountAPI } from '../../services/api';

export default function Loans() {
  const [loanAmount, setLoanAmount] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [purpose, setPurpose] = useState('');
  const [income, setIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState<any[]>([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [existingLoans, setExistingLoans] = useState<any[]>([]);
  const [loadingLoans, setLoadingLoans] = useState(true);

  const interestRate = 5.5; // 5.5% annual interest rate

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, loansData] = await Promise.all([
          accountAPI.getAccounts(),
          loanAPI.getLoans()
        ]);
        
        setAccounts(accountsData);
        if (accountsData.length > 0) {
          setSelectedAccount(accountsData[0]._id);
        }
        
        setExistingLoans(loansData);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoadingLoans(false);
      }
    };

    fetchData();
  }, []);

  const calculateMonthlyPayment = () => {
    const principal = parseFloat(loanAmount);
    const months = parseInt(termMonths);
    
    if (!principal || !months) return '0.00';
    
    const monthlyRate = interestRate / 100 / 12;
    const payment = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / 
                    (Math.pow(1 + monthlyRate, months) - 1);
    
    return payment.toFixed(2);
  };

  const calculateDebtToIncomeRatio = () => {
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const monthlyIncome = parseFloat(income);
    
    if (!monthlyIncome || monthlyIncome <= 0) return 0;
    
    return ((monthlyPayment / monthlyIncome) * 100).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amount = parseFloat(loanAmount);
    const months = parseInt(termMonths);
    const monthlyIncome = parseFloat(income);

    // Validation
    if (amount <= 0) {
      setError('Please enter a valid loan amount');
      return;
    }

    if (amount < 100) {
      setError('Minimum loan amount is $100');
      return;
    }

    if (months < 6 || months > 60) {
      setError('Loan term must be between 6 and 60 months');
      return;
    }

    if (monthlyIncome <= 0) {
      setError('Please enter a valid monthly income');
      return;
    }

    if (!selectedAccount) {
      setError('Please select an account');
      return;
    }

    if (!purpose.trim()) {
      setError('Please provide a loan purpose');
      return;
    }

    // Debt-to-income ratio check (should be under 40%)
    const monthlyPayment = parseFloat(calculateMonthlyPayment());
    const debtToIncomeRatio = (monthlyPayment / monthlyIncome) * 100;

    if (debtToIncomeRatio > 40) {
      setError('Loan amount too high for your income (debt-to-income ratio exceeds 40%). Please reduce the amount or increase the term.');
      return;
    }

    setLoading(true);

    try {
      await loanAPI.apply({
        accountId: selectedAccount,
        loanAmount: amount,
        termMonths: months
      });

      setSuccess(true);
      setLoanAmount('');
      setTermMonths('12');
      setPurpose('');
      setIncome('');

      // Refresh loans list
      const loansData = await loanAPI.getLoans();
      setExistingLoans(loansData);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      console.error('Loan application error:', err);
      setError(err.response?.data?.error || 'Loan application failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();
  const totalPayment = (parseFloat(monthlyPayment) * parseInt(termMonths)).toFixed(2);
  const totalInterest = (parseFloat(totalPayment) - parseFloat(loanAmount || '0')).toFixed(2);
  const debtToIncomeRatio = calculateDebtToIncomeRatio();

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loan Approved!</h2>
          <p className="text-gray-600 mb-4">
            Your loan of ${loanAmount} has been approved and disbursed to your account. You'll receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
            <p className="text-sm text-gray-600 mb-1">Monthly Payment: <span className="font-semibold text-gray-900">${monthlyPayment}</span></p>
            <p className="text-sm text-gray-600">Loan Term: <span className="font-semibold text-gray-900">{termMonths} months</span></p>
          </div>
          <button
            onClick={() => setSuccess(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Loan Details
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
                <p className="text-gray-600">Get quick access to funds with competitive rates</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-2">
                  Disburse to Account
                </label>
                <select
                  id="account"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountNumber} - {account.accountType} (${account.balance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount ($)
                  </label>
                  <input
                    type="number"
                    id="loanAmount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0.00"
                    min="100"
                    step="100"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: $100</p>
                </div>

                <div>
                  <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (Months)
                  </label>
                  <select
                    id="termMonths"
                    value={termMonths}
                    onChange={(e) => setTermMonths(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months (2 years)</option>
                    <option value="36">36 months (3 years)</option>
                    <option value="48">48 months (4 years)</option>
                    <option value="60">60 months (5 years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="income" className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Income ($)
                </label>
                <input
                  type="number"
                  id="income"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0.00"
                  min="500"
                  step="100"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Used to calculate debt-to-income ratio</p>
              </div>

              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                  Loan Purpose
                </label>
                <textarea
                  id="purpose"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="What will you use this loan for? (e.g., home improvement, debt consolidation, education)"
                  required
                />
              </div>

              {/* Loan Calculator */}
              {loanAmount && income && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-5">
                  <div className="flex items-center mb-3">
                    <Calculator className="h-5 w-5 text-purple-600 mr-2" />
                    <h3 className="font-semibold text-gray-900">Loan Summary</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Monthly Payment</p>
                      <p className="text-2xl font-bold text-purple-600">${monthlyPayment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Interest Rate</p>
                      <p className="text-xl font-bold text-gray-900">{interestRate}% APR</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm border-t border-purple-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-medium">${totalInterest}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Payment:</span>
                      <span className="font-medium">${totalPayment}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-purple-200">
                      <span className="text-gray-600">Debt-to-Income Ratio:</span>
                      <span className={`font-semibold ${
                        parseFloat(debtToIncomeRatio) > 40 ? 'text-red-600' :
                        parseFloat(debtToIncomeRatio) > 30 ? 'text-orange-600' :
                        'text-green-600'
                      }`}>
                        {debtToIncomeRatio}%
                      </span>
                    </div>
                  </div>

                  {parseFloat(debtToIncomeRatio) > 40 && (
                    <div className="mt-3 flex items-start bg-red-50 border border-red-200 rounded p-3">
                      <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                      <p className="text-xs text-red-800">
                        Your debt-to-income ratio exceeds 40%. Consider reducing the loan amount or increasing the term.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <strong>Important:</strong> Loan approval is instant for amounts under $10,000. Larger loans may require additional verification. Funds will be disbursed immediately upon approval.
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !loanAmount || !income}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {loading ? 'Processing Application...' : 'Apply for Loan'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Loans Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-4">
              <TrendingUp className="h-5 w-5 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Your Active Loans</h2>
            </div>

            {loadingLoans ? (
              <div className="animate-pulse space-y-3">
                <div className="h-24 bg-gray-200 rounded"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
            ) : existingLoans.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 rounded-full p-4 w-16 h-16 mx-auto mb-3">
                  <DollarSign className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm mb-2">No active loans</p>
                <p className="text-xs text-gray-400">Apply for your first loan above</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {existingLoans.map((loan) => (
                  <div key={loan._id} className="border border-gray-200 rounded-lg p-4 hover:border-purple-300 hover:shadow-sm transition">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-lg font-bold text-gray-900">
                          ${loan.loanAmount.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(loan.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        loan.status === 'active' ? 'bg-green-100 text-green-700' : 
                        loan.status === 'paid' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {loan.status}
                      </span>
                    </div>
                    
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Term:</span>
                        <span className="font-medium">{loan.termMonths} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Payment:</span>
                        <span className="font-medium">${loan.monthlyPayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest Rate:</span>
                        <span className="font-medium">{loan.interestRate}%</span>
                      </div>
                      <div className="flex justify-between pt-1.5 border-t">
                        <span className="text-gray-600">Outstanding:</span>
                        <span className="font-bold text-purple-600">${loan.outstandingBalance.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}