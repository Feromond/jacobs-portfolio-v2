import { useEffect, useRef } from 'react'

import { ricker as rickerSpace } from '../library/signal'

export interface QuakeInfo {
  magnitude: number
  depthKm: number
}

const STOPS = [
  [129, 155, 247],
  [77, 255, 213],
  [195, 177, 255],
  [255, 181, 154],
]

const PHASE_COLORS = {
  p: '121, 251, 206',
  s: '255, 181, 154',
  r: '195, 177, 255',
}

const SECTION_KM = 12
const VP0 = 4.2
const GRADIENT = 0.32
const VS_RATIO = 1.73
const RAYLEIGH = 0.92
const TIME_SCALE = 1.5
const SPACING = 11
const STEP = 2
const PAN_SPEED = 7
const COARSE = 6

const colorAt = (t: number) => {
  const p = Math.min(0.9999, Math.max(0, t)) * (STOPS.length - 1)
  const i = Math.floor(p)
  const f = p - i
  const [a, b] = [STOPS[i], STOPS[i + 1]]
  return a.map((v, k) => Math.round(v + (b[k] - v) * f)).join(', ')
}

const rickerTime = (tau: number, f: number) => {
  const u = (Math.PI * f * tau) ** 2
  return (1 - 2 * u) * Math.exp(-u)
}

const travelTime = (
  dxKm: number,
  z0Km: number,
  zKm: number,
  v0: number,
  k: number
) => {
  const va = v0 + k * z0Km
  const vb = v0 + k * zKm
  const arg = 1 + (k * k * (dxKm * dxKm + (zKm - z0Km) ** 2)) / (2 * va * vb)
  return Math.acosh(arg) / k
}

type Quake = { x: number; zKm: number; t0: number; amp: number }

