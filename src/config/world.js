// Límites del mundo (HU09 / WorldBounds.jsx). El océano mide 8000 en cada eje, así que los muros quedan dentro de él.
export const WORLD = {
  // Caras interiores de los muros del océano (puedes mover cada lado de forma independiente)
  bounds: {
    left: -3000,   // Borde izquierdo (-X,límite oeste del área navegable)
    right: 3000,   // Borde derecho (+X,límite este )
    back: -3000,   // Borde trasero (-Z,limite norte hacia el fondo)
    front: 3000,   // Borde delantero (+Z, límite sur hacia donde nace el barco)
    bottom: -35,   // Borde inferior (-Y, profundidad del muro bajo el agua)
    top: 45,       // Borde superior (+Y, altura del muro sobre el agua)
  },
  wallHalfThickness: 50, // Mitad del grosor del muro; evita que el barco lo atraviese
  warningDistance: 300, // Distancia antes de tocar cada muro donde se activa la alerta HTML (BoundaryWarning)
};