import { GitHubLogoIcon } from '@radix-ui/react-icons'

import { Button } from '@/components/ui/button'
import { supabase } from '@/supabaseClient'

export default function SignFooter() {
  async function handleGitHubLoginClick() {
    await supabase.auth.signInWithOAuth({
      provider: 'github'
    })
  }
  return (
    <>
      <div className="flex w-full items-center justify-center">
        <Button className="w-full" onClick={handleGitHubLoginClick}>
          <GitHubLogoIcon className="mr-2 h-6 w-6" />
          Login With GitHub
        </Button>
      </div>
    </>
  )
}
