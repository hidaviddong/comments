import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

import { getComments } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { isOpenAtom } from '@/store'
import type { PositionProps } from '@/types'
type Checked = DropdownMenuCheckboxItemProps['checked']

export function DialogList() {
  const { data: comments, isPending, isError, error } = useQuery({ queryKey: ['comments'], queryFn: getComments })
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  return (
    <ScrollArea className="h-36 w-full overflow-auto ">
      <div className="p-4">
        {comments.data.map((comment) => (
          <>
            <div key={comment.id} className="text-sm">
              {comment.comment}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

function BubbleCard({ x, y }: PositionProps) {
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
function Bubble({ x, y }: PositionProps) {
  const [showBubbleCard, setShowBubbleCard] = useState<Checked>(true)
  return (
    <>
      <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
        <ChevronDownIcon className="h-4 w-4" onClick={() => setShowBubbleCard(!showBubbleCard)} />
      </Button>
      {!showBubbleCard && <BubbleCard x={x} y={y + 30} />}
    </>
  )
}
export default function TooltipPopover({ x, y }: PositionProps) {
  const isOpen = useAtomValue(isOpenAtom)
  return <>{isOpen && <Bubble x={x} y={y} />}</>
}
