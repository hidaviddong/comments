import { useAtomValue } from 'jotai'

import { highLightAtom } from '@/store'

import { useHighLightCover } from '../hooks'

export default function Highlight() {
  useHighLightCover()
  const highLight = useAtomValue(highLightAtom)
  return (
    <div
      style={{ top: highLight.top, left: highLight.left, width: highLight.width, height: highLight.height }}
      className="pointer-events-none fixed left-[10px] top-[10px] flex h-20 w-40 items-center justify-center rounded border-[3px] border-dashed border-blue-600 bg-blue-200 opacity-60 transition-all duration-100 ease-in-out"></div>
  )
}
