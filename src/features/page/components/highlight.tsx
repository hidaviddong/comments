import { useAtomValue } from 'jotai'

import { highLightAtom } from '@/store'

export default function Highlight() {
  const highLight = useAtomValue(highLightAtom)

  return (
    <div
      style={{ top: highLight.top, left: highLight.left, width: highLight.width, height: highLight.height }}
      className="pointer-events-none fixed left-[10px] top-[10px] h-20 w-40 rounded border border-[#42b88350] bg-[#42b88325] transition-all duration-100 ease-in"></div>
  )
}
