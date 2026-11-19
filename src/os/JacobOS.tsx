import type React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import ventraMinecraftShot from '../assets/img/projects/ventra-minecraft.webp'
import { ColorBends } from '../components/features/background/background'
import { useGithubStars } from '../components/features/projects/useGithubStars'
import { ArrowLeft, External, GITHUB_USER, Star, ventra } from '../library'
import type { AppId, OsApi } from './apps'
import { APP_ORDER, APPS, AppContent, AppTile } from './apps'
import type { QuakeInfo } from './Seismic'
import { useLens } from '../liquidGlass'
import { Seismic } from './Seismic'
import { FrequencyDomain } from './FrequencyDomain'
import { Spectrum } from './Spectrum'
import type { WinState } from './Window'
import { Window } from './Window'
import './os.css'

const WALLPAPERS: {
  name: string
  kind: 'seismic' | 'frequency' | 'spectrum' | 'bends'
  colors?: string[]
}[] = [
  { name: 'seismic section', kind: 'seismic' },
  { name: 'frequency domain', kind: 'frequency' },
  { name: 'spectrogram', kind: 'spectrum' },
  {
    name: 'colour bends',
    kind: 'bends',
    colors: ['#ff5c7a', '#8a5cff', '#00ffd1'],
  },
]

type Wins = Partial<
  Record<AppId, WinState & { payload?: string; nonce?: number }>
>

const MOBILE_QUERY = '(max-width: 720px)'
const MENU_H = 32
const DOCK_SPACE = 96

const useClock = () => {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 15000)
    return () => window.clearInterval(t)
  }, [])
  return now
}

const fit = (win: WinState): WinState => {
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = Math.min(win.w, vw - 24)
  const h = Math.min(win.h, vh - MENU_H - 24)
  return {
    ...win,
    w,
    h,
    x: Math.min(Math.max(win.x, 12), vw - w - 12),
    y: Math.min(Math.max(win.y, MENU_H + 8), vh - h - 12),
  }
}

