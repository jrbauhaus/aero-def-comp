'use client'

import { useState } from 'react'

// Flat alphabetical list — value is the normalized DB string
const COMPANIES: { value: string; label: string }[] = [
  { value: 'aar corp', label: 'AAR Corp' },
  { value: 'accenture federal', label: 'Accenture Federal Services' },
  { value: 'aerojet rocketdyne', label: 'Aerojet Rocketdyne' },
  { value: 'aerovironment', label: 'AeroVironment' },
  { value: 'airbus defense', label: 'Airbus Defence & Space' },
  { value: 'amentum', label: 'Amentum' },
  { value: 'anduril', label: 'Anduril Industries' },
  { value: 'applied intuition', label: 'Applied Intuition' },
  { value: 'arconic', label: 'Arconic' },
  { value: 'archer aviation', label: 'Archer Aviation' },
  { value: 'aerospace corporation', label: 'Aerospace Corporation, The' },
  { value: 'ast spacemobile', label: 'AST SpaceMobile' },
  { value: 'astranis', label: 'Astranis' },
  { value: 'bae systems us', label: 'BAE Systems' },
  { value: 'beta technologies', label: 'BETA Technologies' },
  { value: 'blade air mobility', label: 'Blade Air Mobility' },
  { value: 'blue origin', label: 'Blue Origin' },
  { value: 'boeing defense', label: 'Boeing Defense' },
  { value: 'booz allen hamilton', label: 'Booz Allen Hamilton' },
  { value: 'bwx technologies', label: 'BWX Technologies' },
  { value: 'caci', label: 'CACI International' },
  { value: 'castelion', label: 'Castelion' },
  { value: 'circor', label: 'CIRCOR International' },
  { value: 'cubic corporation', label: 'Cubic Corporation' },
  { value: 'curtiss-wright', label: 'Curtiss-Wright' },
  { value: 'dassault aviation', label: 'Dassault Aviation' },
  { value: 'deloitte government', label: 'Deloitte Government & Public Services' },
  { value: 'ducommun', label: 'Ducommun' },
  { value: 'chromalloy', label: 'Chromalloy' },
  { value: 'eaton aerospace', label: 'Eaton Aerospace' },
  { value: 'elevate aircraft seating', label: 'Elevate Aircraft Seating' },
  { value: 'epirus', label: 'Epirus' },
  { value: 'eve air mobility', label: 'Eve Air Mobility' },
  { value: 'firefly aerospace', label: 'Firefly Aerospace' },
  { value: 'firehawk aerospace', label: 'Firehawk Aerospace' },
  { value: 'firestorm labs', label: 'Firestorm Labs' },
  { value: 'ge aerospace', label: 'GE Aerospace' },
  { value: 'general atomics', label: 'General Atomics' },
  { value: 'general dynamics', label: 'General Dynamics' },
  { value: 'hanwha aerospace', label: 'Hanwha Aerospace' },
  { value: 'heico', label: 'HEICO Corporation' },
  { value: 'hermeus', label: 'Hermeus' },
  { value: 'hidden level', label: 'Hidden Level' },
  { value: 'hii', label: 'HII (Huntington Ingalls Industries)' },
  { value: 'honeywell aerospace', label: 'Honeywell Aerospace Technologies' },
  { value: 'insitu', label: 'Insitu' },
  { value: 'jacobs', label: 'Jacobs' },
  { value: 'johns hopkins apl', label: 'Johns Hopkins APL' },
  { value: 'joby aviation', label: 'Joby Aviation' },
  { value: 'kaman', label: 'Kaman Corporation' },
  { value: 'kongsberg', label: 'Kongsberg Defence & Aerospace' },
  { value: 'kratos defense', label: 'Kratos Defense & Security Solutions' },
  { value: 'l3harris', label: 'L3Harris Technologies' },
  { value: 'leidos', label: 'Leidos' },
  { value: 'leonardo drs', label: 'Leonardo DRS' },
  { value: 'lockheed martin', label: 'Lockheed Martin' },
  { value: 'mantech', label: 'ManTech International' },
  { value: 'maxar technologies', label: 'Maxar Technologies' },
  { value: 'mbda', label: 'MBDA' },
  { value: 'mercury systems', label: 'Mercury Systems' },
  { value: 'mitre', label: 'MITRE Corporation' },
  { value: 'momentus', label: 'Momentus' },
  { value: 'moog', label: 'Moog Inc.' },
  { value: 'northrop grumman', label: 'Northrop Grumman' },
  { value: 'oshkosh defense', label: 'Oshkosh Defense' },
  { value: 'palantir', label: 'Palantir Technologies' },
  { value: 'parker aerospace', label: 'Parker Aerospace' },
  { value: 'parsons', label: 'Parsons Corporation' },
  { value: 'peraton', label: 'Peraton' },
  { value: 'planet labs', label: 'Planet Labs' },
  { value: 'primer ai', label: 'Primer AI' },
  { value: 'rebellion defense', label: 'Rebellion Defense' },
  { value: 'recaro aircraft seating', label: 'Recaro Aircraft Seating' },
  { value: 'red cat holdings', label: 'Red Cat Holdings' },
  { value: 'redwire', label: 'Redwire Corporation' },
  { value: 'relativity space', label: 'Relativity Space' },
  { value: 'rheinmetall', label: 'Rheinmetall' },
  { value: 'rocket lab', label: 'Rocket Lab' },
  { value: 'rtx - collins aerospace', label: 'RTX — Collins Aerospace' },
  { value: 'rtx - pratt and whitney', label: 'RTX — Pratt & Whitney' },
  { value: 'rtx - raytheon', label: 'RTX — Raytheon' },
  { value: 'saab', label: 'Saab' },
  { value: 'safran', label: 'Safran' },
  { value: 'saic', label: 'SAIC' },
  { value: 'saronic', label: 'Saronic Technologies' },
  { value: 'scale ai', label: 'Scale AI' },
  { value: 'shield ai', label: 'Shield AI' },
  { value: 'sierra nevada corporation', label: 'Sierra Nevada Corporation' },
  { value: 'sierra space', label: 'Sierra Space' },
  { value: 'skydio', label: 'Skydio' },
  { value: 'slingshot aerospace', label: 'Slingshot Aerospace' },
  { value: 'spacex', label: 'SpaceX' },
  { value: 'spirit aerosystems', label: 'Spirit AeroSystems' },
  { value: 'standardaero', label: 'StandardAero' },
  { value: 'spire global', label: 'Spire Global' },
  { value: 'supernal', label: 'Supernal' },
  { value: 'teledyne technologies', label: 'Teledyne Technologies' },
  { value: 'terran orbital', label: 'Terran Orbital' },
  { value: 'textron', label: 'Textron' },
  { value: 'textron systems', label: 'Textron Systems' },
  { value: 'thales', label: 'Thales' },
  { value: 'transdigm', label: 'TransDigm Group' },
  { value: 'triumph group', label: 'Triumph Group' },
  { value: 'ursa major', label: 'Ursa Major Technologies' },
  { value: 'v2x', label: 'V2X' },
  { value: 'vannevar labs', label: 'Vannevar Labs' },
  { value: 'vertical aerospace', label: 'Vertical Aerospace' },
  { value: 'voyager space', label: 'Voyager Space' },
  { value: 'wisk aero', label: 'Wisk Aero' },
  { value: 'woodward', label: 'Woodward' },
  { value: 'zone 5 technologies', label: 'Zone 5 Technologies' },
  { value: 'other', label: 'Other' },
]

