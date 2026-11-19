import { useEffect, useMemo, useRef } from 'react'
import './background.css'

type ColorBendsProps = {
  colors: string[]
  rotation?: number
  speed?: number
  scale?: number
  frequency?: number
  warpStrength?: number
  mouseInfluence?: number
  parallax?: number
  noise?: number
  renderScale?: number
}

const MAX_COLORS = 8

const vert = `
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const frag = `
precision highp float;
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer;
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  q += (uPointer - rp) * uMouseInfluence * 0.2;

  float kBelow = clamp(uWarpStrength, 0.0, 1.0);
  float kMix = pow(kBelow, 0.3);
  float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);

  vec2 s = q;
  vec3 col = vec3(0.0);
  for (int i = 0; i < MAX_COLORS; ++i) {
    if (i >= uColorCount) break;
    s -= 0.01;
    vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
    float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
    vec2 warped = s + (r - s) * kBelow * gain;
    float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
    float w = 1.0 - exp(-6.0 / exp(6.0 * mix(m0, m1, kMix)));
    col += uColors[i] * w;
  }
  col = clamp(col, 0.0, 1.0);

  float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
  col = clamp(col + (n - 0.5) * uNoise, 0.0, 1.0);
  gl_FragColor = vec4(col, 1.0);
}
`

const hexToRgb = (hex: string) => {
  const h = hex.replace('#', '')
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255)
}

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader)
    return null
  }
  return shader
}

export function ColorBends({
  colors,
  rotation = 45,
  speed = 0.5,
  scale = 1,
  frequency = 1,
  warpStrength = 1,
  mouseInfluence = 1,
  parallax = 0.5,
  noise = 0.05,
  renderScale = 0.5,
  className = '',
}: ColorBendsProps & { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const setup = useMemo(
    () =>
      createSetup({
        colors,
        rotation,
        speed,
        scale,
        frequency,
        warpStrength,
        mouseInfluence,
        parallax,
        noise,
        renderScale,
      }),
    [
      colors,
      rotation,
      speed,
      scale,
      frequency,
      warpStrength,
      mouseInfluence,
      parallax,
      noise,
      renderScale,
    ]
  )

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let cleanup: (() => void) | undefined
    const run = () => {
      cleanup = setup(container, canvas)
    }
    const idle = 'requestIdleCallback' in window
    const handle = idle
      ? window.requestIdleCallback(run, { timeout: 600 })
      : window.setTimeout(run, 150)

    return () => {
      if (idle) window.cancelIdleCallback(handle)
      else window.clearTimeout(handle)
      cleanup?.()
    }
  }, [setup])

  return (
    <div
      ref={containerRef}
      className={`color-bends ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  )
}

function createSetup({
  colors,
  rotation,
  speed,
  scale,
  frequency,
  warpStrength,
  mouseInfluence,
  parallax,
  noise,
  renderScale,
}: Required<ColorBendsProps>) {
  return (container: HTMLDivElement, canvas: HTMLCanvasElement) => {
    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
      preserveDrawingBuffer: false,
    })
    if (!gl) return

    const vs = compile(gl, gl.VERTEX_SHADER, vert)
    const fs = compile(gl, gl.FRAGMENT_SHADER, frag)
    const program = gl.createProgram()
    if (!vs || !fs || !program) return
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return
    gl.useProgram(program)

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    )
    const position = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

    const u = (name: string) => gl.getUniformLocation(program, name)
    const uCanvas = u('uCanvas')
    const uTime = u('uTime')
    const uPointer = u('uPointer')

    const rgb = colors.slice(0, MAX_COLORS).flatMap(hexToRgb)
    gl.uniform3fv(u('uColors'), new Float32Array(rgb))
    gl.uniform1i(u('uColorCount'), rgb.length / 3)
    gl.uniform1f(u('uSpeed'), speed)
    gl.uniform1f(u('uScale'), scale)
    gl.uniform1f(u('uFrequency'), frequency)
    gl.uniform1f(u('uWarpStrength'), warpStrength)
    gl.uniform1f(u('uMouseInfluence'), mouseInfluence)
    gl.uniform1f(u('uParallax'), parallax)
    gl.uniform1f(u('uNoise'), noise)
    const rad = (rotation * Math.PI) / 180
    gl.uniform2f(u('uRot'), Math.cos(rad), Math.sin(rad))

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2) * renderScale
      const w = Math.max(1, Math.round(container.clientWidth * dpr))
      const h = Math.max(1, Math.round(container.clientHeight * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.uniform2f(uCanvas, w, h)
    }

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let visible = true
    let last = performance.now()
    let elapsed = 0

    const draw = () => {
      gl.uniform1f(uTime, elapsed)
      gl.uniform2f(uPointer, pointer.x, pointer.y)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1)
      last = now
      elapsed += dt
      const k = Math.min(1, dt * 8)
      pointer.x += (pointer.tx - pointer.x) * k
      pointer.y += (pointer.ty - pointer.y) * k
      draw()
      raf = requestAnimationFrame(frame)
    }

    const start = () => {
      if (raf || !visible || document.hidden || reduceMotion.matches) return
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }

    const stop = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const sync = () => {
      stop()
      if (reduceMotion.matches) draw()
      else start()
    }

    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
      pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1)
    }

    const ro = new ResizeObserver(() => {
      resize()
      if (!raf) draw()
    })
    ro.observe(container)

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(container)

    resize()
    elapsed = 6
    draw()
    container.classList.add('is-ready')
    sync()

    window.addEventListener('pointermove', onPointer, { passive: true })
    document.addEventListener('visibilitychange', sync)
    reduceMotion.addEventListener('change', sync)

    return () => {
      stop()
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onPointer)
      document.removeEventListener('visibilitychange', sync)
      reduceMotion.removeEventListener('change', sync)
      gl.deleteBuffer(buffer)
      gl.deleteProgram(program)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }
}
