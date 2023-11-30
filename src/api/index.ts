import { supabase } from '../supabaseClient'

export async function getProjects(profile_id: string) {
  const { data } = await supabase
    .from('projects')
    .select(
      `
    project_id,
    project_name,
    profiles(profile_id,profile_name)
  `
    )
    .eq('profile_id', profile_id)
  return data
}

export async function getTooltips() {
  const { data } = await supabase.from('tooltips').select('*')
  return data
}

export async function getComments() {
  const { data } = await supabase.from('comments').select('*')
  return data
}
