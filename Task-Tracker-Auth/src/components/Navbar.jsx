import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-slate-800/95 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <span className="text-xl font-medium text-slate-200">TaskFlow</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <span className="text-slate-400 text-sm">
                  Welcome, <span className="text-slate-300 font-medium">{user?.name}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-slate-600/50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-slate-200 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-slate-600/50"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-400 hover:text-slate-200 p-2 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-700/50">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-slate-400 text-sm">
                    Welcome, <span className="text-slate-300 font-medium">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-slate-300 hover:text-slate-200 hover:bg-slate-700/50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
