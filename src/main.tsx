import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import tailwindStyle from './index.css?inline'

function createComment(dom: HTMLElement) {
  const queryClient = new QueryClient()
  const domRoot = dom.attachShadow({ mode: 'open' })
  const shadow = document.createElement('div')
  domRoot.appendChild(shadow)

  const styleTags = document.createElement('style')
  styleTags.textContent = tailwindStyle
  domRoot.appendChild(styleTags)

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
  const commentDivId = 'comments-root'
  let commentDiv = document.getElementById(commentDivId)

  if (!commentDiv) {
    commentDiv = document.createElement('div')
    commentDiv.id = commentDivId
    document.body.appendChild(commentDiv)
  }

  createComment(commentDiv)
})
