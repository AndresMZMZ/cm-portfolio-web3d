import { BULLET } from '@/config/bullets'
import { getImpactTime } from '@/utils/ballistics'
import { create } from 'zustand'

// Almacén de balas e impactos (HT06). Es aparte de useGameStore porque sus datos cambian por otras razones:
// las balas aparecen y desaparecen, mientras que los modos del juego solo cambian por acciones del jugador.
// Nombres en inglés: fireBullet (disparar), kind (tipo), target (objetivo).
let nextId = 1
let nextSalvoId = 1
let nextShotId = 1

function removeSalvoShot(activeSalvos, salvoId, shotId) {
  if (salvoId == null) return activeSalvos
  return activeSalvos.flatMap((salvo) => {
    if (salvo.id !== salvoId) return [salvo]
    const shots = salvo.shots.filter((shot) => shot.shotId !== shotId)
    return shots.length > 0 ? [{ ...salvo, shots }] : []
  })
}

export const useBulletStore = create((set) => ({
  bullets: [], // Balas en vuelo: { id, position: [x, y, z], velocity: [x, y, z] }
  impacts: [], // Impactos recientes, para dibujar el destello: { id, position, kind, target }
  salvoQueue: [], // Disparos individuales pendientes, cada uno con su instante fireAt
  activeSalvos: [], // Salvas programadas o con balas todavía en vuelo
  aim: { elevation: BULLET.elevation, yaw: 0 }, // Mira del modo cañones (HU13): elevación y giro lateral de la mira, en radianes. Se ajusta con W/S y A/D.
  setAim: (aim) => set({ aim }), // ACCIÓN: Ajusta la mira del modo cañones con W/S y A/D. 'aim' es un objeto { elevation, yaw } en radianes.

  // ACCIÓN: Disparar una bala desde 'position' hacia 'direction' (ambos arreglos [x, y, z]; la dirección debe ir normalizada).
  // Si ya hay maxActive balas, se retira la más antigua.
  fireBullet: (
    position,
    direction,
    speed = BULLET.speed,
    salvoId = null,
    shotId = null,
    launchTime = 0,
  ) =>
    set((s) => {
      const velocity = direction.map((component) => component * speed)
      const flightTime = getImpactTime(position, velocity, launchTime)
      const bullet = {
        id: nextId++,
        position,
        velocity,
        ttl: Number.isFinite(flightTime)
          ? Math.max(
              BULLET.minimumLifetime,
              flightTime + BULLET.flightTimeMargin,
            )
          : BULLET.minimumLifetime,
        salvoId,
        shotId,
        launchTime,
      }
      const oldest = s.bullets.length >= BULLET.maxActive ? s.bullets[0] : null
      const activeSalvos = s.activeSalvos.map((salvo) =>
        salvo.id === salvoId
          ? {
              ...salvo,
              shots: salvo.shots.map((shot) =>
                shot.shotId === shotId ? { ...shot, launchTime } : shot,
              ),
            }
          : salvo,
      )
      return {
        bullets: [...(oldest ? s.bullets.slice(1) : s.bullets), bullet],
        activeSalvos: oldest
          ? removeSalvoShot(activeSalvos, oldest.salvoId, oldest.shotId)
          : activeSalvos,
      }
    }),

  scheduleSalvo: (shots) => {
    if (shots.length === 0) return null
    const salvoId = nextSalvoId++
    const scheduledShots = shots.map((shot) => ({
      ...shot,
      salvoId,
      shotId: nextShotId++,
    }))
    set((s) => ({
      salvoQueue: [...s.salvoQueue, ...scheduledShots],
      activeSalvos: [...s.activeSalvos, { id: salvoId, shots: scheduledShots }],
    }))
    return salvoId
  },

  takeDueShots: (now) => {
    let dueShots = []
    set((s) => {
      dueShots = s.salvoQueue.filter((shot) => shot.fireAt <= now)
      return dueShots.length
        ? {
            salvoQueue: s.salvoQueue.filter((shot) => shot.fireAt > now),
          }
        : s
    })
    return dueShots
  },

  // ACCIÓN: Retirar una bala (por impacto o por fin de su vida). Si ya no existe, no hace nada.
  removeBullet: (id) =>
    set((s) => {
      const bullet = s.bullets.find((item) => item.id === id)
      if (!bullet) return s
      return {
        bullets: s.bullets.filter((item) => item.id !== id),
        activeSalvos: removeSalvoShot(
          s.activeSalvos,
          bullet.salvoId,
          bullet.shotId,
        ),
      }
    }),

  // ACCIÓN: Registrar un impacto. kind: 'sea' (mar), 'island' (isla), 'bounds' (límite del mundo) u 'object' (otro).
  // target es el name del objeto golpeado (por ejemplo 'island-proyectos'); HU14 y HU15 lo usarán para reaccionar.
  addImpact: (impact) => set((s) => ({ impacts: [...s.impacts, { id: nextId++, ...impact }] })),

  // ACCIÓN: Retirar un impacto cuando termina su destello.
  removeImpact: (id) => set((s) => ({ impacts: s.impacts.filter((i) => i.id !== id) })),
}))
