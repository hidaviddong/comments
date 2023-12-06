import { useAtomValue } from 'jotai'

import { highLightAtom } from '@/store'

import { useHighLightCover } from '../hooks'

export default function Highlight() {
  useHighLightCover()
  const highLight = useAtomValue(highLightAtom)
  return (
    <div
      style={{ top: highLight.top, left: highLight.left, width: highLight.width, height: highLight.height }}
      className="pointer-events-none fixed left-[10px] top-[10px] flex h-20 w-40 items-center justify-center rounded border border-[#42b88350] bg-[#42b88325] transition-all duration-100 ease-in"></div>
  )
}
