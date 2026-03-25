'use client'

import { Comp } from '@/lib/queries/comps'

interface MatchData {
  tight: Comp[]
  broad: Comp[]
}

interface Props {
  userSalary: number
  userBonus?: number | null
  matches: MatchData
}

function median(values: number[]): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2)
}

function formatK(n: number): string {
  return `$${Math.round(n / 1000)}k`
}

function SatisfactionDot({ score }: { score: number | null }) {
  if (!score) return null
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#9147ff']
  return (
    <span
      className="inline-block w-2 h-2 rounded-full ml-1"
      style={{ backgroundColor: colors[score] }}
      title={`Satisfaction: ${score}/5`}
    />
  )
}

function Signal({ userSalary, medianSalary }: { userSalary: number; medianSalary: number }) {
  const diff = userSalary - medianSalary
  const pct = Math.round((diff / medianSalary) * 100)
  const absPct = Math.abs(pct)

  let headline: string
  let sub: string
  let color: string
  let barColor: string

  if (pct >= 10) {
    headline = `+${absPct}%`
    sub = 'above market for your profile'
    color = '#9147ff'
    barColor = '#9147ff'
  } else if (pct <= -10) {
    headline = `-${absPct}%`
    sub = 'below market for your profile'
    color = '#ef4444'
    barColor = '#ef4444'
  } else {
    headline = '~'
    sub = 'at market for your profile'
    color = '#adadb8'
    barColor = '#adadb8'
  }

  return (
    <div className="rounded-xl border border-[#2a2a2d] bg-[#18181b] px-6 py-8 mb-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#5a5a6a] mb-3">Your signal</p>
      <p className="text-6xl font-black tracking-tight mb-2" style={{ color }}>{headline}</p>
      <p className="text-sm text-[#adadb8]">{sub}</p>
      <div className="mt-5 pt-5 border-t border-[#2a2a2d] flex justify-center gap-8 text-xs text-[#5a5a6a]">
        <span>your base <strong className="text-[#efeff1] text-sm">{formatK(userSalary)}</strong></span>
        <span>median <strong className="text-[#efeff1] text-sm">{formatK(medianSalary)}</strong></span>
        <span>delta <strong className="text-sm" style={{ color: barColor }}>{diff >= 0 ? '+' : ''}{formatK(diff)}</strong></span>
      </div>
    </div>
  )
}

function CompRow({ comp }: { comp: Comp }) {
  const total = comp.salary_base + (comp.bonus ?? 0)
  return (
    <div className="flex items-start justify-between py-4 border-b border-[#2a2a2d] last:border-0">
      <div className="flex-1 pr-4">
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#5a5a6a] mb-1 items-center">
          {comp.company && <span className="text-[#adadb8]">{comp.company}</span>}
          {comp.location && <span>{comp.location}</span>}
          {comp.yoe != null && <span>{comp.yoe} yrs</span>}
          {comp.level_numeric != null && <span>L{comp.level_numeric}</span>}
          <SatisfactionDot score={comp.satisfaction} />
        </div>
        {comp.responsibilities && (
          <p className="text-xs text-[#5a5a6a] italic leading-relaxed">{comp.responsibilities}</p>
        )}
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-[#efeff1]">{formatK(comp.salary_base)}</p>
        {comp.bonus ? (
          <p className="text-xs text-[#5a5a6a]">+{formatK(comp.bonus)} · {formatK(total)}</p>
        ) : null}
      </div>
    </div>
  )
}

function Section({ label, sublabel, comps }: { label: string; sublabel: string; comps: Comp[] }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[#9147ff] mb-0.5">{label}</p>
      <p className="text-xs text-[#5a5a6a] mb-3">{sublabel}</p>
      <div className="bg-[#18181b] border border-[#2a2a2d] rounded-xl px-5">
        {comps.map((c, i) => <CompRow key={i} comp={c} />)}
      </div>
    </div>
  )
}

export default function Results({ userSalary, matches }: Props) {
  const { tight, broad } = matches
  const medianTight = median(tight.map(c => c.salary_base))
  const noData = tight.length === 0 && broad.length === 0

  if (noData) {
    return (
      <div className="text-center py-16 border border-[#2a2a2d] rounded-xl bg-[#18181b]">
        <p className="text-2xl font-black text-[#efeff1] mb-2">Not enough data yet.</p>
        <p className="text-sm text-[#5a5a6a]">Your submission was saved — it helps the next person who looks like you.</p>
      </div>
    )
  }

  return (
    <div>
      {medianTight > 0 && <Signal userSalary={userSalary} medianSalary={medianTight} />}

      {tight.length > 0 && (
        <Section
          label="People like you"
          sublabel={`${tight.length} match${tight.length !== 1 ? 'es' : ''} · same discipline, track, level, YOE ±2`}
          comps={tight}
        />
      )}

      {broad.length > 0 && (
        <Section
          label="Others in your discipline"
          sublabel={`${broad.length} result${broad.length !== 1 ? 's' : ''} · same discipline and track, broader range`}
          comps={broad}
        />
      )}
    </div>
  )
}
