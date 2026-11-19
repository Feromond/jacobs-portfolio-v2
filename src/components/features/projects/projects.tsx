import type React from 'react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import { Headings } from '../../core/headings/headings'
import type { FeaturedProject, Project } from '../../../library'
import {
  Arrow,
  ArrowLeft,
  Check,
  Copy,
  GITHUB_USER,
  Pause,
  Play,
  Star,
  archivedProjects,
  contactLinks,
  featuredProjects,
  projects,
  slugify,
  ventra,
} from '../../../library'
import { useLens } from '../../../liquidGlass'
import { useGithubStars } from './useGithubStars'
import './style.css'

type StarLookup = (repo?: string) => number | undefined

const PAGE_SIZE = 5
const RECENT = 'Recent'

const indexItems: Project[] = [
  ...featuredProjects.map((p) => ({
    title: p.title,
    description: p.summary,
    image: p.image,
    icon: p.icon,
    repo: p.repo,
    href: p.links[0]?.href ?? '#',
    links: p.links.slice(1),
    stack: p.stack.split(' · ')[0],
    year: p.year,
    category: p.category,
    featured: true,
  })),
  ...projects,
]

const formatStars = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : `${n}`

const motionAllowed = () => {
  const saveData = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection?.saveData
  return (
    !saveData && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function TourVideo({
  src,
  poster,
  title,
  className = '',
}: {
  src: string
  poster: string
  title: string
  className?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const userPaused = useRef(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const video = ref.current
    if (!video || !motionAllowed()) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !userPaused.current) {
          video.play().catch(() => undefined)
        } else if (!entry.isIntersecting) {
          video.pause()
        }
      },
      { threshold: 0.45 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  const toggle = () => {
    const video = ref.current
    if (!video) return
    if (video.paused) {
      userPaused.current = false
      video.play().catch(() => undefined)
    } else {
      userPaused.current = true
      video.pause()
    }
  }

  return (
    <div className={`tour ${className}`}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        aria-label={`${title} product tour`}
      />
      <button
        type="button"
        className="tour-toggle"
        onClick={toggle}
        aria-label={playing ? `Pause ${title} tour` : `Play ${title} tour`}
      >
        {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
      </button>
    </div>
  )
}

function Links({ links }: { links: FeaturedProject['links'] }) {
  return (
    <div className="tile-links">
      {links.map((link) => (
        <a
          key={link.href}
          className="link"
          href={link.href}
          target="_blank"
          rel="noopener"
        >
          {link.label}
          <Arrow aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

const paletteClass = (p: FeaturedProject) =>
  p.palette ? `palette-${p.palette}` : ''

function HeroTile({ project }: { project: FeaturedProject }) {
  return (
    <article className={`tile tile-hero ${paletteClass(project)}`} data-reveal>
      <div className="tile-copy">
        <img
          className="tile-icon"
          src={project.icon}
          alt=""
          width={64}
          height={64}
          loading="lazy"
        />
        <h3 className="tile-name">{project.title}</h3>
        <p className="tile-headline">{project.headline}</p>
        <p className="tile-text">{project.description}</p>
        <Links links={project.links} />
        <p className="tile-stack">{project.stack}</p>
      </div>
      {project.video ? (
        <TourVideo
          src={project.video}
          poster={project.image}
          title={project.title}
        />
      ) : (
        <div className="tour">
          <img src={project.image} alt="" loading="lazy" />
        </div>
      )}
    </article>
  )
}

function InstallCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      type="button"
      className="install"
      onClick={copy}
      aria-label={`Copy install command: ${command}`}
    >
      <span className="install-prompt" aria-hidden="true">
        $
      </span>
      <code>{command}</code>
      <span className="install-hint" aria-live="polite">
        {copied ? <Check aria-label="Copied" /> : <Copy aria-hidden="true" />}
      </span>
    </button>
  )
}

function SplitTile({
  project,
  stars,
}: {
  project: FeaturedProject
  stars: StarLookup
}) {
  const count = stars(project.repo)
  return (
    <article className={`tile tile-split ${paletteClass(project)}`} data-reveal>
      <div className="tile-copy">
        <div className="tile-head">
          <img
            className="tile-icon"
            src={project.icon}
            alt=""
            width={48}
            height={48}
            loading="lazy"
          />
          <div>
            <h3 className="tile-name">{project.title}</h3>
            {count !== undefined && (
              <p className="tile-stars">
                <Star aria-hidden="true" /> {formatStars(count)} on GitHub
              </p>
            )}
          </div>
        </div>
        <p className="tile-headline">{project.headline}</p>
        <p className="tile-text">{project.description}</p>
        {project.install && <InstallCommand command={project.install} />}
        <Links links={project.links} />
      </div>
      <div className="split-frame">
        <div className="split-bar" aria-hidden="true">
          <i />
          <i />
          <i />
          <span>{slugify(project.title)}</span>
        </div>
        {project.video ? (
          <TourVideo
            src={project.video}
            poster={project.image}
            title={project.title}
            className="tour-split"
          />
        ) : (
          <div className="tour tour-split">
            <img src={project.image} alt="" loading="lazy" />
          </div>
        )}
      </div>
    </article>
  )
}

function StudioTile() {
  const shelf = [
    ...featuredProjects.map((p) => ({
      title: p.title,
      line: p.summary,
      icon: p.icon,
      href: p.links[0]?.href ?? ventra.url,
    })),
    ...projects
      .filter((p) => p.ventra)
      .map((p) => ({
        title: p.title,
        line: p.description,
        icon: p.icon ?? p.image,
        href: p.href,
      })),
  ]
  const markRef = useRef<HTMLImageElement>(null)

  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    const el = markRef.current
    if (!el || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(400px) rotateY(${x * 28}deg) rotateX(${
      -y * 28
    }deg)`
  }

  return (
    <article
      className="tile tile-studio"
      data-reveal
      onPointerMove={tilt}
      onPointerLeave={() => {
        if (markRef.current) markRef.current.style.transform = ''
      }}
    >
      <div className="studio-head">
        <img
          ref={markRef}
          className="studio-mark"
          src={ventra.mark}
          alt=""
          width={52}
          height={52}
          loading="lazy"
        />
        <div>
          <h3>{ventra.name}</h3>
          <p>
            {shelf.length} things shipping · since {ventra.since}
          </p>
        </div>
      </div>
      <p className="studio-blurb">
        Ventra is where I publish my own apps and tools. Most are written in Rust.
      </p>
      <ul className="studio-shelf">
        {shelf.map((item) => (
          <li key={item.title}>
            <a href={item.href} target="_blank" rel="noopener">
              <img
                src={item.icon}
                alt=""
                width={36}
                height={36}
                loading="lazy"
              />
              <span>
                <b>{item.title}</b>
                <span>{item.line}</span>
              </span>
              <Arrow aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <a
        className="studio-link"
        href={ventra.url}
        target="_blank"
        rel="noopener"
      >
        Visit ventra.dev <Arrow aria-hidden="true" />
      </a>
    </article>
  )
}

function ProjectIndex({
  items,
  stars,
}: {
  items: Project[]
  stars: StarLookup
}) {
  const categories = useMemo(
    () => [RECENT, ...Array.from(new Set(items.map((p) => p.category)))],
    [items]
  )
  const listFor = (c: string) =>
    c === RECENT
      ? items.filter((p) => !p.featured).sort((a, b) => b.year - a.year)
      : items
          .filter((p) => p.category === c)
          .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
  const [category, setCategory] = useState(RECENT)
  const [page, setPage] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const [pill, setPill] = useState<React.CSSProperties>({ opacity: 0 })
  const [tabPill, setTabPill] = useState<React.CSSProperties>({})
  const listRef = useRef<HTMLOListElement>(null)
  const tabsRef = useLens<HTMLDivElement>()
  const previewRef = useRef<HTMLDivElement>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0, tilt: 0 })
  const shown = useRef(false)

  const filtered = listFor(category)
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const visible = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)
  const hovered = active !== null ? visible[active] : undefined

  useLayoutEffect(() => {
    const tab = tabsRef.current?.querySelector<HTMLElement>(
      '[aria-selected="true"]'
    )
    if (tab)
      setTabPill({
        width: tab.offsetWidth,
        transform: `translateX(${tab.offsetLeft}px)`,
      })
  }, [category])

  useLayoutEffect(() => {
    const row =
      active !== null
        ? listRef.current?.querySelectorAll<HTMLElement>('.index-row')[active]
        : undefined
    setPill(
      row
        ? {
            opacity: 1,
            height: row.offsetHeight,
            transform: `translateY(${row.offsetTop}px)`,
          }
        : (p) => ({ ...p, opacity: 0 })
    )
  }, [active, page, category])

  const showing = hovered !== undefined
  useEffect(() => {
    const el = previewRef.current
    if (!el || !showing || !window.matchMedia('(hover: hover)').matches) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    const tick = () => {
      const c = current.current
      const t = target.current
      const k = still ? 1 : 0.16
      const dx = (t.x - c.x) * k
      c.x += dx
      c.y += (t.y - c.y) * k
      c.tilt += (Math.max(-7, Math.min(7, dx * 0.35)) - c.tilt) * 0.2
      el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0) rotate(${
        still ? 0 : c.tilt
      }deg)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [showing])

  const follow = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return
    const w = previewRef.current?.offsetWidth ?? 340
    const h = previewRef.current?.offsetHeight ?? 212
    const x = Math.min(e.clientX + 28, window.innerWidth - w - 16)
    const y = Math.min(
      Math.max(e.clientY - h / 2, 16),
      window.innerHeight - h - 16
    )
    target.current = { x, y }
    if (!shown.current) {
      current.current = { x, y, tilt: 0 }
      shown.current = true
    }
  }

  const anchorTo = (row: HTMLElement) => {
    const r = row.getBoundingClientRect()
    const w = previewRef.current?.offsetWidth ?? 340
    const h = previewRef.current?.offsetHeight ?? 212
    target.current = {
      x: Math.min(r.right - w - 80, window.innerWidth - w - 16),
      y: Math.max(16, r.top + r.height / 2 - h / 2),
    }
  }

  const choose = (c: string) => {
    setCategory(c)
    setPage(0)
    setActive(null)
  }

  const go = (p: number) => {
    setPage(Math.min(Math.max(0, p), pages - 1))
    setActive(null)
  }

  const count = (c: string) => listFor(c).length

  const pastelFor = (p: Project) =>
    `var(--pastel-${(items.indexOf(p) % 6) + 1})`

  return (
    <div className="index" data-reveal>
      <div className="index-toolbar">
        <div
          className="index-tabs glass"
          data-lens
          role="tablist"
          aria-label="Filter projects"
          ref={tabsRef}
        >
          <span className="index-tab-pill" style={tabPill} aria-hidden="true" />
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className="index-tab"
              onClick={() => choose(c)}
            >
              {c}
              <span className="index-tab-count">{count(c)}</span>
            </button>
          ))}
        </div>
        {pages > 1 && (
          <div className="index-pager" aria-label="Pages">
            <button
              type="button"
              onClick={() => go(page - 1)}
              disabled={page === 0}
              aria-label="Previous page"
            >
              <ArrowLeft aria-hidden="true" />
            </button>
            <span className="index-page">
              {page + 1} / {pages}
            </span>
            <button
              type="button"
              onClick={() => go(page + 1)}
              disabled={page === pages - 1}
              aria-label="Next page"
            >
              <Arrow aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div
        className="index-body"
        onPointerMove={follow}
        onPointerLeave={() => {
          setActive(null)
          shown.current = false
        }}
      >
        <span className="index-pill" style={pill} aria-hidden="true" />
        <ol
          className="index-list"
          ref={listRef}
          key={`${category}-${page}`}
          style={{ '--rows': PAGE_SIZE } as React.CSSProperties}
        >
          {visible.map((p, i) => {
            const stars_ = stars(p.repo)
            return (
              <li
                key={p.title}
                className={`index-row ${active === i ? 'is-active' : ''}`}
                style={
                  {
                    '--pastel': pastelFor(p),
                    '--i': i,
                  } as React.CSSProperties
                }
                onPointerEnter={(e) =>
                  e.pointerType === 'mouse' && setActive(i)
                }
                onFocus={(e) => {
                  setActive(i)
                  anchorTo(e.currentTarget)
                }}
              >
                <span className="index-thumb" aria-hidden="true">
                  <img
                    src={p.icon ?? p.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{ objectPosition: p.focus ?? 'top center' }}
                  />
                </span>
                <div className="index-main">
                  <h4 className="index-title">
                    <a href={p.href} target="_blank" rel="noopener">
                      {p.title}
                    </a>
                    {p.featured && (
                      <span className="index-featured">Featured</span>
                    )}
                  </h4>
                  <p className="index-desc">{p.description}</p>
                </div>
                <p className="index-meta">
                  <span>{p.stack}</span>
                  <span>
                    {p.year}
                    {stars_ !== undefined && stars_ > 0 && (
                      <span className="index-stars">
                        {' '}
                        · ★ {formatStars(stars_)}
                      </span>
                    )}
                  </span>
                </p>
                <div className="index-links">
                  {p.repo && (
                    <a
                      href={`https://github.com/${GITHUB_USER}/${p.repo}`}
                      target="_blank"
                      rel="noopener"
                    >
                      GitHub
                    </a>
                  )}
                  {p.links.map((l) => (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
                <Arrow className="index-arrow" aria-hidden="true" />
              </li>
            )
          })}
        </ol>
      </div>

      <div
        ref={previewRef}
        className={`index-preview ${hovered ? 'is-visible' : ''}`}
        style={
          {
            '--pastel': hovered ? pastelFor(hovered) : 'var(--pastel-1)',
          } as React.CSSProperties
        }
        aria-hidden="true"
      >
        {items.map((p) => (
          <img
            key={p.title}
            src={p.image}
            alt=""
            loading="lazy"
            decoding="async"
            className={hovered === p ? 'is-current' : ''}
            style={{
              objectPosition: p.focus ?? 'top center',
              objectFit: p.imageFit === 'contain' ? 'contain' : 'cover',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function Projects() {
  const sectionRef = useRef<HTMLElement>(null)
  const { stars, total } = useGithubStars(GITHUB_USER, sectionRef)
  const [lead, ...rest] = featuredProjects
  const [firstSplit, ...moreSplits] = rest

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="projects"
      aria-labelledby="projects-title"
    >
      <Headings
        title="Projects"
        lede="Most of what I build ships under Ventra Software."
        id="projects-title"
      >
        <a
          className="link"
          href={contactLinks.github}
          target="_blank"
          rel="noopener"
        >
          All repositories on GitHub <Arrow aria-hidden="true" />
        </a>
        {total !== undefined && (
          <span className="stars-total">
            <Star aria-hidden="true" /> {formatStars(total)} stars across my
            public repos
          </span>
        )}
      </Headings>

      <div className="bento">
        {lead && <HeroTile project={lead} />}
        {firstSplit && <SplitTile project={firstSplit} stars={stars} />}
        <StudioTile />
        {moreSplits.map((p) => (
          <SplitTile key={p.title} project={p} stars={stars} />
        ))}
      </div>

      <div className="more">
        <h3 className="more-title" data-reveal>
          More projects
        </h3>
        <ProjectIndex items={indexItems} stars={stars} />

        <ul className="archive" data-reveal>
          {archivedProjects.map((p) => (
            <li key={p.href}>
              <a href={p.href} target="_blank" rel="noopener">
                <span className="archive-name">{p.title}</span>
                <span className="archive-note">{p.note}</span>
                <Arrow aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
