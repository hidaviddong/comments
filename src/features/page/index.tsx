import { useAtomValue } from 'jotai'

import { isOpenAtom } from '@/store'
import { TooltipsProps } from '@/types'

import { Bubble } from './components/bubble'
import { useHighLightCover } from './hooks'

export default function Page({ x, y }: TooltipsProps) {
  useHighLightCover()
  const isOpen = useAtomValue(isOpenAtom)
  return <>{isOpen && <Bubble x={x} y={y} />}</>
}
