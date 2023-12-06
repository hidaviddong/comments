import type { AuthError, AuthTokenResponse } from '@supabase/supabase-js'

import { Tables } from './db'
export * from './db'
export type TooltipsType = Array<Tables<'tooltips'>>
export type CommentsType = Array<Tables<'comments'>> | null
export type ProjectsType = Array<Tables<'projects'>> | null
export type TooltipsProps = Pick<Tables<'tooltips'>, 'x' | 'y' | 'tooltip_id'>
export type AuthType = 'login' | 'register'
export interface APIAdapter {
  login: (email: string, password: string) => Promise<AuthTokenResponse>
  logout: () => Promise<{ error: AuthError | null }>
  getTooltips: () => Promise<TooltipsType>
  getComments: () => Promise<CommentsType>
  getProjects: () => Promise<ProjectsType>
}
