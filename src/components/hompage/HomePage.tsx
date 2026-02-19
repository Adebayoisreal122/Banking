import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
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
  Menu,
  X,
  Users,
  Award,
  Target,
  ChevronDown,
} from "lucide-react";

export default function Homepage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: <Shield className="h-7 w-7" />,
      title: "Bank-Level Security",
      description: "256-bit encryption and multi-factor authentication keep your money safe around the clock.",
    },
    {
      icon: <Zap className="h-7 w-7" />,
      title: "Instant Transfers",
      description: "Send and receive money in real-time, 24/7, with zero delays across Nigeria.",
    },
    {
      icon: <TrendingUp className="h-7 w-7" />,
      title: "Smart Insights",
      description: "Track spending patterns and get personalized financial advice tailored for you.",
    },
    {
      icon: <Smartphone className="h-7 w-7" />,
      title: "Mobile First",
      description: "Access your account anywhere, anytime from any device with our sleek interface.",
    },
  ];

  const services = [
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Digital Banking",
      description: "Open accounts instantly with no paperwork required",
      color: "from-blue-500 to-cyan-400",
      bg: "bg-blue-50",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Personal Loans",
      description: "Quick approval with competitive rates from 5.5% APR",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Investment Tools",
      description: "Grow your wealth with smart investment options",
      color: "from-orange-500 to-red-400",
      bg: "bg-orange-50",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Global Payments",
      description: "Send money internationally with low fees",
      color: "from-green-500 to-emerald-400",
      bg: "bg-green-50",
    },
  ];

  const stats = [
    { value: "500K+", label: "Active Users" },
    { value: "₦2T+", label: "Transactions" },
    { value: "99.9%", label: "Uptime" },
    { value: "4.9★", label: "App Rating" },
  ];

  const team = [
    { name: "Adaeze Okonkwo", role: "Chief Executive Officer", initials: "AO", color: "from-blue-400 to-blue-600" },
    { name: "Emeka Nwosu", role: "Chief Technology Officer", initials: "EN", color: "from-purple-400 to-purple-600" },
    { name: "Fatima Bello", role: "Head of Security", initials: "FB", color: "from-pink-400 to-pink-600" },
  ];

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* ── Navigation ── */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img src="/TrustWave.png" alt="TrustWave" className="h-32 w-48 object-contain" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200 text-sm"
                >
                  {link.label}
                </a>
              ))}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-blue-200"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-gray-100 px-4 py-4 space-y-1 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-gray-100 space-y-2 mt-2">
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold text-center transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold text-center hover:bg-blue-700 transition"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-br from-blue-100 via-purple-50 to-pink-50 rounded-full blur-3xl opacity-60 -z-10" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-100 rounded-full blur-3xl opacity-40 -z-10" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                <Lock className="h-3.5 w-3.5" />
                <span>Trusted by 500K+ Nigerians</span>
              </div>

              <div className="space-y-2">
                <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                  Banking
                </h1>
                <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                  Made Simple.
                </h1>
              </div>

              <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
                Experience the future of banking with instant transfers, zero fees, and powerful
                financial tools — built for Nigeria, trusted worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/signup"
                  className="group bg-blue-600 hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-blue-200 flex items-center justify-center space-x-2"
                >
                  <span>Open Free Account</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="border border-gray-200 text-gray-700 px-7 py-3.5 rounded-xl font-semibold hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex items-center space-x-4 pt-2">
                <div className="flex -space-x-2.5">
                  {["from-blue-400 to-indigo-500", "from-purple-400 to-pink-500", "from-green-400 to-cyan-500", "from-orange-400 to-red-500"].map((grad, i) => (
                    <div key={i} className={`w-9 h-9 rounded-full bg-gradient-to-br ${grad} border-2 border-white`} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center space-x-0.5 text-yellow-400 text-sm">★★★★★</div>
                  <p className="text-xs text-gray-500 mt-0.5">Rated 4.9 by 10,000+ users</p>
                </div>
              </div>
            </div>

            {/* Hero Card */}
            <div className="relative flex justify-center">
              <div className="relative w-full max-w-sm">
                {/* Main card */}
                <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-6 shadow-2xl shadow-blue-300/40">
                  <div className="space-y-5">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-200 text-xs font-medium">Total Balance</p>
                        <p className="text-white text-3xl font-bold mt-1">₦1,245,850.00</p>
                      </div>
                      <div className="bg-white/20 p-2.5 rounded-xl">
                        <CreditCard className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 text-emerald-300 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">+12.5% this month</span>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-blue-200">Account Number</span>
                        <span className="text-white font-mono font-medium">•••• 4829</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-1">
                        {["Transfer", "Deposit", "Withdraw"].map((action) => (
                          <div key={action} className="bg-white/15 hover:bg-white/25 rounded-xl p-2.5 text-center cursor-pointer transition">
                            <span className="text-white text-xs font-medium">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mini transaction list */}
                    <div className="space-y-2">
                      {[
                        { label: "Received from Emeka", amount: "+₦50,000", color: "text-emerald-300" },
                        { label: "Airtime Purchase", amount: "-₦2,000", color: "text-red-300" },
                      ].map((tx) => (
                        <div key={tx.label} className="flex justify-between items-center bg-white/10 rounded-xl px-3 py-2">
                          <span className="text-blue-100 text-xs">{tx.label}</span>
                          <span className={`text-xs font-semibold ${tx.color}`}>{tx.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl px-3 py-2 shadow-xl flex items-center space-x-2 border border-gray-100">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-xs font-semibold text-gray-700">Verified</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl px-3 py-2.5 shadow-xl border border-gray-100">
                  <p className="text-xs text-gray-500">Just transferred</p>
                  <p className="text-sm font-bold text-gray-900">₦50,000 →</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll hint */}
          <div className="flex justify-center mt-16">
            <a href="#features" className="flex flex-col items-center text-gray-400 hover:text-blue-500 transition group">
              <span className="text-xs mb-1">Explore</span>
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-14 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                <div className="text-3xl md:text-4xl font-bold text-white mb-1 group-hover:text-blue-400 transition">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Why TrustWave</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Everything you need,</h2>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-400">in one place.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group relative bg-white border border-gray-100 rounded-2xl p-6 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-50 transition-all duration-300 cursor-default"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">Our Services</span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Comprehensive Banking</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">From everyday banking to long-term investments — we've got you covered.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((service, i) => (
              <div
                key={i}
                className="group bg-white rounded-2xl p-7 border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300"
              >
                <div className={`bg-gradient-to-br ${service.color} w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-500 text-sm mb-5 leading-relaxed">{service.description}</p>
                <a href="#" className="inline-flex items-center space-x-1.5 text-blue-600 font-semibold text-sm group-hover:space-x-2.5 transition-all">
                  <span>Learn more</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
            {/* Text */}
            <div className="space-y-6">
              <span className="text-blue-600 font-semibold text-sm tracking-wider uppercase">About Us</span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Built for Nigeria,<br />
                <span className="text-blue-600">Trusted Globally.</span>
              </h2>
              <p className="text-gray-500 leading-relaxed">
                TrustWave Bank was founded in 2020 with a single mission: to make financial services
                accessible, transparent, and powerful for every Nigerian. We believe that modern banking
                shouldn't be complicated or exclusive.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Today, we serve over 500,000 active users across Nigeria, processing over ₦2 trillion
                in transactions annually. Our team of 200+ passionate professionals works tirelessly
                to deliver the best digital banking experience in Africa.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4">
                {[
                  { icon: <Users className="h-5 w-5" />, label: "200+ Team Members" },
                  { icon: <Award className="h-5 w-5" />, label: "CBN Licensed" },
                  { icon: <Target className="h-5 w-5" />, label: "Since 2020" },
                ].map((item, i) => (
                  <div key={i} className="bg-blue-50 rounded-2xl p-4 text-center">
                    <div className="text-blue-600 flex justify-center mb-2">{item.icon}</div>
                    <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform rotate-3" />
              <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 space-y-4">
                <h3 className="text-white font-bold text-xl mb-6">Our Mission</h3>
                {[
                  "Democratize access to financial services across Africa",
                  "Build tools that empower individuals and businesses",
                  "Maintain the highest standards of security and trust",
                  "Drive financial literacy in our communities",
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <div className="bg-white/20 rounded-full p-1 mt-0.5 flex-shrink-0">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                    <p className="text-blue-100 text-sm leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="text-center mb-12 space-y-2">
            <h3 className="text-3xl font-bold text-gray-900">Meet Our Leadership</h3>
            <p className="text-gray-500">The team driving Nigeria's financial future</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, i) => (
              <div key={i} className="bg-gray-50 rounded-2xl p-6 text-center hover:shadow-lg transition group border border-gray-100">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform`}>
                  <span className="text-white font-bold text-lg">{member.initials}</span>
                </div>
                <h4 className="font-bold text-gray-900 text-lg">{member.name}</h4>
                <p className="text-gray-500 text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/20 rounded-full blur-3xl" />
        <div className="max-w-3xl mx-auto text-center relative space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            Ready to take control<br />of your finances?
          </h2>
          <p className="text-gray-400 text-lg">
            Join 500,000+ Nigerians who trust TrustWave for their daily banking needs.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 hover:shadow-2xl hover:shadow-blue-900/50"
          >
            <span>Open Your Free Account</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-gray-600 text-sm">No credit card required • Set up in 2 minutes • CBN Licensed</p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 border-t border-gray-800 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <img src="/TrustFoot.png" alt="TrustWave" className="h-16 w-40 object-contain mb-3" />
              <p className="text-sm leading-relaxed">Modern banking for the digital age, built for Nigeria.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Security", "API"] },
              { title: "Company", links: ["About", "Careers", "Contact", "Blog"] },
              { title: "Legal", links: ["Privacy", "Terms", "Security", "Cookies"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="text-white font-semibold mb-4 text-sm">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm hover:text-white transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm">&copy; 2026 TrustWave Bank. All rights reserved.</p>
            <p className="text-xs text-gray-600">Licensed by the Central Bank of Nigeria (CBN)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}