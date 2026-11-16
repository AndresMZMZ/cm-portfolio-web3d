// Controles que se muestran en el panel de configuración inicial (HU02).
// Mantén esta lista alineada con config/keyboardMap.js.
// keys (teclas), soon (próximamente).
export const CONTROLS = [
  { keys: ['↑', '↓'], action: 'Avanzar y retroceder con el barco' },
  { keys: ['←', '→'], action: 'Girar el barco' },
  { keys: ['Enter', 'F'], action: 'Ver la isla cuando estés cerca' },
  { keys: ['Q', 'E'], action: 'Preparar los cañones de babor (izquierda) o estribor (derecha)' },
  // soon: true marca acciones que ya tienen tecla pero todavía no funcionan (llegan en el Sprint 3).
  { keys: ['W', 'A', 'S', 'D'], action: 'Mover la mira de los cañones', soon: true },
  { keys: ['Espacio'], action: 'Disparar', soon: true },
  { keys: ['Esc'], action: 'Cerrar un panel o volver a navegar' },
]
