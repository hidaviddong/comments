import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { isOpenAtom } from '@/store'
const tags = Array.from({ length: 50 }).map((_, i, a) => `v1.2.0-beta.${a.length - i}`)
type Checked = DropdownMenuCheckboxItemProps['checked']

export function DialogList() {
  return (
    <ScrollArea className="h-36 w-full overflow-auto ">
      <div className="p-4">
        {tags.map((tag) => (
          <>
            <div key={tag} className="text-sm">
              {tag}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}

function BubbleCard() {
  return (
    <div className="absolute left-[200px] top-[270px] h-52 w-72 space-y-2 rounded-md border p-2 shadow">
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
function Bubble() {
  const [showStatusBar, setShowStatusBar] = useState<Checked>(true)
  return (
    <>
      <Button variant="outline" size="icon" className="absolute left-[200px] top-[240px] h-6 w-6">
        <ChevronDownIcon className="h-4 w-4" onClick={() => setShowStatusBar(!showStatusBar)} />
      </Button>
      {!showStatusBar && <BubbleCard />}
    </>
  )
}
export default function TooltipPopover() {
  const isOpen = useAtomValue(isOpenAtom)
  return <>{isOpen && <Bubble />}</>
}
