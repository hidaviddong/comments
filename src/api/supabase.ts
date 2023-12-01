import { APIAdapter } from '@/types'

import { supabase } from '../supabaseClient'
export class SupabaseAdapter implements APIAdapter {
  async login(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  }
  async getTooltips() {
    const { data } = await supabase.from('tooltips').select('*')
    return data
  }
  async getComments() {
    const { data } = await supabase.from('comments').select('*')
    return data
  }
  async getProjects() {
    const { data } = await supabase.from('projects').select('*')
    return data
  }
}
