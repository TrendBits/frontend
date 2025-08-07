import { ArrowLeft, Clock, FileText, Lightbulb, Target, Copy, Download } from "lucide-react";
import { RootLayout } from "../../components/Layouts";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { useState } from "react";

interface SummaryData {
  id: string;
  search_term: string;
  headline: string;
  summary: string;
  key_points: string[];
  call_to_action: string;
  created_at: string;
  updated_at: string;
}

interface SummaryProps {
  data: SummaryData;
}

const Summary = ({ data }: SummaryProps) => {
  const [copied, setCopied] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCopy = async () => {
    const content = `${data.headline}\n\n${data.summary}\n\nKey Points:\n${data.key_points.map(point => `• ${point}`).join('\n')}\n\n${data.call_to_action}`;
    
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Summary copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleDownload = () => {
    const content = `${data.headline}\n\n${data.summary}\n\nKey Points:\n${data.key_points.map(point => `• ${point}`).join('\n')}\n\n${data.call_to_action}\n\nGenerated on: ${formatDate(data.created_at)}`;
    
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link
            to="/history"
            className="inline-flex items-center gap-2 text-customprimary hover:text-primaryDark font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to History
          </Link>
          
          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6 text-customprimary" />
                  <h1 className="text-2xl font-bold text-gray-800 font-fredoka">
                    {data.headline}
                  </h1>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Created: {formatDate(data.created_at)}</span>
                  </div>
                  {data.updated_at !== data.created_at && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>Updated: {formatDate(data.updated_at)}</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-lightGray/80 hover:bg-customprimary/20 text-gray-700 hover:text-customprimary rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-customprimary/20 hover:bg-customprimary/30 text-customprimary rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>
            
            {/* Search Term */}
            <div className="bg-lightGray/60 rounded-lg p-3 mb-4">
              <h3 className="text-xs font-semibold text-gray-600 mb-1">Original Search Term:</h3>
              <p className="text-sm text-gray-800 font-medium">{data.search_term}</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Summary Section */}
          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-customprimary" />
              <h2 className="text-xl font-semibold text-gray-800 font-fredoka">Summary</h2>
            </div>
            <div className="bg-lightGray/80 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{data.summary}</p>
            </div>
          </div>

          {/* Key Points Section */}
          {data.key_points && data.key_points.length > 0 && (
            <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-5 h-5 text-customprimary" />
                <h2 className="text-xl font-semibold text-gray-800 font-fredoka">Key Points</h2>
              </div>
              <div className="bg-lightGray/80 rounded-lg p-4">
                <ul className="space-y-3">
                  {data.key_points.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="w-2 h-2 bg-customprimary rounded-full mt-2 flex-shrink-0"></span>
                      <p className="text-gray-700 leading-relaxed">{point}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Call to Action Section */}
          {data.call_to_action && (
            <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-customprimary" />
                <h2 className="text-xl font-semibold text-gray-800 font-fredoka">Call to Action</h2>
              </div>
              <div className="bg-customprimary/20 backdrop-blur-sm rounded-lg p-4 border border-customprimary/30">
                <p className="text-customprimary font-medium leading-relaxed">{data.call_to_action}</p>
              </div>
            </div>
          )}

          {/* Actions Section */}
          <div className="bg-secondaryBg/90 backdrop-blur-sm rounded-xl border border-customprimary/20 p-6">
            <h2 className="text-xl font-semibold text-gray-800 font-fredoka mb-4">Actions</h2>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/prompt"
                search={{ prompt: data.search_term }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-customprimary text-white rounded-lg hover:bg-primaryDark transition-colors font-medium"
              >
                <FileText className="w-4 h-4" />
                Use Search Term Again
              </Link>
              <Link
                to="/history"
                className="inline-flex items-center gap-2 px-4 py-2 bg-lightGray/80 hover:bg-customprimary/20 text-gray-700 hover:text-customprimary rounded-lg transition-colors font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </RootLayout>
  );
};

export default Summary;