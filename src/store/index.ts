import type { Session } from '@supabase/supabase-js'
import { atom } from 'jotai'
import { atomWithReset } from 'jotai/utils'

import type { AuthType, TooltipsType } from '@/types'
export const isOpenAtom = atom(false)
export const tooltipAtom = atom<TooltipsType[number]>({
  project_id: '',
  tooltip_id: '',
  x: null,
  y: null
})
export const buttonTextAtom = atom((get) => (get(isOpenAtom) ? 'Close' : 'Open'))
export const sessionAtom = atom<Session | null>(null)
export const authAtom = atom<AuthType>('login')
export const highLightAtom = atomWithReset({
  left: 0,
  top: 0,
  width: 0,
  height: 0
})
export const currentProjectAtom = atom('')
