import { BULLET } from '@/config/bullets'
import { CANNONS } from '@/config/cannons'
import * as THREE from 'three'

// Calcula la boca del cañón y la dirección de disparo para una batería lateral o de popa.
// shipObject es el objeto 3D del barco; station es 'left', 'right' o 'stern'.
// Se puede pasar 'out' para reutilizar los vectores y localMuzzle para calcular cada boca de una salva.
// El barco avanza por su eje -Z local, así que su costado derecho (estribor) es +X y el izquierdo (babor) es -X.
export function getMuzzle(
  shipObject,
  station,
  elevation = BULLET.elevation,
  yaw = 0,
  out = { position: new THREE.Vector3(), direction: new THREE.Vector3() },
  localMuzzle,
) {
  const stationConfig = CANNONS[station]
  if (!stationConfig) throw new RangeError(`Unknown cannon station: ${station}`)
  const muzzle = localMuzzle ?? stationConfig.aimMuzzle
  const horizontalSpeed = Math.cos(elevation)

  out.position
    .fromArray(muzzle)
    .applyQuaternion(shipObject.quaternion)
    .add(shipObject.position)

  if (station === 'stern') {
    out.direction.set(
      Math.sin(yaw) * horizontalSpeed,
      Math.sin(elevation),
      Math.cos(yaw) * horizontalSpeed,
    )
  } else {
    const sign = station === 'left' ? -1 : 1
    out.direction.set(
      sign * horizontalSpeed * Math.cos(yaw),
      Math.sin(elevation),
      -horizontalSpeed * Math.sin(yaw),
    )
  }

  out.direction
    .applyQuaternion(shipObject.quaternion)
  return out
}

export function getSalvoMuzzles(station) {
  const stationConfig = CANNONS[station]
  if (!stationConfig) throw new RangeError(`Unknown cannon station: ${station}`)
  return stationConfig.salvoIndices.map((index) => stationConfig.muzzles[index])
}

export function getSalvoShots(shipObject, station, elevation, yaw) {
  const muzzles = getSalvoMuzzles(station)
  const spread = CANNONS.spreadRadians

  return muzzles.map((localMuzzle, index) => {
    const centeredIndex = muzzles.length > 1
      ? (index / (muzzles.length - 1)) * 2 - 1
      : 0
    const shotElevation = THREE.MathUtils.clamp(
      elevation + (index % 2 === 0 ? -0.5 : 0.5) * spread,
      BULLET.minElevation,
      BULLET.maxElevation,
    )
    const shotYaw = THREE.MathUtils.clamp(
      yaw + centeredIndex * spread,
      -BULLET.aimYawLimit,
      BULLET.aimYawLimit,
    )
    const { position, direction } = getMuzzle(
      shipObject,
      station,
      shotElevation,
      shotYaw,
      undefined,
      localMuzzle,
    )

    return {
      muzzlePosition: position.toArray(),
      position: position
        .clone()
        .addScaledVector(direction, BULLET.spawnClearance)
        .toArray(),
      direction: direction.toArray(),
    }
  })
}
