import { Link } from "react-router-dom";
import {
  CreditCard,
  Shield,
  Zap,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Lock,
  DollarSign,
  BarChart3,
  Globe,
} from "lucide-react";

export default function Homepage() {
  const features = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Bank-Level Security",
      description:
        "256-bit encryption and multi-factor authentication keep your money safe.",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Transfers",
      description:
        "Send and receive money in real-time, 24/7, with zero delays.",
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Smart Insights",
      description:
        "Track spending patterns and get personalized financial advice.",
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Mobile First",
      description: "Access your account anywhere, anytime from any device.",
    },
  ];

  const services = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Digital Banking ",
      description: "Open accounts instantly with no paperwork required",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Personal Loans For you",
      description: "Quick approval with competitive rates from 5.5% APR",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Investment Tools For You",
      description: "Grow your wealth with smart investment options",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Payments",
      description: "Send money internationally with low fees",
      color: "from-green-500 to-emerald-500",
    },
  ];

  const stats = [
    { value: "500K+", label: "Active Users" },
    { value: "$2B+", label: "Transactions" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "App Rating" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <img src="/TrustWave.png" alt="Logo" className="h-40 w-60" />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Features
              </a>
              <a
                href="#services"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                Services
              </a>
              <a
                href="#about"
                className="text-gray-600 hover:text-gray-900 transition"
              >
                About
              </a>
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-medium transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:scale-105 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Lock className="h-4 w-4" />
                <span>Secure & Trusted by 500K+ Users</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                Banking
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Made Simple
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the future of banking with instant transfers, zero
                fees, and powerful financial tools at your fingertips.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transform hover:scale-105 transition flex items-center justify-center space-x-2"
                >
                  <span>Open Free Account</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-400 hover:bg-gray-50 transition flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center space-x-6 pt-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-white"
                    ></div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="text-yellow-400">
                        ★
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">
                    Rated 4.9 by 10K+ users
                  </p>
                </div>
              </div>
            </div>

            {/* Hero Image/Card */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-8 shadow-2xl transform rotate-3 hover:rotate-0 transition duration-500">
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80 text-sm">Total Balance</span>
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-white">
                    $12,458.50
                  </div>
                  <div className="flex items-center space-x-2 text-green-300 text-sm">
                    <TrendingUp className="h-4 w-4" />
                    <span>+12.5% this month</span>
                  </div>
                  <div className="pt-4 space-y-2">
                    <div className="bg-white/20 rounded-lg p-3 flex justify-between">
                      <span className="text-white/90">Account Number</span>
                      <span className="text-white font-mono">•••• 4829</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-white text-sm">Transfer</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-white text-sm">Deposit</div>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 text-center">
                        <div className="text-white text-sm">Withdraw</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-lg animate-bounce">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-lg">
                <div className="text-sm text-gray-600">Instant Transfer</div>
                <div className="text-lg font-bold text-gray-900">+$500</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Modern banking features designed for your lifestyle
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-300 transition group"
              >
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Comprehensive Banking Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From everyday banking to long-term investments
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 hover:shadow-xl transition group"
              >
                <div
                  className={`bg-gradient-to-br ${service.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition`}
                >
                  {service.icon}
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <a
                  href="#"
                  className="text-blue-600 font-medium flex items-center space-x-2 group-hover:space-x-3 transition-all"
                >
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to start your journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 500,000+ users who trust SecureBank for their financial needs
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition"
          >
            <span>Open Your Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-blue-100 text-sm mt-4">
            No credit card required • Set up in 2 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/TrustFoot.png" alt="FootTrust" className="h-45 w-80"/>
              </div>
              <p className="text-sm">Modern banking for the digital age.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            <p>&copy; 2026 TrustWave Bank. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
