import { WandSparkles, AlertCircle, Users } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { getHotTrends } from "../../api/trends.api";
import { generateSummary } from "../../api/prompts.api";
import DynamicIcon from "../../components/ui/DynamicIcon";
import { toast } from "sonner";
import { 
  getAuthState, 
  validatePromptInput, 
  sanitizeInput, 
  getGuestData, 
  updateGuestData, 
  initializeGuestSession,
  canMakeRequest
} from "../../util/auth.util";
import type { SummaryResponse } from "../../api/api.types";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  const [charCount, setCharCount] = useState(0);
  const navigate = useNavigate();
  const search = useSearch({ from: '/_protected/_auth/prompt' });
  const authState = getAuthState();
  const guestData = getGuestData();
  
  // Initialize guest session if needed
  useEffect(() => {
    if (authState === 'unauthenticated' && !guestData) {
      initializeGuestSession();
    }
  }, [authState, guestData]);
  
  // Set initial prompt from URL query parameter
  useEffect(() => {
    if (search.prompt) {
      setPrompt(search.prompt);
      setCharCount(search.prompt.length);
    }
  }, [search.prompt]);
  
  // Fetch hot trends
  const { data: hotTrendsData, isLoading } = useQuery({
    queryKey: ['hotTrends'],
    queryFn: getHotTrends,
    staleTime: 12 * 60 * 60 * 1000,
    gcTime: 12 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Generate summary mutation with enhanced error handling
  const generateSummaryMutation = useMutation({
    mutationFn: async (searchPrompt: string) => {
      const validation = validatePromptInput(searchPrompt);
      if (!validation.valid) {
        throw new Error(validation.error);
      }
      
      const sanitizedPrompt = sanitizeInput(searchPrompt);
      return await generateSummary(sanitizedPrompt);
    },
    // In the generateSummaryMutation onSuccess handler
    onSuccess: (response) => {
      const data: SummaryResponse = response.data;
      
      // Update guest data if applicable
      if (data.guest_info && authState !== 'authenticated') {
        updateGuestData({
          requestsUsed: data.guest_info.requests_used,
          requestsRemaining: data.guest_info.requests_remaining,
          lastRequestTime: Date.now()
        });
      }
      
      toast.success("AI summary generated successfully!");
      
      navigate({ 
        to: '/summary',
        state: { summaryData: data } as any
      });
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate AI summary. Please try again.";
      toast.error(errorMessage);
      
      // Handle guest limit reached
      if (error?.response?.status === 403) {
        setTimeout(() => {
          navigate({ to: '/auth/register' });
        }, 2000);
      }
    },
  });

  // Extract topics from the API response
  const aiTopicSuggestions = hotTrendsData?.data?.topics || [];

  const handleSuggestionClick = (query: string) => {
    setPrompt(query);
    setCharCount(query.length);
  };

  const handlePromptChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    setCharCount(value.length);
  }, []);

  const handleSearch = () => {
    if (!canMakeRequest()) {
      toast.error("Please sign up to continue using TrendBits.");
      navigate({ to: '/auth/register' });
      return;
    }
    
    const validation = validatePromptInput(prompt);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }
    
    generateSummaryMutation.mutate(prompt.trim());
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSearch();
    }
  };

  const isInputValid = validatePromptInput(prompt).valid;
  const canSubmit = isInputValid && canMakeRequest() && !generateSummaryMutation.isPending;

  return (
    <RootLayout className="justify-center items-center flex bg-mainBg">
      <div className="relative justify-center items-center m-auto z-10 px-5 w-full max-w-4xl py-16 sm:py-0">
        <h1 className="text-center mb-6 text-sm sm:text-xl font-medium text-gray-700 animate-fade-in-up">
          Discover the Latest Trends in Any Field
        </h1>

        {/* Guest User Status */}
        {authState === 'guest' && guestData && (
          <div className="w-full md:w-[560px] mx-auto mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg animate-slide-up">
            {guestData.requestsRemaining > 0 ? (
              <>
                <div className="flex items-center gap-2 text-blue-700">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Guest Mode: {guestData.requestsRemaining} free {guestData.requestsRemaining === 1 ? 'prompt' : 'prompts'} remaining
                  </span>
                </div>
                {guestData.requestsRemaining <= 1 && (
                  <p className="text-xs text-blue-600 mt-1">
                    Sign up for unlimited prompts and access to history!
                  </p>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2 text-amber-700">
                <Users className="w-4 h-4" />
                <div>
                  <span className="text-sm font-medium block">
                    Guest Mode: No free prompts remaining
                  </span>
                  <p className="text-xs text-amber-600 mt-1">
                    Sign up now for unlimited prompts and access to history!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="w-full md:w-[560px] mx-auto bg-mainBg shadow-md rounded-xl border border-customprimary mb-6 animate-slide-up hover:shadow-lg transition-all duration-300">
          <div className="bg-transparent flex flex-col p-4 rounded-lg gap-2">
            <div className="relative">
              <textarea
                id="prompt"
                className="outline-none border-none w-full bg-transparent text-sm text-gray-800 py-1 font-poppins resize-none h-16 transition-all duration-200 focus:scale-[1.01]"
                placeholder="Search most recent AI trends (e.g., OpenAI funding, Google Gemini 2.5, Meta AI strategy)"
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyPress}
                disabled={generateSummaryMutation.isPending}
                maxLength={300}
              />
              
              {/* Character Counter */}
              <div className="absolute bottom-1 right-1 text-xs text-gray-400">
                {charCount}/300
              </div>
            </div>

            {/* Validation Error */}
            {prompt && !isInputValid && (
              <div className="flex items-center gap-2 text-red-600 text-xs">
                <AlertCircle className="w-3 h-3" />
                <span>{validatePromptInput(prompt).error}</span>
              </div>
            )}

            <div className="flex ml-auto items-center gap-2">
              <button 
                onClick={handleSearch}
                disabled={!canSubmit}
                className="text-sm transition-all duration-300 px-3 py-2 bg-primaryDark text-white hover:bg-customprimary hover:scale-105 hover:shadow-lg rounded-md flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <WandSparkles size={18} className="mr-2 group-hover:rotate-12 transition-transform duration-300" /> 
                {generateSummaryMutation.isPending ? 'Generating...' : 'Search AI Trends'}
              </button>
            </div>
          </div>
        </div>

        {/* AI Topic Suggestions */}
        {(aiTopicSuggestions && aiTopicSuggestions.length > 0) && (
          <div className="w-full max-w-4xl mx-auto animate-fade-in-up-delay">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800 text-center animate-pulse-glow">🔥 Trending AI Topics</h3>
              {isLoading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {aiTopicSuggestions.map((suggestion: any, index: number) => {
                const title = suggestion.title || 'AI Trend';
                const description = suggestion.description || 'Latest AI development';
                const query = suggestion.query || title;
                const iconName = suggestion.icon || 'TrendingUp';
                
                return (
                  <div
                    key={index}
                    onClick={() => handleSuggestionClick(query)}
                    className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-customprimary hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105 hover:-translate-y-1 animate-slide-in-card ${
                      !canMakeRequest() ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{
                      animationDelay: `${index * 0.1}s`
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-customprimary group-hover:text-primaryDark transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                        <DynamicIcon 
                          name={iconName} 
                          className="w-4 h-4" 
                          fallback="TrendingUp"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-primaryDark transition-colors duration-300">
                          {title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                          {description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="w-full max-w-4xl mx-auto text-center animate-fade-in-up">
            <div className="flex items-center justify-center gap-2 mb-4">
              <h3 className="text-lg font-semibold text-gray-800">🔥 Loading Trending AI Topics</h3>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center font-poppins animate-fade-in-up-slow">
          🤖 <strong>AI Insights:</strong> {aiTopicSuggestions.length > 0 ? 'Click on trending topics above or search for specific AI developments, funding news, or technology breakthroughs.' : 'Search for specific AI developments, funding news, or technology breakthroughs.'}
          {hotTrendsData?.data?.topics && (
            <span className="block mt-1 text-green-600 animate-bounce-subtle">✓ Latest trends loaded</span>
          )}
          {authState === 'guest' && (
            <span className="block mt-1 text-blue-600">✨ Sign up for unlimited access and history tracking</span>
          )}
        </p>
      </div>
    </RootLayout>
  );
};

export default Prompt;
