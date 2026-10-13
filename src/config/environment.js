// No usammos un luz direccional si no que usamos una sola constante
// porque así el sol que se ve en el cielo y la dirección de las sombras siempre coinciden
export const SUN_POSITION = [80, 16, 0] // baja sobre el horizonte = atardecer

const LIGHT_DISTANCE = 80 // en una luz direccional solo importa la dirección, no la distancia
const length = Math.hypot(...SUN_POSITION)
export const SUN_OFFSET = SUN_POSITION.map((v) => (v / length) * LIGHT_DISTANCE)