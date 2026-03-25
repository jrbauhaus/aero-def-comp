import { supabase } from '../supabase'

export interface MatchParams {
  discipline: string
  track: string
  level_numeric: number
  yoe: number
}

export interface Comp {
  salary_base: number
  bonus: number | null
  yoe: number
  level_numeric: number
  company: string | null
  location: string | null
  track: string | null
  responsibilities: string | null
  satisfaction: number | null
}

// Tight match: same discipline + track + level, yoe ±2
export async function getTightMatches(params: MatchParams): Promise<Comp[]> {
  const { discipline, track, level_numeric, yoe } = params
  const { data, error } = await supabase
    .from('comps')
    .select('salary_base, bonus, yoe, level_numeric, company, location, track, responsibilities, satisfaction')
    .eq('discipline', discipline)
    .eq('track', track)
    .eq('level_numeric', level_numeric)
    .gte('yoe', yoe - 2)
    .lte('yoe', yoe + 2)
    .not('salary_base', 'is', null)
    .gt('salary_base', 0)

  if (error) throw error
  return data ?? []
}

// Broad match: same discipline + track, looser yoe, different level
export async function getBroadMatches(params: MatchParams): Promise<Comp[]> {
  const { discipline, track, level_numeric, yoe } = params
  const { data, error } = await supabase
    .from('comps')
    .select('salary_base, bonus, yoe, level_numeric, company, location, track, responsibilities, satisfaction')
    .eq('discipline', discipline)
    .eq('track', track)
    .not('salary_base', 'is', null)
    .gt('salary_base', 0)
    .neq('level_numeric', level_numeric)
    .gte('yoe', yoe - 4)
    .lte('yoe', yoe + 4)
    .limit(20)

  if (error) throw error
  return data ?? []
}

export async function submitComp(comp: {
  discipline: string
  track: string
  level_numeric: number
  yoe: number
  salary_base: number
  bonus: number | null
  location: string | null
  degrees: string | null
  company: string | null
  satisfaction: number | null
  responsibilities: string | null
}) {
  const { error } = await supabase.from('comps').insert([comp])
  if (error) throw error
}
