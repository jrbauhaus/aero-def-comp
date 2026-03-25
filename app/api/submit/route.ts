import { NextRequest, NextResponse } from 'next/server'
import { submitComp } from '@/lib/queries/comps'

const SALARY_MIN = 30000
const SALARY_MAX = 600000
const YOE_MAX = 45

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      discipline,
      track,
      level_numeric,
      yoe,
      salary_base,
      bonus,
      location,
      degrees,
      company,
      satisfaction,
      responsibilities,
    } = body

    // Required field validation
    if (!discipline || !track || level_numeric == null || yoe == null || !salary_base) {
      return NextResponse.json(
        { data: null, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Range validation
    if (salary_base < SALARY_MIN || salary_base > SALARY_MAX) {
      return NextResponse.json(
        { data: null, error: `Salary must be between $${SALARY_MIN.toLocaleString()} and $${SALARY_MAX.toLocaleString()}` },
        { status: 400 }
      )
    }

    if (yoe < 0 || yoe > YOE_MAX) {
      return NextResponse.json(
        { data: null, error: 'Years of experience out of range' },
        { status: 400 }
      )
    }

    if (level_numeric < 1 || level_numeric > 7) {
      return NextResponse.json(
        { data: null, error: 'Level must be between 1 and 7' },
        { status: 400 }
      )
    }

    await submitComp({
      discipline: discipline.toLowerCase().trim(),
      track: track.toLowerCase().trim(),
      level_numeric: Number(level_numeric),
      yoe: Number(yoe),
      salary_base: Number(salary_base),
      bonus: bonus ? Number(bonus) : null,
      location: location?.trim() || null,
      degrees: degrees?.trim() || null,
      company: company?.toLowerCase().trim() || null,
      satisfaction: satisfaction ? Number(satisfaction) : null,
      responsibilities: responsibilities?.trim() || null,
    })

    return NextResponse.json({ data: 'ok', error: null })
  } catch (err) {
    console.error('Submit error:', err)
    return NextResponse.json({ data: null, error: 'Server error' }, { status: 500 })
  }
}
