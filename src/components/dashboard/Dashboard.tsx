import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Receipt,
  CreditCard,
  PiggyBank,
  TrendingUp,
  Plus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { accountAPI } from "../../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await accountAPI.getDashboard();
        setDashboard(data);

        // Prepare chart data from transactions
        if (data.recentTransactions?.length) {
          const transactions = [...data.recentTransactions]
            .sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            )
            .slice(-10); // Last 10 transactions

          const chartArr = transactions.map((tx: any) => ({
            name: new Date(tx.createdAt).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
            }),
            balance: tx.balanceAfter,
          }));

          setChartData(chartArr);
        }
      } catch (err: any) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [navigate]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-28 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <p className="text-red-500">{error || "No dashboard data available."}</p>
    );
  }

  const primaryAccount = dashboard.accounts?.[0];
  const transactions = dashboard.recentTransactions || [];
  const activeLoans = dashboard.activeLoans || [];

  const totalLoans = activeLoans.reduce(
    (sum: number, loan: any) => sum + loan.outstandingBalance,
    0
  );
  const monthlyGrowth = calculateMonthlyGrowth(transactions);

  const quickActions = [
    {
      name: "Deposit Money",
      href: "/deposit",
      icon: Plus,
      color: "bg-green-600 hover:bg-green-700",
      description: "Add funds to your account",
    },
    {
      name: "Transfer Money",
      href: "/transfer",
      icon: ArrowUpRight,
      color: "bg-blue-600 hover:bg-blue-700",
      description: "Send money to other accounts",
    },
    {
      name: "Withdraw Cash",
      href: "/withdraw",
      icon: ArrowDownLeft,
      color: "bg-orange-600 hover:bg-orange-700",
      description: "Withdraw from your account",
    },
    {
      name: "Pay Bills",
      href: "/bills",
      icon: Receipt,
      color: "bg-purple-600 hover:bg-purple-700",
      description: "Utilities, credit cards, and more",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header with User Info */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 rounded-xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName || "User"}! 👋
        </h1>
        <div className="space-y-1">
          <p className="text-blue-100">
            Account: {primaryAccount?.accountNumber}
          </p>
          <p className="text-2xl font-bold">
            #{dashboard.totalBalance?.toLocaleString() || "0.00"}
          </p>
          <p className="text-sm text-blue-200">Total Balance</p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Available Balance"
          value={`#${primaryAccount?.balance?.toLocaleString() || "0.00"}`}
          icon={<CreditCard className="h-6 w-6 text-blue-600" />}
          bg="bg-blue-50"
        />
        <Card
          title="Account Type"
          value={primaryAccount?.accountType?.toUpperCase() || "N/A"}
          icon={<PiggyBank className="h-6 w-6 text-purple-600" />}
          bg="bg-purple-50"
        />
        <Card
          title="Active Loans"
          value={`#${totalLoans.toLocaleString()}`}
          icon={<DollarSign className="h-6 w-6 text-orange-600" />}
          bg="bg-orange-50"
        />
        <Card
          title="Monthly Activity"
          value={monthlyGrowth}
          icon={<TrendingUp className="h-6 w-6 text-green-600" />}
          bg="bg-green-50"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.name}
                to={action.href}
                className={`p-4 rounded-xl text-white shadow-sm transition transform hover:scale-[1.02] active:scale-95 ${action.color}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className="h-6 w-6" />
                  <ArrowUpRight className="h-4 w-4" />
                </div>
                <h3 className="font-semibold">{action.name}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts and Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balance Chart */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Balance Trend
          </h2>
          {chartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(v) => [
                      `#${Number(v).toLocaleString()}`,
                      "Balance",
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              <p>No transaction data available yet</p>
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No transactions yet</p>
              <Link
                to="/deposit"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Make Your First Deposit
              </Link>
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {transactions.map((tx: any) => {
                const isCredit = [
                  "deposit",
                  "transfer_in",
                  "loan_disbursement",
                ].includes(tx.transactionType);
                return (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-full ${
                          isCredit ? "bg-green-100" : "bg-red-100"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {tx.transactionType.replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`font-semibold ${
                        isCredit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}#{tx.amount.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, icon, bg }: any) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bg} p-3 rounded-full`}>{icon}</div>
      </div>
    </div>
  );
}

function calculateMonthlyGrowth(transactions: any[]): string {
  if (!transactions || transactions.length === 0) return "N/A";

  const now = new Date();
  const thisMonth = transactions.filter((tx) => {
    const txDate = new Date(tx.createdAt);
    return (
      txDate.getMonth() === now.getMonth() &&
      txDate.getFullYear() === now.getFullYear()
    );
  });

  const credits = thisMonth
    .filter((tx) =>
      ["deposit", "transfer_in", "loan_disbursement"].includes(
        tx.transactionType
      )
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const debits = thisMonth
    .filter((tx) =>
      ["withdrawal", "transfer_out", "bill_payment"].includes(
        tx.transactionType
      )
    )
    .reduce((sum, tx) => sum + tx.amount, 0);

  const growth = credits - debits;
  const sign = growth >= 0 ? "+" : "";
  return `${sign}#${Math.abs(growth).toLocaleString()}`;
}
