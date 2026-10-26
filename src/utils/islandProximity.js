import { ISLANDS } from '@/config/islands'
import { useGameStore } from '@/store/useGameStore'

/**
 * Calcula la distancia entre el barco y las islas para aplicar un freno gradual
 * y actualizar la interfaz cuando el jugador entra en zona de interacción.
 * @param {Object} position - Posición actual del barco en formato {x, y, z}
 * @returns {number} Factor de velocidad (0.35 a 1.0) para multiplicar la marcha del barco
 */
export function updateIslandProximity(position) {
  let nearest = null           // Almacenará el objeto completo de la isla más cercana
  let nearestDist = Infinity   // Inicializa la distancia más corta en "Infinito" para asegurar que cualquier isla sea menor al principio

  // BUCLE DE BÚSQUEDA: Recorre todas las islas para encontrar cuál es la más cercana al barco
  for (const island of ISLANDS) {
    // TEOREMA DE PITÁGORAS (Math.hypot): Calcula la hipotenusa (distancia en línea recta) 
    // entre el barco y la isla en el plano 2D horizontal (ignorando la altura Y del agua).
    const d = Math.hypot(position.x - island.position[0], position.z - island.position[2])
    
    // EVALUACIÓN DE PROXIMIDAD:
    // Si la distancia 'd' es menor que el radio permitido de la isla O menor que la distancia más corta registrada hasta ahora...
    if (d < island.interactRadius && d < nearestDist) {
      nearest = island        // Guarda esta isla como la actual candidata más cercana
      nearestDist = d         // Actualiza el récord de la distancia más corta
    }
  }

  // OBTENCIÓN DEL ESTADO ACTUAL (Zustand):
  // Trae los datos sin suscribirse reactivamente para no causar atascos de rendimiento en el ciclo useFrame
  const { nearIsland, setNearIsland } = useGameStore.getState()
  // Si encontramos una isla válida dentro de su radio guarda su ID, de lo contrario devuelve null (alta mar)
  const id = nearest ? nearest.id : null

  // FILTRO DE RENDIMIENTO CRÍTICO:
  // Solo actualiza el cerebro global si el ID cambió (ej. pasaste de alta mar a la isla, o cambiaste de isla).
  // Esto evita que React intente redibujar los componentes de la interfaz HTML 60 veces por segundo de forma innecesaria.
  if (nearIsland !== id) setNearIsland(id)

  // COMPROBACIÓN FINAL DE NAVEGACIÓN:
  // Si el bucle determinó que no estás dentro del radio de ninguna isla, devuelve '1' (Velocidad 100% normal)
  if (!nearest) return 1

  // INTERPOLACIÓN LINEAL (Cálculo del Freno Gradual):
  // 't' es un porcentaje decimal (de 0.0 a 1.0) que indica qué tan adentro del radio está el barco.
  // Si estás en el puro borde exterior del radio, 't' vale 1. Si estás en el centro exacto de la isla, 't' vale 0.
  const t = nearestDist / nearest.interactRadius
  
  // Devuelve el factor multiplicador de velocidad final utilizando una interpolación lineal invertida.
  // Entre más se acerque 't' a cero (más cerca de la isla), más se acercará el resultado final a su 'minSpeed' (freno).
  return nearest.minSpeed + (1 - nearest.minSpeed) * t
}
