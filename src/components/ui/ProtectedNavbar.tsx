import { User, Menu } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import Logo from "@/assets/logo.png";

const ProtectedNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-mainBg border-b border-customprimary shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand Section */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={Logo} alt="TrendBits Logo" className="w-8 h-8" />
              <div className="hidden sm:block">
                <h1 className="font-fredoka font-semibold text-xl text-primaryDark">
                  TrendBits
                </h1>
                <p className="text-xs text-gray-600 -mt-1">Discover AI Trends</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/prompt"
              className={`transition-colors font-medium text-sm px-3 py-2 rounded-md ${
                isActive('/prompt')
                  ? 'text-white bg-customprimary'
                  : 'text-gray-700 hover:text-primaryDark hover:bg-secondaryBg'
              }`}
            >
              Prompts
            </Link>
            <Link
              to="/"
              className={`transition-colors font-medium text-sm px-3 py-2 rounded-md ${
                isActive('/history')
                  ? 'text-white bg-customprimary'
                  : 'text-gray-700 hover:text-primaryDark hover:bg-secondaryBg'
              }`}
            >
              History
            </Link>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                  isActive('/profile')
                    ? 'bg-customprimary text-white'
                    : 'text-gray-700 hover:text-primaryDark hover:bg-secondaryBg'
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  isActive('/profile') 
                    ? 'bg-white text-customprimary' 
                    : 'bg-customprimary text-white'
                  }`}>
                  <User size={14} className={`${
                    isActive('/profile') ? 'text-customprimary' : 'text-white'
                  }`} />
                </div>
                <span className="hidden sm:block font-medium text-sm">
                  Profile
                </span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-primaryDark hover:bg-secondaryBg rounded-lg transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-customprimary bg-secondaryBg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/prompt"
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors font-medium text-sm ${
                  isActive('/prompt')
                    ? 'text-white bg-customprimary'
                    : 'text-gray-700 hover:text-primaryDark hover:bg-mainBg'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Prompt
              </Link>
              <Link
                to="/"
                className={`block w-full text-left px-3 py-2 rounded-md transition-colors font-medium text-sm ${
                  isActive('/history')
                    ? 'text-white bg-customprimary'
                    : 'text-gray-700 hover:text-primaryDark hover:bg-mainBg'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                History
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default ProtectedNavbar;