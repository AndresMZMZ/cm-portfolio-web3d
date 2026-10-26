import { create } from 'zustand'
// ENUMERACIÓN DE MODOS DEL JUEGO (Máquina de estados):
// Object.freeze bloquea este objeto para que ningún otro script pueda modificar o alterar 
export const MODES = Object.freeze({
  INTRO: 'intro',           // Fase inicial: pantalla de carga activa y controles del barco congelados.
  NAVIGATION: 'navigation', // Fase de exploración: el barco tiene el timón libre y navega por el océano.
  COMBAT: 'combat',         // Fase de acción: cañones laterales desplegados y listos para apuntar.
  PANEL: 'panel',           // Fase de portafolio: se detiene el barco para leer los proyectos de una isla.
})
// ALMACÉN GLOBAL DE ESTADOS (Zustand Store):
// El docente usa Zustand solo de forma indirecta (lo trae KeyboardControls),
// pero creamos un store propio porque centraliza los modos del juego en un único lugar.
export const useGameStore = create((set) => ({
  
  // ESTADOS INICIALES:
  mode: MODES.INTRO,     // El juego arranca obligatoriamente en la pantalla de carga (INTRO).
  activePanel: null,     // Almacena el ID string de la isla cuyo portafolio se está leyendo (ej: 'proyectos').
  nearIsland: null,      // Almacena el ID de la isla si el barco está en su radio de choque, o null si está en alta mar.

  // ACCIÓN: Registrar cercanía con una isla
  // Esta función es invocada constantemente por el bucle del barco para avisarle a la interfaz 2D si debe mostrar el botón.
  setNearIsland: (id) => set({ nearIsland: id }),

  // ACCIÓN: Arrancar el juego (Botón INICIAR de la pantalla de carga)
  // Regla estricta: Solo cambia el modo a NAVEGACIÓN si el jugador se encuentra actualmente en la fase INTRO.
  startGame: () => set((s) => (s.mode === MODES.INTRO ? { mode: MODES.NAVIGATION } : s)),

  // ACCIÓN: Entrar en modo de combate (Teclas Q / E)
  // Regla estricta: Solo permite desenfundar los cañones si el barco se encontraba navegando en mar abierto.
  startCombat: () =>
    set((s) => (s.mode === MODES.NAVIGATION ? { mode: MODES.COMBAT } : s)),

  // ACCIÓN: Desplegar el portafolio de una isla (Teclas Enter / F o clic en el botón)
  // Cambia el modo a PANEL e inyecta el ID correspondiente para saber qué lista de proyectos renderizar en el HTML.
  openPanel: (id) => set({ mode: MODES.PANEL, activePanel: id }),

  // ACCIÓN: Salir de menús o combate (Tecla Esc o botón "Sigue Navegando")
  // Regla estricta: Si el jugador presiona Esc estando todavía en la pantalla de carga (INTRO), el estado se ignora (s)
  // para evitar que se salte la carga. En cualquier otro modo, devuelve al barco a NAVEGACIÓN y limpia el panel activo.
  backToNavigation: () =>
    set((s) => (s.mode === MODES.INTRO ? s : { mode: MODES.NAVIGATION, activePanel: null })),
}))
