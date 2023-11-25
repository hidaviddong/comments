import { useAtom, useAtomValue } from 'jotai'

import { useMouseHover } from '@/hooks'
import { buttonTextAtom, isOpenAtom } from '@/store'

import { Button } from './ui/button'

const FooterMenu = () => {
  useMouseHover()
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const buttonText = useAtomValue(buttonTextAtom)
  return (
    <Button className="fixed bottom-1 left-1/2 -translate-x-1/2 transform" onClick={() => setIsOpen(!isOpen)}>
      {buttonText}
    </Button>
  )
}

export default FooterMenu
