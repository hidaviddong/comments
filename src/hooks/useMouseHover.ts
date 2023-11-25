import { useAtomValue, useSetAtom } from 'jotai'
import { useEffect } from 'react'

import { isOpenAtom, tooltipsAtom } from '@/store'

export function useMouseHover() {
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
        const x = rect.left + rect.width // 右边界坐标
        const y = rect.top + rect.height // 下边界坐标
        const id = `comment-${x}-${y}`
        // 但是这里的useId 总是相同的
        setTooltips((prevTooltips) => {
          // 检查数组中是否已经有这个 ID 的元素
          const alreadyExists = prevTooltips.some((tooltip) => tooltip.id === id)
          if (alreadyExists) {
            return prevTooltips
          }
          return [...prevTooltips, { id, x, y }]
        })
      }
    }
    const handleMouseOut = (event: MouseEvent) => {
      if (event.target instanceof HTMLElement) {
        event.target.style.border = event.target.dataset.originalBorder || ''

        // 获取元素的唯一标识符
        // const rect = event.target.getBoundingClientRect()
        // const x = rect.left + rect.width // 右边界坐标
        // const y = rect.top + rect.height // 下边界坐标
        // const idToRemove = `comment-${x}-${y}`

        // 更新 tooltips 数组，移除对应的元素
        // setTooltips((prevTooltips) => prevTooltips.filter((tooltip) => tooltip.id !== idToRemove))
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
  }, [isOpen, setTooltips])
}
