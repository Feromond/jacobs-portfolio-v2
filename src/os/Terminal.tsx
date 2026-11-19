import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import {
  contactLinks,
  experiences,
  publications,
  ventra,
  currentMonthIndex,
  formatMonth,
  monthIndex,
} from '../library'
import type { AppId, OsApi } from './apps'
import { catalog, findProject } from './catalog'

type Line = { id: number; node: React.ReactNode }

const PROMPT = (
  <span className="t-prompt">
    jacob@mish <span className="t-dim">~</span> $
  </span>
)

const FILES = ['about.txt', 'contact.txt', 'resume.pdf']
const DIRS = ['projects/', 'experience/', 'research/']
const APP_ALIASES: Record<string, AppId> = {
  about: 'about',
  projects: 'projects',
  experience: 'experience',
  jobs: 'experience',
  terminal: 'terminal',
  resume: 'resume',
  'resume.pdf': 'resume',
  cv: 'resume',
  research: 'research',
  publications: 'research',
  contact: 'contact',
}

const COMMANDS = [
  'help',
  'whoami',
  'neofetch',
  'ls',
  'open',
  'cat',
  'projects',
  'experience',
  'stars',
  'contact',
  'wallpaper',
  'date',
  'echo',
  'clear',
  'history',
  'exit',
]

const ext = (href: string, label: string) => (
  <a className="t-link" href={href} target="_blank" rel="noopener">
    {label}
  </a>
)

const careerYears = () => {
  const first = experiences.map((e) => e.from).sort()[0]
  return Math.max(1, Math.floor((currentMonthIndex() - monthIndex(first)) / 12))
}

const formatDate = (ym: string | null) => formatMonth(ym, 'now')

function Neofetch({ total }: { total?: number }) {
  const art = [
    ['a', 'm', 'dot'],
    ['c'],
    ['b', 'dot', 'm', 'a'],
    ['a', 'm', 'dot', 'b'],
    ['c', 'a'],
  ]
  const info: [string, string][] = [
    ['role', 'software engineer · data & ml'],
    ['stack', 'rust, python, typescript, swift'],
    ['studio', ventra.name.toLowerCase()],
    ['uptime', `${careerYears()} years shipping software`],
    ['projects', `${catalog.length} public`],
    ['stars', total !== undefined ? `${total} across public repos` : '…'],
    ['shell', 'jsh 1.0'],
  ]
  return (
    <div className="t-neofetch">
      <div className="t-art" aria-hidden="true">
        {art.map((row, i) => (
          <div key={i}>
            {row.map((k, j) => (
              <i key={j} className={`t-seg t-${k}`} />
            ))}
          </div>
        ))}
      </div>
      <div>
        <div>
          <span className="t-hi">jacob</span>@<span className="t-hi">mish</span>
        </div>
        <div className="t-dim">─────────────</div>
        {info.map(([k, v]) => (
          <div key={k}>
            <span className="t-key">{k}</span> {v}
          </div>
        ))}
      </div>
    </div>
  )
}

