import { useQuery } from '@tanstack/react-query'
import { useAtom } from 'jotai'

import { getTooltips } from './api'
import FooterMenu from './components/footer-menu'
import TooltipPopover from './components/tooltip-popover'
import { sessionAtom } from './store'

export default function Page() {
  const [session] = useAtom(sessionAtom)
  const {
    data: tooltips,
    isError,
    error
  } = useQuery({ queryKey: ['tooltips'], queryFn: getTooltips, enabled: !!session })
  if (isError) {
    return <span>{error.message}</span>
  }
  return (
    <>
      {session && tooltips?.map((tooltip) => <TooltipPopover x={tooltip.x} y={tooltip.y} key={tooltip.tooltip_id} />)}
      <FooterMenu />
    </>
  )
}