export default function JacobOS() {
  const [mobile, setMobile] = useState(
    () => window.matchMedia(MOBILE_QUERY).matches
  )
  const [wins, setWins] = useState<Wins>({})
  const [focused, setFocused] = useState<AppId | null>(null)
  const [wallpaper, setWallpaper] = useState(0)
  const [quake, setQuake] = useState<QuakeInfo | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const zTop = useRef(10)
  const opened = useRef(0)
  const now = useClock()
  const menubarRef = useLens<HTMLElement>()
  const dockRef = useLens<HTMLElement>()
  const { stars, total } = useGithubStars(GITHUB_USER)

  useEffect(() => {
    document.title = 'JacobOS · Jacob Mish'
    const mq = window.matchMedia(MOBILE_QUERY)
    const onChange = () => setMobile(mq.matches)
    mq.addEventListener('change', onChange)
    const onResize = () =>
      setWins((ws) => {
        const next: Wins = {}
        ;(Object.keys(ws) as AppId[]).forEach((id) => {
          next[id] = { ...ws[id]!, ...fit(ws[id]!) }
        })
        return next
      })
    window.addEventListener('resize', onResize)
    return () => {
      mq.removeEventListener('change', onChange)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const focus = useCallback((id: AppId) => {
    zTop.current += 1
    const z = zTop.current
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id]!, z } } : w))
    setFocused(id)
  }, [])

  const open = useCallback((id: AppId, payload?: string) => {
    zTop.current += 1
    const z = zTop.current
    setWins((w) => {
      const existing = w[id]
      if (existing) {
        return {
          ...w,
          [id]: {
            ...existing,
            z,
            minimized: false,
            payload: payload ?? existing.payload,
            nonce: payload ? Date.now() : existing.nonce,
          },
        }
      }
      const [dw, dh] = APPS[id].size
      const vw = window.innerWidth
      const vh = window.innerHeight
      const n = opened.current++ % 6
      const width = Math.min(dw, vw - 160)
      const height = Math.min(dh, vh - MENU_H - DOCK_SPACE - 16)
      return {
        ...w,
        [id]: {
          ...fit({
            x: (vw - width) / 2 - 120 + n * 34,
            y: MENU_H + 24 + n * 28,
            w: width,
            h: height,
            z,
            minimized: false,
            maximized: false,
          }),
          payload,
          nonce: Date.now(),
        },
      }
    })
    setFocused(id)
    setMenuOpen(false)
  }, [])

  const close = useCallback((id: AppId) => {
    setWins((w) => {
      const next = { ...w }
      delete next[id]
      return next
    })
    setFocused((f) => (f === id ? null : f))
  }, [])

  const patch = (id: AppId, p: Partial<WinState>) =>
    setWins((w) => (w[id] ? { ...w, [id]: { ...w[id]!, ...p } } : w))

  const chooseWallpaper = useCallback((name: string) => {
    const i = WALLPAPERS.findIndex(
      (w) => w.name === name || w.name.startsWith(name.toLowerCase())
    )
    if (i < 0) return false
    setWallpaper(i)
    return true
  }, [])

  const api: OsApi = useMemo(
    () => ({
      open,
      close,
      stars,
      total,
      wallpapers: WALLPAPERS.map((w) => w.name),
      wallpaper: WALLPAPERS[wallpaper].name,
      setWallpaper: chooseWallpaper,
    }),
    [open, close, stars, total, wallpaper, chooseWallpaper]
  )

  useEffect(() => {
    if (window.matchMedia(MOBILE_QUERY).matches) return
    open('about')
    open('terminal')
    const vw = window.innerWidth
    const vh = window.innerHeight
    setWins((w) =>
      w.terminal && w.about
        ? {
            ...w,
            about: fit({ ...w.about, x: Math.max(24, vw * 0.05), y: 52 }),
            terminal: fit({
              ...w.terminal,
              x: vw - w.terminal.w - 150,
              y: Math.min(vh - w.terminal.h - DOCK_SPACE, 300),
            }),
          }
        : w
    )
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (menuOpen) setMenuOpen(false)
      else if (focused && focused !== 'terminal') close(focused)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focused, close, menuOpen])

  const dockClick = (id: AppId) => {
    const w = wins[id]
    if (!w || w.minimized) open(id)
    else if (focused === id) {
      patch(id, { minimized: true })
      setFocused(null)
    } else focus(id)
  }

  const clock = now.toLocaleString('en', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  const shortClock = now.toLocaleTimeString('en', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const openIds = APP_ORDER.filter((id) => wins[id])
  const paper = WALLPAPERS[wallpaper]
  const tileSize = mobile ? 60 : 54

  return (
    <main className={`os on-${paper.kind} ${mobile ? 'is-mobile' : ''}`}>
      {paper.kind === 'bends' && (
        <ColorBends
          className="os-wallpaper"
          colors={paper.colors ?? []}
          rotation={-17}
          speed={0.06}
          scale={1.1}
          mouseInfluence={0.075}
          parallax={0.1}
          noise={0.04}
        />
      )}
      {paper.kind === 'seismic' && (
        <Seismic className="os-wallpaper" onQuake={setQuake} />
      )}
      {paper.kind === 'spectrum' && <Spectrum className="os-wallpaper" />}
      {paper.kind === 'frequency' && (
        <FrequencyDomain className="os-wallpaper" />
      )}
      {!mobile && (paper.kind === 'seismic' || paper.kind === 'spectrum') && (
        <p className="os-caption" aria-hidden="true">
          {paper.kind === 'spectrum' ? (
            <>Live spectrogram · 2048-point FFT · click to send a chirp</>
          ) : quake ? (
            <>
              M{quake.magnitude.toFixed(1)} at {quake.depthKm} km depth ·{' '}
              <span className="cap-p">P waves</span> arrive first, then{' '}
              <span className="cap-s">S waves</span>, then{' '}
              <span className="cap-r">surface waves</span>
            </>
          ) : (
            <>
              Synthetic seismic section with a fault, a salt dome and folded
              beds · click anywhere to trigger an earthquake
            </>
          )}
        </p>
      )}
      <div className="os-vignette" aria-hidden="true" />

      <header className="os-menubar glass" data-lens ref={menubarRef}>
        <div className="os-menubar-left">
          <button
            type="button"
            className="os-brand"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="os-dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            JacobOS
          </button>
          {!mobile && focused && (
            <span className="os-app-name">{APPS[focused].title}</span>
          )}
          {menuOpen && (
            <div className="os-menu glass" role="menu">
              {APP_ORDER.map((id) => (
                <button
                  key={id}
                  type="button"
                  role="menuitem"
                  onClick={() => open(id)}
                >
                  <AppTile id={id} size={20} /> {APPS[id].title}
                </button>
              ))}
              <hr />
              <p className="os-menu-label">Wallpaper</p>
              <div className="os-papers" role="group" aria-label="Wallpaper">
                {WALLPAPERS.map((w, i) => (
                  <button
                    key={w.name}
                    type="button"
                    className={`os-paper paper-${w.kind}`}
                    aria-pressed={wallpaper === i}
                    onClick={() => setWallpaper(i)}
                  >
                    <span className="os-paper-swatch" aria-hidden="true" />
                    <span>{w.name}</span>
                  </button>
                ))}
              </div>
              <hr />
              <a role="menuitem" href="/">
                <ArrowLeft aria-hidden="true" /> Back to jacobmish.com
              </a>
            </div>
          )}
        </div>
        <div className="os-menubar-right">
          {total !== undefined && (
            <a
              className="os-stars"
              href={`https://github.com/${GITHUB_USER}`}
              target="_blank"
              rel="noopener"
              aria-label={`${total} GitHub stars`}
            >
              <Star aria-hidden="true" /> {total}
            </a>
          )}
          <time>{mobile ? shortClock : clock}</time>
          <a className="os-exit" href="/">
            {mobile ? 'Exit' : 'Exit to site'}
          </a>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          className="os-scrim"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <nav className="os-icons" aria-label="Desktop">
        {APP_ORDER.map((id) => (
          <button
            key={id}
            type="button"
            className="os-icon"
            onClick={() => open(id)}
          >
            <AppTile id={id} size={tileSize} />
            <span>{APPS[id].title}</span>
          </button>
        ))}
        <a
          className="os-icon"
          href="https://map.ventra.dev"
          target="_blank"
          rel="noopener"
        >
          <span
            className="app-tile is-image"
            style={{ '--s': `${tileSize}px` } as React.CSSProperties}
          >
            <img src={ventraMinecraftShot} alt="" />
          </span>
          <span>
            Minecraft map <External aria-hidden="true" />
          </span>
        </a>
        <a className="os-icon" href={ventra.url} target="_blank" rel="noopener">
          <span
            className="app-tile is-image is-mark"
            style={{ '--s': `${tileSize}px` } as React.CSSProperties}
          >
            <img src={ventra.mark} alt="" />
          </span>
          <span>
            ventra.dev <External aria-hidden="true" />
          </span>
        </a>
      </nav>

      {openIds.map((id) => {
        const w = wins[id]!
        return (
          <Window
            key={id}
            title={APPS[id].title}
            state={w}
            focused={focused === id}
            sheet={mobile}
            minSize={APPS[id].minSize}
            onFocus={() => focused !== id && focus(id)}
            onClose={() => close(id)}
            onMinimize={() => {
              patch(id, { minimized: true })
              setFocused(null)
            }}
            onToggleMax={() => patch(id, { maximized: !w.maximized })}
            onChange={(p) => patch(id, p)}
          >
            <AppContent
              id={id}
              payload={w.payload}
              nonce={w.nonce}
              api={api}
              focused={focused === id}
            />
          </Window>
        )
      })}

      {!mobile && (
        <nav
          className="os-dock glass"
          data-lens
          ref={dockRef}
          aria-label="Dock"
        >
          {APP_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              className={`os-dock-item ${wins[id] ? 'is-running' : ''}`}
              onClick={() => dockClick(id)}
              aria-label={APPS[id].title}
            >
              <span className="os-dock-label" aria-hidden="true">
                {APPS[id].title}
              </span>
              <AppTile id={id} size={48} />
            </button>
          ))}
        </nav>
      )}
    </main>
  )
}
