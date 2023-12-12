import { PlusIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { currentProjectAtom, tooltipAtom } from '@/store'
import { supabase } from '@/supabaseClient'
import { TooltipsProps } from '@/types'

export default function ClientTooltip({ x, y }: Pick<TooltipsProps, 'x' | 'y'>) {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const currentProject = useAtomValue(currentProjectAtom)
  const setTooltip = useSetAtom(tooltipAtom)
  if (x === 0 && y === 0) {
    return <></>
  }
  async function handlePlusIconClick() {
    if (currentProject === '') {
      toast({
        variant: 'destructive',
        title: `You haven't selected your Project yet! Please click on the avatar to choose.`
      })
    } else {
      // 在服务端创建一个
      const { data: existingTooltips, error: queryError } = await supabase
        .from('tooltips')
        .select()
        .eq('x', x!)
        .eq('y', y!)
        .eq('project_id', currentProject)

      if (queryError) {
        console.error('Error querying existing tooltips:', queryError.message)
        return
      }
      if (existingTooltips.length === 0) {
        // 说明没有，可以创建一个！
        const { error: insertError } = await supabase
          .from('tooltips')
          .insert({
            x,
            y,
            project_id: currentProject
          })
          .select()
        if (insertError) {
          console.error('Error inserting new tooltip:', insertError.message)
          // 处理插入错误，例如显示一个错误消息
          return
        }
        await queryClient.invalidateQueries({
          queryKey: ['tooltips', currentProject]
        })
        setTooltip({
          project_id: '',
          tooltip_id: '',
          x: 0,
          y: 0
        })
      }
    }
  }
  return (
    <>
      <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
        <PlusIcon className="h-4 w-4" onClick={handlePlusIconClick} />
      </Button>
    </>
  )
}
