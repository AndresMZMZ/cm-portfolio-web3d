import { create } from 'zustand'

// Modos del juego: solo uno activo a la vez
export const MODES = Object.freeze({
  NAVIGATION: 'navigation', // navegar con el barco
  COMBAT: 'combat',         // modo cañones
  PANEL: 'panel',           // panel de una isla abierto
})

// El docente usa Zustand solo de forma indirecta (lo trae KeyboardControls),
// pero creamos un store propio porque centraliza los modos del juego en un único lugar
export const useGameStore = create((set) => ({
  mode: MODES.NAVIGATION,
  activePanel: null, // id de la isla cuyo panel está abierto

  // Solo se puede entrar al combate desde la navegación
  startCombat: () =>
    set((s) => (s.mode === MODES.NAVIGATION ? { mode: MODES.COMBAT } : s)),
  openPanel: (id) => set({ mode: MODES.PANEL, activePanel: id }),
  // Esc o "Sigue navegando": siempre vuelve a navegar
  backToNavigation: () => set({ mode: MODES.NAVIGATION, activePanel: null }),
}))