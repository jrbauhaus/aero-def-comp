'use client'

import { Comp } from '@/lib/queries/comps'

interface ShareCardProps {
  signalLabel: string
  signalSub: string
  signalColor: string
  discipline: string
  track: string
  level: number
  company: string
  medianSalary: number
  matchCount: number
  peers: Comp[]
}

function formatK(n: number): string {
  return `$${Math.round(n / 1000)}k`
}

export default function ShareCard({
  signalLabel,
  signalSub,
  signalColor,
  discipline,
  track,
  level,
  company,
  medianSalary,
  matchCount,
  peers,
}: ShareCardProps) {
  const previewPeers = peers.slice(0, 3)

  return (
    <div>
      <div
        style={{
          width: '100%',
          background: '#0e0e10',
          borderRadius: 20,
          padding: '28px 24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          border: '1px solid #2a2a2d',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gridTemplateRows: 'auto auto',
          columnGap: 8,
          rowGap: 3,
          marginBottom: 24,
          alignItems: 'end',
        }}>
          {/* row 1 — levar | company name (truncates if very long) */}
          <div style={{
            fontSize: 20, fontWeight: 900, color: '#efeff1',
            letterSpacing: '-0.5px',
            fontFamily: 'var(--font-fraunces), Georgia, serif',
            lineHeight: 1,
          }}>levar</div>
          <div style={{
            fontSize: 11, color: '#5a5a6a', textAlign: 'right',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            lineHeight: 1,
          }}>{company}</div>
          {/* row 2 — tagline | discipline · track · level (never truncates) */}
          <div style={{
            fontSize: 10, color: '#f97316', fontWeight: 600,
            fontStyle: 'italic', whiteSpace: 'nowrap', lineHeight: 1.4,
          }}>real a&d comp data</div>
          <div style={{
            fontSize: 10, color: '#adadb8', textAlign: 'right',
            whiteSpace: 'nowrap', lineHeight: 1.4,
          }}>{discipline} · {track.toUpperCase()} · L{level}</div>
        </div>

        {/* Signal */}
        <div style={{ marginBottom: 20 }}>
          <div style={{
            fontSize: 64,
            fontWeight: 900,
            color: signalColor,
            lineHeight: 1,
            letterSpacing: '-2px',
          }}>
            {signalLabel}
          </div>
          <div style={{ fontSize: 13, color: '#adadb8', marginTop: 6 }}>
            {signalSub}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: '#2a2a2d', marginBottom: 16 }} />

        {/* Peer rows */}
        {previewPeers.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 9, color: '#5a5a6a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>
              people like you
            </div>
            {previewPeers.map((p, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingBottom: 8,
                borderBottom: i < previewPeers.length - 1 ? '1px solid #1a1a1d' : 'none',
                paddingTop: i > 0 ? 8 : 0,
                gap: 8,
              }}>
                <div style={{ minWidth: 0, overflow: 'hidden' }}>
                  <div style={{ fontSize: 11, color: '#adadb8', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.company ?? 'unknown'}
                  </div>
                  <div style={{ fontSize: 10, color: '#5a5a6a', marginTop: 1 }}>
                    {p.yoe} yrs · L{p.level_numeric}
                  </div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#efeff1', flexShrink: 0 }}>
                  {formatK(p.salary_base)}
                </div>
              </div>
            ))}
            {matchCount > 3 && (
              <div style={{ fontSize: 10, color: '#f97316', marginTop: 8 }}>
                +{matchCount - 3} more at levar.vercel.app
              </div>
            )}
          </div>
        )}

        {/* Divider */}
        <div style={{ height: 1, background: '#2a2a2d', marginBottom: 16 }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          <div style={{
            flex: 1,
            background: '#18181b',
            borderRadius: 8,
            padding: '10px 12px',
            border: '1px solid #2a2a2d',
          }}>
            <div style={{ fontSize: 9, color: '#5a5a6a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              peer median
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#efeff1' }}>
              {formatK(medianSalary)}
            </div>
          </div>
          <div style={{
            flex: 1,
            background: '#18181b',
            borderRadius: 8,
            padding: '10px 12px',
            border: '1px solid #2a2a2d',
          }}>
            <div style={{ fontSize: 9, color: '#5a5a6a', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
              matches
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#9147ff' }}>
              {matchCount}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 10, color: '#f97316' }}>
          levar.vercel.app
        </div>
      </div>
    </div>
  )
}
