'use client'

import { Comp } from '@/lib/queries/comps'

interface MatchData {
  tight: Comp[]
  broad: Comp[]
}

interface Props {
  userSalary: number
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
      className="inline-block w-2 h-2 rounded-full"
      style={{ backgroundColor: colors[score] }}
      title={`Satisfaction: ${score}/5`}
    />
  )
}

function StatTile({ label, value, sub, accent }: {
  label: string
  value: string
  sub?: string
  accent?: string
}) {
  return (
    <div className="bg-[#1f1f23] border border-[#2e2e33] rounded-xl p-4 flex flex-col justify-between min-h-[90px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a5a6a]">{label}</p>
      <div>
        <p className="text-2xl font-black tracking-tight" style={{ color: accent ?? '#efeff1' }}>{value}</p>
        {sub && <p className="text-xs text-[#5a5a6a] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function CompCard({ comp }: { comp: Comp }) {
  const total = comp.salary_base + (comp.bonus ?? 0)
  return (
    <div className="bg-[#1f1f23] border border-[#2e2e33] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
          {comp.company && <span className="text-xs font-semibold text-[#adadb8]">{comp.company}</span>}
          <SatisfactionDot score={comp.satisfaction} />
        </div>
        <p className="text-base font-black text-[#efeff1] shrink-0 ml-2">{formatK(comp.salary_base)}</p>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[#5a5a6a] mb-2">
        {comp.discipline && <span className="text-[#adadb8]">{comp.discipline}</span>}
        {comp.track && <span className="text-[#adadb8]">{comp.track.toUpperCase()}</span>}
        {comp.location && <span>{comp.location}</span>}
        {comp.yoe != null && <span>{comp.yoe} yrs</span>}
        {comp.level_numeric != null && <span>L{comp.level_numeric}</span>}
        {comp.bonus ? <span>+{formatK(comp.bonus)} bonus · {formatK(total)} total</span> : null}
      </div>

      {comp.responsibilities && (
        <p className="text-xs text-[#5a5a6a] italic leading-relaxed border-t border-[#2a2a2d] pt-2 mt-1">
          {comp.responsibilities}
        </p>
      )}
    </div>
  )
}

export default function Results({ userSalary, matches }: Props) {
  const { tight, broad } = matches
  const medianSalary = median(tight.map(c => c.salary_base))
  const noData = tight.length === 0 && broad.length === 0

  const diff = medianSalary > 0 ? userSalary - medianSalary : 0
  const pct = medianSalary > 0 ? Math.round((diff / medianSalary) * 100) : null
  const absPct = pct !== null ? Math.abs(pct) : null

  let signalLabel = '—'
  let signalSub = 'not enough data yet'
  let signalColor = '#5a5a6a'

  if (pct !== null) {
    if (pct >= 10) {
      signalLabel = `+${absPct}%`
      signalSub = `you're above your peer group`
      signalColor = '#9147ff'
    } else if (pct <= -10) {
      signalLabel = `-${absPct}%`
      signalSub = `you're below your peer group`
      signalColor = '#ef4444'
    } else {
      signalLabel = `${pct >= 0 ? '+' : ''}${pct}%`
      signalSub = `roughly at market for your profile`
      signalColor = '#adadb8'
    }
  }

  if (noData) {
    return (
      <div className="text-center py-16 border border-[#2a2a2d] rounded-xl bg-[#18181b]">
        <p className="text-2xl font-black text-[#efeff1] mb-2">Not enough data yet.</p>
        <p className="text-sm text-[#5a5a6a]">Your submission was saved — it helps the next person who looks like you.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* Row 1: Signal hero + stat tiles */}
      <div className="grid grid-cols-3 gap-3">

        {/* Signal — spans 2 cols */}
        <div className="col-span-2 bg-[#1f1f23] border border-[#2e2e33] rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#5a5a6a]">vs. your peers</p>
          <div>
            <p className="text-6xl font-black tracking-tight leading-none mb-1" style={{ color: signalColor }}>
              {signalLabel}
            </p>
            <p className="text-xs text-[#5a5a6a]">{signalSub}</p>
          </div>
        </div>

        {/* Stat tiles stacked */}
        <div className="flex flex-col gap-3">
          <StatTile
            label="Median"
            value={medianSalary > 0 ? formatK(medianSalary) : '—'}
            sub="peer group"
          />
          <StatTile
            label="Matches"
            value={String(tight.length)}
            sub={tight.length === 1 ? 'person like you' : 'people like you'}
            accent="#9147ff"
          />
        </div>
      </div>

      {/* Row 2: your base + delta tiles */}
      {medianSalary > 0 && (
        <div className="grid grid-cols-2 gap-3">
          <StatTile
            label="Your base"
            value={formatK(userSalary)}
          />
          <StatTile
            label="Delta"
            value={`${diff >= 0 ? '+' : ''}${formatK(diff)}`}
            sub="vs median"
            accent={diff >= 0 ? '#9147ff' : '#ef4444'}
          />
        </div>
      )}

      {/* People like you */}
      {tight.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9147ff]">People like you</p>
            <p className="text-xs text-[#5a5a6a]">same discipline · track · level · YOE ±2</p>
          </div>
          <div className="space-y-2">
            {tight.map((c, i) => <CompCard key={i} comp={c} />)}
          </div>
        </div>
      )}

      {/* Others in discipline */}
      {broad.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9147ff]">Others in your discipline</p>
            <p className="text-xs text-[#5a5a6a]">broader range</p>
          </div>
          <div className="space-y-2">
            {broad.map((c, i) => <CompCard key={i} comp={c} />)}
          </div>
        </div>
      )}

    </div>
  )
}
