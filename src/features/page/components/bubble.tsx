import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TooltipsProps } from '@/types'

import { DialogList } from './dialog-list'
type Checked = DropdownMenuCheckboxItemProps['checked']

function BubbleCard({ x, y }: TooltipsProps) {
  return (
    <div
      className="absolute h-52 w-72 space-y-2 rounded-md border p-2 shadow"
      style={{ left: `${x}px`, top: `${y}px` }}>
      <DialogList />
      <div className="mt-1 flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Write the comment..." className="w-3/4" />
        <Button type="submit" className="w-1/4">
          Send
        </Button>
      </div>
    </div>
  )
}

export function Bubble({ x, y }: TooltipsProps) {
  const [showBubbleCard, setShowBubbleCard] = useState<Checked>(true)
  return (
    <>
      <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
        <ChevronDownIcon className="h-4 w-4" onClick={() => setShowBubbleCard(!showBubbleCard)} />
      </Button>
      {x && y && !showBubbleCard && <BubbleCard x={x} y={y + 30} />}
    </>
  )
}
