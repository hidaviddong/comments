import axios from 'axios'
interface Tooltip {
  id: string
  x: number
  y: number
}
export interface TooltipsResponse {
  data: Tooltip[]
}

interface Comment {
  id: string
  user: string
  comment: string
}

interface CommentResponse {
  data: Comment[]
}

export async function getTooltips() {
  const response = await axios.get<TooltipsResponse>('http://localhost:3000/api/tooltips')
  return response.data
}

export async function getComments() {
  const response = await axios.get<CommentResponse>('http://localhost:3000/api/comments')
  return response.data
}
