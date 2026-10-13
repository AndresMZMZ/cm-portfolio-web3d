// Todos los ajustes de la cámara en un solo lugar: se afinan sin tocar la lógica
export const CAMERA = {
  offset: [0, 13, 25], // [x, y, z] respecto al barco: z positivo = detrás, y = arriba
  lookAhead: 10,      // a cuántas unidades por delante de la proa mira la cámara
  lookHeight: 2,      // a qué altura sobre el barco apunta la mirada
  followDamping: 3,   // más alto = la cámara alcanza al barco más rápido
  lookDamping: 6,     // más alto = la mirada gira más rápido
}