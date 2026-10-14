import { MODES, useGameStore } from '@/store/useGameStore'
import { useKeyboardControls } from '@react-three/drei'
import { useEffect } from 'react'

// Cambia el modo del juego con el teclado. Son acciones puntuales, así que usamos subscribe (clase 5)
export function useModeKeys() {
  const [subscribe] = useKeyboardControls()

  useEffect(() => {
    const { startCombat, backToNavigation } = useGameStore.getState()
    // Q / E: entrar al modo cañones (el flanco babor/estribor se guarda en la HU13)
    const offLeft = subscribe((s) => s.aimLeft, (pressed) => pressed && startCombat())
    const offRight = subscribe((s) => s.aimRight, (pressed) => pressed && startCombat())
    // Esc: volver a navegar desde cualquier modo
    const offCancel = subscribe((s) => s.cancel, (pressed) => pressed && backToNavigation())
    // Enter / F: abrir la isla cercana (solo navegando y dentro de su rango)
    const offInteract = subscribe(
      (s) => s.interact,
      (pressed) => {
        if (!pressed) return
        const { mode, nearIsland, openPanel } = useGameStore.getState()
        if (mode === MODES.NAVIGATION && nearIsland) openPanel(nearIsland)
      }
    )
    // Limpieza (cleanup): se quitan las suscripciones al desmontar
    return () => { offLeft(); offRight(); offCancel(); offInteract() }
  }, [subscribe])
}