export function Seismic({
  className = '',
  onQuake,
}: {
  className?: string
  onQuake?: (q: QuakeInfo) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onQuakeRef = useRef(onQuake)
  onQuakeRef.current = onQuake

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const quakes: Quake[] = []
    const start = performance.now()
    let w = 0
    let h = 0
    let sectionW = 0
    let kmPerPx = 0
    let raf = 0
    let last = 0
    let nextAmbient = 2.5
    let frozenT: number | null = null

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sectionW = Math.max(w * 2.4, 2400)
      kmPerPx = SECTION_KM / h
    }

    const panAt = (t: number) => {
      const range = Math.max(1, sectionW - w)
      const d = (t * PAN_SPEED) % (range * 2)
      return d < range ? d : range * 2 - d
    }

    const reflectors = (X: number) => {
      const out: [depthPx: number, reflectionStrength: number][] = []
      const unconformity = h * (0.27 + 0.03 * Math.sin(X * 0.0021))

      for (let i = 0; i < 3; i++) {
        const z = h * (0.085 + 0.055 * i) + 6 * Math.sin(X * 0.004 + i)
        if (z < unconformity - 6) out.push([z, i % 2 ? -0.55 : 0.6])
      }

      const channelX = sectionW * 0.16
      const channel = Math.abs(X - channelX) < 170
      if (channel) {
        const z =
          h * 0.115 + 38 * Math.cos(((X - channelX) / 170) * (Math.PI / 2))
        out.push([z, 0.85])
      }

      out.push([unconformity, 1])

      const anticlineX = sectionW * 0.38
      const faultX = sectionW * 0.6
      const saltX = sectionW * 0.82
      const saltTop = h * 0.4
      const saltHalf = sectionW * 0.035

      for (let j = 0; j < 6; j++) {
        let z =
          h * (0.31 + 0.085 * j) +
          h * 0.045 * Math.sin(X * 0.0017 + 0.6) -
          h * 0.11 * Math.exp(-(((X - anticlineX) / (sectionW * 0.08)) ** 2)) +
          (X - sectionW / 2) * 0.05
        const faultAt = faultX + (z - unconformity) * 0.45
        if (X > faultAt) z += 22 + 9 * j
        z -=
          80 *
          Math.exp(-(((X - saltX) / (saltHalf * 2.6)) ** 2)) *
          ((j + 1) / 6)
        const inSalt =
          z > saltTop && Math.abs(X - saltX) < saltHalf + (z - saltTop) * 0.22
        if (z > unconformity + 5 && !inSalt) out.push([z, j % 2 ? 0.7 : -0.6])
      }

      if (Math.abs(X - saltX) < saltHalf * 1.25) {
        const top = saltTop + ((X - saltX) / saltHalf) ** 2 * 34
        out.push([top, 1.25])
      }

      out.push([
        h * 0.9 + 10 * Math.sin(X * 0.009) + 5 * Math.sin(X * 0.031),
        0.9,
      ])
      return out
    }

    const draw = (now: number) => {
      const t = frozenT ?? (now - start) / 1000
      const pan = panAt(t)
      const samples = Math.ceil(h / STEP) + 1
      const geo = new Float32Array(samples)
      const phases = {
        p: new Float32Array(samples),
        s: new Float32Array(samples),
        r: new Float32Array(samples),
      }
      const gain = SPACING * 1.1

      ctx.clearRect(0, 0, w, h)

      for (let x = SPACING / 2; x < w; x += SPACING) {
        const X = x + pan
        geo.fill(0)
        phases.p.fill(0)
        phases.s.fill(0)
        phases.r.fill(0)

        for (const [d, r] of reflectors(X)) {
          const lo = Math.max(0, Math.floor((d - 16) / STEP))
          const hi = Math.min(samples - 1, Math.ceil((d + 16) / STEP))
          for (let s = lo; s <= hi; s++)
            geo[s] += r * rickerSpace(s * STEP - d, 5)
        }

        let waveMax = 0
        for (const q of quakes) {
          const elapsed = (t - q.t0) * TIME_SCALE
          if (elapsed < 0) continue
          const dxKm = (X - q.x) * kmPerPx
          const vs0 = VP0 / VS_RATIO
          const ks = GRADIENT / VS_RATIO
          for (let a = 0; a < samples - 1; a += COARSE) {
            const b = Math.min(samples - 1, a + COARSE)
            const za = a * STEP * kmPerPx
            const zb = b * STEP * kmPerPx
            const tpa = travelTime(dxKm, q.zKm, za, VP0, GRADIENT)
            const tpb = travelTime(dxKm, q.zKm, zb, VP0, GRADIENT)
            const tsa = travelTime(dxKm, q.zKm, za, vs0, ks)
            const tsb = travelTime(dxKm, q.zKm, zb, vs0, ks)
            const hitP =
              elapsed > Math.min(tpa, tpb) - 0.55 &&
              elapsed < Math.max(tpa, tpb) + 0.55
            const hitS =
              elapsed > Math.min(tsa, tsb) - 0.65 &&
              elapsed < Math.max(tsa, tsb) + 0.65
            if (!hitP && !hitS) continue
            for (let s = a; s < b; s++) {
              const f = (s - a) / (b - a)
              const zKm = s * STEP * kmPerPx
              const spread =
                q.amp / Math.sqrt(1 + Math.hypot(dxKm, zKm - q.zKm))
              if (hitP) {
                const tp = tpa + (tpb - tpa) * f
                const tau = elapsed - tp
                if (Math.abs(tau) < 0.5)
                  phases.p[s] +=
                    0.55 * spread * Math.exp(-tp / 40) * rickerTime(tau, 3.2)
              }
              if (hitS) {
                const ts = tsa + (tsb - tsa) * f
                const tau = elapsed - ts
                if (Math.abs(tau) < 0.6)
                  phases.s[s] +=
                    1.25 * spread * Math.exp(-ts / 30) * rickerTime(tau, 2.4)
              }
            }
          }

          const vr = (VP0 / VS_RATIO) * RAYLEIGH
          const tr =
            travelTime(0, q.zKm, 0, VP0 / VS_RATIO, GRADIENT / VS_RATIO) +
            Math.abs(dxKm) / vr
          const tauR = elapsed - tr
          if (Math.abs(tauR) < 1.6) {
            const env = Math.exp(-((tauR / 0.75) ** 2))
            const carrier = Math.cos(2 * Math.PI * 1.3 * tauR)
            const surface =
              (1.9 * q.amp * env * carrier) /
              Math.sqrt(1 + Math.abs(dxKm) * 0.5)
            for (let s = 0; s < samples; s++) {
              const zKm = s * STEP * kmPerPx
              const decay = Math.exp(-zKm / 1.4)
              if (decay < 0.02) break
              phases.r[s] += surface * decay
            }
          }
        }

        for (let s = 0; s < samples; s++) {
          waveMax = Math.max(
            waveMax,
            Math.abs(phases.p[s]) +
              Math.abs(phases.s[s]) +
              Math.abs(phases.r[s])
          )
        }

        const color = colorAt(x / w)
        const value = (s: number) =>
          geo[s] + phases.p[s] + phases.s[s] + phases.r[s]

        ctx.beginPath()
        ctx.moveTo(x, 0)
        for (let s = 0; s < samples; s++) {
          ctx.lineTo(x + Math.max(0, value(s)) * gain, s * STEP)
        }
        ctx.lineTo(x, h)
        ctx.closePath()
        ctx.fillStyle = `rgba(${color}, 0.3)`
        ctx.fill()

        if (waveMax > 0.03) {
          for (const key of ['p', 's', 'r'] as const) {
            const arr = phases[key]
            let peak = 0
            for (let s = 0; s < samples; s++)
              peak = Math.max(peak, Math.abs(arr[s]))
            if (peak < 0.03) continue
            ctx.beginPath()
            ctx.moveTo(x, 0)
            for (let s = 0; s < samples; s++) {
              ctx.lineTo(
                x +
                  Math.max(0, value(s)) *
                    gain *
                    (Math.abs(arr[s]) > 0.02 ? 1 : 0),
                s * STEP
              )
            }
            ctx.lineTo(x, h)
            ctx.closePath()
            ctx.fillStyle = `rgba(${PHASE_COLORS[key]}, ${Math.min(
              0.75,
              0.25 + peak
            )})`
            ctx.fill()
          }
        }

        ctx.beginPath()
        for (let s = 0; s < samples; s++) {
          const px = x + value(s) * gain
          if (s === 0) ctx.moveTo(px, 0)
          else ctx.lineTo(px, s * STEP)
        }
        ctx.strokeStyle = `rgba(${color}, ${waveMax > 0.05 ? 0.7 : 0.4})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (let i = quakes.length - 1; i >= 0; i--) {
        if ((t - quakes[i].t0) * TIME_SCALE > 40) quakes.splice(i, 1)
      }

      if (frozenT === null && t > nextAmbient) {
        trigger(
          Math.random() * w,
          h * (0.45 + Math.random() * 0.45),
          2 + Math.random() * 0.8,
          t
        )
        nextAmbient = t + 9 + Math.random() * 8
      }
    }

    const trigger = (x: number, y: number, magnitude: number, t: number) => {
      const zKm = Math.max(0.6, y * kmPerPx)
      quakes.push({
        x: x + panAt(t),
        zKm,
        t0: t,
        amp: 0.5 * 10 ** (0.35 * (magnitude - 2.5)),
      })
      onQuakeRef.current?.({
        magnitude: Math.round(magnitude * 10) / 10,
        depthKm: Math.round(zKm * 10) / 10,
      })
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 40) return
      last = now
      draw(now)
    }

    const run = () => {
      cancelAnimationFrame(raf)
      if (reduce.matches || document.hidden) {
        draw(performance.now())
        return
      }
      frozenT = null
      raf = requestAnimationFrame(frame)
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const t = (performance.now() - start) / 1000
      const depthShare = (e.clientY - r.top) / h
      trigger(e.clientX - r.left, e.clientY - r.top, 2.8 + depthShare * 1.6, t)
      if (reduce.matches) {
        frozenT = t + 3.2 / TIME_SCALE
        draw(performance.now())
      }
    }

    const ro = new ResizeObserver(() => {
      build()
      draw(performance.now())
    })
    ro.observe(canvas)

    build()
    run()
    canvas.addEventListener('pointerdown', onPointer)
    document.addEventListener('visibilitychange', run)
    reduce.addEventListener('change', run)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('visibilitychange', run)
      reduce.removeEventListener('change', run)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`seismic ${className}`}
      role="img"
      aria-label="Synthetic seismic section with a fault, a salt dome and folded layers. Click to trigger an earthquake."
    />
  )
}
