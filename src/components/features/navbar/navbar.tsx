import type React from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { navItems } from '../../../library'
import * as Icons from '../../../library/icons'
import { useLens } from '../../../liquidGlass'
import './style.css'

const LIFT = 1.18
const HOVER_LIFT = 1.07
const HOVER_PULL = 0.35
const DRAG_START = 6

type Spring = { pos: number; vel: number; target: number }

const step = (s: Spring, k: number, c: number, dt: number) => {
  const accel = k * (s.target - s.pos) - c * s.vel
  s.vel += accel * dt
  s.pos += s.vel * dt
}

const settled = (s: Spring, eps: number) =>
  Math.abs(s.target - s.pos) < eps && Math.abs(s.vel) < eps * 10

export function Navbar() {
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)
  activeRef.current = active
  const [scrolled, setScrolled] = useState(false)
  const [underLens, setUnderLens] = useState<number | null>(null)
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([])
  const listRef = useRef<HTMLUListElement>(null)
  const barRef = useLens<HTMLLIElement>()
  const pillRef = useLens<HTMLLIElement>({ magnify: 1.24, band: 12, pull: 7 })

  const x = useRef<Spring>({ pos: 0, vel: 0, target: 0 })
  const w = useRef<Spring>({ pos: 0, vel: 0, target: 0 })
  const lift = useRef<Spring>({ pos: 1, vel: 0, target: 1 })
  const raf = useRef(0)
  const last = useRef(0)
  const placed = useRef(false)
  const drag = useRef<{ id: number; startX: number; moved: boolean } | null>(
    null
  )
  const lockUntil = useRef(0)
  const suppressClick = useRef(false)
  const still = useRef(false)
  const settleTimer = useRef(0)
  const hover = useRef<number | null>(null)

  const render = useCallback(() => {
    const pill = pillRef.current
    if (!pill) return
    const speed = Math.abs(x.current.vel)
    const s = lift.current.pos
    const sx = s * (1 + Math.min(0.12, speed / 3200))
    const sy = s * (1 - Math.min(0.07, speed / 5600))
    pill.style.width = `${w.current.pos}px`
    pill.style.transform = `translate3d(${x.current.pos}px, 0, 0) scale(${sx}, ${sy})`
    pill.classList.toggle('is-lifted', lift.current.target > 1 || s > 1.025)
    pill.classList.toggle('is-pressed', lift.current.target >= LIFT)
  }, [pillRef])

  const frame = useCallback(
    (now: number) => {
      const dt = Math.min(1 / 30, (now - last.current) / 1000 || 1 / 60)
      last.current = now
      const dragging = !!drag.current?.moved
      const k = dragging ? 900 : 380
      const c = dragging ? 46 : 30
      step(x.current, k, c, dt)
      step(w.current, k, c, dt)
      step(lift.current, 520, 19, dt)
      render()
      const done =
        !drag.current &&
        settled(x.current, 0.2) &&
        settled(w.current, 0.2) &&
        settled(lift.current, 0.002)
      if (done) {
        raf.current = 0
        return
      }
      raf.current = requestAnimationFrame(frame)
    },
    [render]
  )

  const kick = useCallback(() => {
    if (still.current) {
      x.current.pos = x.current.target
      w.current.pos = w.current.target
      lift.current.pos = 1
      lift.current.target = 1
      render()
      return
    }
    if (raf.current) return
    last.current = performance.now()
    raf.current = requestAnimationFrame(frame)
  }, [frame, render])

  const aimAt = useCallback(
    (index: number) => {
      const el = itemRefs.current[index]
      if (!el) return
      x.current.target = el.offsetLeft
      w.current.target = el.offsetWidth
      if (!placed.current) {
        x.current.pos = x.current.target
        w.current.pos = w.current.target
        placed.current = true
        render()
        pillRef.current?.style.setProperty('opacity', '1')
        return
      }
      kick()
    },
    [kick, render, pillRef]
  )

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    still.current = mq.matches
    const onChange = () => (still.current = mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    let pending = 0
    const update = () => {
      pending = 0
      setScrolled(window.scrollY > 24)
      if (performance.now() < lockUntil.current || drag.current) return
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4
      if (atBottom) {
        setActive(navItems.length - 1)
        return
      }
      const line = window.innerHeight * 0.4
      let current = 0
      navItems.forEach((item, i) => {
        const el = document.getElementById(item.id)
        if (el && el.getBoundingClientRect().top <= line) current = i
      })
      setActive(current)
    }
    const onScroll = () => {
      if (!pending) pending = requestAnimationFrame(update)
    }
    const onScrollEnd = () => {
      lockUntil.current = 0
      onScroll()
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', onScrollEnd)
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(pending)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', onScrollEnd)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useLayoutEffect(() => {
    if (!drag.current) aimAt(hover.current ?? active)
  }, [active, aimAt])

  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (!drag.current) aimAt(hover.current ?? active)
    })
    itemRefs.current.forEach((el) => el && ro.observe(el))
    return () => ro.disconnect()
  }, [active, aimAt])

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current)
      window.clearTimeout(settleTimer.current)
    },
    []
  )

  const nearest = (clientX: number) => {
    let best = 0
    let bestDist = Infinity
    itemRefs.current.forEach((el, i) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const d = Math.abs(clientX - (r.left + r.width / 2))
      if (d < bestDist) {
        bestDist = d
        best = i
      }
    })
    return best
  }

  const followPointer = (clientX: number) => {
    const list = listRef.current
    if (!list) return
    const r = list.getBoundingClientRect()
    const i = nearest(clientX)
    const width = itemRefs.current[i]?.offsetWidth ?? w.current.target
    w.current.target = width
    x.current.target = Math.min(
      Math.max(clientX - r.left - width / 2, 4),
      r.width - width - 4
    )
    setUnderLens(i)
    kick()
  }

  const go = (index: number) => {
    lockUntil.current = performance.now() + 1200
    window.clearTimeout(settleTimer.current)
    if (!still.current) {
      lift.current.target = LIFT
      settleTimer.current = window.setTimeout(() => {
        if (drag.current) return
        lift.current.target = hover.current !== null ? HOVER_LIFT : 1
        kick()
      }, 240)
    }
    if (hover.current !== null) hover.current = index
    activeRef.current = index
    setActive(index)
    aimAt(index)
  }

  const onPointerDown = (e: React.PointerEvent<HTMLUListElement>) => {
    if (e.button !== 0) return
    hover.current = null
    drag.current = { id: e.pointerId, startX: e.clientX, moved: false }
    lift.current.target = LIFT
    setUnderLens(nearest(e.clientX))
    kick()
  }

  const hoverAt = (clientX: number) => {
    const list = listRef.current
    const i = nearest(clientX)
    const el = itemRefs.current[i]
    if (!list || !el) return
    const left = list.getBoundingClientRect().left
    const centre = el.offsetLeft + el.offsetWidth / 2
    const pointer = clientX - left
    const pulled = centre + (pointer - centre) * HOVER_PULL
    w.current.target = el.offsetWidth
    x.current.target = pulled - el.offsetWidth / 2
    if (!still.current) lift.current.target = HOVER_LIFT
    if (i !== hover.current) {
      hover.current = i
      setUnderLens(i)
    }
    kick()
  }

  const onPointerMove = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d && e.pointerType === 'mouse') {
      hoverAt(e.clientX)
      return
    }
    if (!d || d.id !== e.pointerId) return
    if (!d.moved && Math.abs(e.clientX - d.startX) > DRAG_START) {
      d.moved = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    if (d.moved) followPointer(e.clientX)
  }

  const release = (e: React.PointerEvent<HTMLUListElement>) => {
    const d = drag.current
    if (!d || d.id !== e.pointerId) return
    drag.current = null
    const r = listRef.current?.getBoundingClientRect()
    const inside =
      !!r &&
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    const hovering = e.pointerType === 'mouse' && inside
    hover.current = hovering ? nearest(e.clientX) : null
    lift.current.target = hovering && !still.current ? HOVER_LIFT : 1
    setUnderLens(hovering ? hover.current : null)
    if (d.moved) {
      suppressClick.current = true
      const index = nearest(e.clientX)
      go(index)
      const target = document.getElementById(navItems[index].id)
      target?.scrollIntoView({
        behavior: still.current ? 'auto' : 'smooth',
      })
      history.replaceState(null, '', `#${navItems[index].id}`)
    } else {
      kick()
    }
  }

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <nav aria-label="Primary">
        <ul
          ref={listRef}
          className="nav-list"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={release}
          onPointerCancel={release}
          onPointerLeave={() => {
            if (drag.current) return
            hover.current = null
            lift.current.target = 1
            setUnderLens(null)
            aimAt(activeRef.current)
          }}
          onClickCapture={(e) => {
            if (suppressClick.current) {
              e.preventDefault()
              e.stopPropagation()
              suppressClick.current = false
            }
          }}
        >
          <li
            ref={barRef}
            className="nav-bg glass"
            data-lens
            aria-hidden="true"
          />
          <li ref={pillRef} className="nav-pill" data-lens aria-hidden="true" />
          {navItems.map((item, i) => {
            const Icon = Icons[item.icon]
            return (
              <li key={item.id}>
                <a
                  ref={(el) => (itemRefs.current[i] = el)}
                  href={`#${item.id}`}
                  className={[
                    'nav-link',
                    active === i && 'is-active',
                    underLens === i && 'is-under-lens',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-current={active === i ? 'location' : undefined}
                  draggable={false}
                  onClick={() => go(i)}
                >
                  <Icon className="nav-icon" aria-hidden="true" />
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            )
          })}
        </ul>
        <a className="nav-os" href="/os" aria-label="Open JacobOS">
          <Icons.Desktop aria-hidden="true" />
          <span>JacobOS</span>
        </a>
      </nav>
    </header>
  )
}
