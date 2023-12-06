import { useAtomValue } from 'jotai'

import { isOpenAtom } from '@/store'
import { TooltipsProps } from '@/types'

import { Tooltip } from './components/tooltip'

export default function Page({ x, y }: TooltipsProps) {
  const isOpen = useAtomValue(isOpenAtom)
  return <>{isOpen && <Tooltip x={x} y={y} />}</>
}
