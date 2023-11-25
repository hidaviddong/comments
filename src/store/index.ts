import { atom } from 'jotai'

import type { Position } from '@/types'
export const isOpenAtom = atom(false)
export const tooltipsAtom = atom<Position[]>([])
export const buttonTextAtom = atom((get) => (get(isOpenAtom) ? 'Close' : 'Open'))
