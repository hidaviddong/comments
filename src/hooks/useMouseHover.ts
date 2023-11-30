import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { isOpenAtom, tooltipsAtom } from '@/store'
import { TooltipsType } from '@/types'
import { getRandomInteger } from '@/utils'

export function useMouseHover() {
  const queryClient = useQueryClient()
  const isOpen = useAtomValue(isOpenAtom)
  const setTooltips = useSetAtom(tooltipsAtom)
  useEffect(() => {
    const handleMouseOver = (event: MouseEvent) => {
      const targetElement = event.target
      if (isOpen && targetElement instanceof HTMLElement) {
        // 这里还要加判断 不能为document上的HTML元素，不能为BODY元素，不能为comments-root这个元素里面的任何子元素
        const commentsRoot = document.getElementById('comments-root')
        // 检查目标元素是否满足排除条件
        if (
          targetElement === document.documentElement ||
          targetElement === document.head ||
          targetElement === document.body ||
          targetElement === commentsRoot ||
          commentsRoot?.contains(targetElement)
        ) {
          return
        }
        targetElement.dataset.originalBorder = targetElement.style.border
        targetElement.style.border = '1px solid red'

        const rect = targetElement.getBoundingClientRect()
        const x = rect.left + rect.width - 10 // 右边界坐标
        const y = rect.top + rect.height - 10 // 下边界坐标
        const tooltip_id = getRandomInteger(0, 9)
        // 合并数据并更新缓存
        queryClient.setQueryData<TooltipsType[]>(['tooltips'], (oldData) => {
          // 确保 oldData 不是 null 或 undefined
          const existingData = oldData || []
          // 合并逻辑，排除重复项
          return [
            ...existingData,
            {
              project_id: 1,
              route_id: 1,
              tooltip_id,
              x,
              y
            }
          ]
        })
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
    } else {
      queryClient.invalidateQueries({
        queryKey: ['tooltips']
      })
    }
    return () => {
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isOpen, setTooltips, queryClient])
}
