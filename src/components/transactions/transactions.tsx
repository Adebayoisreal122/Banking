import { useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  Filter,
  X,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
} from "lucide-react";
import { accountAPI } from "../../services/api";

const TX_TYPES: Record<string, { label: string; color: string; bg: string; isCredit: boolean }> = {
  deposit:          { label: "Deposit",           color: "text-green-600",  bg: "bg-green-100",  isCredit: true  },
  transfer_in:      { label: "Transfer In",        color: "text-green-600",  bg: "bg-green-100",  isCredit: true  },
  loan_disbursement:{ label: "Loan Disbursement",  color: "text-blue-600",   bg: "bg-blue-100",   isCredit: true  },
  withdrawal:       { label: "Withdrawal",         color: "text-red-500",    bg: "bg-red-100",    isCredit: false },
  transfer_out:     { label: "Transfer Out",       color: "text-red-500",    bg: "bg-red-100",    isCredit: false },
  bill_payment:     { label: "Bill Payment",       color: "text-orange-500", bg: "bg-orange-100", isCredit: false },
  loan_repayment:   { label: "Loan Repayment",     color: "text-purple-600", bg: "bg-purple-100", isCredit: false },
};

const getTxMeta = (type: string) => TX_TYPES[type] ?? { label: type.replace(/_/g, " "), color: "text-gray-600", bg: "bg-gray-100", isCredit: false };

