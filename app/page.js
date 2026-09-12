import { getSiteData } from '@/lib/site-data'
import LandingPage from '@/components/landing/landing'

export const revalidate = 300

export default async function Page() {
  const initialData = await getSiteData()
  return <LandingPage initialData={initialData} />
}