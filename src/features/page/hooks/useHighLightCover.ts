import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { highLightAtom, isOpenAtom, tooltipAtom } from '@/store'

export function useHighLightCover() {
  const queryClient = useQueryClient()
  const isOpen = useAtomValue(isOpenAtom)
  const setHighLight = useSetAtom(highLightAtom)
  const setTooltip = useSetAtom(tooltipAtom)
  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const targetElement = event.target
      if (isOpen && targetElement instanceof HTMLElement) {
        const commentsRoot = document.getElementById('comments-root')
        if (
          targetElement === document.documentElement ||
          targetElement === document.head ||
          targetElement === document.body ||
          targetElement === commentsRoot ||
          commentsRoot?.contains(targetElement)
        ) {
          return
        }
        const rect = targetElement.getBoundingClientRect()
        setHighLight({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
        // TODO check if already have bubble
        // 如果存在的话就不存了
        setTooltip({
          x: rect.left + rect.width / 2 - 10,
          y: rect.top + rect.height / 2 - 10,
          tooltip_id: '',
          route_id: ''
        })
      }
    }

    if (isOpen) {
      document.addEventListener('mouseover', handleMouseOver)
    }
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isOpen, setTooltip, setHighLight, queryClient])
}
