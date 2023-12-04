import { useQuery } from '@tanstack/react-query'

import Footer from '@/features/footer'
import Page from '@/features/page'

import { commentsService } from './api'
import { useAuth } from './features/page/hooks'

export default function App() {
  const session = useAuth()
  const { data } = useQuery({
    queryKey: ['tooltips'],
    queryFn: () => commentsService.getTooltips(),
    enabled: !!session
  })
  return (
    <>
      {session && data?.map((tooltip) => <Page x={tooltip.x} y={tooltip.y} key={tooltip.tooltip_id} />)}
      <Footer />
    </>
  )
}
