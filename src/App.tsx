import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import Footer from '@/features/footer'
import { isOpenAtom, tooltipAtom } from '@/store'

import { commentsService } from './api'
import Highlight from './features/page/components/highlight'
import { Tooltip } from './features/page/components/tooltip'
import { useAuth } from './features/page/hooks'

export default function App() {
  const isOpen = useAtomValue(isOpenAtom)
  const session = useAuth()
  const { data: serverTooltips } = useQuery({
    queryKey: ['tooltips'],
    queryFn: () => commentsService.getTooltips(),
    enabled: !!session
  })
  const clientTooltip = useAtomValue(tooltipAtom)

  return (
    <>
      {isOpen && <Highlight />}
      {/* server tooltips */}
      {isOpen &&
        session &&
        serverTooltips?.map((tooltip) => <Tooltip x={tooltip.x} y={tooltip.y} key={tooltip.tooltip_id} />)}
      {/* client tooltip */}
      {isOpen && <Tooltip x={clientTooltip.x} y={clientTooltip.y} />}
      <Footer />
    </>
  )
}
