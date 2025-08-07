import { WandSparkles } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getHotTrends } from "../../api/trends.api";
import { generateSummary } from "../../api/prompts.api";
import DynamicIcon from "../../components/ui/DynamicIcon";
import { toast } from "sonner";
import ProtectedNavbar from "@/components/ui/ProtectedNavbar";

const Prompt = () => {
  const [prompt, setPrompt] = useState("");
  
  // Fetch hot trends with React Query - cache for 12 hours
  const { data: hotTrendsData, isLoading } = useQuery({
    queryKey: ['hotTrends'],
    queryFn: getHotTrends,
    staleTime: 12 * 60 * 60 * 1000, // 12 hours in milliseconds
    gcTime: 12 * 60 * 60 * 1000, // Keep in cache for 12 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Generate summary mutation
  const generateSummaryMutation = useMutation({
    mutationFn: (searchPrompt: string) => generateSummary(searchPrompt),
    onSuccess: (data) => {
      console.log('Summary generated:', data);
      toast.success("AI summary generated successfully!");
      // TODO: Handle successful summary generation (e.g., navigate to results page)
    },
    onError: (error: any) => {
      console.error('Error generating summary:', error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to generate AI summary. Please try again.";
      toast.error(errorMessage);
    },
  });

  // Extract topics from the API response
  const aiTopicSuggestions = hotTrendsData?.data?.topics || [];

  const handleSuggestionClick = (query: string) => {
    setPrompt(query);
  };

  const handleSearch = () => {
    if (prompt.trim()) {
      generateSummaryMutation.mutate(prompt.trim());
    }
  };

  return (
    <>
    <ProtectedNavbar/>
    <RootLayout className="justify-center items-center flex bg-mainBg">
        <div className="relative justify-center items-center m-auto z-10 px-5 w-full max-w-4xl py-16 sm:py-0">
          <h1 className="text-center mb-6 text-sm sm:text-xl font-medium text-gray-700">Discover the Latest Trends in Any Field</h1>

          <div className="w-full md:w-[560px] mx-auto bg-mainBg shadow-md rounded-xl border border-customprimary mb-6">
            <div className="bg-transparent flex flex-col p-4 rounded-lg gap-2">
              <textarea
                id="prompt"
                className="outline-none border-none w-full bg-transparent text-sm text-gray-800 py-1 font-poppins resize-none h-16"
                placeholder="Search most recent AI trends (e.g., OpenAI funding, Google Gemini 2.5, Meta AI strategy)"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={generateSummaryMutation.isPending}
              />

              <div className="flex ml-auto items-center gap-2">
                <button 
                  onClick={handleSearch}
                  disabled={!prompt.trim() || generateSummaryMutation.isPending}
                  className="text-sm transition-all px-3 py-2 bg-primaryDark text-white hover:bg-customprimary rounded-md flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <WandSparkles size={18} className="mr-2" /> 
                  {generateSummaryMutation.isPending ? 'Generating...' : 'Search AI Trends'}
                </button>
              </div>
            </div>
          </div>

          {/* AI Topic Suggestions */}
          {(aiTopicSuggestions && aiTopicSuggestions.length > 0) && (
            <div className="w-full max-w-4xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">🔥 Trending AI Topics</h3>
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
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-customprimary hover:shadow-md transition-all cursor-pointer group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-customprimary group-hover:text-primaryDark transition-colors">
                          <DynamicIcon 
                            name={iconName} 
                            className="w-4 h-4" 
                            fallback="TrendingUp"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm mb-1 group-hover:text-primaryDark transition-colors">
                            {title}
                          </h4>
                          <p className="text-xs text-gray-600 leading-relaxed">
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
            <div className="w-full max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <h3 className="text-lg font-semibold text-gray-800">🔥 Loading Trending AI Topics</h3>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-4 text-center font-poppins">
            🤖 <strong>AI Insights:</strong> {aiTopicSuggestions.length > 0 ? 'Click on trending topics above or search for specific AI developments, funding news, or technology breakthroughs.' : 'Search for specific AI developments, funding news, or technology breakthroughs.'}
            {hotTrendsData?.data?.topics && (
              <span className="block mt-1 text-green-600">✓ Latest trends loaded</span>
            )}
          </p>
        </div>
    </RootLayout>
    </>
  );
};

export default Prompt;
