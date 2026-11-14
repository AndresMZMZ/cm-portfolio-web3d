// Controles que se muestran en el panel de configuración inicial (HU02).
// Mantén esta lista alineada con config/keyboardMap.js.
// Nombres en inglés: CONTROLS (controles), keys (teclas), action (acción), soon (próximamente).
// Puedes renombrarlos a tu gusto si lo haces en todos los archivos que los usan.
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
