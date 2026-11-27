// Límites del mundo (HU09 / WorldBounds.jsx). El océano es un disco de radio 11000.
export const WORLD = {
  // Rango horizontal de referencia para el centro y radio del límite circular.
  bounds: {
    left: -8000,   // Borde izquierdo (-X,límite oeste del área navegable)
    right: 8000,   // Borde derecho (+X,límite este)
    back: -8000,   // Borde trasero (-Z,limite norte hacia el fondo)
    front: 8000,   // Borde delantero (+Z, límite sur hacia donde nace el barco)
    bottom: -35,   // Borde inferior (-Y, profundidad del muro bajo el agua)
    top: 45,       // Borde superior (+Y, altura del muro sobre el agua)
  },
  wallHalfThickness: 50, // Mitad del grosor del muro; evita que el barco lo atraviese
  warningDistance: 300, // Distancia antes de tocar cada muro donde se activa la alerta HTML (BoundaryWarning)
};