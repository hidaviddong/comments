// import { useQuery } from '@tanstack/react-query'
// import { useAtomValue } from 'jotai'

// import { getTooltips } from './api'
import FooterMenu from './components/footer-menu'
// import TooltipPopover from './components/tooltip-popover'
// import { sessionAtom } from './store'

export default function Page() {
  // const { data: tooltips, isPending, isError, error } = useQuery({ queryKey: ['tooltips'], queryFn: getTooltips })
  // const session = useAtomValue(sessionAtom)
  // if (isPending) {
  //   return <div>......</div>
  // }
  // if (isError) {
  //   return <span>{error.message}</span>
  // }
  return (
    <>
      {/* {tooltips.data?.map((tooltip) => <TooltipPopover x={tooltip.x} y={tooltip.y} key={tooltip.id} />)} */}
      <FooterMenu />
    </>
  )
}
