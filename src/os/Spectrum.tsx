import { useEffect, useRef } from 'react'

import { fft } from '../library/signal'

const N = 2048
const FS = 8192
const HOP = 256
const F_MIN = 70
const F_MAX = FS / 2
const COLUMN = 2
const PANEL = 70
const FULL_SCALE_DB = 20 * Math.log10(N / 4)
const RANGE_DB = 70

const MAP = [
  [8, 9, 11],
  [40, 52, 110],
  [129, 155, 247],
  [77, 255, 213],
  [195, 177, 255],
  [255, 181, 154],
  [255, 236, 214],
]

const colorFor = (v: number) => {
  const p = Math.min(0.9999, Math.max(0, v)) * (MAP.length - 1)
  const i = Math.floor(p)
  const f = p - i
  return MAP[i].map((c, k) => Math.round(c + (MAP[i + 1][k] - c) * f))
}

const LUT = Array.from({ length: 256 }, (_, i) => colorFor(i / 255))

const hann = Float32Array.from(
  { length: N },
  (_, i) => 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / (N - 1))
)

const CHORDS = [
  [220, 277.18, 329.63],
  [196, 246.94, 293.66],
  [174.61, 220, 261.63],
  [164.81, 207.65, 246.94],
]

type Chirp = { f0: number; start: number; phase: number }

