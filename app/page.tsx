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
      const [submitRes, matchRes] = await Promise.all([
        fetch('/api/submit', {
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
        }),
        fetch('/api/match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            discipline: formData.discipline,
            track: formData.track,
            level_numeric: Number(formData.level_numeric),
            yoe: Number(formData.yoe),
          }),
        }),
      ])

      const submitJson = await submitRes.json()
      if (submitJson.error) throw new Error(submitJson.error)

      const matchJson = await matchRes.json()
      if (matchJson.error) throw new Error(matchJson.error)

      setMatches(matchJson.data)
      setStep('results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0e0e10]">
      <div className="max-w-lg mx-auto px-5 py-16">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#efeff1] tracking-tight">levar</h1>
          <p className="text-sm text-[#5a5a6a] mt-1">are you underpaid?</p>
        </div>

        {/* Form */}
        {step === 'form' && <CompForm onSubmit={handleFormSubmit} loading={false} />}

        {/* Confirm */}
        {step === 'confirm' && formData && (
          <div className="space-y-6">
            <p className="text-base font-bold text-[#efeff1]">Does this look right?</p>
            <div className="bg-[#18181b] border border-[#2a2a2d] rounded-xl p-5 space-y-3 text-sm">
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
                <div className="pt-3 border-t border-[#2a2a2d]">
                  <p className="text-[#5a5a6a] text-xs mb-1 uppercase tracking-wider">What you do</p>
                  <p className="text-[#adadb8]">{formData.responsibilities}</p>
                </div>
              )}
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep('form'); setError(null) }}
                disabled={loading}
                className="flex-1 border border-[#2a2a2d] text-[#adadb8] rounded-lg py-3 text-sm hover:bg-[#18181b] transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-[#9147ff] hover:bg-[#772ce8] text-white rounded-lg py-3 text-sm font-bold transition-colors disabled:opacity-50"
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
              userBonus={formData.bonus ? Number(formData.bonus) : null}
              matches={matches}
            />
            <button
              onClick={() => { setStep('form'); setFormData(null); setMatches(null) }}
              className="mt-10 text-xs text-[#5a5a6a] hover:text-[#adadb8] transition-colors"
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
      <span className="text-[#5a5a6a]">{label}</span>
      <span className="text-[#efeff1] font-medium">{value}</span>
    </div>
  )
}
