import { atom } from 'jotai'

import type { AuthType, TooltipsType } from '@/types'

export const isOpenAtom = atom(false)
export const tooltipsAtom = atom<TooltipsType[]>([])
export const buttonTextAtom = atom((get) => (get(isOpenAtom) ? 'Close' : 'Open'))
export const sessionAtom = atom<unknown>(null)
export const authAtom = atom<AuthType>('login')
