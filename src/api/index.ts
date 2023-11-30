import { supabase } from '../supabaseClient'
export interface Tooltip {
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
  const { data } = await supabase.from('tooltips').select('*')
  return data
}

export async function getComments() {
  const { data } = await supabase.from('comments').select('*')
  return data
}
