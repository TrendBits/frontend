import { User, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";
import { getAuthState } from "@/util/auth.util";

const ProtectedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const authState = getAuthState();
  const isAuthenticated = authState === 'authenticated';

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-mainBg border-b border-customprimary shadow-sm sticky top-0 z-50 w-full min-w-vw">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src={Logo} alt="TrendBits Logo" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="font-fredoka font-semibold text-xl text-primaryDark">
                  TrendBits
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Discover AI Trends</p>
              </div>
            </Link>
          </div>

          {/* Centered Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-center">
            {/* Always show Prompt link */}
            <Link
              to="/prompt"
              className={`transition-colors font-medium text-sm px-3 py-2 rounded-md ${
                isActive('/prompt')
                  ? 'text-white bg-customprimary'
                  : 'text-gray-700 hover:text-customprimary hover:bg-customprimary/10'
              }`}
            >
              Prompts
            </Link>

            {/* Show History only for authenticated users */}
            {isAuthenticated && (
              <Link
                to="/history"
                className={`transition-colors font-medium text-sm px-3 py-2 rounded-md ${
                  isActive('/history')
                    ? 'text-white bg-customprimary'
                    : 'text-gray-700 hover:text-customprimary hover:bg-customprimary/10'
                }`}
              >
                History
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-3">
            {/* Authentication Actions */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className={`transition-colors font-medium text-sm px-3 py-2 rounded-md flex items-center gap-2 ${
                  isActive('/profile')
                    ? 'text-white bg-customprimary'
                    : 'text-gray-700 hover:text-customprimary hover:bg-customprimary/10'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/auth/login"
                  className="text-sm font-medium text-gray-700 hover:text-customprimary px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="text-sm font-medium bg-customprimary text-white px-4 py-2 rounded-md hover:bg-primaryDark transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-customprimary p-2 rounded-md transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-customprimary bg-secondaryBg">
            <div className="px-3 p-6 space-y-3">
              <div className="space-y-3">
                 <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">Navigation</div>
                   <Link
                  to="/prompt"
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive('/prompt')
                      ? 'text-white bg-customprimary shadow-md'
                      : 'text-gray-700 bg-gray-50 hover:bg-customprimary/10 hover:text-customprimary border border-gray-200 hover:border-customprimary/30'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className={`w-2 h-2 rounded-full ${
                    isActive('/prompt') ? 'bg-white' : 'bg-customprimary'
                  }`} />
                  Prompts
                </Link>
                  {isAuthenticated && (
                    <Link
                      to="/history"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/history')
                          ? 'text-white bg-customprimary shadow-md'
                          : 'text-gray-700 bg-gray-50 hover:bg-customprimary/10 hover:text-customprimary border border-gray-200 hover:border-customprimary/30'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        isActive('/history') ? 'bg-white' : 'bg-customprimary'
                      }`} />
                      History
                    </Link>
                  )}
              </div>

              {/* Authentication Section */}
              <div className="border-t border-gray-100 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                      Account
                    </div>
                    <Link
                      to="/profile"
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive('/profile')
                          ? 'text-white bg-customprimary shadow-md'
                          : 'text-gray-700 hover:text-customprimary hover:bg-customprimary/10'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">Get Started</div>
                    <div className="space-y-2">
                      <Link
                        to="/auth/login"
                        className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-700 hover:text-customprimary border border-gray-200 rounded-lg hover:border-customprimary transition-all duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        to="/auth/register"
                        className="block w-full text-center px-4 py-3 text-sm font-medium bg-customprimary text-white rounded-lg hover:bg-primaryDark transition-all duration-200 shadow-md hover:shadow-lg"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProtectedNavbar;