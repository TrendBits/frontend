import Profile from '@/pages/protected/Profile'
import { createFileRoute } from '@tanstack/react-router'
import { getUserProfile } from '@/api/auth.api'

export const Route = createFileRoute('/_protected/_auth/profile')({
  beforeLoad: async () => {
    try {
      const response = await getUserProfile();
      return {
        userProfile: response.data
      };
    } catch (error) {
      return {
        userProfile: {
          username: 'User',
          email: 'user@example.com'
        }
      };
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <Profile/>
}
