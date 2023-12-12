import dayjs from 'dayjs'
import { LoaderIcon, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

import { useCommentsQuery, useTooltipDelete } from '../hooks'

export function DialogList({ tooltip_id }: { tooltip_id: string }) {
  const { data: comments, isLoading, isError, error } = useCommentsQuery(tooltip_id)
  const [showDeleteBar, setShowDeleteBar] = useState(false)
  const { mutate: deleteTooltip } = useTooltipDelete()
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
  return (
    <ScrollArea className="w-full flex-1 overflow-auto ">
      <div className="space-y-2">
        {comments?.map((comment) => (
          <div
            key={comment.comment_id}
            className="flex w-full items-center justify-start space-x-2 rounded-lg border p-2 ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Avatar>
                    <AvatarImage
                      src={comment.profiles.profile_info.avatar_url}
                      alt={comment.profiles.profile_info.full_name}
                    />
                    <AvatarFallback>{comment.profiles?.profile_info.full_name[0]}</AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{comment.profiles.profile_info.full_name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex h-full w-full flex-col justify-center">
              <span className="text-xs text-slate-300">{dayjs(comment.create_time).format('YYYY-MM-DD HH:mm')}</span>
              <p className="text-sm"> {comment.comment_content}</p>
            </div>
          </div>
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
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                deleteTooltip(tooltip_id)
              }}>
              Delete
            </Button>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}
