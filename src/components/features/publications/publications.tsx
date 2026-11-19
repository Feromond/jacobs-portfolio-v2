import type React from 'react'
import { useMemo } from 'react'

import { Headings } from '../../core/headings/headings'
import type { Publication } from '../../../library'
import { Arrow, Download, publications, ricker } from '../../../library'
import './style.css'

const ME = 'Mish, J.'
const TRACE_COLORS = [
  '#9fd8f2',
  '#8ff0cb',
  '#ffc9a3',
  '#c3b1ff',
  '#a8e6cf',
  '#ffb8d9',
]
const W = 300
const H = 96
const TRACES = 22

const seeded = (text: string) => {
  let h = 2166136261
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function Seismogram({ seed }: { seed: string }) {
  const { traces, pick } = useMemo(() => {
    const rand = seeded(seed)
    const apex = 0.2 + rand() * 0.6
    const t0 = 18 + rand() * 10
    const v = 0.7 + rand() * 0.6
    const reflectors = Array.from({ length: 3 }, (_, i) => ({
      depth: 40 + i * 18 + rand() * 8,
      dip: (rand() - 0.5) * 0.12,
      r: (rand() < 0.5 ? -1 : 1) * (0.4 + rand() * 0.4),
    }))
    const spacing = W / TRACES
    const first: string[] = []
    const paths = Array.from({ length: TRACES }, (_, k) => {
      const x0 = spacing * (k + 0.5)
      const offset = (x0 / W - apex) * W
      const arrival = Math.sqrt(t0 * t0 + (offset * v * 0.3) ** 2)
      first.push(`${x0.toFixed(1)},${arrival.toFixed(1)}`)
      let d = ''
      for (let y = 0; y <= H; y += 2) {
        let a = 1.1 * ricker(y - arrival, 3.2)
        for (const r of reflectors)
          a += r.r * ricker(y - (r.depth + r.dip * x0), 2.6)
        a += (rand() - 0.5) * 0.08
        d += `${y ? 'L' : 'M'}${(x0 + a * spacing * 0.9).toFixed(1)},${y}`
      }
      return d
    })
    return { traces: paths, pick: first.join(' ') }
  }, [seed])

  return (
    <svg
      className="pub-seismo"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {traces.map((d, i) => (
        <path key={i} d={d} />
      ))}
      <polyline className="pub-pick" points={pick} pathLength={1} />
    </svg>
  )
}

function Authors({ text }: { text: string }) {
  const at = text.indexOf(ME)
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <strong>{ME}</strong>
      {text.slice(at + ME.length)}
    </>
  )
}

function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
  return (
    <article
      className="pub"
      data-reveal
      style={
        {
          '--trace': TRACE_COLORS[index % TRACE_COLORS.length],
          '--reveal-delay': `${index * 0.08}s`,
        } as React.CSSProperties
      }
    >
      <div className="pub-art">
        <Seismogram seed={pub.title} />
        <span className="pub-type">
          {pub.type} · {pub.year}
        </span>
      </div>
      <div className="pub-body">
        <h3 className="pub-title">
          <a href={pub.link} target="_blank" rel="noopener">
            {pub.title}
          </a>
        </h3>
        <p className="pub-authors">
          <Authors text={pub.authors} />
        </p>
        <p className="pub-venue" title={pub.venue}>
          {pub.venueShort}
          {pub.place && ` · ${pub.place}`}
        </p>
        <p className="pub-role">{pub.role}</p>
        <div className="pub-links">
          <a className="link" href={pub.link} target="_blank" rel="noopener">
            {pub.type === 'Talk' ? 'Watch the talk' : 'Read the paper'}
            <Arrow aria-hidden="true" />
          </a>
          {pub.pdf && (
            <a className="link" href={pub.pdf} download>
              PDF <Download aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export function Publications() {
  return (
    <section
      id="publications"
      className="publications"
      aria-labelledby="publications-title"
    >
      <Headings
        title="Publications"
        lede="Papers and talks from my time in geophysics."
        id="publications-title"
      />
      <div className="pubs">
        {publications.map((pub, i) => (
          <PublicationCard key={pub.link} pub={pub} index={i} />
        ))}
      </div>
    </section>
  )
}
