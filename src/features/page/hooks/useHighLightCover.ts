import { useQueryClient } from '@tanstack/react-query'
import { useAtomValue, useSetAtom } from 'jotai'
import { RESET } from 'jotai/utils'
import { useEffect } from 'react'

import { highLightAtom, isOpenAtom, tooltipsAtom } from '@/store'
// import { TooltipsType } from '@/types'
// import { getRandomInteger } from '@/utils'

export function useHighLightCover() {
  const queryClient = useQueryClient()
  const isOpen = useAtomValue(isOpenAtom)
  const setHighLightAtom = useSetAtom(highLightAtom)
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
        const rect = targetElement.getBoundingClientRect()
        setHighLightAtom({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height
        })
        console.log(rect)
        // const x = rect.left + rect.width - 10 // 右边界坐标
        // const y = rect.top + rect.height - 10 // 下边界坐标
        // const tooltip_id = getRandomInteger(0, 9)
      }
    }
    const handleMouseOut = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        setHighLightAtom(RESET)
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
  }, [isOpen, setTooltips, setHighLightAtom, queryClient])
}
