import { ISLANDS } from '@/config/islands'
// Obtiene la primera isla de la lista (ISLANDS[0]) y la asigna como la isla principal de referencia
const [mainIsland] = ISLANDS
// CONFIGURACIÓN FÍSICA Y DE MOVIMIENTO DEL BARCO
export const SHIP = {
  speed: 50,          // Velocidad de movimiento del barco al avanzar o retroceder
  turnSpeed: 1.5,     // Velocidad de giro del barco (qué tan rápido rota sobre su eje)
  spawnDistance: 900, // Distancia en unidades 3D a la que aparecerá el barco respecto a la isla principal
  waterline: 5,     // Altura de flotación del barco (qué tan hundido o elevado está respecto al agua)
}
// Aparece el barco en el lado +Z de la isla principal
export const SHIP_SPAWN_POSITION = [
  mainIsland.position[0],                     // Posición X: Alineado exactamente con el centro X de la isla principal
  0,                                           // Posición Y: En la superficie del agua (altura cero)
  mainIsland.position[2] + SHIP.spawnDistance, // Eje Z: Toma la coordenada Z de la isla y le suma 900 unidades hacia el frente
]