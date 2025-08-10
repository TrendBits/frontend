import { createFileRoute, useLocation } from '@tanstack/react-router';
import Summary from '@/pages/protected/Summary';
import type { SummaryResponse } from '@/api/api.types';

export const Route = createFileRoute('/_protected/_auth/summary')({
  component: RouteComponent,
  errorComponent: ({ error }) => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Summary</h2>
        <p className="text-gray-600">{error.message}</p>
        <p className="text-sm text-gray-500 mt-2">Please try generating a new summary.</p>
      </div>
    </div>
  )
});

function RouteComponent() {
  const location = useLocation();
  const summaryData = (location.state as any)?.summaryData as SummaryResponse;
  
  // Fallback if no data is provided
  if (!summaryData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">No Summary Data</h2>
          <p className="text-gray-600 mb-4">Please generate a new summary to view results.</p>
          <a href="/prompt" className="text-customprimary hover:underline">Go to Prompt Page</a>
        </div>
      </div>
    );
  }
  
  return <Summary data={summaryData} />;
}