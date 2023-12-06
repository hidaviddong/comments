import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { supabase } from '@/supabaseClient'
import { TooltipsProps } from '@/types'

import { useAuth } from '../hooks'
import { DialogList } from './dialog-list'
type Checked = DropdownMenuCheckboxItemProps['checked']

function TooltipCard({ x, y, tooltip_id }: TooltipsProps) {
  const queryClient = useQueryClient()
  const session = useAuth()
  const handleSendClick = async () => {
    // 在这个坐标下，如果没有新对话，就创建一个新的对话并发送comment
    await supabase.from('tooltips').insert({
      x,
      y,
      route_id: 'bd9ac14e-6af6-417f-812b-ed927af4c62f'
    })
    // 重新获取一次
    await queryClient.invalidateQueries({
      queryKey: ['tooltips']
    })
  }
  return (
    <div
      className="absolute h-52 w-72 space-y-2 rounded-md border bg-white p-2 shadow"
      style={{ left: `${x}px`, top: `${y! + 20}px` }}>
      <DialogList profile_id={session?.user.id || ''} tooltip_id={tooltip_id} />
      <div className="mt-1 flex w-full max-w-sm items-center space-x-2">
        <Input type="text" placeholder="Write the comment..." className="w-3/4" />
        <Button type="submit" className="w-1/4" onClick={handleSendClick}>
          Send
        </Button>
      </div>
    </div>
  )
}

export function Tooltip({ x, y, tooltip_id }: TooltipsProps) {
  const [showBubbleCard, setShowBubbleCard] = useState<Checked>(true)
  return (
    <>
      <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
        <ChevronDownIcon className="h-4 w-4" onClick={() => setShowBubbleCard(!showBubbleCard)} />
      </Button>
      {x && y && !showBubbleCard && <TooltipCard x={x} y={y} tooltip_id={tooltip_id} />}
    </>
  )
}
