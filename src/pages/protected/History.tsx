import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Search, Clock, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { getPromptHistoryList } from "../../api/prompts.api";
import { toast } from "sonner";

// Update the interface to match the API response
interface HistoryItem {
  id: string;
  search_term: string;
  headline: string;
  summary: string;
  key_points: string[];
  call_to_action: string;
  created_at: string;
  updated_at: string;
}

const History = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/_protected/_auth/history/' });
  const [searchQuery, setSearchQuery] = useState(search.q || "");
  
  const { page = 1, limit = 10, q } = search;

  // Fetch history data with React Query
  const { data: historyData, isLoading, error } = useQuery({
    queryKey: ['promptHistory', page, limit, q],
    queryFn: () => getPromptHistoryList({ page, limit, q }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Update data extraction to match API structure
  const historyItems: HistoryItem[] = historyData?.data?.trends || [];
  const totalItems = historyData?.data?.pagination?.total_items || 0;
  const totalPages = historyData?.data?.pagination?.total_pages || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: '/history',
      search: { page: 1, limit, q: searchQuery.trim() || undefined }
    });
  };

  const handlePageChange = (newPage: number) => {
    navigate({
      to: '/',
      search: { page: newPage, limit, q }
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (error) {
    toast.error("Failed to load history. Please try again.");
  }

  return (
    <RootLayout className="bg-mainBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-8 h-8 text-customprimary" />
            <h1 className="text-3xl font-bold text-gray-800 font-fredoka">Prompt History</h1>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="w-full bg-mainBg shadow-md rounded-xl border border-customprimary mb-6">
          <form onSubmit={handleSearch} className="bg-transparent flex items-center p-4 rounded-lg gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search your prompts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="outline-none border-none w-full bg-transparent text-sm text-gray-800 py-2 font-poppins pl-10 pr-4 h-10"
              />
            </div>
            <button
              type="submit"
              className="text-sm transition-all px-4 py-2 bg-primaryDark text-white hover:bg-customprimary rounded-md flex items-center font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </button>
          </form>
        </div>

        {/* History List */}
        <div className="space-y-4 mb-8">
          {isLoading ? (
            // Loading State
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-4 bg-customprimary/30 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-customprimary/20 rounded w-1/2"></div>
                    </div>
                    <div className="h-6 bg-customprimary/25 rounded-full w-20"></div>
                  </div>
                  <div className="h-3 bg-customprimary/20 rounded w-full mb-2"></div>
                  <div className="h-3 bg-customprimary/15 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : historyItems.length > 0 ? (
            // History Items
            // Update the history item rendering
            historyItems.map((item) => (
              <div key={item.id} className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 hover:border-customprimary hover:shadow-lg hover:bg-secondaryBg transition-all p-6 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-customprimary" />
                      <h3 className="font-semibold text-gray-800 group-hover:text-primaryDark transition-colors">
                        {item.headline}
                      </h3>
                    </div>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4" />
                      {formatDate(item.created_at)}
                    </p>
                    <p className="text-xs text-gray-400 mb-3">
                      Search: {item.search_term.length > 80 ? `${item.search_term.substring(0, 80)}...` : item.search_term}
                    </p>
                  </div>
                </div>
                
                <div className="bg-lightGray/80 backdrop-blur-sm rounded-lg p-4 mb-4 border border-customprimary/15">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {item.summary.length > 300 ? `${item.summary.substring(0, 300)}...` : item.summary}
                  </p>
                  
                  {item.key_points && item.key_points.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-xs font-semibold text-gray-600 mb-2">Key Points:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {item.key_points.slice(0, 3).map((point, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="w-1 h-1 bg-customprimary rounded-full mt-2 flex-shrink-0"></span>
                            <span>{point.length > 100 ? `${point.substring(0, 100)}...` : point}</span>
                          </li>
                        ))}
                        {item.key_points.length > 3 && (
                          <li className="text-customprimary font-medium">+{item.key_points.length - 3} more points</li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {item.call_to_action && (
                    <div className="bg-customprimary/20 backdrop-blur-sm rounded p-2 mt-3 border border-customprimary/30">
                      <p className="text-xs text-customprimary font-medium">{item.call_to_action}</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-400">
                    ID: {item.id.split('-')[0]}...
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      to="/history/$summary_id"
                      params={{ summary_id: item.id }}
                      className="text-customprimary hover:text-primaryDark font-medium text-sm transition-colors"
                    >
                      View Details →
                    </Link>
                    <Link
                      to="/prompt"
                      search={{ prompt: item.search_term }}
                      className="text-gray-600 hover:text-customprimary font-medium text-sm transition-colors"
                    >
                      Use Search Term →
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                {q ? 'No prompts found' : 'No prompts yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {
                  q 
                    ? `No prompts match your search for "${q}".` 
                    : 'Start creating prompts to see your history here.'
                }
              </p>
              {q ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    navigate({ 
                      to: '/',
                      search: { page: 1, limit } 
                    });
                  }}
                  className="px-4 py-2 text-customprimary hover:text-primaryDark font-medium transition-colors"
                >
                  Clear search
                </button>
              ) : (
                <Link
                  to="/prompt"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-customprimary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
                >
                  <FileText className="w-4 h-4" />
                  Create Your First Prompt
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Stats and Pagination - moved to bottom */}
        {!isLoading && (
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600 text-sm">
                {q ? (
                  <>Showing results for "<span className="font-medium text-gray-800">{q}</span>" • </>
                ) : null}
                <span className="font-medium">{totalItems}</span> total prompts
              </p>
              {totalPages > 0 && (
                <div className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </div>
              )}
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page <= 1}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primaryDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          pageNum === page
                            ? 'bg-customprimary text-white'
                            : 'text-gray-600 hover:bg-secondaryBg hover:text-primaryDark'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primaryDark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </RootLayout>
  );
};

export default History;