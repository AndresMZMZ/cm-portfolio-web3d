import { MODES, useGameStore } from '@/store/useGameStore'
import { useKeyboardControls } from '@react-three/drei'
import { useEffect } from 'react'

/**
 * Hook personalizado para gestionar el cambio de modos de juego a través de pulsaciones de teclado puntuales. */
export function useModeKeys() {
  // 'subscribe' permite escuchar eventos reactivos del teclado de Drei pasándole un selector de acción y un callback
  const [subscribe] = useKeyboardControls()

  useEffect(() => {
    // Extrae las acciones globales del estado de Zustand para disparar transiciones de modo
    const { startCombat, backToNavigation } = useGameStore.getState()

    // SUSCRIPCIÓN PARA APUNTAR A LA IZQUIERDA (Tecla Q):
    // Cuando se presiona la tecla ('pressed' es true), activa inmediatamente el estado global de combate.
    // 'subscribe' devuelve una función de cancelación (cleanup) que guardamos en 'offLeft'.
    const offLeft = subscribe((s) => s.aimLeft, (pressed) => pressed && startCombat())

    // SUSCRIPCIÓN PARA APUNTAR A LA DERECHA (Tecla E):
    // Funciona igual que el flanco izquierdo; presionar la tecla inicia la fase de combate (cañones listos).
    const offRight = subscribe((s) => s.aimRight, (pressed) => pressed && startCombat())

    // SUSCRIPCIÓN DE CANCELACIÓN / ESCAPE (Tecla Esc):
    // Al presionar Escape, invoca 'backToNavigation' para cerrar menús, paneles de proyectos o salir del modo combate.
    const offCancel = subscribe((s) => s.cancel, (pressed) => pressed && backToNavigation())

    // SUSCRIPCIÓN DE INTERACCIÓN CON ISLAS (Teclas Enter / F):
    const offInteract = subscribe(
      (s) => s.interact, // Escucha el mapeo 'interact'
      (pressed) => {
        if (!pressed) return // Si la tecla se soltó, ignora el evento (solo actúa al hundirla)
        
        // Obtiene el estado actual en tiempo real para evaluar las condiciones de entorno
        const { mode, nearIsland, openPanel } = useGameStore.getState()
        
        // REGLA DE INTERACCIÓN: Solo abre el panel si el barco está navegando libremente 
        // Y el sistema de proximidad confirma que estás dentro del radio de una isla ('nearIsland' no es null).
        if (mode === MODES.NAVIGATION && nearIsland) openPanel(nearIsland)
      }
    )

    // FUNCIÓN DE LIMPIEZA (CLEANUP):
    // Cuando el componente que invoca este hook se desmonta, se ejecutan estas 4 funciones.
    // Esto destruye los escuchadores en memoria y evita un error crítico donde las teclas se duplican o se quedan pegadas.
    return () => { offLeft(); offRight(); offCancel(); offInteract() }
  }, [subscribe]) // Se vuelve a ejecutar solo si la función de suscripción base de Drei cambia
}
