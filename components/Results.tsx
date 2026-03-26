'use client'

import { useState } from 'react'
import { Comp } from '@/lib/queries/comps'

const DEFAULT_VISIBLE = 4

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
  const colors = ['', '#c94040', '#d4663a', '#c9a840', '#5a9e5a', '#e07840']
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
    <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-4 flex flex-col justify-between min-h-[90px]">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--dim)]">{label}</p>
      <div>
        <p className="text-2xl font-black tracking-tight" style={{ color: accent ?? 'var(--text)' }}>{value}</p>
        {sub && <p className="text-xs text-[var(--dim)] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function CompCard({ comp }: { comp: Comp }) {
  const total = comp.salary_base + (comp.bonus ?? 0)
  return (
    <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5 items-center">
          {comp.company && <span className="text-xs font-semibold text-[var(--muted)]">{comp.company}</span>}
          <SatisfactionDot score={comp.satisfaction} />
        </div>
        <p className="text-base font-black text-[var(--text)] shrink-0 ml-2">{formatK(comp.salary_base)}</p>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-[var(--dim)] mb-2">
        {comp.discipline && <span className="text-[var(--muted)]">{comp.discipline}</span>}
        {comp.track && <span className="text-[var(--muted)]">{comp.track.toUpperCase()}</span>}
        {comp.location && <span>{comp.location}</span>}
        {comp.yoe != null && <span>{comp.yoe} yrs</span>}
        {comp.level_numeric != null && <span>L{comp.level_numeric}</span>}
        {comp.bonus ? <span>+{formatK(comp.bonus)} bonus · {formatK(total)} total</span> : null}
      </div>

      {comp.responsibilities && (
        <p className="text-xs text-[var(--dim)] italic leading-relaxed border-t border-[var(--border)] pt-2 mt-1">
          {comp.responsibilities}
        </p>
      )}
    </div>
  )
}

export default function Results({ userSalary, matches }: Props) {
  const { tight, broad } = matches
  const [showAllTight, setShowAllTight] = useState(false)
  const [showAllBroad, setShowAllBroad] = useState(false)

  const visibleTight = showAllTight ? tight : tight.slice(0, DEFAULT_VISIBLE)
  const visibleBroad = showAllBroad ? broad : broad.slice(0, DEFAULT_VISIBLE)
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
      signalColor = '#e07840'
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
      <div className="text-center py-16 border border-[var(--border)] rounded-xl bg-[var(--surface)]">
        <p className="text-2xl font-black text-[var(--text)] mb-2">Not enough data yet.</p>
        <p className="text-sm text-[var(--dim)]">Your submission was saved — it helps the next person who looks like you.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">

      {/* Row 1: Signal hero + stat tiles */}
      <div className="grid grid-cols-3 gap-3">

        {/* Signal — spans 2 cols */}
        <div className="col-span-2 bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-5 flex flex-col justify-between min-h-[140px]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--dim)]">vs. your peers</p>
          <div>
            <p className="text-6xl font-black tracking-tight leading-none mb-1" style={{ color: signalColor }}>
              {signalLabel}
            </p>
            <p className="text-xs text-[var(--dim)]">{signalSub}</p>
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
            accent={diff >= 0 ? '#e07840' : '#c94040'}
          />
        </div>
      )}

      {/* People like you */}
      {tight.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">People like you</p>
            <p className="text-xs text-[var(--dim)]">same discipline · track · level · YOE ±2</p>
          </div>
          <div className="space-y-2">
            {visibleTight.map((c, i) => <CompCard key={i} comp={c} />)}
          </div>
          {tight.length > DEFAULT_VISIBLE && (
            <button
              onClick={() => setShowAllTight(v => !v)}
              className="mt-2 text-xs text-[var(--dim)] hover:text-[var(--muted)] transition-colors w-full text-center py-2"
            >
              {showAllTight ? '↑ show less' : `↓ show ${tight.length - DEFAULT_VISIBLE} more`}
            </button>
          )}
        </div>
      )}

      {/* Others in discipline */}
      {broad.length > 0 && (
        <div>
          <div className="flex items-baseline justify-between mb-2 mt-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Others in your discipline</p>
            <p className="text-xs text-[var(--dim)]">broader range</p>
          </div>
          <div className="space-y-2">
            {visibleBroad.map((c, i) => <CompCard key={i} comp={c} />)}
          </div>
          {broad.length > DEFAULT_VISIBLE && (
            <button
              onClick={() => setShowAllBroad(v => !v)}
              className="mt-2 text-xs text-[var(--dim)] hover:text-[var(--muted)] transition-colors w-full text-center py-2"
            >
              {showAllBroad ? '↑ show less' : `↓ show ${broad.length - DEFAULT_VISIBLE} more`}
            </button>
          )}
        </div>
      )}

    </div>
  )
}
