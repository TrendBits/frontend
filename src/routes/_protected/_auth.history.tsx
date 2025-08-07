import History from '@/pages/protected/History'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

const historySearchSchema = z.object({
  page: z.number().catch(1).default(1),
  limit: z.number().catch(10).default(10),
  q: z.string().optional(),
})

export const Route = createFileRoute('/_protected/_auth/history')({
  validateSearch: historySearchSchema,
  component: RouteComponent,
})

function RouteComponent() {
  return <History/>
}
