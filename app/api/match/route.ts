import { NextRequest, NextResponse } from 'next/server'
import { getTightMatches, getBroadMatches } from '@/lib/queries/comps'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { discipline, track, level_numeric, yoe } = body

    if (!discipline || !track || level_numeric == null || yoe == null) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields: discipline, track, level_numeric, yoe' },
        { status: 400 }
      )
    }

    const params = {
      discipline: discipline.toLowerCase().trim(),
      track: track.toLowerCase().trim(),
      level_numeric: Number(level_numeric),
      yoe: Number(yoe),
    }

    const [tight, broad] = await Promise.all([
      getTightMatches(params),
      getBroadMatches(params),
    ])

    return NextResponse.json({ data: { tight, broad }, error: null })
  } catch (err) {
    console.error('Match error:', err)
    return NextResponse.json({ data: null, error: 'Server error' }, { status: 500 })
  }
}
