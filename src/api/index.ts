import type { AuthTokenResponse } from '@supabase/supabase-js'

import { APIAdapter, CommentsType, ProjectsType, TooltipsType } from '@/types'

import { SupabaseAdapter } from './supabase'

class CommentsAdapter implements APIAdapter {
  private adapter: APIAdapter

  constructor(env: string) {
    if (env === 'supabase') {
      this.adapter = new SupabaseAdapter()
    } else {
      throw new Error(`未知的服务类型: ${env}`)
    }
  }
  async login(email: string, password: string): Promise<AuthTokenResponse> {
    return this.adapter.login(email, password)
  }
  async getTooltips(): Promise<TooltipsType> {
    return this.adapter.getTooltips()
  }

  async getComments(): Promise<CommentsType> {
    return this.adapter.getComments()
  }
  async getProjects(): Promise<ProjectsType> {
    return this.adapter.getProjects()
  }
}
const env = import.meta.env.VITE_BACKEND_SERVICE
export const commentsService = new CommentsAdapter(env)
