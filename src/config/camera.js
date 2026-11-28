// Todos los ajustes de la cámara en un solo lugar: se afinan sin tocar la lógica
export const CAMERA = {
  offset: [0, 200, 330], // [x, y, z] respecto al barco: z positivo = detrás, y = arriba
  lookAhead: 80,       // encuadra el espacio entre el barco y la isla
  lookHeight: 100,       // eleva el punto de enfoque para incluir la isla
  followDamping: 5,   // más alto = la cámara alcanza al barco más rápido
  lookDamping: 8,     // más alto = la mirada gira más rápido
  
  // HU13: cámara del modo cañones. Al activar Q o E la cámara rodea el barco y mira hacia el costado elegido.
  // Nombres en inglés: sideDamping (suavizado lateral), combat (combate). Puedes renombrarlos a tu gusto.
  sideDamping: 4, // qué tan rápido rodea la cámara al barco al entrar, cambiar de lado o salir (más alto = más rápido)
  // Mismos significados que offset, lookAhead y lookHeight, pero medidos en la dirección del costado que mira la cámara.
  combat: {
    offset: [0, 200, 330], // z positivo = la cámara queda del lado contrario al que se dispara
    lookAhead: 250,        // más lejos que en navegación: el alcance de los cañones llega a unas 600 unidades
    lookHeight: 20,        // más bajo: la mira queda cerca del agua y se ve el anillo de impacto
  },
}