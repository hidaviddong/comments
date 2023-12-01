import type { AuthTokenResponse } from '@supabase/supabase-js'

import { Tables } from './db'
export * from './db'
export type TooltipsType = Array<Tables<'tooltips'>> | null
export type CommentsType = Array<Tables<'comments'>> | null
export type ProjectsType = Array<Tables<'projects'>> | null
export type TooltipsProps = Pick<Tables<'tooltips'>, 'x' | 'y'>
export type AuthType = 'login' | 'register'
export interface APIAdapter {
  login: (email: string, password: string) => Promise<AuthTokenResponse>
  getTooltips: () => Promise<TooltipsType>
  getComments: () => Promise<CommentsType>
  getProjects: () => Promise<ProjectsType>
}
