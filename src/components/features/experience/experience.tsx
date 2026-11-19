import type React from 'react'
import { useId, useRef, useState } from 'react'

import { Headings } from '../../core/headings/headings'
import {
  Arrow,
  ArrowLeft,
  External,
  currentMonthIndex,
  experiences,
  formatMonth,
  monthIndex as toIndex,
} from '../../../library'
import './style.css'

const nowIndex = currentMonthIndex()
const start = Math.min(...experiences.map((e) => toIndex(e.from))) - 3
const end = nowIndex + 2
const span = end - start

const firstYear = Math.ceil(start / 12)
const lastYear = Math.floor(nowIndex / 12)
const tickStep = Math.max(1, Math.ceil((lastYear - firstYear + 1) / 8))
const years = Array.from(
  { length: lastYear - firstYear + 1 },
  (_, i) => firstYear + i
).filter((y) => (lastYear - y) % tickStep === 0)

const NUMBER_WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Eleven',
  'Twelve',
]
const roleCount = NUMBER_WORDS[experiences.length] ?? `${experiences.length}`

const pct = (index: number) => `${((index - start) / span) * 100}%`

const formatDuration = (from: string, to: string | null) => {
  const months = (to ? toIndex(to) : nowIndex) - toIndex(from) + 1
  const y = Math.floor(months / 12)
  const m = months % 12
  const parts = []
  if (y) parts.push(`${y} yr${y > 1 ? 's' : ''}`)
  if (m) parts.push(`${m} mo${m > 1 ? 's' : ''}`)
  return parts.join(' ')
}

const METRIC =
  /(\$[\d,.]+(?:\s?(?:million|billion|k|M))?|\d+(?:\.\d+)?[%×]|\d[\d,]*\+?\s(?:users|customers|stars|downloads))/g

function Highlighted({ text }: { text: string }) {
  const parts = text.split(METRIC)
  return (
    <>
      {parts.map((part, i) =>
        i % 2 ? (
          <strong key={i} className="metric">
            {part}
          </strong>
        ) : (
          part
        )
      )}
    </>
  )
}

