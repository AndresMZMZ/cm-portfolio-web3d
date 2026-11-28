// Controles que se muestran en el panel de configuración inicial (HU02).
// Mantén esta lista alineada con config/keyboardMap.js.
// keys (teclas).
export const CONTROLS = [
  { keys: ['↑', '↓'], action: 'Avanzar y retroceder con el barco' },
  { keys: ['←', '→'], action: 'Girar el barco' },
  { keys: ['Enter', 'F'], action: 'Ver la isla cuando estés cerca' },

  // HU13: controles del modo cañones.
  { keys: ['Q', 'E'], action: 'Seleccionar los cañones de babor (izquierda) o estribor (derecha)' },
  { keys: ['R'], action: 'Seleccionar los cañones de popa' },
  { keys: ['W', 'S'], action: 'Subir o bajar la mira de los cañones' },
  { keys: ['A', 'D'], action: 'Girar la mira de los cañones hacia los lados' },
  { keys: ['Espacio'], action: 'Disparar (con unos segundos de recarga)' },
  { keys: ['Esc'], action: 'Cerrar un panel o volver a navegar' },
]
