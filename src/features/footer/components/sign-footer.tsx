import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { LoaderIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { useOAuthSign } from '../hooks'

export default function SignFooter() {
  const mutation = useOAuthSign()
  return (
    <div className="flex w-full items-center justify-center">
      {mutation.isSuccess && (
        <Button className="w-full">
          <LoaderIcon className="h-6 w-6 animate-spin" />
        </Button>
      )}
      {mutation.isIdle && (
        <>
          <Button className="w-full" onClick={() => mutation.mutate('github')}>
            <GitHubLogoIcon className="mr-2 h-6 w-6" />
            Login With GitHub
          </Button>
        </>
      )}
    </div>
  )
}
