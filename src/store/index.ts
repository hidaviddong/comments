import { atom } from 'jotai'

import type { Position } from '@/types'
type AuthEnum = 'login' | 'register'
export const isOpenAtom = atom(false)
export const tooltipsAtom = atom<Position[]>([])
export const buttonTextAtom = atom((get) => (get(isOpenAtom) ? 'Close' : 'Open'))
export const sessionAtom = atom<unknown>(null)
export const authAtom = atom<AuthEnum>('login')
