import { create } from 'zustand'

// Modos del juego: solo uno activo a la vez
export const MODES = Object.freeze({
  INTRO: 'intro',           // pantalla de carga visible: el juego está en pausa
  NAVIGATION: 'navigation', // navegar con el barco
  COMBAT: 'combat',         // modo cañones
  PANEL: 'panel',           // panel de una isla abierto
})

// El docente usa Zustand solo de forma indirecta (lo trae KeyboardControls),
// pero creamos un store propio porque centraliza los modos del juego en un único lugar
export const useGameStore = create((set) => ({
  // el juego arranca en INTRO (antes arrancaba en NAVIGATION)
  mode: MODES.INTRO,
  activePanel: null, // id de la isla cuyo panel está abierto

  nearIsland: null, // id de la isla cercana (o null); lo escribe el barco al navegar
  setNearIsland: (id) => set({ nearIsland: id }),

  // Botón de inicio de la pantalla de carga: solo funciona desde INTRO
  startGame: () => set((s) => (s.mode === MODES.INTRO ? { mode: MODES.NAVIGATION } : s)),

  // Solo se puede entrar al combate desde la navegación
  startCombat: () =>
    set((s) => (s.mode === MODES.NAVIGATION ? { mode: MODES.COMBAT } : s)),
  openPanel: (id) => set({ mode: MODES.PANEL, activePanel: id }),
  // Esc o "Sigue navegando": vuelve a navegar
  // Esc ya no puede saltarse la pantalla de carga
  backToNavigation: () =>
    set((s) => (s.mode === MODES.INTRO ? s : { mode: MODES.NAVIGATION, activePanel: null })),
}))