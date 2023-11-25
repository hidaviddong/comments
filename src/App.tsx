import { useAtom, useAtomValue } from 'jotai'

import { Button } from './components/ui/button'
import { useMouseHover } from './hooks'
import { buttonTextAtom, isOpenAtom } from './store'

export default function App() {
  const [isOpen, setIsOpen] = useAtom(isOpenAtom)
  const buttonText = useAtomValue(buttonTextAtom)
  useMouseHover()
  return (
    <Button className="fixed bottom-1 left-1/2 -translate-x-1/2 transform" onClick={() => setIsOpen(!isOpen)}>
      {buttonText}
    </Button>
  )
}
