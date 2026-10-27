// Todos los ajustes de la cámara en un solo lugar: se afinan sin tocar la lógica
export const CAMERA = {
  offset: [0, 200, 330], // [x, y, z] respecto al barco: z positivo = detrás, y = arriba
  lookAhead: 80,       // encuadra el espacio entre el barco y la isla
  lookHeight: 100,       // eleva el punto de enfoque para incluir la isla
  followDamping: 5,   // más alto = la cámara alcanza al barco más rápido
  lookDamping: 8,     // más alto = la mirada gira más rápido
}