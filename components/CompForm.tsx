'use client'

import { useState } from 'react'

// Grouped by sector — value is the normalized DB string
const COMPANIES: { group: string; options: { value: string; label: string }[] }[] = [
  {
    group: 'RTX',
    options: [
      { value: 'rtx - raytheon', label: 'RTX — Raytheon' },
      { value: 'rtx - collins aerospace', label: 'RTX — Collins Aerospace' },
      { value: 'rtx - pratt and whitney', label: 'RTX — Pratt & Whitney' },
    ],
  },
  {
    group: 'Prime Contractors',
    options: [
      { value: 'boeing defense', label: 'Boeing Defense' },
      { value: 'general dynamics', label: 'General Dynamics' },
      { value: 'l3harris', label: 'L3Harris Technologies' },
      { value: 'leidos', label: 'Leidos' },
      { value: 'lockheed martin', label: 'Lockheed Martin' },
      { value: 'northrop grumman', label: 'Northrop Grumman' },
      { value: 'hii', label: 'HII (Huntington Ingalls Industries)' },
      { value: 'textron', label: 'Textron' },
    ],
  },
  {
    group: 'Mid-Tier Contractors',
    options: [
      { value: 'bae systems us', label: 'BAE Systems (US)' },
      { value: 'general atomics', label: 'General Atomics' },
      { value: 'sierra nevada corporation', label: 'Sierra Nevada Corporation' },
      { value: 'oshkosh defense', label: 'Oshkosh Defense' },
      { value: 'leonardo drs', label: 'Leonardo DRS' },
      { value: 'curtiss-wright', label: 'Curtiss-Wright' },
      { value: 'bwx technologies', label: 'BWX Technologies' },
      { value: 'cubic corporation', label: 'Cubic Corporation' },
      { value: 'v2x', label: 'V2X' },
      { value: 'teledyne technologies', label: 'Teledyne Technologies' },
      { value: 'heico', label: 'HEICO Corporation' },
      { value: 'kaman', label: 'Kaman Corporation' },
      { value: 'kratos defense', label: 'Kratos Defense & Security Solutions' },
      { value: 'mercury systems', label: 'Mercury Systems' },
    ],
  },
  {
    group: 'Defense Services & IT',
    options: [
      { value: 'booz allen hamilton', label: 'Booz Allen Hamilton' },
      { value: 'caci', label: 'CACI International' },
      { value: 'jacobs', label: 'Jacobs' },
      { value: 'mantech', label: 'ManTech International' },
      { value: 'parsons', label: 'Parsons Corporation' },
      { value: 'peraton', label: 'Peraton' },
      { value: 'saic', label: 'SAIC' },
      { value: 'mitre', label: 'MITRE Corporation' },
      { value: 'aerospace corporation', label: 'The Aerospace Corporation' },
      { value: 'johns hopkins apl', label: 'Johns Hopkins APL' },
      { value: 'amentum', label: 'Amentum' },
      { value: 'accenture federal', label: 'Accenture Federal Services' },
      { value: 'deloitte government', label: 'Deloitte Government & Public Services' },
    ],
  },
  {
    group: 'Aerospace & Propulsion',
    options: [
      { value: 'aerojet rocketdyne', label: 'Aerojet Rocketdyne' },
      { value: 'ge aerospace', label: 'GE Aerospace' },
      { value: 'honeywell aerospace', label: 'Honeywell Aerospace Technologies' },
      { value: 'parker aerospace', label: 'Parker Aerospace' },
      { value: 'safran', label: 'Safran' },
      { value: 'spirit aerosystems', label: 'Spirit AeroSystems' },
      { value: 'transdigm', label: 'TransDigm Group' },
      { value: 'moog', label: 'Moog Inc.' },
      { value: 'ducommun', label: 'Ducommun' },
      { value: 'triumph group', label: 'Triumph Group' },
      { value: 'woodward', label: 'Woodward' },
      { value: 'hexcel', label: 'Hexcel Corporation' },
      { value: 'arconic', label: 'Arconic' },
      { value: 'circor', label: 'CIRCOR International' },
    ],
  },
  {
    group: 'Space',
    options: [
      { value: 'spacex', label: 'SpaceX' },
      { value: 'blue origin', label: 'Blue Origin' },
      { value: 'rocket lab', label: 'Rocket Lab' },
      { value: 'sierra space', label: 'Sierra Space' },
      { value: 'relativity space', label: 'Relativity Space' },
      { value: 'firefly aerospace', label: 'Firefly Aerospace' },
      { value: 'maxar technologies', label: 'Maxar Technologies' },
      { value: 'planet labs', label: 'Planet Labs' },
      { value: 'voyager space', label: 'Voyager Space' },
      { value: 'terran orbital', label: 'Terran Orbital' },
      { value: 'redwire', label: 'Redwire Corporation' },
      { value: 'ursa major', label: 'Ursa Major Technologies' },
      { value: 'astranis', label: 'Astranis' },
      { value: 'ast spacemobile', label: 'AST SpaceMobile' },
      { value: 'momentus', label: 'Momentus' },
      { value: 'spire global', label: 'Spire Global' },
      { value: 'slingshot aerospace', label: 'Slingshot Aerospace' },
    ],
  },
  {
    group: 'eVTOL & Advanced Air Mobility',
    options: [
      { value: 'joby aviation', label: 'Joby Aviation' },
      { value: 'archer aviation', label: 'Archer Aviation' },
      { value: 'wisk aero', label: 'Wisk Aero' },
      { value: 'beta technologies', label: 'BETA Technologies' },
      { value: 'eve air mobility', label: 'Eve Air Mobility' },
      { value: 'supernal', label: 'Supernal (Hyundai)' },
      { value: 'vertical aerospace', label: 'Vertical Aerospace' },
      { value: 'blade air mobility', label: 'Blade Air Mobility' },
    ],
  },
  {
    group: 'Defense Tech & Advanced Programs',
    options: [
      { value: 'anduril', label: 'Anduril Industries' },
      { value: 'palantir', label: 'Palantir Technologies' },
      { value: 'shield ai', label: 'Shield AI' },
      { value: 'applied intuition', label: 'Applied Intuition' },
      { value: 'scale ai', label: 'Scale AI' },
      { value: 'saronic', label: 'Saronic Technologies' },
      { value: 'epirus', label: 'Epirus' },
      { value: 'hidden level', label: 'Hidden Level' },
      { value: 'rebellion defense', label: 'Rebellion Defense' },
      { value: 'vannevar labs', label: 'Vannevar Labs' },
      { value: 'primer ai', label: 'Primer AI' },
      { value: 'castelion', label: 'Castelion' },
      { value: 'hermeus', label: 'Hermeus' },
      { value: 'firehawk aerospace', label: 'Firehawk Aerospace' },
    ],
  },
  {
    group: 'Drones & UAS',
    options: [
      { value: 'aerovironment', label: 'AeroVironment' },
      { value: 'red cat holdings', label: 'Red Cat Holdings' },
      { value: 'zone 5 technologies', label: 'Zone 5 Technologies' },
      { value: 'skydio', label: 'Skydio' },
      { value: 'insitu', label: 'Insitu (Boeing subsidiary)' },
      { value: 'textron systems', label: 'Textron Systems' },
      { value: 'firestorm labs', label: 'Firestorm Labs' },
    ],
  },
  {
    group: 'International (Major US Operations)',
    options: [
      { value: 'airbus defense', label: 'Airbus Defence & Space' },
      { value: 'bae systems intl', label: 'BAE Systems' },
      { value: 'leonardo spa', label: 'Leonardo S.p.A.' },
      { value: 'rheinmetall', label: 'Rheinmetall' },
      { value: 'saab', label: 'Saab' },
      { value: 'thales', label: 'Thales' },
      { value: 'mbda', label: 'MBDA' },
      { value: 'kongsberg', label: 'Kongsberg Defence & Aerospace' },
      { value: 'dassault aviation', label: 'Dassault Aviation' },
      { value: 'hanwha aerospace', label: 'Hanwha Aerospace' },
    ],
  },
  {
    group: 'Other',
    options: [
      { value: 'other', label: 'Other' },
    ],
  },
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

const inputClass = "w-full border border-[#2a2a2d] bg-[#18181b] rounded-lg px-3 py-2.5 text-sm text-[#efeff1] placeholder-[#5a5a6a] focus:outline-none focus:ring-2 focus:ring-[#9147ff] focus:border-transparent transition"
const labelClass = "block text-xs font-semibold text-[#adadb8] mb-1.5 uppercase tracking-wider"

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
            <label
              key={t.value}
              className={`flex-1 text-center border rounded-lg py-2.5 text-sm cursor-pointer transition select-none font-medium ${
                form.track === t.value
                  ? 'bg-[#9147ff] text-white border-[#9147ff]'
                  : 'bg-[#18181b] text-[#adadb8] border-[#2a2a2d] hover:border-[#9147ff] hover:text-[#efeff1]'
              }`}
            >
              <input type="radio" name="track" value={t.value} checked={form.track === t.value} onChange={set('track')} required className="sr-only" />
              {t.label}
            </label>
          ))}
        </div>
      </div>

      {/* Level + YOE */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Level <span className="normal-case font-normal text-[#5a5a6a]">(1–7)</span></label>
          <input type="number" min={1} max={7} value={form.level_numeric} onChange={set('level_numeric')} required placeholder="e.g. 3" className={inputClass} />
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
        <label className={labelClass}>Company <span className="normal-case font-normal text-[#5a5a6a]">(optional)</span></label>
        <select value={form.company} onChange={set('company')} className={inputClass}>
          <option value="">Select your company</option>
          {COMPANIES.map(group => (
            <optgroup key={group.group} label={group.group}>
              {group.options.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Location <span className="normal-case font-normal text-[#5a5a6a]">(optional)</span></label>
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
          <span className="normal-case font-normal text-[#5a5a6a]">(optional — helps matching)</span>
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
          How do you feel about your job? <span className="normal-case font-normal text-[#5a5a6a]">(optional)</span>
        </label>
        <div className="flex gap-3 mt-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              onClick={() => setSatisfaction(n)}
              className={`flex flex-col items-center gap-1 flex-1 py-2.5 rounded-lg border text-sm font-bold transition select-none ${
                form.satisfaction === String(n)
                  ? 'bg-[#9147ff] border-[#9147ff] text-white'
                  : 'bg-[#18181b] border-[#2a2a2d] text-[#adadb8] hover:border-[#9147ff] hover:text-[#efeff1]'
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
        className="w-full bg-[#9147ff] hover:bg-[#772ce8] text-white rounded-lg py-3.5 text-sm font-bold transition-colors disabled:opacity-50 tracking-wide"
      >
        {loading ? 'Looking...' : 'See where you stand →'}
      </button>
    </form>
  )
}
