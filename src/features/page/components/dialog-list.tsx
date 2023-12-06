import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { useCommentsQuery } from '../hooks'

export function DialogList({ profile_id, tooltip_id }: { profile_id: string; tooltip_id: string }) {
  const { data: comments, isPending, isError, error } = useCommentsQuery(profile_id, tooltip_id)
  if (isPending) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }
  return (
    <ScrollArea className="h-36 w-full overflow-auto ">
      <div className="p-4">
        {comments?.map((comment) => (
          <>
            <div key={comment.comment_id} className="text-sm">
              {comment.comment_content}
            </div>
            <Separator className="my-2" />
          </>
        ))}
      </div>
    </ScrollArea>
  )
}
