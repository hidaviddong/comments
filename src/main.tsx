import './index.css'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'

function createComment(dom: HTMLElement) {
  const queryClient = new QueryClient()
  const domRoot = dom.attachShadow({ mode: 'open' })
  const shadow = document.createElement('div')
  domRoot.appendChild(shadow)

  const styleTags = document.getElementsByTagName('style')
  if (styleTags.length !== 0) {
    const lastStyleTag = styleTags[styleTags.length - 1]
    domRoot.appendChild(lastStyleTag)
  }

  const shadowRoot = createRoot(shadow)
  shadowRoot.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </React.StrictMode>
  )
}

document.addEventListener('DOMContentLoaded', () => {
  // 找到或创建一个div元素来挂载评论组件
  const commentDivId = 'comments-root' // 设定或获取div的ID
  let commentDiv = document.getElementById(commentDivId)

  // 如果找不到该元素，就创建一个新的div并添加到文档中
  if (!commentDiv) {
    commentDiv = document.createElement('div')
    commentDiv.id = commentDivId
    document.body.appendChild(commentDiv) // 或者添加到页面的其他特定位置
  }

  createComment(commentDiv)
})