const DISCIPLINES = [
  // Engineering
  'mechanical engineering',
  'systems engineering',
  'electrical engineering',
  'software engineering',
  'manufacturing engineering',
  'quality engineering',
  'process engineering',
  'aerospace engineering',
  'test engineering',
  'structural engineering',
  'reliability engineering',
  // Non-engineering
  'finance',
  'program management',
  'production',
  'operations',
  'supply chain',
  'contracts',
  'configuration management',
  'compliance',
  'ehs',
  'other',
]

const LOCATIONS = [
  { value: 'remote', label: 'Remote' },
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'Washington DC' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
]

const TRACKS = [
  { value: 'ic', label: 'Individual Contributor' },
  { value: 'manager', label: 'Manager' },
  { value: 'technician', label: 'Technician' },
]

export interface FormData {
  discipline: string
  track: string
  level_numeric: string
  yoe: string
  salary_base: string
  bonus: string
  location: string
  company: string
  responsibilities: string
  satisfaction: string
}

interface Props {
  onSubmit: (data: FormData) => void
  loading: boolean
}

const inputClass = "w-full border border-[var(--border)] bg-[var(--surface2)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition"
const labelClass = "block text-xs font-semibold text-[var(--muted)] mb-1.5 uppercase tracking-wider"

const SATISFACTION_LABELS: Record<number, string> = {
  1: 'rough',
  2: 'meh',
  3: 'fine',
  4: 'good',
  5: 'love it',
}

