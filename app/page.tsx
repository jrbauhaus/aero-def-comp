'use client'

import { useState } from 'react'
import CompForm, { FormData } from '@/components/CompForm'
import Results from '@/components/Results'
import { Comp } from '@/lib/queries/comps'

type Step = 'form' | 'confirm' | 'results'

interface MatchData {
  tight: Comp[]
  broad: Comp[]
}

export default function Home() {
  const [step, setStep] = useState<Step>('form')
  const [formData, setFormData] = useState<FormData | null>(null)
  const [matches, setMatches] = useState<MatchData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setStep('confirm')
  }

  const handleConfirm = async () => {
    if (!formData) return
    setLoading(true)
    setError(null)

    try {
      // Match first — compare against existing data before adding yours
      const matchRes = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: formData.discipline,
          track: formData.track,
          level_numeric: Number(formData.level_numeric),
          yoe: Number(formData.yoe),
        }),
      })

      const matchJson = await matchRes.json()
      if (matchJson.error) throw new Error(matchJson.error)

      // Then submit — your data helps the next person
      const submitRes = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discipline: formData.discipline,
          track: formData.track,
          level_numeric: Number(formData.level_numeric),
          yoe: Number(formData.yoe),
          salary_base: Number(formData.salary_base),
          bonus: formData.bonus ? Number(formData.bonus) : null,
          location: formData.location || null,
          company: formData.company || null,
          responsibilities: formData.responsibilities || null,
          satisfaction: formData.satisfaction ? Number(formData.satisfaction) : null,
          degrees: null,
        }),
      })

      const submitJson = await submitRes.json()
      if (submitJson.error) throw new Error(submitJson.error)

      setMatches(matchJson.data)
      setStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="max-w-lg mx-auto px-5 py-16">

        {/* Header */}
        <div className="mb-10">
          <h1
            className="text-4xl text-[var(--text)] tracking-tight cursor-pointer hover:opacity-70 transition-opacity inline-block"
            style={{ fontFamily: 'var(--font-fraunces)', fontWeight: 900 }}
            onClick={() => { setStep('form'); setFormData(null); setMatches(null); setError(null) }}
          >
            levar
          </h1>
          <p className="text-sm font-semibold italic text-[#f97316] mt-0.5">real aerospace & defense comp data</p>
          <p className="text-sm text-[var(--dim)] mt-1">are you underpaid?</p>
        </div>

        {/* Form */}
        {step === 'form' && <CompForm onSubmit={handleFormSubmit} loading={false} />}

        {/* Confirm */}
        {step === 'confirm' && formData && (
          <div className="space-y-6">
            <p className="text-base font-bold text-[#efeff1]">Does this look right?</p>
            <div className="bg-[var(--surface2)] border border-[var(--border)] rounded-xl p-5 space-y-3 text-sm">
              <Row label="Discipline" value={formData.discipline} />
              <Row label="Track" value={formData.track.toUpperCase()} />
              <Row label="Level" value={`L${formData.level_numeric}`} />
              <Row label="YOE" value={`${formData.yoe} years`} />
              <Row label="Base" value={`$${Number(formData.salary_base).toLocaleString()}`} />
              {formData.bonus && <Row label="Bonus" value={`$${Number(formData.bonus).toLocaleString()}`} />}
              {formData.company && <Row label="Company" value={formData.company} />}
              {formData.location && <Row label="Location" value={formData.location} />}
              {formData.satisfaction && <Row label="Satisfaction" value={`${formData.satisfaction}/5`} />}
              {formData.responsibilities && (
                <div className="pt-3 border-t border-[var(--border)]">
                  <p className="text-[var(--dim)] text-xs mb-1 uppercase tracking-wider">What you do</p>
                  <p className="text-[var(--muted)]">{formData.responsibilities}</p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('form'); setError(null) }}
                disabled={loading}
                className="flex-1 border border-[var(--border)] text-[var(--muted)] rounded-lg py-3 text-sm hover:bg-[var(--surface)] transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-white rounded-lg py-3 text-sm font-bold transition-colors disabled:opacity-50"
              >
                {loading ? 'One sec...' : 'Looks right →'}
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {step === 'results' && matches && formData && (
          <div>
            <Results
              userSalary={Number(formData.salary_base)}
              matches={matches}
            />
            <button
              onClick={() => { setStep('form'); setFormData(null); setMatches(null) }}
              className="mt-10 text-xs text-[var(--dim)] hover:text-[var(--muted)] transition-colors"
            >
              ← start over
            </button>
          </div>
        )}

      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-baseline">
      <span className="text-[var(--dim)]">{label}</span>
      <span className="text-[var(--text)] font-medium">{value}</span>
    </div>
  )
}
