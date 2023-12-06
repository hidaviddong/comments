import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { highLightAtom, isOpenAtom, tooltipAtom } from '@/store'
import { TooltipsType } from '@/types'

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
        // check if already have tooltip
        // todo : router
        const currentTooltips = queryClient.getQueryData(['tooltips']) as TooltipsType
        const tooltipX = rect.left + rect.width / 2 - 10
        const tooltipY = rect.top + rect.height / 2 - 10
        currentTooltips.forEach((tooltip) => {
          if (tooltip.x === tooltipX && tooltip.y === tooltipY) {
            return
          }
          setTooltip({
            x: tooltipX,
            y: tooltipY,
            tooltip_id: '',
            route_id: ''
          })
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