export function Terminal({ api, focused }: { api: OsApi; focused: boolean }) {
  const [lines, setLines] = useState<Line[]>(() => [
    {
      id: 0,
      node: (
        <span className="t-dim">
          JacobOS terminal. Type <span className="t-hi">help</span> to see what
          you can do.
        </span>
      ),
    },
  ])
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(1)

  useEffect(() => {
    if (focused) inputRef.current?.focus({ preventScroll: true })
  }, [focused])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [lines])

  const print = (...nodes: React.ReactNode[]) =>
    setLines((prev) => [
      ...prev,
      ...nodes.map((node) => ({ id: nextId.current++, node })),
    ])

  const run = (raw: string) => {
    const trimmed = raw.trim()
    print(
      <span>
        {PROMPT} {trimmed}
      </span>
    )
    if (!trimmed) return
    setHistory((h) => [...h, trimmed])
    const [cmd, ...args] = trimmed.split(/\s+/)
    const arg = args.join(' ').replace(/\/$/, '')

    switch (cmd.toLowerCase()) {
      case 'help':
        print(
          <div className="t-table">
            {[
              ['whoami', 'who is this'],
              ['neofetch', 'system info, sort of'],
              ['ls [dir]', 'list files and projects'],
              ['open <name>', 'open an app or project'],
              ['cat <file>', 'read a file'],
              ['projects', 'everything I have built'],
              ['experience', 'where I have worked'],
              ['stars', 'GitHub stars, live'],
              ['contact', 'how to reach me'],
              ['wallpaper [name]', 'list or set the desktop wallpaper'],
              ['clear', 'clear the screen'],
            ].map(([c, d]) => (
              <div key={c}>
                <span className="t-hi">{c}</span>
                <span className="t-dim">{d}</span>
              </div>
            ))}
          </div>
        )
        break
      case 'whoami':
        print('jacob mish · software engineer · data & ml')
        break
      case 'neofetch':
        print(<Neofetch total={api.total} />)
        break
      case 'ls':
        if (!arg) {
          print(
            <span>
              {DIRS.map((d) => (
                <span key={d} className="t-dir">
                  {d}{' '}
                </span>
              ))}
              {FILES.join('  ')}
            </span>
          )
        } else if (arg === 'projects') {
          print(
            <span>
              {catalog.map((p) => (
                <span key={p.slug} className="t-dir">
                  {p.slug}/{' '}
                </span>
              ))}
            </span>
          )
        } else if (arg === 'experience') {
          print(
            experiences
              .map((e) => e.company.toLowerCase().replace(/\s+/g, '-'))
              .join('  ')
          )
        } else if (arg === 'research') {
          print(publications.map((p) => `${p.year}.pdf`).join('  '))
        } else {
          print(`ls: ${arg}: No such file or directory`)
        }
        break
      case 'cd':
        print(
          <span className="t-dim">
            This is a small shell. Try{' '}
            <span className="t-hi">open {arg || 'projects'}</span>.
          </span>
        )
        break
      case 'open': {
        if (!arg) {
          print('usage: open <app|project>')
          break
        }
        const name = arg.toLowerCase()
        const app = APP_ALIASES[name]
        const project = findProject(name)
        if (name === 'ventra' || name === 'ventra.dev') {
          window.open(ventra.url, '_blank', 'noopener')
          print(<span className="t-dim">opening ventra.dev in a new tab…</span>)
        } else if (app) {
          api.open(app)
          print(<span className="t-dim">opening {arg}…</span>)
        } else if (project) {
          api.open('projects', project.slug)
          print(<span className="t-dim">opening {project.title}…</span>)
        } else {
          print(`open: ${arg}: not found. Try ls projects.`)
        }
        break
      }
      case 'cat':
        if (arg === 'about.txt') {
          print(
            'Software engineer with a background in Geophysics. I build fast, reliable software, from data pipelines and ML to native apps and terminal tools.'
          )
        } else if (arg === 'contact.txt') {
          print(
            <span>
              email {ext(contactLinks.email, 'jacobpmish@gmail.com')} · linkedin{' '}
              {ext(contactLinks.linkedin, 'in/jacob-mish')}
            </span>
          )
        } else if (arg === 'resume.pdf') {
          api.open('resume')
          print(<span className="t-dim">binary file; opened in Résumé.</span>)
        } else {
          print(`cat: ${arg || '(nothing)'}: No such file`)
        }
        break
      case 'projects':
        print(
          <div className="t-table">
            {catalog.map((p) => (
              <div key={p.slug}>
                <span className="t-hi">{p.title}</span>
                <span className="t-dim">{p.stack}</span>
              </div>
            ))}
          </div>
        )
        break
      case 'experience':
      case 'jobs':
        print(
          <div className="t-table">
            {experiences.map((e) => (
              <div key={e.company}>
                <span className="t-hi">{e.company}</span>
                <span className="t-dim">
                  {e.title} · {formatDate(e.from)} to {formatDate(e.to)}
                  {!e.to && <span className="t-live"> ● live</span>}
                </span>
              </div>
            ))}
          </div>
        )
        break
      case 'stars': {
        if (api.total === undefined) {
          print('stars: still fetching from GitHub, try again in a moment')
          break
        }
        const top = catalog
          .map((p) => [p.title, api.stars(p.repo) ?? 0] as const)
          .filter(([, n]) => n > 0)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 4)
        print(
          <span>
            <span className="t-peach">{api.total} ★</span> across public repos
          </span>,
          <div className="t-table">
            {top.map(([t, n]) => (
              <div key={t}>
                <span className="t-hi">{t}</span>
                <span className="t-dim">{n} ★</span>
              </div>
            ))}
          </div>
        )
        break
      }
      case 'contact':
        api.open('contact')
        print(
          <span>
            {ext(contactLinks.email, 'email')} ·{' '}
            {ext(contactLinks.linkedin, 'linkedin')} ·{' '}
            {ext(contactLinks.github, 'github')}
          </span>
        )
        break
      case 'wallpaper':
        if (!arg) {
          print(
            <div className="t-table">
              {api.wallpapers.map((name) => (
                <div key={name}>
                  <span className={name === api.wallpaper ? 't-mint' : 't-hi'}>
                    {name === api.wallpaper ? '● ' : '  '}
                    {name}
                  </span>
                  <span className="t-dim">
                    {name === api.wallpaper
                      ? 'current'
                      : `wallpaper ${name.split(' ')[0]}`}
                  </span>
                </div>
              ))}
            </div>
          )
        } else if (api.setWallpaper(arg)) {
          print(<span className="t-dim">wallpaper set to {arg}</span>)
        } else {
          print(
            `wallpaper: no wallpaper named ${arg}. Try: ${api.wallpapers.join(
              ', '
            )}`
          )
        }
        break
      case 'date':
        print(new Date().toString())
        break
      case 'echo':
        print(args.join(' '))
        break
      case 'history':
        print([...history, trimmed].map((h, i) => `${i + 1}  ${h}`).join('\n'))
        break
      case 'clear':
        setLines([])
        break
      case 'exit':
        api.close('terminal')
        break
      case 'sudo':
        print(
          'jacob is not in the sudoers file. This incident will be reported.'
        )
        break
      case 'rm':
        print(<span className="t-peach">nice try.</span>)
        break
      case 'vim':
      case 'nvim':
        print(':q! (you are safe here)')
        break
      case 'cargo':
        print(
          <span>
            Compiling jacobos v1.0.0 <span className="t-mint">Finished</span> in
            0.42s
          </span>
        )
        break
      default:
        print(`jsh: command not found: ${cmd}. Type help.`)
    }
  }

  const complete = () => {
    const parts = input.split(/\s+/)
    if (parts.length === 1) {
      const match = COMMANDS.filter((c) => c.startsWith(parts[0]))
      if (match.length === 1) setInput(match[0] + ' ')
      else if (match.length > 1) print(match.join('  '))
      return
    }
    const last = parts[parts.length - 1]
    const pool = [
      ...Object.keys(APP_ALIASES),
      ...catalog.map((p) => p.slug),
      ...FILES,
      ...DIRS,
    ]
    const match = Array.from(new Set(pool.filter((p) => p.startsWith(last))))
    if (match.length === 1) {
      parts[parts.length - 1] = match[0]
      setInput(parts.join(' '))
    } else if (match.length > 1) {
      print(match.join('  '))
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      run(input)
      setInput('')
      setCursor(-1)
    } else if (e.key === 'Tab') {
      e.preventDefault()
      complete()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const next = cursor < 0 ? history.length - 1 : Math.max(0, cursor - 1)
      setCursor(next)
      setInput(history[next])
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (cursor < 0) return
      const next = cursor + 1
      if (next >= history.length) {
        setCursor(-1)
        setInput('')
      } else {
        setCursor(next)
        setInput(history[next])
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setLines([])
    }
  }

  return (
    <div
      className="app-terminal"
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((l) => (
        <div key={l.id} className="t-line">
          {l.node}
        </div>
      ))}
      <label className="t-input">
        {PROMPT}
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-label="Terminal command"
        />
      </label>
    </div>
  )
}
