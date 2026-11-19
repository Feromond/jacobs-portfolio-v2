import type React from 'react'
import { memo, useEffect, useRef, useState } from 'react'

import resumePDF from '../assets/Jacob_Mish_Resume.pdf'
import { Career } from '../components/features/experience/experience'
import {
  Arrow,
  ArrowLeft,
  Briefcase,
  Download,
  External,
  Flask,
  Folder,
  Github,
  LinkedIn,
  Mail,
  ResumeIcon,
  Star,
  Terminal as TerminalIcon,
  User,
  archivedProjects,
  contactLinks,
  publications,
  skillGroups,
  ventra,
} from '../library'
import { catalog, findProject } from './catalog'
import { Terminal } from './Terminal'

export type AppId =
  | 'about'
  | 'projects'
  | 'experience'
  | 'terminal'
  | 'resume'
  | 'research'
  | 'contact'

export interface OsApi {
  open: (id: AppId, payload?: string) => void
  close: (id: AppId) => void
  stars: (repo?: string) => number | undefined
  total?: number
  wallpapers: string[]
  wallpaper: string
  setWallpaper: (name: string) => boolean
}

interface AppDef {
  title: string
  tile: string
  glyph: React.ReactNode
  size: [number, number]
  minSize: [number, number]
}

export const APPS: Record<AppId, AppDef> = {
  about: {
    title: 'About Jacob',
    tile: 'var(--pastel-1)',
    glyph: <User />,
    size: [560, 600],
    minSize: [360, 320],
  },
  projects: {
    title: 'Projects',
    tile: 'var(--pastel-2)',
    glyph: <Folder />,
    size: [820, 580],
    minSize: [420, 340],
  },
  experience: {
    title: 'Experience',
    tile: 'var(--pastel-3)',
    glyph: <Briefcase />,
    size: [780, 620],
    minSize: [440, 380],
  },
  terminal: {
    title: 'Terminal',
    tile: 'linear-gradient(160deg, #23262c, #0c0d10)',
    glyph: <TerminalIcon />,
    size: [620, 400],
    minSize: [380, 220],
  },
  resume: {
    title: 'Résumé',
    tile: 'var(--pastel-4)',
    glyph: <ResumeIcon />,
    size: [720, 820],
    minSize: [380, 360],
  },
  research: {
    title: 'Research',
    tile: 'var(--pastel-5)',
    glyph: <Flask />,
    size: [640, 520],
    minSize: [380, 300],
  },
  contact: {
    title: 'Contact',
    tile: 'var(--pastel-6)',
    glyph: <Mail />,
    size: [440, 420],
    minSize: [340, 340],
  },
}

export const APP_ORDER: AppId[] = [
  'about',
  'projects',
  'experience',
  'terminal',
  'resume',
  'research',
  'contact',
]

export function AppTile({ id, size = 56 }: { id: AppId; size?: number }) {
  const app = APPS[id]
  return (
    <span
      className={`app-tile ${id === 'terminal' ? 'is-dark' : ''}`}
      style={{ '--tile': app.tile, '--s': `${size}px` } as React.CSSProperties}
      aria-hidden="true"
    >
      {app.glyph}
    </span>
  )
}

function About({ api }: { api: OsApi }) {
  return (
    <div className="app-about">
      <p className="app-kicker">
        <span className="live-dot" aria-hidden="true" />
        Software Engineer · Data &amp; ML
      </p>
      <h3>Jacob Mish</h3>
      <p className="app-lead">
        I build fast, reliable software, from data pipelines and ML to native
        apps and terminal tools.
      </p>
      <p>
        I started in Geophysics, using neural networks to find hazards in
        fibre-optic sensing data. Now I work across the stack, leaning toward
        backend systems and large projects, and ship my own apps, mostly in
        Rust, under {ventra.name}.
      </p>
      <div className="app-about-grid">
        {skillGroups.map((g) => (
          <div key={g.label}>
            <p className="app-label">{g.label}</p>
            <p>{g.items.join(', ')}</p>
          </div>
        ))}
      </div>
      <div className="app-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => api.open('projects')}
        >
          Browse projects
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => api.open('experience')}
        >
          Experience
        </button>
      </div>
    </div>
  )
}

