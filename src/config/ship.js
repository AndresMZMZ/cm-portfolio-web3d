import { ISLANDS } from '@/config/islands'

// Obtiene la primera isla de la lista (ISLANDS[0]) y la asigna como la isla principal de referencia
const [mainIsland] = ISLANDS
// CONFIGURACIÓN FÍSICA DE NAVEGACIÓN Y COLISIONES DEL BARCO
export const SHIP = {
  speed: 50,          // Velocidad de movimiento del barco al avanzar o retroceder
  turnSpeed: 1.5,     // Velocidad de giro del barco (qué tan rápido rota sobre su eje)
  spawnDistance: 900, // Distancia en unidades 3D a la que aparecerá el barco respecto a la isla principal
  waterline: 5,     // Altura de flotación del barco (qué tan hundido o elevado está respecto al agua)

// Parámetros de la cápsula de colisión (CapsuleCollider en Ship.jsx) (HU09):
// Se usa una cápsula acostada en vez de una caja para que el barco deslice suavemente al rozar esquinas.
  colliderHalfLength: 54, // mitad de la longitud del casco del barco
  colliderRadius: 20,     // Radio de la cápsula del casco del barco
  colliderOffset: [0, 10, 0], // Desplazamiento del colisionador respecto al centro del barco (X, Y, Z)

// Vaivén del barco combinado con el oleaje (HU08). Súbelos para un balanceo más visible.
  swayHeave: 1.5, // subida y bajada vertical
  swayPitch: 0.2, // cabeceo adelante/atrás
  swayRoll: 0.5, // balanceo lateral izquierda/derecha
}
// Coordenadas donde aparece el barco en el lado +Z de la isla principal
export const SHIP_SPAWN_POSITION = [
  mainIsland.position[0],                     // Posición eje X: Alineado exactamente con el centro X de la isla principal
  0,                                           // Posición eje Y: En la superficie del agua (altura cero)
  mainIsland.position[2] + SHIP.spawnDistance, // Posición eje Z: Toma la coordenada Z de la isla y le suma 900 unidades hacia el frente
]