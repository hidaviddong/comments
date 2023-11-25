import { useAtomValue } from 'jotai'
import { useEffect } from 'react'

import { isOpenAtom } from '@/store'

export function useMouseHover() {
  const isOpen = useAtomValue(isOpenAtom)
  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      if (isOpen && event.target instanceof HTMLElement) {
        const commentsRoot = document.getElementById('comments-root')
        if (event.target === commentsRoot) {
          return
        }

        event.target.dataset.originalBorder = event.target.style.border
        event.target.style.border = '1px solid red'

        const rect = event.target.getBoundingClientRect()
        console.log(rect.right + window.scrollX)
      }
    }
    const handleMouseOut = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        event.target.style.border = event.target.dataset.originalBorder || ''
      }
    }

    if (isOpen) {
      document.addEventListener('mouseover', handleMouseOver)
      document.addEventListener('mouseout', handleMouseOut)
    }

    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isOpen])
}
