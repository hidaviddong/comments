import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { highLightAtom, isOpenAtom, tooltipAtom } from '@/store'

import { useTooltipsQuery } from '.'

export function useHighLightCover() {
  const queryClient = useQueryClient()
  const isOpen = useAtomValue(isOpenAtom)
  const setHighLight = useSetAtom(highLightAtom)
  const setTooltip = useSetAtom(tooltipAtom)
  const { data: serverTooltips } = useTooltipsQuery()
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
        const tooltipX = rect.left + rect.width / 2 - 10
        const tooltipY = rect.top + rect.height / 2 - 10
        let isOverlapping = false // 初始假设没有重叠

        serverTooltips?.forEach((tooltip) => {
          // 确保tooltip有有效的x和y值
          if (tooltip.x != null && tooltip.y != null) {
            const distanceX = Math.abs(tooltip.x - tooltipX)
            const distanceY = Math.abs(tooltip.y - tooltipY)

            // 如果X或Y轴上的距离小于或等于10，则认为它们重叠
            if (distanceX <= 10 && distanceY <= 10) {
              isOverlapping = true
            }
          }
        })

        if (!isOverlapping) {
          setTooltip({
            x: tooltipX,
            y: tooltipY,
            tooltip_id: '',
            project_id: ''
          })
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mouseover', handleMouseOver)
    }
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [isOpen, setTooltip, setHighLight, queryClient, serverTooltips])
}
