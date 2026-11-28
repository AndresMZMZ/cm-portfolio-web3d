import { create } from 'zustand'
// MODOS DEL JUEGO (Máquina de estados):
// Object.freeze bloquea este objeto para que ningún otro script pueda modificar o alterar 
export const MODES = Object.freeze({
  INTRO: 'intro',           // Fase inicial: pantalla de carga activa y controles del barco congelados.
  SETTINGS: 'settings',     // Fase de configuración (HU02): panel con audio e instrucciones antes de navegar.
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
  activePanel: null,     // Toma el ID string de la isla cuyo portafolio se está leyendo (ej: 'proyectos').
  nearIsland: null,      // Almacena el ID de la isla si el barco está en su radio de choque, o null si está en alta mar.
  combatSide: null,      // Batería activa (HU13): 'left', 'right', 'stern' o null si no hay combate.
  outOfBounds: false,    // Bandera booleana (true/false) indica si el barco entró en la franja límite del océano (HU09).
  audioEnabled: true,    // Audio activado (activado = enabled): lo elige el visitante en el panel de HU02 y lo usará HU03 (puedes renombrarla a tu gusto).
  
  // ACCIÓN: Registrar cercanía con una isla
  // Se invocada constantemente por el bucle del barco (Ship.jsx) para mostrar u ocultar el botón flotante en HTML.
  setNearIsland: (id) => set({ nearIsland: id }),
  // ACCIÓN: Activar o desactivar la alerta de límite del mundo (HU09)
  // Invocada por los sensores de WorldBounds.jsx para que BoundaryWarning.jsx muestre el cartel "Regresa al mar abierto".
  setOutOfBounds: (value) => set({ outOfBounds: value }),

  // ACCIÓN: Pasar de la pantalla de carga al panel de configuración (Botón INICIAR de la pantalla de carga)
  // Regla estricta: Solo cambia el modo a CONFIGURACIÓN (SETTINGS) si el jugador se encuentra actualmente en la fase INTRO.
  startGame: () => set((s) => (s.mode === MODES.INTRO ? { mode: MODES.SETTINGS } : s)),
 // ACCIÓN: Elegir si el audio está activado o no (interruptor del panel de HU02)
  SET_AUDIO_ENABLED: (value) => set({ audioEnabled: value }),
  // ACCIÓN: Confirmar el panel de configuración (botón Empezar del panel de HU02)
  // Regla estricta: Solo pasa a NAVEGACIÓN si el jugador está en la fase SETTINGS.
  confirmSettings: () =>
    set((s) => (s.mode === MODES.SETTINGS ? { mode: MODES.NAVIGATION } : s)),

  // ACCIÓN: Activa el modo combate o cambia de flanco (Q: babor, E: estribor). Solo disponible desde navegación en mar abierto o ya en combate.
  startCombat: (side) =>
    set((s) =>
      s.mode === MODES.NAVIGATION || s.mode === MODES.COMBAT
        ? { mode: MODES.COMBAT, combatSide: side }
        : s,
    ),

  // ACCIÓN: Desplegar el portafolio de una isla (Teclas Enter / F o clic en el botón)
  // Cambia el modo a PANEL e inyecta el ID correspondiente para saber qué lista de proyectos renderizar en el HTML.
  openPanel: (id) => set({ mode: MODES.PANEL, activePanel: id }),

  // ACCIÓN: Salir de menús o combate (Tecla Esc o botón "Sigue Navegando")
  // Regla estricta: Si el jugador presiona Esc estando todavía en la pantalla de carga (INTRO), el estado se ignora (s)
  // para evitar que se salte la carga. En cualquier otro modo, devuelve al barco a NAVEGACIÓN y limpia el panel activo.
  backToNavigation: () =>
    set((s) =>
      s.mode === MODES.INTRO || s.mode === MODES.SETTINGS
        ? s
        : { mode: MODES.NAVIGATION, activePanel: null, combatSide: null },
    ),
}))