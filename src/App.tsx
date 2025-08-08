import { ArrowRight, TrendingUp, Zap, Users } from 'lucide-react';
import Logo from './assets/logo.png';
import './App.css';
import { Link } from '@tanstack/react-router';

function App() {
  return (
    <div className="min-w-dvw min-h-dvh bg-mainBg">
      {/* Header */}
      <header className="bg-mainBg border-b border-customprimary/20 fixed top-0 left-0 right-0 z-50 backdrop-blur-sm bg-mainBg/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
           <div className="flex items-center gap-3 animate-fade-in-left">
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

            <div className="flex items-center gap-4 animate-fade-in-right">
              <a 
                href="/auth/login" 
                className="text-gray-700 hover:text-primaryDark transition-colors font-medium"
              >
                Login
              </a>
              <a 
                href="/auth/register" 
                className="bg-customprimary text-white px-4 py-2 rounded-lg hover:bg-primaryDark transition-colors font-medium"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Reduced Height with Animations */}
      <main className="pt-16">
        <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-fredoka font-bold text-gray-900 mb-6 animate-slide-up">
              Discover the Latest
              <span className="text-customprimary block animate-slide-up-delay">Trends</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto font-poppins animate-fade-in-up">
              Get AI-powered summaries of trending topics across any field. 
              Stay ahead with intelligent insights and comprehensive analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up-delay">
              <Link
                to="/prompt" 
                className="bg-customprimary text-white px-8 py-4 rounded-lg hover:bg-primaryDark transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium flex items-center justify-center gap-2 text-lg group"
              >
                Start Exploring 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/history" 
                className="border-2 border-customprimary text-customprimary px-8 py-4 rounded-lg hover:bg-customprimary hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium text-lg"
              >
                View Examples
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-3xl font-fredoka font-bold text-gray-900 mb-4">
              Why Choose TrendBits?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI to deliver the most relevant and up-to-date trend analysis
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-secondaryBg rounded-xl border border-customprimary/10 hover:border-customprimary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-in-left">
              <div className="w-16 h-16 bg-customprimary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-customprimary/20 transition-colors">
                <TrendingUp className="w-8 h-8 text-customprimary" />
              </div>
              <h3 className="text-xl font-fredoka font-semibold text-gray-900 mb-2">
                Real-time Trends
              </h3>
              <p className="text-gray-600">
                Access the latest trending topics and developments across multiple industries and platforms.
              </p>
            </div>
            
            <div className="text-center p-6 bg-secondaryBg rounded-xl border border-customprimary/10 hover:border-customprimary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-in-up">
              <div className="w-16 h-16 bg-customprimary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-customprimary/20 transition-colors">
                <Zap className="w-8 h-8 text-customprimary" />
              </div>
              <h3 className="text-xl font-fredoka font-semibold text-gray-900 mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Get intelligent summaries, key points, and actionable insights generated by advanced AI.
              </p>
            </div>
            
            <div className="text-center p-6 bg-secondaryBg rounded-xl border border-customprimary/10 hover:border-customprimary/30 transition-all duration-300 hover:scale-105 hover:shadow-lg animate-slide-in-right">
              <div className="w-16 h-16 bg-customprimary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-customprimary/20 transition-colors">
                <Users className="w-8 h-8 text-customprimary" />
              </div>
              <h3 className="text-xl font-fredoka font-semibold text-gray-900 mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600">
                Discover what's trending based on community discussions and expert analysis.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="bg-gradient-to-r from-customprimary to-primaryDark rounded-2xl p-12 text-center text-white animate-fade-in-up hover:scale-[1.02] transition-transform duration-300">
            <h2 className="text-3xl font-fredoka font-bold mb-4">
              Ready to Stay Ahead of the Curve?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of users discovering the latest trends with AI-powered insights.
            </p>
            <Link
              to="/auth/register" 
              className="bg-white text-customprimary px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-lg font-medium text-lg inline-flex items-center gap-2 group"
            >
              Get Started Free 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondaryBg border-t border-customprimary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center animate-fade-in-up">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src={Logo} alt="TrendBits Logo" className="w-6 h-6" />
              <span className="font-fredoka font-semibold text-primaryDark">
                TrendBits
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 TrendBits. Discover AI Trends with Intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
