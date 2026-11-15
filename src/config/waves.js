// Olas del océano (HU08). Las usan Ocean.jsx y Ship.jsx (el vaivén del barco),
// sube y baja con la misma ola que se ve en pantalla.
// direction: hacia dónde avanza la ola en el plano del océano [x, y]; se normaliza al usarla.
// k: número de onda; la distancia entre crestas es 2 * PI / k (a mayor k, olas más pequeñas).
// amplitude: altura máxima de la ola, speed: qué tan rápido se desplaza.
export const WAVES = [
  { direction: [1.0, 0.4], k: 0.05, amplitude: 0.45, speed: 1.0 }, // Ola macro (lenta y masiva)
  { direction: [-0.3, 1.0], k: 0.11, amplitude: 0.25, speed: 1.4 }, // Ola media (dirección transversal)
  { direction: [0.7, -0.8], k: 0.23, amplitude: 0.12, speed: 2.0 }, // Ola micro (rápida y superficial)
]
