import { BULLET } from '@/config/bullets'
import { create } from 'zustand'

// Almacén de balas e impactos (HT06). Es aparte de useGameStore porque sus datos cambian por otras razones:
// las balas aparecen y desaparecen, mientras que los modos del juego solo cambian por acciones del jugador.
// Nombres en inglés: fireBullet (disparar), kind (tipo), target (objetivo).
let nextId = 1

export const useBulletStore = create((set) => ({
  bullets: [], // Balas en vuelo: { id, position: [x, y, z], velocity: [x, y, z] }
  impacts: [], // Impactos recientes, para dibujar el destello: { id, position, kind, target }
  aim: { elevation: BULLET.elevation, yaw: 0 }, // Mira del modo cañones (HU13): elevación y giro lateral de la mira, en radianes. Se ajusta con W/S y A/D.
  setAim: (aim) => set( { aim }), // ACCIÓN: Ajusta la mira del modo cañones con W/S y A/D. 'aim' es un objeto { elevation, yaw } en radianes.

  // ACCIÓN: Disparar una bala desde 'position' hacia 'direction' (ambos arreglos [x, y, z]; la dirección debe ir normalizada).
  // Si ya hay maxActive balas, se retira la más antigua.
  fireBullet: (position, direction, speed = BULLET.speed) =>
    set((s) => {
      const bullet = {
        id: nextId++,
        position,
        velocity: direction.map((component) => component * speed),
      }
      const kept = s.bullets.length >= BULLET.maxActive ? s.bullets.slice(1) : s.bullets
      return { bullets: [...kept, bullet] }
    }),

  // ACCIÓN: Retirar una bala (por impacto o por fin de su vida). Si ya no existe, no hace nada.
  removeBullet: (id) =>
    set((s) => (s.bullets.some((b) => b.id === id) ? { bullets: s.bullets.filter((b) => b.id !== id) } : s)),

  // ACCIÓN: Registrar un impacto. kind: 'sea' (mar), 'island' (isla), 'bounds' (límite del mundo) u 'object' (otro).
  // target es el name del objeto golpeado (por ejemplo 'island-proyectos'); HU14 y HU15 lo usarán para reaccionar.
  addImpact: (impact) => set((s) => ({ impacts: [...s.impacts, { id: nextId++, ...impact }] })),

  // ACCIÓN: Retirar un impacto cuando termina su destello.
  removeImpact: (id) => set((s) => ({ impacts: s.impacts.filter((i) => i.id !== id) })),
}))
