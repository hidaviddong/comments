import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { Send } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { currentProjectAtom } from '@/store'
import { supabase } from '@/supabaseClient'
import { TooltipsProps } from '@/types'

import { useAuth } from '../hooks'
import { DialogList } from './dialog-list'
type Checked = DropdownMenuCheckboxItemProps['checked']

function TooltipCard({ x, y, tooltip_id }: TooltipsProps) {
  const queryClient = useQueryClient()
  const session = useAuth()
  const currentProject = useAtomValue(currentProjectAtom)
  const handleSendClick = async () => {
    // 在这个坐标下，如果没有新对话，就创建一个新的对话并发送comment
    await supabase.from('tooltips').insert({
      x,
      y,
      project_id: currentProject
    })
    // 重新获取一次
    await queryClient.invalidateQueries({
      queryKey: ['tooltips', currentProject]
    })
  }
  return (
    <div
      className="absolute h-52 w-72 space-y-2 rounded-md border bg-white p-2 shadow"
      style={{ left: `${x}px`, top: `${y! + 20}px` }}>
      <DialogList profile_id={session?.user.id || ''} tooltip_id={tooltip_id} />
      <div className="mt-1 flex w-full max-w-sm items-center justify-center space-x-2">
        <Input type="text" placeholder="Write the comment..." className="w-48" />
        <Button type="submit" className="w-24" onClick={handleSendClick}>
          <Send />
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