export default function CompForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<FormData>({
    discipline: '',
    track: '',
    level_numeric: '',
    yoe: '',
    salary_base: '',
    bonus: '',
    location: '',
    company: '',
    responsibilities: '',
    satisfaction: '',
  })

  const set = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const setSatisfaction = (val: number) =>
    setForm(prev => ({ ...prev, satisfaction: prev.satisfaction === String(val) ? '' : String(val) }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Discipline */}
      <div>
        <label className={labelClass}>Discipline</label>
        <select value={form.discipline} onChange={set('discipline')} required className={inputClass}>
          <option value="">Select your discipline</option>
          <optgroup label="Engineering">
            {DISCIPLINES.slice(0, 11).map(d => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </optgroup>
          <optgroup label="Other">
            {DISCIPLINES.slice(11).map(d => (
              <option key={d} value={d}>
                {d === 'ehs' ? 'EHS' : d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Track */}
      <div>
        <label className={labelClass}>Track</label>
        <div className="flex gap-2">
          {TRACKS.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, track: t.value }))}
              className={`flex-1 text-center border rounded-lg py-2.5 text-sm transition font-medium ${
                form.track === t.value
                  ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                  : 'bg-[var(--surface2)] text-[var(--muted)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--text)]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {/* hidden required input so form validation still works */}
        <input type="text" required value={form.track} onChange={() => {}} className="sr-only" aria-hidden />
      </div>

      {/* Level + YOE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Level</label>
          <select value={form.level_numeric} onChange={set('level_numeric')} required className={inputClass}>
            <option value="">Select your level</option>
            <option value="1">L1 — Entry</option>
            <option value="2">L2 — Early Career</option>
            <option value="3">L3 — Mid-Level</option>
            <option value="4">L4 — Upper-Level</option>
            <option value="5">L5 — Lead</option>
            <option value="6">L6 — Senior</option>
            <option value="7">L7 — Principal</option>
            <option value="8">L8 — Chief / Fellow</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Years exp.</label>
          <input type="number" min={0} max={45} value={form.yoe} onChange={set('yoe')} required placeholder="e.g. 8" className={inputClass} />
        </div>
      </div>

      {/* Base + Bonus */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Base salary</label>
          <input type="number" value={form.salary_base} onChange={set('salary_base')} required placeholder="120000" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bonus <span className="normal-case font-normal text-[#5a5a6a]">(optional)</span></label>
          <input type="number" value={form.bonus} onChange={set('bonus')} placeholder="10000" className={inputClass} />
        </div>
      </div>

      {/* Company */}
      <div>
        <label className={labelClass}>Company</label>
        <select value={form.company} onChange={set('company')} className={inputClass}>
          <option value="">Select your company</option>
          {COMPANIES.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Location</label>
        <select value={form.location} onChange={set('location')} className={inputClass}>
          <option value="">Select state or remote</option>
          {LOCATIONS.map(l => (
            <option key={l.value} value={l.value}>{l.label}</option>
          ))}
        </select>
      </div>

      {/* Responsibilities */}
      <div>
        <label className={labelClass}>
          What do you actually do?{' '}
        </label>
        <textarea
          value={form.responsibilities} onChange={set('responsibilities')}
          rows={3}
          placeholder="e.g. Lead a team of 4 mechanical engineers on propulsion subsystems. Review drawings, run trade studies, interface with program office."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Satisfaction */}
      <div>
        <label className={labelClass}>
          How do you feel about your job?
        </label>
        <div className="flex gap-3 mt-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setSatisfaction(n)}
              className={`flex flex-col items-center gap-1 flex-1 py-2.5 rounded-lg border text-sm font-bold transition select-none ${
                form.satisfaction === String(n)
                  ? 'bg-[var(--accent)] border-[var(--accent)] text-white'
                  : 'bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--text)]'
              }`}
            >
              <span className="text-base">{n}</span>
              <span className="text-[10px] font-normal opacity-70">{SATISFACTION_LABELS[n]}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[var(--accent)] hover:bg-[var(--accent-dim)] text-white rounded-lg py-3.5 text-sm font-bold transition-colors disabled:opacity-50 tracking-wide"
      >
        {loading ? 'Looking...' : 'See where you stand →'}
      </button>
    </form>
  )
}
