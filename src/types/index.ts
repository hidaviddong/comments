import { Tables } from './db'
export * from './db'
export type TooltipsType = Tables<'tooltips'>
export type TooltipsProps = Pick<Tables<'tooltips'>, 'x' | 'y'>
export type AuthType = 'login' | 'register'
