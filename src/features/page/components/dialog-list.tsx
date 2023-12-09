import { useQueryClient } from '@tanstack/react-query'
import { LoaderIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/supabaseClient'

import { useCommentsQuery } from '../hooks'

export function DialogList({ tooltip_id }: { tooltip_id: string }) {
  const queryClient = useQueryClient()
  const { data: comments, isLoading, isError, error } = useCommentsQuery(tooltip_id)
  const [showDeleteBar, setShowDeleteBar] = useState(false)
  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <LoaderIcon className="h-6 w-6 animate-spin"></LoaderIcon>
      </div>
    )
  }

  if (isError) {
    return <div className="flex w-full flex-1 items-center justify-center">Error: {error.message}</div>
  }
  async function handleTooltipDelete() {
    const { data, error } = await supabase.from('tooltips').delete().eq('tooltip_id', tooltip_id).select()
    console.log(data)
    if (data) {
      queryClient.invalidateQueries({
        queryKey: ['tooltips']
      })
    }
    if (error) {
      console.error(error)
    }
  }
  return (
    <ScrollArea className="w-full flex-1 overflow-auto ">
      <div className="space-y-2">
        {comments?.map((comment) => (
          <>
            <div
              key={comment.comment_id}
              className="flex w-full items-center justify-start space-x-2 rounded-lg border p-2 ">
              <Avatar className="bg-red-300">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex h-full w-full flex-col justify-center ">
                <span className="text-xs text-slate-300">19.22PM</span>
                <p className="text-sm"> {comment.comment_content}</p>
              </div>
            </div>
          </>
        ))}
        <Separator />
        <Button size="sm" variant="outline" className="w-full" onClick={() => setShowDeleteBar(true)}>
          <Trash2 className="h-4 w-4" />
        </Button>
        {showDeleteBar && (
          <div className="flex w-full justify-around">
            <Button size="sm" onClick={() => setShowDeleteBar(false)}>
              Cancle
            </Button>
            <Button size="sm" variant="destructive" onClick={handleTooltipDelete}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
