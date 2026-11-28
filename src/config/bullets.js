// Balas de cañón (HT06: motor de físicas y colisiones). Valores ajustables del disparo y de la bala.
// Nombres en inglés: BULLET (bala), radius (radio), speed (velocidad), elevation (elevación),
// gravityScale (multiplicador de gravedad), lifetime (tiempo de vida), maxActive (máximo activas),
// seaLevel (nivel del mar), muzzleOffset (separación lateral), muzzleHeight (altura), muzzleZ (posición longitudinal).
export const BULLET = {
  radius: 3, // Radio de la bala
  speed: 300, // Velocidad inicial en unidades por segundo (por encima de ~450 la bala podría atravesar muros finos: activa ccd en Bullets.jsx)
  elevation: 0.45, // Ángulo de subida del disparo en radianes (unos 26 grados)
  // El mundo es muy grande para la gravedad real de Rapier (9.81): la bala casi no caería.
  // Con 12 la gravedad efectiva es unas 118 unidades/s2 y el disparo describe un arco de unos 2 segundos.
  gravityScale: 12,
  lifetime: 3, // Segundos máximos de vida antes de que la bala desaparezca
  maxActive: 24, // Balas simultáneas permitidas; si se supera, se retira la más antigua
  seaLevel: 5, // Altura del agua: debe coincidir con el position-y del plano del océano en Ocean.jsx
  // La boca del cañón nace fuera de la cápsula del casco (radio 17 en config/ship.js) para que la bala no choque
  // con su propio barco al salir.
  muzzleOffset: 17, // Separación lateral de la boca respecto al centro del barco en el eje X
  muzzleHeight: 8, // eje Y: Altura de la boca respecto al centro del barco
  muzzleZ: 1.9, // z: Posición a lo largo del barco, en coordenadas locales del barco
  // HU13: límites y rapidez de la mira. Nombres en inglés: elevationSpeed (rapidez de elevación), aimYawLimit (límite de giro lateral), aimYawSpeed (rapidez de giro), reloadTime (tiempo de recarga).
  minElevation: 0.1, // Elevación mínima de la mira en radianes (unos 6 grados)
  maxElevation: 0.9, // Elevación máxima en radianes (unos 52 grados)
  elevationSpeed: 0.6, // Rapidez con la que W y S cambian la elevación (radianes por segundo)
  aimYawLimit: 0.5, // Giro lateral máximo de la mira respecto al costado (radianes, unos 29 grados)
  aimYawSpeed: 0.8, // Rapidez con la que A y D giran la mira (radianes por segundo)
  reloadTime: 1.2, // Segundos entre un disparo y el siguiente
  reticlePoints: 28, // Cantidad de puntos de la línea de trayectoria 
  reticleRingInner: 6, // Radio interior del anillo en el agua
  reticleRingOuter: 8, // Radio exterior del anillo en el agua
  reticleColor: "#ffd27a", // Color de la línea y el anillo
  }
