import axios from 'axios'
interface Tooltip {
  id: string
  x: number
  y: number
}
export interface TooltipsResponse {
  code: number
  message: string
  data: Tooltip[] | null
}

interface Comment {
  id: string
  content: string
  isResolved: boolean
  user: string
}

interface CommentResponse {
  tooltipId: number
  message: string
  data: Comment[] | null
}

export async function getTooltips() {
  const response = await axios.get<TooltipsResponse>('http://localhost:3000/api/tooltips')
  return response.data
}

export async function getComments() {
  const response = await axios.get<CommentResponse>('http://localhost:3000/api/comments')
  return response.data
}
