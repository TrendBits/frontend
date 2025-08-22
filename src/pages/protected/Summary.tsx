import { ArrowLeft, Clock, FileText, Lightbulb, Target, Copy, Download, UserPlus, AlertCircle } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";
import type { SummaryResponse } from "../../api/api.types";
import { getAuthState } from "../../util/auth.util";

interface SummaryProps {
  data: SummaryResponse;
}

// Helper function to detect if content contains markdown
const isMarkdown = (text: string): boolean => {
  const markdownPatterns = [
    /\*\*.*?\*\*/, // Bold
    /\*.*?\*/, // Italic
    /^#{1,6}\s/m, // Headers
    /^\* /m, // Unordered lists
    /^\d+\. /m, // Ordered lists
  ];
  return markdownPatterns.some((pattern) => pattern.test(text));
};

// markdown parser for basic summary formatting
const parseSimpleMarkdown = (text: string) => {
  return (
    text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-gray-700 mt-4">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-gray-800 mt-5">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold text-gray-800 mt-0">$1</h1>')
      .replace(/^\* (.*$)/gm, '<li class="text-gray-700 mb-1">$1</li>')
      // Handle regular markdown links: [text](url)
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 hover:underline">$1</a>')
      .split("\n\n")
      .map((paragraph) => {
        const trimmed = paragraph.trim();
        if (!trimmed) return "";

        // If it's a heading, return as is
        if (trimmed.includes("<h1") || trimmed.includes("<h2") || trimmed.includes("<h3")) {
          return trimmed;
        }

        // If it's a list item, return as is
        if (trimmed.includes("<li")) {
          return trimmed;
        }

        // For regular text, wrap in paragraph tags
        return `<p class="text-gray-700 leading-relaxed mb-3">${trimmed.replace(/\n/g, " ")}</p>`;
      })
      .filter((content) => content.trim() !== "") // Remove empty content
      .join("")
  );
};

// Content renderer component
const ContentRenderer = ({ content, className = "" }: { content: string; className?: string }) => {
  if (isMarkdown(content)) {
    return <div className={`prose prose-sm max-w-none ${className}`} dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(content) }} />;
  }
  return <div className={className}>{content}</div>;
};

const Summary = ({ data }: SummaryProps) => {
  const [copied, setCopied] = useState(false);
  const authState = getAuthState();
  const isGuest = authState === 'guest';
  const isAuthenticated = authState === 'authenticated';

  const handleCopy = async () => {
    try {
      const textToCopy = `${data.headline}\n\n${data.summary}\n\nKey Points:\n${data.key_points.map(point => `• ${point}`).join('\n')}\n\n${data.call_to_action}`;
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const content = `${data.headline}\n\n${data.summary}\n\nKey Points:\n${data.key_points.map(point => `• ${point}`).join('\n')}\n\n${data.call_to_action}\n\nReferences:\n${data.references.map(ref => `• ${ref.title} - ${ref.url}`).join('\n')}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.headline.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };


  return (
    <RootLayout className="bg-mainBg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8 animate-slide-up">
          <Link to="/prompt" className="inline-flex items-center gap-2 text-customprimary hover:text-primaryDark font-medium mb-6 transition-all hover:translate-x-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>

          {/* Guest User Upgrade Prompt */}
          {isGuest && data.guest_info && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6 animate-fade-in-up">
              <div className="flex items-start gap-3">
                <UserPlus className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Enjoying TrendBits?</h3>
                  <p className="text-sm text-blue-700 mb-3">
                    You have {data.guest_info.requests_remaining} free {data.guest_info.requests_remaining === 1 ? 'prompt' : 'prompts'} remaining. 
                    Sign up for unlimited access and save your summaries to history!
                  </p>
                  <div className="flex gap-2">
                    <Link 
                      to="/auth/register" 
                      className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Sign Up Free
                    </Link>
                    <Link 
                      to="/auth/login" 
                      className="px-3 py-1.5 border border-blue-300 text-blue-700 text-sm rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-fade-in-up">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-4">
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 mb-3">
                  <FileText className="w-6 h-6 text-customprimary mb-2 sm:mb-0" />
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-800 font-fredoka">{data.headline}</h1>
                </div>
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                  </div>
                  {!data.saved_to_history && isGuest && (
                    <div className="flex items-center gap-2 text-amber-600">
                      <AlertCircle className="w-4 h-4" />
                      <span>Not saved - Sign up to save</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-lightGray/80 hover:bg-customprimary/20 text-gray-700 hover:text-customprimary rounded-lg transition-all hover:scale-105"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? "Copied!" : "Copy"}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-customprimary/20 hover:bg-customprimary/30 text-customprimary rounded-lg transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Search Term */}
            <div className="bg-lightGray/60 rounded-lg p-3 mb-4">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">Original Search Term:</h3>
              <p className="text-xs sm:text-sm text-gray-800 font-medium">{data.searchTerm}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-slide-in-left">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-customprimary" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-fredoka">Summary</h2>
            </div>
            <div className="bg-lightGray/80 rounded-lg p-4">
              <ContentRenderer content={data.summary} className="text-gray-700 leading-relaxed whitespace-pre-wrap" />
            </div>
          </div>

          {/* Key Points Section */}
          {data.key_points && data.key_points.length > 0 && (
            <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-slide-in-right">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-customprimary" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-fredoka">Key Points</h2>
              </div>
              <div className="bg-lightGray/80 rounded-lg p-4">
                <ul className="space-y-3">
                  {data.key_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3 animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                      <span className="w-2 h-2 bg-customprimary rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* References Section */}
          {data.references && data.references.length > 0 && (
            <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-customprimary" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-fredoka">References</h2>
              </div>
              <div className="bg-lightGray/80 rounded-lg p-4">
                <div className="grid gap-4">
                  {data.references.map((reference, index) => (
                    <div key={index} className="border-l-4 border-customprimary pl-4 animate-slide-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start gap-2">
                          <a
                            href={reference.url.replace(/`/g, "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium text-sm break-words"
                          >
                            {reference.title}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="font-medium">{reference.source}</span>
                          <span>•</span>
                          <span>{new Date(reference.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Call to Action Section */}
          {data.call_to_action && (
            <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-fade-in-up-delay">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-customprimary" />
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 font-fredoka">Next Steps</h2>
              </div>
              <div className="bg-lightGray/80 rounded-lg p-4">
                <ContentRenderer content={data.call_to_action} className="text-gray-700 leading-relaxed" />
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-3 sm:p-6 animate-fade-in-up-delay">
            <h2 className="text-xl font-semibold text-gray-800 font-fredoka mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/prompt"
                search={{ prompt: data.searchTerm }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-customprimary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
              >
                <FileText className="w-4 h-4" />
                Search Similar Topics
              </Link>
              
              {isAuthenticated && (
                <Link
                  to="/history"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  <Clock className="w-4 h-4" />
                  View History
                </Link>
              )}
              
              {isGuest && (
                <Link
                  to="/auth/register"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up to Save
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Summary;