export default function Transactions() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selected, setSelected] = useState<any | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await accountAPI.getDashboard();
        const txs = data.recentTransactions || [];
        // Sort newest first
        const sorted = [...txs].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setTransactions(sorted);
        setFiltered(sorted);
      } catch (err) {
        setError("Failed to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (tx) =>
          tx.transactionType?.toLowerCase().includes(q) ||
          tx.description?.toLowerCase().includes(q) ||
          tx.amount?.toString().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== "all") {
      if (typeFilter === "credit") {
        result = result.filter((tx) => getTxMeta(tx.transactionType).isCredit);
      } else if (typeFilter === "debit") {
        result = result.filter((tx) => !getTxMeta(tx.transactionType).isCredit);
      } else {
        result = result.filter((tx) => tx.transactionType === typeFilter);
      }
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date();
      result = result.filter((tx) => {
        const txDate = new Date(tx.createdAt);
        if (dateFilter === "today") {
          return txDate.toDateString() === now.toDateString();
        } else if (dateFilter === "week") {
          const weekAgo = new Date(now);
          weekAgo.setDate(now.getDate() - 7);
          return txDate >= weekAgo;
        } else if (dateFilter === "month") {
          return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
        }
        return true;
      });
    }

    setFiltered(result);
  }, [search, typeFilter, dateFilter, transactions]);

  // Summary stats
  const totalCredits = transactions.filter((tx) => getTxMeta(tx.transactionType).isCredit).reduce((s, tx) => s + tx.amount, 0);
  const totalDebits = transactions.filter((tx) => !getTxMeta(tx.transactionType).isCredit).reduce((s, tx) => s + tx.amount, 0);

  // Group by date
  const grouped = filtered.reduce((acc: Record<string, any[]>, tx) => {
    const date = new Date(tx.createdAt).toLocaleDateString("en-NG", {
      weekday: "long", year: "numeric", month: "long", day: "numeric",
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(tx);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-28 bg-gray-200 rounded-2xl" />
        <div className="h-12 bg-gray-200 rounded-xl" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {transactions.length} total transactions
          </p>
        </div>
        <button className="flex items-center space-x-2 border border-gray-200 text-gray-600 px-4 py-2 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
          <Download className="h-4 w-4" />
          <span className="hidden sm:block">Export</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center space-x-3">
          <div className="bg-blue-50 p-2.5 rounded-xl">
            <DollarSign className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Transactions</p>
            <p className="text-lg font-bold text-gray-900">{transactions.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center space-x-3">
          <div className="bg-green-50 p-2.5 rounded-xl">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Credits</p>
            <p className="text-lg font-bold text-green-600">+₦{totalCredits.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center space-x-3">
          <div className="bg-red-50 p-2.5 rounded-xl">
            <TrendingDown className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-400">Total Debits</p>
            <p className="text-lg font-bold text-red-500">-₦{totalDebits.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-3">
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition ${
              showFilters || typeFilter !== "all" || dateFilter !== "all"
                ? "border-blue-500 text-blue-600 bg-blue-50"
                : "border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:block">Filter</span>
            {(typeFilter !== "all" || dateFilter !== "all") && (
              <span className="bg-blue-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {(typeFilter !== "all" ? 1 : 0) + (dateFilter !== "all" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-3 pt-1 border-t border-gray-100">
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-500">Type</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="credit">Credits Only</option>
                <option value="debit">Debits Only</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer_in">Transfers In</option>
                <option value="transfer_out">Transfers Out</option>
                <option value="loan_disbursement">Loan Disbursements</option>
                <option value="loan_repayment">Loan Repayments</option>
                <option value="bill_payment">Bill Payments</option>
              </select>
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs font-medium text-gray-500">Date Range</label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">This Month</option>
              </select>
            </div>
            {(typeFilter !== "all" || dateFilter !== "all") && (
              <div className="flex flex-col justify-end">
                <button
                  onClick={() => { setTypeFilter("all"); setDateFilter("all"); }}
                  className="text-xs text-red-500 hover:text-red-600 font-medium px-2 py-1.5 hover:bg-red-50 rounded-lg transition"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Transaction List */}
      <div className="space-y-5">
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="bg-gray-100 rounded-2xl p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-gray-400" />
            </div>
            <p className="font-semibold text-gray-700">No transactions found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or search term</p>
          </div>
        ) : (
          Object.entries(grouped).map(([date, txs]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center space-x-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{date}</p>
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs text-gray-400 whitespace-nowrap">{txs.length} txn{txs.length > 1 ? "s" : ""}</span>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {txs.map((tx, i) => {
                  const meta = getTxMeta(tx.transactionType);
                  return (
                    <button
                      key={tx._id}
                      onClick={() => setSelected(tx)}
                      className={`w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors text-left ${
                        i < txs.length - 1 ? "border-b border-gray-50" : ""
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`${meta.bg} p-2.5 rounded-xl flex-shrink-0`}>
                          {meta.isCredit
                            ? <ArrowDownLeft className={`h-4 w-4 ${meta.color}`} />
                            : <ArrowUpRight className={`h-4 w-4 ${meta.color}`} />
                          }
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm capitalize">{meta.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[200px]">
                            {tx.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <p className={`font-bold text-sm ${meta.color}`}>
                          {meta.isCredit ? "+" : "-"}₦{tx.amount?.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(tx.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Transaction Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {(() => {
              const meta = getTxMeta(selected.transactionType);
              return (
                <div className="space-y-5">
                  {/* Icon + amount */}
                  <div className="text-center pt-2">
                    <div className={`${meta.bg} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3`}>
                      {meta.isCredit
                        ? <ArrowDownLeft className={`h-7 w-7 ${meta.color}`} />
                        : <ArrowUpRight className={`h-7 w-7 ${meta.color}`} />
                      }
                    </div>
                    <p className={`text-3xl font-bold ${meta.color}`}>
                      {meta.isCredit ? "+" : "-"}₦{selected.amount?.toLocaleString()}
                    </p>
                    <p className="text-gray-500 text-sm mt-1 capitalize font-medium">{meta.label}</p>
                  </div>

                  {/* Details */}
                  <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                    {[
                      { label: "Status", value: "Successful", valueClass: "text-green-600 font-semibold" },
                      { label: "Date", value: new Date(selected.createdAt).toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short" }) },
                      { label: "Balance After", value: `₦${selected.balanceAfter?.toLocaleString()}` },
                      { label: "Transaction ID", value: selected._id, valueClass: "font-mono text-xs break-all" },
                      { label: "Description", value: selected.description || "No description" },
                    ].map(({ label, value, valueClass }) => (
                      <div key={label} className="flex justify-between items-start gap-4">
                        <span className="text-sm text-gray-500 flex-shrink-0">{label}</span>
                        <span className={`text-sm text-gray-800 text-right ${valueClass || "font-medium"}`}>{value}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelected(null)}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl font-semibold text-sm transition"
                  >
                    Close
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}