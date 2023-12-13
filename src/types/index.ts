import { Tables } from './db'
export * from './db'
export type TooltipsType = Array<Tables<'tooltips'>>
export type CommentsType = Array<Tables<'comments'>> | null
export type ProjectsType = Array<Tables<'projects'>> | null
export type TooltipsProps = Pick<Tables<'tooltips'>, 'x' | 'y' | 'tooltip_id'>
export type AuthType = 'login' | 'register'
