export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      comments: {
        Row: {
          comment_content: string | null
          comment_id: number
          comment_resolved: boolean | null
          profile_id: string | null
          tooltip_id: number | null
        }
        Insert: {
          comment_content?: string | null
          comment_id?: number
          comment_resolved?: boolean | null
          profile_id?: string | null
          tooltip_id?: number | null
        }
        Update: {
          comment_content?: string | null
          comment_id?: number
          comment_resolved?: boolean | null
          profile_id?: string | null
          tooltip_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['profile_id']
          },
          {
            foreignKeyName: 'comments_tooltip_id_fkey'
            columns: ['tooltip_id']
            isOneToOne: false
            referencedRelation: 'tooltips'
            referencedColumns: ['tooltip_id']
          }
        ]
      }
      profiles: {
        Row: {
          profile_id: string
          profile_name: string | null
        }
        Insert: {
          profile_id: string
          profile_name?: string | null
        }
        Update: {
          profile_id?: string
          profile_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      projects: {
        Row: {
          profile_id: string | null
          project_id: number
          project_name: string | null
        }
        Insert: {
          profile_id?: string | null
          project_id?: number
          project_name?: string | null
        }
        Update: {
          profile_id?: string | null
          project_id?: number
          project_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'projects_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['profile_id']
          }
        ]
      }
      routes: {
        Row: {
          project_id: number | null
          route_id: number
          route_name: string | null
        }
        Insert: {
          project_id?: number | null
          route_id?: number
          route_name?: string | null
        }
        Update: {
          project_id?: number | null
          route_id?: number
          route_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'routes_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['project_id']
          }
        ]
      }
      tooltips: {
        Row: {
          project_id: number | null
          route_id: number | null
          tooltip_id: number
          x: number | null
          y: number | null
        }
        Insert: {
          project_id?: number | null
          route_id?: number | null
          tooltip_id?: number
          x?: number | null
          y?: number | null
        }
        Update: {
          project_id?: number | null
          route_id?: number | null
          tooltip_id?: number
          x?: number | null
          y?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'tooltips_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['project_id']
          },
          {
            foreignKeyName: 'tooltips_route_id_fkey'
            columns: ['route_id']
            isOneToOne: false
            referencedRelation: 'routes'
            referencedColumns: ['route_id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] & Database['public']['Views'])
  ? (Database['public']['Tables'] & Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database['public']['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database['public']['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never