export function Spectrum({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const buffer = new Float32Array(N)
    let head = 0
    const re = new Float32Array(N)
    const im = new Float32Array(N)
    const chirps: Chirp[] = []
    let sampleIndex = 0
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = 0
    let rowBins: Float32Array = new Float32Array(0)
    let columnImage: ImageData | null = null
    const phases = new Float64Array(8)

    const freqAtRow = (y: number) =>
      F_MIN * Math.pow(F_MAX / F_MIN, 1 - y / Math.max(1, h - 1))

    const rowAtFreq = (f: number) =>
      (1 - Math.log(f / F_MIN) / Math.log(F_MAX / F_MIN)) * (h - 1)

    const build = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.fillStyle = 'rgb(8, 9, 11)'
      ctx.fillRect(0, 0, w, h)
      columnImage = ctx.createImageData(
        Math.max(1, Math.round(COLUMN * dpr)),
        Math.max(1, canvas.height)
      )
      rowBins = Float32Array.from({ length: Math.ceil(h) }, (_, y) =>
        Math.min(N / 2 - 2, (freqAtRow(y) / FS) * N)
      )
    }

    const synth = () => {
      for (let n = 0; n < HOP; n++) {
        const t = sampleIndex / FS
        const chord = CHORDS[Math.floor(t / 4) % CHORDS.length]
        const age = t % 4
        const env = (1 - Math.exp(-age * 40)) * Math.exp(-age * 0.7)
        let v = 0
        chord.forEach((f, k) => {
          phases[k] += (2 * Math.PI * f) / FS
          v += env * 0.2 * Math.sin(phases[k])
          v += env * 0.05 * Math.sin(2 * phases[k])
          v += env * 0.018 * Math.sin(3 * phases[k])
        })
        const glide = 900 + 600 * Math.sin(t * 0.35)
        phases[5] += (2 * Math.PI * glide) / FS
        v += 0.04 * Math.sin(phases[5])
        for (const c of chirps) {
          const age = t - c.start
          if (age < 0 || age > 1.6) continue
          const f = c.f0 * Math.pow(0.35, age / 1.6)
          c.phase += (2 * Math.PI * f) / FS
          v += 0.35 * Math.exp(-age * 1.6) * Math.sin(c.phase)
        }
        v += (Math.random() - 0.5) * 0.006
        buffer[head] = v
        head = (head + 1) % N
        sampleIndex++
      }
      for (let i = chirps.length - 1; i >= 0; i--) {
        if (sampleIndex / FS - chirps[i].start > 1.7) chirps.splice(i, 1)
      }
    }

    const spectrum = () => {
      for (let i = 0; i < N; i++) {
        re[i] = buffer[(head + i) % N] * hann[i]
        im[i] = 0
      }
      fft(re, im)
      const mags = new Float32Array(N / 2)
      for (let i = 0; i < N / 2; i++) {
        const db = 20 * Math.log10(Math.hypot(re[i], im[i]) + 1e-6)
        const level = Math.min(
          1,
          Math.max(0, (db - FULL_SCALE_DB + RANGE_DB) / RANGE_DB)
        )
        mags[i] = level ** 1.9
      }
      return mags
    }

    const magAt = (mags: Float32Array, bin: number) => {
      const i = Math.floor(bin)
      const f = bin - i
      return mags[i] * (1 - f) + mags[i + 1] * f
    }

    const paintColumn = (mags: Float32Array, x: number) => {
      const img = columnImage
      if (!img) return
      const data = img.data
      const cw = img.width
      const last = rowBins.length - 1
      for (let yy = 0; yy < img.height; yy++) {
        const [r, g, b] =
          LUT[
            Math.round(
              magAt(mags, rowBins[Math.min(last, Math.floor(yy / dpr))]) * 255
            )
          ]
        for (let xx = 0; xx < cw; xx++) {
          const o = (yy * cw + xx) * 4
          data[o] = r
          data[o + 1] = g
          data[o + 2] = b
          data[o + 3] = 255
        }
      }
      ctx.putImageData(img, Math.round(x * dpr), 0)
    }

    const plot = (mags: Float32Array) => {
      ctx.fillStyle = 'rgb(8, 9, 11)'
      ctx.fillRect(0, 0, PANEL, h)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.fillRect(PANEL - 1, 0, 1, h)
      ctx.beginPath()
      for (let y = 0; y < h; y += 2) {
        const px = PANEL - 8 - magAt(mags, rowBins[y]) * (PANEL - 16)
        if (y === 0) ctx.moveTo(px, y)
        else ctx.lineTo(px, y)
      }
      ctx.strokeStyle = 'rgba(121, 251, 206, 0.8)'
      ctx.lineWidth = 1.2
      ctx.stroke()
      ctx.font = '11px ui-monospace, SFMono-Regular, Menlo, monospace'
      ctx.fillStyle = 'rgba(154, 162, 174, 0.75)'
      for (const f of [100, 250, 500, 1000, 2000, 4000]) {
        const y = rowAtFreq(f)
        ctx.fillRect(PANEL - 5, y, 4, 1)
        ctx.fillText(f >= 1000 ? `${f / 1000}k` : `${f}`, 8, y - 3)
      }
    }

    const drawColumn = (mags: Float32Array) => {
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      const from = Math.round((PANEL + COLUMN) * dpr)
      const to = Math.round(PANEL * dpr)
      const width = canvas.width - from
      ctx.drawImage(
        canvas,
        from,
        0,
        width,
        canvas.height,
        to,
        0,
        width,
        canvas.height
      )
      ctx.restore()
      paintColumn(mags, w - COLUMN)
      plot(mags)
    }

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame)
      if (now - last < 33) return
      last = now
      synth()
      drawColumn(spectrum())
    }

    const run = () => {
      cancelAnimationFrame(raf)
      if (reduce.matches || document.hidden) return
      raf = requestAnimationFrame(frame)
    }

    const prefill = () => {
      let mags = new Float32Array(N / 2)
      let i = 0
      for (let x = PANEL; x < w; x += COLUMN) {
        synth()
        if (i++ % 2 === 0) mags = spectrum()
        paintColumn(mags, x)
      }
      plot(mags)
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const f = Math.min(3600, Math.max(200, freqAtRow(e.clientY - r.top)))
      chirps.push({ f0: f, start: sampleIndex / FS, phase: 0 })
      if (reduce.matches) {
        for (let i = 0; i < 40; i++) {
          synth()
          drawColumn(spectrum())
        }
      }
    }

    const ro = new ResizeObserver(() => {
      build()
      prefill()
    })
    ro.observe(canvas)

    build()
    prefill()
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
      className={`spectrum ${className}`}
      role="img"
      aria-label="Live spectrogram of a synthetic signal. Click to send a chirp."
    />
  )
}
