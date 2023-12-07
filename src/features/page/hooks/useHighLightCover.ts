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
        // 这里区分两个情况：
        // 1、是空数组 可以直接setTooltip
        // 2、有数据，先判断是否重合
        // 检查是否有重合的 tooltip
        const isOverlapping = serverTooltips?.some((tooltip) => tooltip.x === tooltipX && tooltip.y === tooltipY)

        // 如果没有重合的 tooltip，设置新的 tooltip
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
