// Balas de cañón (HT06: motor de físicas y colisiones). Valores ajustables del disparo y de la bala.
// Nombres en inglés: BULLET (bala), radius (radio), speed (velocidad), elevation (elevación),
// gravityScale (multiplicador de gravedad), lifetime (tiempo de vida), maxActive (máximo activas),
// seaLevel (nivel del mar), muzzleOffset (separación de la boca del cañón), muzzleHeight (altura de la boca).
export const BULLET = {
  radius: 3, // Radio de la bala
  speed: 300, // Velocidad inicial en unidades por segundo (por encima de ~450 la bala podría atravesar muros finos: activa ccd en Bullets.jsx)
  elevation: 0.45, // Ángulo de subida del disparo en radianes (unos 26 grados)
  // El mundo es muy grande para la gravedad real de Rapier (9.81): la bala casi no caería.
  // Con 12 la gravedad efectiva es unas 118 unidades/s2 y el disparo describe un arco de unos 2 segundos.
  gravityScale: 12,
  lifetime: 8, // Segundos máximos de vida antes de que la bala desaparezca
  maxActive: 24, // Balas simultáneas permitidas; si se supera, se retira la más antigua
  seaLevel: 5, // Altura del agua: debe coincidir con el position-y del plano del océano en Ocean.jsx
  // La boca del cañón nace fuera de la cápsula del casco (radio 17 en config/ship.js) para que la bala no choque
  // con su propio barco al salir.
  muzzleOffset: 28, // Separación lateral de la boca respecto al centro del barco
  muzzleHeight: 8, // Altura de la boca respecto al centro del barco
}
