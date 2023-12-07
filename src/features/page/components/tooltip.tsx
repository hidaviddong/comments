import { zodResolver } from '@hookform/resolvers/zod'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import { Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { currentProjectAtom } from '@/store'
import { supabase } from '@/supabaseClient'
import { TooltipsProps } from '@/types'

import { useAuth } from '../hooks'
import { DialogList } from './dialog-list'
type Checked = DropdownMenuCheckboxItemProps['checked']

const CommentFormSchema = z.object({
  comment_content: z
    .string()
    .min(1, { message: 'Please comments at least one character!' })
    .max(200, { message: 'Comment length should be under 200 characters.' })
})
type CommentFormSchemaType = z.infer<typeof CommentFormSchema>

function TooltipCard({ x, y, tooltip_id }: TooltipsProps) {
  const queryClient = useQueryClient()
  const session = useAuth()
  const currentProject = useAtomValue(currentProjectAtom)
  const commentForm = useForm<CommentFormSchemaType>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      comment_content: ''
    }
  })
  const handleSendClick = async (formData: CommentFormSchemaType) => {
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
      const { data: newTooltipsData, error: insertError } = await supabase
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
      commentForm.reset()
      await supabase
        .from('comments')
        .insert({
          comment_content: formData.comment_content,
          tooltip_id: newTooltipsData[0].tooltip_id,
          profile_id: session?.user.id
        })
        .select()
      // 缓存失效
      await queryClient.invalidateQueries({
        queryKey: ['tooltips', currentProject]
      })
      await queryClient.invalidateQueries({
        queryKey: ['comments', newTooltipsData[0].tooltip_id]
      })
    } else {
      // 说明已经有了 那就直接插入好了
      commentForm.reset()
      await supabase
        .from('comments')
        .insert({
          comment_content: formData.comment_content,
          tooltip_id: tooltip_id,
          profile_id: session?.user.id
        })
        .select()

      // 缓存失效
      await queryClient.invalidateQueries({
        queryKey: ['tooltips', currentProject]
      })
      await queryClient.invalidateQueries({
        queryKey: ['comments', tooltip_id]
      })
    }
  }

  return (
    <div
      className="absolute h-52 w-72 space-y-2 rounded-md border bg-white p-2 shadow"
      style={{ left: `${x}px`, top: `${y! + 20}px` }}>
      <DialogList tooltip_id={tooltip_id} />
      <div className="mt-1 flex w-full max-w-sm items-center justify-center space-x-2">
        <Form {...commentForm}>
          <form onSubmit={commentForm.handleSubmit(handleSendClick)} className="flex w-56 justify-around space-x-2">
            <FormField
              control={commentForm.control}
              name="comment_content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-12">
              <Send />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export function Tooltip({ x, y, tooltip_id }: TooltipsProps) {
  const [showBubbleCard, setShowBubbleCard] = useState<Checked>(true)
  const currentProject = useAtomValue(currentProjectAtom)
  return (
    <>
      <Button variant="outline" size="icon" className="absolute h-6 w-6" style={{ left: `${x}px`, top: `${y}px` }}>
        <ChevronDownIcon className="h-4 w-4" onClick={() => setShowBubbleCard(!showBubbleCard)} />
      </Button>
      {currentProject && x && y && !showBubbleCard && <TooltipCard x={x} y={y} tooltip_id={tooltip_id} />}
    </>
  )
}
