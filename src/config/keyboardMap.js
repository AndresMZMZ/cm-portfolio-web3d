import { useMemo } from 'react'

export function useGameKeyboardMap() {
  return useMemo(() => [
    // Movimiento del barco (Exclusivo con Flechas)
    { name: 'forward', keys: ['ArrowUp'] },
    { name: 'back', keys: ['ArrowDown'] },
    { name: 'left', keys: ['ArrowLeft'] },
    { name: 'right', keys: ['ArrowRight'] },
    
    // Control de la retícula de cañones (W, A, S, D)
    { name: 'targetUp', keys: ['KeyW'] },
    { name: 'targetDown', keys: ['KeyS'] },
    { name: 'targetLeft', keys: ['KeyA'] },
    { name: 'targetRight', keys: ['KeyD'] },

    // Modos de combate y activación de flancos
    { name: 'aimLeft', keys: ['KeyQ'] },
    { name: 'aimRight', keys: ['KeyE'] },
    { name: 'fire', keys: ['Space'] },
    { name: 'cancel', keys: ['Escape'] },
    
    // Auto-navegación
    { name: 'autoSail', keys: ['KeyZ'] },
    
    // Interactuar con una isla cercana
    { name: 'interact', keys: ['Enter', 'KeyF'] },
  ], [])
}