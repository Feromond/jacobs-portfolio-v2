import type React from 'react'

import resumePDF from '../../../assets/Jacob_Mish_Resume.pdf'
import { Arrow } from '../../../library'
import './style.css'

type Kind = 'a' | 'b' | 'c' | 'm' | 'dot'
type Seg = [number, Kind]
type Row = { segs: Seg[]; indent?: boolean }

const rowsBefore: Row[] = [
  {
    segs: [
      [180, 'a'],
      [120, 'm'],
      [0, 'dot'],
    ],
  },
  { segs: [[390, 'c']] },
  {
    segs: [
      [140, 'b'],
      [0, 'dot'],
      [100, 'm'],
      [190, 'a'],
    ],
  },
  {
    segs: [
      [240, 'a'],
      [120, 'm'],
      [0, 'dot'],
      [180, 'b'],
    ],
  },
  {
    segs: [
      [150, 'a'],
      [0, 'dot'],
      [100, 'm'],
      [200, 'c'],
    ],
    indent: true,
  },
]

const rowsAfter: Row[] = [
  {
    segs: [
      [250, 'b'],
      [0, 'dot'],
    ],
  },
  {
    segs: [
      [180, 'c'],
      [100, 'a'],
      [260, 'c'],
    ],
  },
  {
    segs: [
      [260, 'a'],
      [140, 'c'],
    ],
  },
  { segs: [[300, 'b']] },
  {
    segs: [
      [100, 'c'],
      [0, 'dot'],
      [160, 'm'],
      [60, 'a'],
    ],
  },
]

const delay = (seconds: number) =>
  ({ '--d': `${seconds}s` } as React.CSSProperties)

function CodeRows({ rows }: { rows: Row[] }) {
  return (
    <>
      {rows.map((row, r) => (
        <div
          key={r}
          className={`code-row rise ${row.indent ? 'is-indented' : ''}`}
          style={delay(0.15)}
          aria-hidden="true"
        >
          {row.segs.map(([w, kind], s) => (
            <span
              key={s}
              className={`code-seg rise seg-${kind}`}
              style={
                { ...delay(0.45 + s * 0.15), '--w': w } as React.CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </>
  )
}

export function Home() {
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero-rail rise" style={delay(0.15)} aria-hidden="true" />
      <div className="hero-bundle">
        <CodeRows rows={rowsBefore} />

        <div className="hero-name rise" style={delay(0.3)}>
          <h1 id="hero-title" className="hero-title rise" style={delay(0.45)}>
            Jacob Mish
          </h1>
          <p className="hero-kicker rise" style={delay(0.5)}>
            <span className="live-dot" aria-hidden="true" />
            Software Engineer · Data &amp; ML
          </p>
          <p className="hero-role rise" style={delay(0.6)}>
            <strong>I build fast, reliable software,</strong> from data pipelines
            and ML to native apps and terminal tools.
          </p>
          <div className="hero-actions rise" style={delay(0.72)}>
            <a className="btn btn-primary" href="#projects">
              See my work
            </a>
            <a className="btn btn-secondary" href="/os">
              Open JacobOS
            </a>
            <a className="link" href={resumePDF} download>
              Résumé <Arrow aria-hidden="true" />
            </a>
          </div>
        </div>

        <CodeRows rows={rowsAfter} />
      </div>
    </section>
  )
}