export function Career({ reveal = false }: { reveal?: boolean }) {
  const [selected, setSelected] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const baseId = useId()

  const step = (delta: number) =>
    setSelected((s) => (s + delta + experiences.length) % experiences.length)

  const onKeyDown = (e: React.KeyboardEvent) => {
    const keys: Record<string, number> = {
      ArrowDown: 1,
      ArrowRight: 1,
      ArrowUp: -1,
      ArrowLeft: -1,
    }
    let next: number | undefined
    if (e.key in keys)
      next = (selected + keys[e.key] + experiences.length) % experiences.length
    if (e.key === 'Home') next = 0
    if (e.key === 'End') next = experiences.length - 1
    if (next === undefined) return
    e.preventDefault()
    setSelected(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div className="career" data-reveal={reveal || undefined}>
      <div className="timeline">
        <div className="timeline-axis" aria-hidden="true">
          {years.map((y) => (
            <span key={y} style={{ left: pct(y * 12) }}>
              {y}
            </span>
          ))}
        </div>

        <div
          className="timeline-rows"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Roles"
          onKeyDown={onKeyDown}
        >
          <span className="timeline-overlay" aria-hidden="true">
            {years.map((y) => (
              <span
                key={y}
                className="timeline-grid"
                style={{ left: pct(y * 12) }}
              />
            ))}
            <span className="timeline-now" style={{ left: pct(nowIndex + 1) }}>
              <span>Now</span>
            </span>
          </span>

          {experiences.map((e, i) => {
            const from = toIndex(e.from)
            const to = e.to ? toIndex(e.to) + 1 : nowIndex + 1
            return (
              <button
                key={e.company}
                ref={(el) => (tabRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`${baseId}-tab-${i}`}
                aria-selected={selected === i}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected === i ? 0 : -1}
                className={`timeline-row ${
                  selected === i ? 'is-selected' : ''
                }`}
                style={{ '--role': e.color } as React.CSSProperties}
                onClick={() => setSelected(i)}
              >
                <span className="timeline-label">
                  <span
                    className={`logo ${
                      e.logoBg === 'transparent' ? 'is-icon' : ''
                    }`}
                    style={{ background: e.logoBg }}
                  >
                    <img src={e.logo} alt="" width={28} height={28} />
                  </span>
                  <span className="timeline-name">
                    <span className="timeline-company">{e.company}</span>
                    <span className="timeline-years">
                      {e.from.slice(0, 4)}
                      {e.to?.slice(0, 4) === e.from.slice(0, 4)
                        ? ''
                        : `–${e.to ? e.to.slice(0, 4) : 'now'}`}
                    </span>
                  </span>
                </span>
                <span className="timeline-track">
                  <span
                    className={`timeline-bar ${e.to ? '' : 'is-current'}`}
                    style={{
                      left: pct(from),
                      width: `${((to - from) / span) * 100}%`,
                    }}
                  >
                    {!e.to && <span className="live-dot timeline-beacon" />}
                  </span>
                </span>
                {!e.to && (
                  <span className="visually-hidden">, current role</span>
                )}
              </button>
            )
          })}
        </div>
        <div className="timeline-foot">
          <span className="live">
            <span className="live-dot" aria-hidden="true" />
            Current role
          </span>
          <span className="timeline-hint">
            Select a role or use the arrow keys
          </span>
        </div>
      </div>

      <div className="roles">
        {experiences.map((job, i) => (
          <div
            key={job.company}
            className={`role ${selected === i ? 'is-selected' : ''}`}
            id={selected === i ? `${baseId}-panel` : undefined}
            role={selected === i ? 'tabpanel' : undefined}
            aria-labelledby={
              selected === i ? `${baseId}-tab-${selected}` : undefined
            }
            aria-hidden={selected !== i || undefined}
            style={{ '--role': job.color } as React.CSSProperties}
          >
            <div className="role-info">
              <div className="role-head">
                <span
                  className={`logo logo-lg ${
                    job.logoBg === 'transparent' ? 'is-icon' : ''
                  }`}
                  style={{ background: job.logoBg }}
                >
                  <img src={job.logo} alt="" width={56} height={56} />
                </span>
                <div>
                  <h3>{job.title}</h3>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener"
                    tabIndex={selected === i ? undefined : -1}
                  >
                    {job.company}
                    <External aria-hidden="true" />
                  </a>
                </div>
              </div>

              {!job.to && (
                <p className="live role-live">
                  <span className="live-dot" aria-hidden="true" />
                  Currently here
                </p>
              )}

              <p className="role-meta">
                {formatMonth(job.from)} – {formatMonth(job.to)}
                <span aria-hidden="true"> · </span>
                {formatDuration(job.from, job.to)}
                {job.location && (
                  <>
                    <span aria-hidden="true"> · </span>
                    {job.location}
                  </>
                )}
              </p>

              <p className="role-summary">{job.summary}</p>

              <div className="role-step">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous role"
                  tabIndex={selected === i ? undefined : -1}
                >
                  <ArrowLeft aria-hidden="true" />
                </button>
                <span>
                  {i + 1} of {experiences.length}
                </span>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next role"
                  tabIndex={selected === i ? undefined : -1}
                >
                  <Arrow aria-hidden="true" />
                </button>
              </div>
            </div>

            <ul className="role-highlights">
              {job.highlights.map((h) => (
                <li key={h}>
                  <Highlighted text={h} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Experience() {
  return (
    <section
      id="experience"
      className="experience"
      aria-labelledby="experience-title"
    >
      <Headings
        title="Experience"
        lede={`${roleCount} roles across product, data, and research.`}
        id="experience-title"
      />
      <Career reveal />
    </section>
  )
}
