import { atom } from 'jotai'

export const isOpenAtom = atom(false)
export const buttonTextAtom = atom((get) => (get(isOpenAtom) ? 'Close' : 'Open'))
