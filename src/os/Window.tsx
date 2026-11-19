import type React from 'react'
import { useRef, useState } from 'react'

export interface WinState {
  x: number
  y: number
  w: number
  h: number
  z: number
  minimized: boolean
  maximized: boolean
}

type WindowProps = {
  title: string
  state: WinState
  focused: boolean
  sheet: boolean
  minSize: [number, number]
  onFocus: () => void
  onClose: () => void
  onMinimize: () => void
  onToggleMax: () => void
  onChange: (patch: Partial<WinState>) => void
  children: React.ReactNode
}

type Edge = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'

const EDGES: Edge[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']
const MENU_H = 32
const MARGIN = 6

const clamp = (v: number, min: number, max: number) =>
  Math.min(Math.max(v, min), Math.max(min, max))

export function Window({
  title,
  state,
  focused,
  sheet,
  minSize,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  onChange,
  children,
}: WindowProps) {
  const [busy, setBusy] = useState<'drag' | 'resize' | null>(null)
  const rootRef = useRef<HTMLElement>(null)

  const rect = () => {
    const r = rootRef.current?.getBoundingClientRect()
    return r
      ? { x: r.left, y: r.top, w: r.width, h: r.height }
      : { x: state.x, y: state.y, w: state.w, h: state.h }
  }
  const drag = useRef<{ dx: number; dy: number; w: number } | null>(null)
  const resize = useRef<{
    edge: Edge
    px: number
    py: number
    x: number
    y: number
    w: number
    h: number
  } | null>(null)

  const startDrag = (e: React.PointerEvent) => {
    if (
      sheet ||
      state.maximized ||
      e.button !== 0 ||
      (e.target as HTMLElement).closest('button')
    )
      return
    const r = rect()
    drag.current = { dx: e.clientX - r.x, dy: e.clientY - r.y, w: r.w }
    e.currentTarget.setPointerCapture(e.pointerId)
    setBusy('drag')
  }

  const moveDrag = (e: React.PointerEvent) => {
    if (!drag.current) return
    onChange({
      x: clamp(
        e.clientX - drag.current.dx,
        80 - drag.current.w,
        window.innerWidth - 80
      ),
      y: clamp(
        e.clientY - drag.current.dy,
        MENU_H + 4,
        window.innerHeight - 44
      ),
    })
  }

  const startResize = (edge: Edge) => (e: React.PointerEvent) => {
    if (e.button !== 0) return
    e.stopPropagation()
    resize.current = { edge, px: e.clientX, py: e.clientY, ...rect() }
    e.currentTarget.setPointerCapture(e.pointerId)
    setBusy('resize')
  }

  const moveResize = (e: React.PointerEvent) => {
    const r = resize.current
    if (!r) return
    const [minW, minH] = minSize
    const vw = window.innerWidth
    const vh = window.innerHeight
    const dx = e.clientX - r.px
    const dy = e.clientY - r.py
    const next: Partial<WinState> = {}

    if (r.edge.includes('e')) {
      next.w = clamp(r.w + dx, minW, vw - MARGIN - r.x)
    }
    if (r.edge.includes('w')) {
      const x = clamp(r.x + dx, MARGIN, r.x + r.w - minW)
      next.x = x
      next.w = r.w + (r.x - x)
    }
    if (r.edge.includes('s')) {
      next.h = clamp(r.h + dy, minH, vh - MARGIN - r.y)
    }
    if (r.edge.startsWith('n')) {
      const y = clamp(r.y + dy, MENU_H + MARGIN, r.y + r.h - minH)
      next.y = y
      next.h = r.h + (r.y - y)
    }
    onChange(next)
  }

  const stop = () => {
    drag.current = null
    resize.current = null
    setBusy(null)
  }

  const floating = !sheet && !state.maximized
  const style: React.CSSProperties = floating
    ? {
        zIndex: state.z,
        transform: `translate(${state.x}px, ${state.y}px)`,
        width: state.w,
        height: state.h,
      }
    : { zIndex: state.z }

  return (
    <section
      ref={rootRef}
      className={[
        'os-window',
        focused && 'is-focused',
        state.minimized && 'is-minimized',
        state.maximized && 'is-maximized',
        sheet && 'is-sheet',
        busy && `is-${busy}`,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      role="dialog"
      aria-label={title}
      aria-hidden={state.minimized || undefined}
      onPointerDownCapture={onFocus}
    >
      <header
        className="os-titlebar"
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={stop}
        onPointerCancel={stop}
        onDoubleClick={(e) => {
          if (!sheet && !(e.target as HTMLElement).closest('button'))
            onToggleMax()
        }}
      >
        {!sheet && (
          <div className="os-lights">
            <button
              type="button"
              className="light light-close"
              aria-label={`Close ${title}`}
              onClick={onClose}
            />
            <button
              type="button"
              className="light light-min"
              aria-label={`Minimize ${title}`}
              onClick={onMinimize}
            />
            <button
              type="button"
              className="light light-max"
              aria-label={
                state.maximized ? `Restore ${title}` : `Maximize ${title}`
              }
              onClick={onToggleMax}
            />
          </div>
        )}
        <h2 className="os-title">{title}</h2>
        {sheet && (
          <button type="button" className="os-done" onClick={onClose}>
            Done
          </button>
        )}
      </header>
      <div className="os-content">{children}</div>
      {floating &&
        EDGES.map((edge) => (
          <span
            key={edge}
            className={`os-edge os-edge-${edge}`}
            aria-hidden="true"
            onPointerDown={startResize(edge)}
            onPointerMove={moveResize}
            onPointerUp={stop}
            onPointerCancel={stop}
          />
        ))}
    </section>
  )
}
