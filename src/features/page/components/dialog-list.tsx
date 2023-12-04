import { useQuery } from '@tanstack/react-query'

import { commentsService } from '@/api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

export function DialogList() {
  const {
    data: comments,
    isPending,
    isError,
    error
  } = useQuery({ queryKey: ['comments'], queryFn: () => commentsService.getComments() })
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
