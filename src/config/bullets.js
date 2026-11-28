// Balas de cañón (HT06: motor de físicas y colisiones). Valores ajustables del disparo y de la bala.
// Nombres en inglés: BULLET (bala), radius (radio), speed (velocidad), elevation (elevación),
// gravityScale (multiplicador de gravedad), minimumLifetime (vida mínima), maxActive (máximo activas),
// seaLevel (nivel del mar), muzzleOffset (separación lateral), muzzleHeight (altura), muzzleZ (posición longitudinal).
export const BULLET = {
  radius: 3, // Radio de la bala
  speed: 300, // Velocidad inicial en unidades por segundo (por encima de ~450 la bala podría atravesar muros finos: activa ccd en Bullets.jsx)
  elevation: 0.45, // Ángulo de subida del disparo en radianes (unos 26 grados)
  // El mundo es muy grande para la gravedad real de Rapier (9.81): la bala casi no caería.
  // Con 12 la gravedad efectiva es unas 118 unidades/s2.
  gravityScale: 12,
  physicsTimeStep: 1 / 60, // Debe coincidir con el paso fijo de <Physics> en App.jsx
  minimumLifetime: 3, // Respaldo mínimo; el TTL real se calcula según el tiempo balístico de vuelo
  flightTimeMargin: 1, // Margen para la integración discreta de Rapier y el oleaje
  maxActive: 24, // Balas simultáneas permitidas; si se supera, se retira la más antigua
  seaLevel: 5, // Altura del agua: debe coincidir con el position-y del plano del océano en Ocean.jsx
  // La boca del cañón nace fuera de la cápsula del casco (radio 17 en config/ship.js) para que la bala no choque
  // con su propio barco al salir.
  muzzleOffset: 17, // Separación lateral de la boca respecto al centro del barco en el eje X
  muzzleHeight: 8, // eje Y: Altura de la boca respecto al centro del barco
  muzzleZ: 1.9, // z: Posición a lo largo del barco, en coordenadas locales del barco
  spawnClearance: 4, // Desplaza el centro físico de la bala fuera del casco sin mover la retícula de la boca
  // HU13: límites y rapidez de la mira. Nombres en inglés: elevationSpeed (rapidez de elevación), aimYawLimit (límite de giro lateral), aimYawSpeed (rapidez de giro), reloadTime (tiempo de recarga).
  minElevation: 0.1, // Elevación mínima de la mira en radianes (unos 6 grados)
  maxElevation: 0.9, // Elevación máxima en radianes (unos 52 grados)
  elevationSpeed: 0.6, // Rapidez con la que W y S cambian la elevación (radianes por segundo)
  aimYawLimit: 0.5, // Giro lateral máximo de la mira respecto al costado (radianes, unos 29 grados)
  aimYawSpeed: 0.8, // Rapidez con la que A y D giran la mira (radianes por segundo)
  mouseAimSpeed: 0.004, // Radianes de elevación por píxel de arrastre vertical
  salvoInterval: 0.075, // Segundos entre cada cañonazo de una salva
  salvoSpread: 0.012, // Dispersión angular máxima en radianes
  reloadTime: 1.2, // Segundos entre un disparo y el siguiente
  reticlePoints: 32, // Cantidad de puntos por arco de trayectoria
  reticleOuterRadius: 57, // Radio fijo del área que contiene la dispersión de la salva
  reticlePulseRingCount: 3, // Ondas que se contraen desde el borde hacia el centro
  reticlePulseSpeed: 0.22, // Ciclos de contracción por segundo
  reticleFlowSpeed: 0.3, // Recorridos del punto luminoso por segundo
  reticleTubeDiameter: 1, // Diámetro del tubo semitransparente de trayectoria
  reticleTubeColor: "#00b7ff", // Color del tubo de trayectoria
  reticleTubeOpacity: 0.38, // Opacidad del tubo (0 transparente, 1 opaco)
  reticleFlowSphereRadius: 0.75, // Radio de cada esfera blanca en movimiento
  reticleFlowSphereColor: "#ffffff", // Color de las esferas en movimiento
  reticleOuterRingColor: "#0088ff",
  reticleOuterRingOpacity: 0.95,
  reticleFillColor: "#0066ff",
  reticleFillOpacity: 0.12,
  reticlePulseColor: "#7ceeff",
  reticlePulseAlternateColor: "#ffffff",
  reticlePulseOpacity: 0.85,
  reticleCoreRadius: 9, // Radio del núcleo giratorio
  reticleCoreColor: "#00aaff",
  reticleCenterLightColor: "#e0f7ff",
  reticleCoreRotationSpeed: 1.4, // Radianes por segundo en sentido antihorario
  impactMarkSize: 8, // Tamaño de la X que indica el impacto real
  impactMarkerDuration: 2, // Tiempo que permanece visible la X del impacto
  impactMarkColor: "#ffffff",
  impactMarkOpacity: 0.95,
  reticleColor: "#0077ff", // Color de las trayectorias previas al disparo
};
