import { ISLANDS } from '@/config/islands'

// Obtiene la primera isla de la lista (ISLANDS[0]) y la asigna como la isla principal de referencia
const [mainIsland] = ISLANDS
// CONFIGURACIÓN FÍSICA DE NAVEGACIÓN Y COLISIONES DEL BARCO
export const SHIP = {
  speed: 50,          // Velocidad de movimiento del barco al avanzar o retroceder
  turnSpeed: 1.5,     // Velocidad de giro del barco (qué tan rápido rota sobre su eje)
  spawnDistance: 900, // Distancia en unidades 3D a la que aparecerá el barco respecto a la isla principal
  waterline: 5,     // Altura de flotación del barco (qué tan hundido o elevado está respecto al agua)

  // Bordes del colisionador del casco (CuboidCollider en Ship.jsx), relativos al centro del barco.
  colliders: [
    {
      label: 'casco',
      left: -18,   // borde izquierdo (-X, babor)
      right: 18,   // borde derecho (+X, estribor)
      back: -58,   // borde delantero hacia donde avanza (-Z, proa)
      front: 79,   // borde trasero (+Z, popa); extendido para cubrir bien la popa
      bottom: -12, // borde inferior (-Y, quilla bajo el agua)
      top: 22,     // borde superior (+Y, cubierta)
    },
  ],

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