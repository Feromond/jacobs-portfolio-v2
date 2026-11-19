import { useEffect, useMemo, useState } from 'react'

const SVG_NS = 'http://www.w3.org/2000/svg'
const BAND = 16
const PULL = 18
const DETAIL = 0.5
const SPREAD = [1, 1.07, 1.14]
const SIZE_STEP = 8
const CACHE_LIMIT = 16

let defs: SVGDefsElement | null = null
let next = 0

const supported = () => {
  if (typeof window === 'undefined') return false
  const data = (
    navigator as Navigator & {
      userAgentData?: { brands?: { brand: string }[] }
    }
  ).userAgentData
  // Stick to frosted glass outside Chromium for reliable rendering.
  const chromium = !!data?.brands?.some((b) => b.brand === 'Chromium')
  return (
    chromium &&
    !window.matchMedia('(prefers-reduced-transparency: reduce)').matches
  )
}

const ensureDefs = () => {
  if (defs) return defs
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.style.position = 'absolute'
  svg.style.pointerEvents = 'none'
  defs = document.createElementNS(SVG_NS, 'defs')
  svg.append(defs)
  document.body.append(svg)
  document.documentElement.classList.add('lens')
  return defs
}

export interface LensShape {
  band: number
  pull: number
  magnify: number
}

const DEFAULT_SHAPE: LensShape = { band: BAND, pull: PULL, magnify: 1 }

const drawMap = (
  width: number,
  height: number,
  radius: number,
  shape: LensShape
) => {
  const w = Math.max(2, Math.round(width * DETAIL))
  const h = Math.max(2, Math.round(height * DETAIL))
  const r = Math.min(radius, width / 2, height / 2)
  const band = Math.min(shape.band, width / 2, height / 2)
  const zoom = 1 - 1 / shape.magnify
  const offsets = new Float32Array(w * h * 2)
  let maxAbs = 1
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = (x + 0.5) / DETAIL - width / 2
      const py = (y + 0.5) / DETAIL - height / 2
      const qx = Math.abs(px) - (width / 2 - r)
      const qy = Math.abs(py) - (height / 2 - r)
      let dist: number
      let nx = 0
      let ny = 0
      if (qx > 0 && qy > 0) {
        const len = Math.hypot(qx, qy)
        dist = len - r
        nx = (qx / len) * Math.sign(px)
        ny = (qy / len) * Math.sign(py)
      } else {
        dist = Math.max(qx, qy) - r
        if (qx > qy) nx = Math.sign(px)
        else ny = Math.sign(py)
      }
      const depth = -dist
      let dx = 0
      let dy = 0
      if (depth >= 0) {
        dx = -px * zoom
        dy = -py * zoom
        if (depth < band) {
          const t = 1 - depth / band
          const pull = shape.pull * t * t
          dx -= nx * pull
          dy -= ny * pull
        }
      }
      const i = (y * w + x) * 2
      offsets[i] = dx
      offsets[i + 1] = dy
      maxAbs = Math.max(maxAbs, Math.abs(dx), Math.abs(dy))
    }
  }
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  const img = ctx.createImageData(w, h)
  for (let i = 0; i < w * h; i++) {
    img.data[i * 4] = 128 + (offsets[i * 2] / maxAbs) * 127
    img.data[i * 4 + 1] = 128 + (offsets[i * 2 + 1] / maxAbs) * 127
    img.data[i * 4 + 2] = 128
    img.data[i * 4 + 3] = 255
  }
  ctx.putImageData(img, 0, 0)
  return { url: canvas.toDataURL('image/png'), scale: maxAbs * 2 }
}

const channel = (k: 0 | 1 | 2) => {
  const m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0]
  m[k * 5 + k] = 1
  return m.join(' ')
}

