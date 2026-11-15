import { WAVES } from '@/config/waves'

// Las direcciones se normalizan una sola vez (el shader hace lo mismo con normalize()).
const NORMALIZED = WAVES.map((wave) => {
  const length = Math.hypot(wave.direction[0], wave.direction[1])
  return { ...wave, dx: wave.direction[0] / length, dy: wave.direction[1] / length }
})

// GLSL exige que los números decimales lleven punto (1 no es válido, 1.0 sí).
const glslFloat = (n) => (Number.isInteger(n) ? n.toFixed(1) : String(n))

// Genera las llamadas addWave(...) del vertex shader de Ocean.jsx a partir de WAVES,
// para que el agua y el barco compartan los mismos datos (principio DRY de The Pragmatic Programmer).
export function wavesToGlsl() {
  return WAVES.map(
    ({ direction, k, amplitude, speed }) =>
      `addWave(p, vec2(${glslFloat(direction[0])}, ${glslFloat(direction[1])}), ${glslFloat(k)}, ${glslFloat(amplitude)}, ${glslFloat(speed)}, h, g);`,
  ).join('\n    ')
}

// Calcula la altura del agua y su pendiente en el punto (x, z) del mundo, en el instante time (segundos).
// Es la misma suma de ondas senoidales de waveCalc() en Ocean.jsx, pero evaluada en JavaScript (Clase 02: Math.sin).
// El plano del océano está girado -90 grados sobre X, así que su eje local Y equivale a -Z del mundo.
// Devuelve { height, slopeX, slopeZ }: la altura y cuánto sube el agua por cada unidad hacia +X y hacia +Z.
// Pasa un objeto en 'out' para reutilizarlo en cada fotograma y no crear basura de memoria.
export function sampleWave(x, z, time, out = { height: 0, slopeX: 0, slopeZ: 0 }) {
  const px = x
  const py = -z
  let height = 0
  let gradX = 0
  let gradY = 0
  for (const { dx, dy, k, amplitude, speed } of NORMALIZED) {
    const phase = (dx * px + dy * py) * k + time * speed
    height += amplitude * Math.sin(phase)
    const slope = amplitude * k * Math.cos(phase)
    gradX += slope * dx
    gradY += slope * dy
  }
  out.height = height
  out.slopeX = gradX
  out.slopeZ = -gradY
  return out
}
