import { zodResolver } from '@hookform/resolvers/zod'
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useAtomValue } from 'jotai'
import { LoaderIcon, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { currentProjectAtom } from '@/store'
import { TooltipsProps } from '@/types'

import { useAuth } from '../hooks'
import { useCommentCreate } from '../hooks/use-comment-create'
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
  const session = useAuth()
  const { mutate: createComment, isPending } = useCommentCreate(tooltip_id)
  const commentForm = useForm<CommentFormSchemaType>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: {
      comment_content: ''
    }
  })
  const handleSendClick = async (formData: CommentFormSchemaType) => {
    commentForm.reset()
    if (session) {
      createComment({ comment_content: formData.comment_content, tooltip_id, profile_id: session.user.id })
    }
  }
  return (
    <div
      className="absolute h-52 w-72 space-y-2 rounded-md border bg-white p-2 shadow"
      style={{ left: `${x}px`, top: `${y! + 20}px` }}>
      <div className="flex h-full w-full flex-col space-y-1">
        <DialogList tooltip_id={tooltip_id} />
        <footer className="mt-1 flex w-full items-center justify-start">
          <Form {...commentForm}>
            <form onSubmit={commentForm.handleSubmit(handleSendClick)} className="flex w-full justify-around space-x-2">
              <FormField
                control={commentForm.control}
                name="comment_content"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isPending} {...field} className="w-56" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button disabled={isPending} type="submit" className="mr-4 w-12">
                {isPending ? <LoaderIcon className="h-6 w-6 animate-spin" /> : <Send />}
              </Button>
            </form>
          </Form>
        </footer>
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