const attach = (el: HTMLElement, shape: LensShape) => {
  const id = `lens-${next++}`
  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.id = id
  filter.setAttribute('filterUnits', 'userSpaceOnUse')
  filter.setAttribute('color-interpolation-filters', 'sRGB')
  const map = document.createElementNS(SVG_NS, 'feImage')
  map.setAttribute('result', 'map')
  map.setAttribute('preserveAspectRatio', 'none')
  filter.append(map)

  const shifts = SPREAD.map((_, k) => {
    const shift = document.createElementNS(SVG_NS, 'feDisplacementMap')
    shift.setAttribute('in', 'SourceGraphic')
    shift.setAttribute('in2', 'map')
    shift.setAttribute('xChannelSelector', 'R')
    shift.setAttribute('yChannelSelector', 'G')
    shift.setAttribute('result', `shift${k}`)
    const pick = document.createElementNS(SVG_NS, 'feColorMatrix')
    pick.setAttribute('in', `shift${k}`)
    pick.setAttribute('type', 'matrix')
    pick.setAttribute('values', channel(k as 0 | 1 | 2))
    pick.setAttribute('result', `ch${k}`)
    filter.append(shift, pick)
    return shift
  })

  const blendA = document.createElementNS(SVG_NS, 'feBlend')
  blendA.setAttribute('in', 'ch0')
  blendA.setAttribute('in2', 'ch1')
  blendA.setAttribute('mode', 'screen')
  blendA.setAttribute('result', 'rg')
  const blendB = document.createElementNS(SVG_NS, 'feBlend')
  blendB.setAttribute('in', 'rg')
  blendB.setAttribute('in2', 'ch2')
  blendB.setAttribute('mode', 'screen')
  filter.append(blendA, blendB)
  ensureDefs().append(filter)

  const cache = new Map<string, { url: string; scale: number }>()
  let drawn = ''
  const update = () => {
    const width = Math.round(el.offsetWidth / SIZE_STEP) * SIZE_STEP
    const height = Math.round(el.offsetHeight)
    if (width < 8 || height < 8) return
    const radius = Math.min(
      parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0,
      width / 2,
      height / 2
    )
    const key = `${width}x${height}r${radius}`
    if (key === drawn) return
    let result = cache.get(key)
    if (!result) {
      const made = drawMap(width, height, radius, shape)
      if (!made) return
      result = made
      cache.set(key, made)
      if (cache.size > CACHE_LIMIT) {
        const oldest = cache.keys().next().value
        if (oldest !== undefined) cache.delete(oldest)
      }
    }
    drawn = key
    for (const node of [filter, map]) {
      node.setAttribute('x', '0')
      node.setAttribute('y', '0')
      node.setAttribute('width', String(width))
      node.setAttribute('height', String(height))
    }
    map.setAttribute('href', result.url)
    shifts.forEach((shift, k) =>
      shift.setAttribute('scale', String(result!.scale * SPREAD[k]))
    )
    el.style.setProperty('--lens-filter', `url(#${id})`)
  }

  let pending = 0
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(pending)
    pending = requestAnimationFrame(update)
  })
  ro.observe(el)
  update()

  return () => {
    ro.disconnect()
    cancelAnimationFrame(pending)
    filter.remove()
    el.style.removeProperty('--lens-filter')
  }
}

export const lensSupported = supported

export type LensRef<T> = ((node: T | null) => void) & { current: T | null }

export function useLens<T extends HTMLElement>(shape?: Partial<LensShape>) {
  const [node, setNode] = useState<T | null>(null)
  const ref = useMemo(() => {
    const callback = ((el: T | null) => {
      callback.current = el
      setNode(el)
    }) as LensRef<T>
    callback.current = null
    return callback
  }, [])
  const band = shape?.band ?? DEFAULT_SHAPE.band
  const pull = shape?.pull ?? DEFAULT_SHAPE.pull
  const magnify = shape?.magnify ?? DEFAULT_SHAPE.magnify
  useEffect(() => {
    if (!node || !supported()) return
    return attach(node, { band, pull, magnify })
  }, [node, band, pull, magnify])
  return ref
}
