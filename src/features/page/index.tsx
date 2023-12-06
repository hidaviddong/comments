import { useAtomValue } from 'jotai'

import { currentRouteAtom, isOpenAtom, tooltipAtom } from '@/store'

import Highlight from './components/highlight'
import { Tooltip } from './components/tooltip'
import { useAuth, useTooltipsQuery } from './hooks'
export default function Page() {
  const isOpen = useAtomValue(isOpenAtom)
  const currentRoute = useAtomValue(currentRouteAtom)
  const session = useAuth()
  const { data: serverTooltips } = useTooltipsQuery(currentRoute)

  const clientTooltip = useAtomValue(tooltipAtom)
  return (
    <>
      {isOpen && <Highlight />}
      {/* server tooltips */}
      {isOpen &&
        session &&
        serverTooltips?.map((tooltip) => (
          <Tooltip x={tooltip.x} y={tooltip.y} tooltip_id={tooltip.tooltip_id} key={tooltip.tooltip_id} />
        ))}
      {/* client tooltip */}
      {isOpen && <Tooltip x={clientTooltip.x} y={clientTooltip.y} tooltip_id="" />}
    </>
  )
}
