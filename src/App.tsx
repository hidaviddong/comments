import { useAtomValue } from 'jotai'

import FooterMenu from './components/footer-menu'
import TooltipPopover from './components/tooltip-popover'
import { tooltipsAtom } from './store'

export default function App() {
  const tooltips = useAtomValue(tooltipsAtom)
  return (
    <>
      {tooltips.map((tooltip, index) => (
        <TooltipPopover x={tooltip.x} y={tooltip.y} key={index} />
      ))}
      <FooterMenu />
    </>
  )
}
