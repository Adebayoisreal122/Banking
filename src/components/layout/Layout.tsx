import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Receipt,
  Menu,
  X,
  LogOut,
  Settings,
  Clock,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Transfer', href: '/transfer', icon: ArrowUpRight },
    { name: 'Withdraw', href: '/withdraw', icon: ArrowDownLeft },
    { name: 'Loans', href: '/loans', icon: DollarSign },
    { name: 'Pay Bills', href: '/bills', icon: Receipt },
    { name: 'Transactions', href: '/transactions', icon: Clock },
  ];

  const bottomNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ item, onClick }: { item: typeof navigation[0]; onClick?: () => void }) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.href;
    return (
      <Link
        to={item.href}
        onClick={onClick}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl mb-1 transition-all duration-200 group ${
          isActive
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <Icon className={`mr-3 h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : ''}`} />
        <span>{item.name}</span>
        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/70" />}
      </Link>
    );
  };

  const SidebarContent = ({ onLinkClick }: { onLinkClick?: () => void }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-100">
        <img src="/TrustWave.png" alt="TrustWave" className="h-36 w-48 object-contain" />
      </div>

      {/* User info */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex items-center space-x-3 bg-gray-50 rounded-xl px-3 py-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Main Menu</p>
        {navigation.map((item) => (
          <NavLink key={item.name} item={item} onClick={onLinkClick} />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        {bottomNavigation.map((item) => (
          <NavLink key={item.name} item={item} onClick={onLinkClick} />
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group mt-1"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
        >
          <X className="h-5 w-5" />
        </button>
        <SidebarContent onLinkClick={() => setSidebarOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 shadow-sm">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 lg:pl-64 min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-gray-100 shadow-sm sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Breadcrumb */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-900 capitalize">
                {location.pathname.replace('/', '') || 'Dashboard'}
              </p>
              <p className="text-xs text-gray-400">TrustWave Bank</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/settings"
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <Settings className="h-5 w-5" />
            </Link>
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-xl">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user?.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">
                      {user?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.fullName}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}