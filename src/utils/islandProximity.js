import { ISLANDS } from '@/config/islands'
import { useGameStore } from '@/store/useGameStore'

// Devuelve el factor de velocidad (1 = normal) y avisa al estado qué isla está cerca
export function updateIslandProximity(position) {
  let nearest = null
  let nearestDist = Infinity
  for (const island of ISLANDS) {
    const d = Math.hypot(position.x - island.position[0], position.z - island.position[2])
    if (d < island.interactRadius && d < nearestDist) {
      nearest = island
      nearestDist = d
    }
  }
  const { nearIsland, setNearIsland } = useGameStore.getState()
  const id = nearest ? nearest.id : null
  // Solo se escribe cuando cambia: evita redibujar la interfaz en cada fotograma
  if (nearIsland !== id) setNearIsland(id)
  if (!nearest) return 1
  // Frena de forma gradual: 1 en el borde del rango y minSpeed junto a la isla
  const t = nearestDist / nearest.interactRadius
  return nearest.minSpeed + (1 - nearest.minSpeed) * t
}