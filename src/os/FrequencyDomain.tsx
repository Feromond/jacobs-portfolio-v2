import { useEffect, useRef } from 'react'

import { fft } from '../library/signal'

export interface FilterBand {
  f1: number
  f2: number
  f3: number
  f4: number
}

const N = 1024
const DT = 0.002
const NYQUIST = 1 / (2 * DT)
const F_SHOW = 125
const STEP = 6
const WAVELET_HZ = 30
const PAD = 28

const ormsby = (f: number, b: FilterBand) => {
  const a = Math.abs(f)
  if (a <= b.f1 || a >= b.f4) return 0
  if (a < b.f2) return (a - b.f1) / (b.f2 - b.f1)
  if (a <= b.f3) return 1
  return (b.f4 - a) / (b.f4 - b.f3)
}

const WAVELET = Array.from({ length: 61 }, (_, i) => {
  const t = (i - 30) * DT
  const u = (Math.PI * WAVELET_HZ * t) ** 2
  return (1 - 2 * u) * Math.exp(-u)
})

export function FrequencyDomain({
  className = '',
  onBand,
}: {
  className?: string
  onBand?: (b: FilterBand) => void
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const onBandRef = useRef(onBand)
  onBandRef.current = onBand

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const raw = new Float64Array(N)
    const spikes = new Float64Array(N + WAVELET.length)
    const re = new Float64Array(N)
    const im = new Float64Array(N)
    const taper = Float64Array.from({ length: N }, (_, i) => {
      const edge = 64
      if (i < edge) return 0.5 - 0.5 * Math.cos((Math.PI * i) / edge)
      if (i > N - edge) return 0.5 - 0.5 * Math.cos((Math.PI * (N - i)) / edge)
      return 1
    })
    const band: FilterBand = { f1: 6, f2: 10, f3: 40, f4: 55 }
    let sample = 0
    let w = 0
    let h = 0
    let raf = 0
    let last = 0
    let dragging: number | null = null
    let padR = PAD

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      padR = w > 720 ? 230 : 16
    }

    const nextSample = () => {
      const t = sample * DT
      if (Math.random() < 0.035) {
        spikes[spikes.length - 1] +=
          (Math.random() < 0.3 ? -1 : 1) * (0.4 + Math.random())
      }
      let reflect = 0
      for (let k = 0; k < WAVELET.length; k++) {
        reflect += spikes[spikes.length - 1 - k] * WAVELET[k]
      }
      spikes.copyWithin(0, 1)
      spikes[spikes.length - 1] = 0
      const roll =
        1.4 *
        Math.sin(2 * Math.PI * 5 * t) *
        Math.max(0, Math.sin(t * 0.6)) ** 3
      const hum = 0.35 * Math.sin(2 * Math.PI * 60 * t)
      const noise = (Math.random() - 0.5) * 0.5
      sample++
      return reflect + roll + hum + noise
    }

    const advance = (count: number) => {
      raw.copyWithin(0, count)
      for (let i = N - count; i < N; i++) raw[i] = nextSample()
    }

    const filtered = new Float64Array(N)
    const spectrumRaw = new Float64Array(N / 2)
    const spectrumOut = new Float64Array(N / 2)

    const analyse = () => {
      for (let i = 0; i < N; i++) {
        re[i] = raw[i] * taper[i]
        im[i] = 0
      }
      fft(re, im)
      for (let k = 0; k < N; k++) {
        const f = (k <= N / 2 ? k : k - N) / (N * DT)
        if (k < N / 2) spectrumRaw[k] = Math.hypot(re[k], im[k])
        const g = ormsby(f, band)
        re[k] *= g
        im[k] *= g
        if (k < N / 2) spectrumOut[k] = Math.hypot(re[k], im[k])
      }
      fft(re, im, true)
      for (let i = 0; i < N; i++) filtered[i] = re[i]
    }

    const panel = (
      top: number,
      height: number,
      label: string,
      note: string
    ) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.025)'
      ctx.fillRect(PAD, top, w - PAD - padR, height)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
      ctx.strokeRect(PAD + 0.5, top + 0.5, w - PAD - padR - 1, height - 1)
      ctx.font = '600 12px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = 'rgba(238, 240, 244, 0.85)'
      ctx.fillText(label, PAD + 14, top + 22)
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = 'rgba(154, 162, 174, 0.75)'
      ctx.fillText(note, PAD + 14, top + 38)
    }

    const trace = (
      data: Float64Array,
      top: number,
      height: number,
      color: string,
      scale: number
    ) => {
      const mid = top + height / 2
      ctx.beginPath()
      for (let i = 0; i < N; i++) {
        const x = PAD + ((w - PAD - padR) * i) / (N - 1)
        const y =
          mid - Math.max(-1, Math.min(1, data[i] * scale)) * (height * 0.42)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = 1.25
      ctx.stroke()
    }

    const freqX = (f: number) => PAD + 14 + ((w - PAD - padR - 28) * f) / F_SHOW

    const spectrum = (top: number, height: number) => {
      const base = top + height - 26
      const span = height - 64
      const kMax = Math.floor((F_SHOW / NYQUIST) * (N / 2))
      let peak = 1e-6
      for (let k = 1; k < kMax; k++) peak = Math.max(peak, spectrumRaw[k])
      const yOf = (v: number) => {
        const db = 20 * Math.log10(v / peak + 1e-6)
        return base - Math.max(0, (db + 60) / 60) * span
      }

      ctx.beginPath()
      ctx.moveTo(freqX(band.f1), base)
      ctx.lineTo(freqX(band.f2), base - span)
      ctx.lineTo(freqX(band.f3), base - span)
      ctx.lineTo(freqX(band.f4), base)
      ctx.closePath()
      ctx.fillStyle = 'rgba(121, 251, 206, 0.1)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(121, 251, 206, 0.55)'
      ctx.setLineDash([4, 4])
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.setLineDash([])

      const curve = (
        data: Float64Array,
        stroke: string,
        fill: string | null
      ) => {
        ctx.beginPath()
        ctx.moveTo(freqX(0), base)
        for (let k = 0; k <= kMax; k++) {
          ctx.lineTo(freqX((k / (N / 2)) * NYQUIST), yOf(data[k]))
        }
        if (fill) {
          ctx.lineTo(freqX(F_SHOW), base)
          ctx.closePath()
          ctx.fillStyle = fill
          ctx.fill()
        }
        ctx.strokeStyle = stroke
        ctx.lineWidth = 1.25
        ctx.stroke()
      }
      curve(
        spectrumRaw,
        'rgba(195, 177, 255, 0.55)',
        'rgba(195, 177, 255, 0.08)'
      )
      curve(spectrumOut, 'rgba(255, 181, 154, 0.95)', null)

      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = 'rgba(154, 162, 174, 0.75)'
      for (let f = 0; f <= F_SHOW; f += 25) {
        const x = freqX(f)
        ctx.fillRect(x, base, 1, 4)
        ctx.fillText(`${f} Hz`, x - 12, base + 17)
      }
      ctx.fillStyle = 'rgba(255, 181, 154, 0.8)'
      ctx.fillText(
        '60 Hz hum',
        freqX(60) + 6,
        yOf(spectrumRaw[Math.round((60 / NYQUIST) * (N / 2))]) - 6
      )
    }

    const layout = () => {
      const top = 52
      const bottom = 96
      const gap = 14
      const avail = h - top - bottom - gap * 2
      const traceH = Math.max(90, avail * 0.27)
      const specH = avail - traceH * 2
      return {
        raw: [top, traceH],
        spec: [top + traceH + gap, specH],
        out: [top + traceH + gap + specH + gap, traceH],
      } as const
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      const L = layout()
      panel(
        L.raw[0],
        L.raw[1],
        'Raw trace',
        'reflections · ground roll · 60 Hz hum · noise'
      )
      trace(raw, L.raw[0], L.raw[1], 'rgba(195, 177, 255, 0.85)', 0.45)
      panel(
        L.spec[0],
        L.spec[1],
        'Amplitude spectrum (FFT)',
        `Ormsby bandpass ${band.f1}–${band.f2}–${band.f3}–${band.f4} Hz · drag to move it`
      )
      spectrum(L.spec[0], L.spec[1])
      panel(L.out[0], L.out[1], 'Filtered trace', 'inverse FFT of the passband')
      trace(filtered, L.out[0], L.out[1], 'rgba(121, 251, 206, 0.95)', 0.6)
    }

    const tick = () => {
      advance(STEP)
      analyse()
      draw()
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 33) return
      last = now
      tick()
    }

    const run = () => {
      cancelAnimationFrame(raf)
      if (reduce.matches || document.hidden) {
        analyse()
        draw()
        return
      }
      raf = requestAnimationFrame(frame)
    }

    const bandFromX = (x: number) => {
      const f = ((x - PAD - 14) / (w - PAD - padR - 28)) * F_SHOW
      return Math.round(f)
    }

    const setCentre = (centre: number) => {
      const width = band.f4 - band.f1
      const f1 = Math.max(
        1,
        Math.min(F_SHOW - width - 1, Math.round(centre - width / 2))
      )
      const shift = f1 - band.f1
      band.f1 += shift
      band.f2 += shift
      band.f3 += shift
      band.f4 += shift
      onBandRef.current?.({ ...band })
      if (reduce.matches) {
        analyse()
        draw()
      }
    }

    const onDown = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const L = layout()
      const y = e.clientY - r.top
      if (y < L.spec[0] || y > L.spec[0] + L.spec[1]) return
      dragging = e.pointerId
      canvas.setPointerCapture(e.pointerId)
      setCentre(bandFromX(e.clientX - r.left))
    }

    const onMove = (e: PointerEvent) => {
      if (dragging !== e.pointerId) return
      const r = canvas.getBoundingClientRect()
      setCentre(bandFromX(e.clientX - r.left))
    }

    const onUp = () => {
      dragging = null
    }

    const ro = new ResizeObserver(() => {
      build()
      draw()
    })
    ro.observe(canvas)

    build()
    advance(N)
    analyse()
    draw()
    run()
    onBandRef.current?.({ ...band })
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    document.addEventListener('visibilitychange', run)
    reduce.addEventListener('change', run)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      document.removeEventListener('visibilitychange', run)
      reduce.removeEventListener('change', run)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={`frequency ${className}`}
      role="img"
      aria-label="A seismic trace, its amplitude spectrum with a bandpass filter, and the filtered trace. Drag in the spectrum to move the filter."
    />
  )
}
