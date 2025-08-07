import Summary from '@/pages/protected/Summary'
import { createFileRoute } from '@tanstack/react-router'
import { getPromptHistoryDetail } from '@/api/prompts.api'

export const Route = createFileRoute('/_protected/_auth/history/$summary_id')({
  component: RouteComponent,
  loader: async ({ params }) => {
    const summaryData = await getPromptHistoryDetail(params.summary_id)
    return {
      summaryData: summaryData.data
    }
  },
  errorComponent: ({ error }) => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Summary</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    </div>
  )
})

function RouteComponent() {
  const { summaryData } = Route.useLoaderData()
  return <Summary data={summaryData} />
}