function Projects({
  payload,
  nonce,
  api,
}: {
  payload?: string
  nonce?: number
  api: OsApi
}) {
  const [slug, setSlug] = useState<string | undefined>(payload)
  const [filter, setFilter] = useState<'all' | 'featured' | 'archive'>('all')
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (payload) setSlug(payload)
  }, [payload, nonce])

  useEffect(() => {
    rootRef.current?.closest('.os-content')?.scrollTo({ top: 0 })
  }, [slug])

  const project = slug ? findProject(slug) : undefined

  if (project) {
    const count = api.stars(project.repo)
    return (
      <div className="app-project" ref={rootRef}>
        <button
          type="button"
          className="app-back"
          onClick={() => setSlug(undefined)}
        >
          <ArrowLeft aria-hidden="true" /> All projects
        </button>
        <div className="app-project-media">
          <img src={project.image} alt="" />
        </div>
        <div className="app-project-body">
          <div className="app-project-head">
            {project.icon && <img src={project.icon} alt="" width={48} />}
            <div>
              <h3>{project.title}</h3>
              <p className="app-mono">{project.stack}</p>
            </div>
          </div>
          {project.featured && <p className="app-lead">{project.summary}</p>}
          <p>{project.description}</p>
          <div className="app-links">
            {project.links.map((l) => (
              <a
                key={l.href}
                className="link"
                href={l.href}
                target="_blank"
                rel="noopener"
              >
                {l.label} <Arrow aria-hidden="true" />
              </a>
            ))}
            {count !== undefined && (
              <span className="app-stars">
                <Star aria-hidden="true" /> {count}
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const items = catalog.filter((p) =>
    filter === 'featured' ? p.featured : true
  )

  return (
    <div className="app-finder" ref={rootRef}>
      <nav className="app-sidebar" aria-label="Project folders">
        <p className="app-label">Folders</p>
        {(
          [
            ['all', 'All projects'],
            ['featured', 'Ventra apps'],
            ['archive', 'Archive'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={filter === key ? 'is-active' : ''}
            onClick={() => setFilter(key)}
          >
            <Folder aria-hidden="true" /> {label}
          </button>
        ))}
        <a
          className="app-sidebar-link"
          href={ventra.url}
          target="_blank"
          rel="noopener"
        >
          ventra.dev <External aria-hidden="true" />
        </a>
      </nav>
      {filter === 'archive' ? (
        <ul className="app-archive">
          {archivedProjects.map((p) => (
            <li key={p.href}>
              <a href={p.href} target="_blank" rel="noopener">
                <b>{p.title}</b>
                <span>{p.note}</span>
                <External aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <div className="app-grid">
          {items.map((p) => (
            <button
              key={p.slug}
              type="button"
              className="app-item"
              onClick={() => setSlug(p.slug)}
            >
              <span className="app-thumb">
                <img src={p.icon ?? p.image} alt="" loading="lazy" />
              </span>
              <span className="app-item-name">{p.title}</span>
              <span className="app-item-meta">{p.stack.split(' · ')[0]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Resume() {
  return (
    <div className="app-resume">
      <div className="app-toolbar">
        <span className="app-mono">Jacob_Mish_Resume.pdf</span>
        <div className="app-links">
          <a className="link" href={resumePDF} target="_blank" rel="noopener">
            Open in new tab <External aria-hidden="true" />
          </a>
          <a className="link" href={resumePDF} download>
            Download <Download aria-hidden="true" />
          </a>
        </div>
      </div>
      <iframe src={`${resumePDF}#view=FitH`} title="Jacob Mish résumé" />
    </div>
  )
}

function Research() {
  return (
    <ol className="app-research">
      {publications.map((p) => (
        <li key={p.link}>
          <span className="app-year">{p.year}</span>
          <div>
            <h3>{p.title}</h3>
            <p>
              {p.authors} · {p.venue}
            </p>
            <div className="app-links">
              <a className="link" href={p.link} target="_blank" rel="noopener">
                {p.type === 'Talk' ? 'Watch the talk' : 'Read the paper'}{' '}
                <Arrow aria-hidden="true" />
              </a>
              {p.pdf && (
                <a className="link" href={p.pdf} download>
                  PDF <Download aria-hidden="true" />
                </a>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  )
}

function Contact({ api }: { api: OsApi }) {
  const rows = [
    {
      label: 'Email',
      value: 'jacobpmish@gmail.com',
      href: contactLinks.email,
      icon: <Mail />,
    },
    {
      label: 'LinkedIn',
      value: 'in/jacob-mish',
      href: contactLinks.linkedin,
      icon: <LinkedIn />,
    },
    {
      label: 'GitHub',
      value: api.total !== undefined ? `Feromond · ${api.total} ★` : 'Feromond',
      href: contactLinks.github,
      icon: <Github />,
    },
  ]
  return (
    <div className="app-contact">
      <h3>Say hi.</h3>
      <p>Email and LinkedIn are the easiest ways to reach me.</p>
      <ul>
        {rows.map((r) => (
          <li key={r.label}>
            <a
              href={r.href}
              target={r.href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener"
            >
              <span className="app-contact-icon">{r.icon}</span>
              <span>
                <b>{r.label}</b>
                <span>{r.value}</span>
              </span>
              <Arrow aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const AppContent = memo(function AppContent({
  id,
  payload,
  nonce,
  api,
  focused,
}: {
  id: AppId
  payload?: string
  nonce?: number
  api: OsApi
  focused: boolean
}) {
  switch (id) {
    case 'about':
      return <About api={api} />
    case 'projects':
      return <Projects payload={payload} nonce={nonce} api={api} />
    case 'experience':
      return (
        <div className="app-experience">
          <Career />
        </div>
      )
    case 'terminal':
      return <Terminal api={api} focused={focused} />
    case 'resume':
      return <Resume />
    case 'research':
      return <Research />
    case 'contact':
      return <Contact api={api} />
  }
})
