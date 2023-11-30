import { useQuery } from '@tanstack/react-query'

import { getTooltips } from './api'
import FooterMenu from './components/footer-menu'
import TooltipPopover from './components/tooltip-popover'

export default function App() {
  const { data: tooltips, isPending, isError, error } = useQuery({ queryKey: ['tooltips'], queryFn: getTooltips })
  if (isPending) {
    return <div>......</div>
  }
  if (isError) {
    return <span>{error.message}</span>
  }

  return (
    <>
      {tooltips.data?.map((tooltip) => <TooltipPopover x={tooltip.x} y={tooltip.y} key={tooltip.id} />)}
      <FooterMenu />
    </>
  )
}
