import { BULLET } from '@/config/bullets'
import * as THREE from 'three'

// Calcula la boca del cañón y la dirección de disparo para un lado del barco (HT06; HU13 lo usará para disparar).
// shipObject: el objeto 3D del barco (name="ship"); side: 'left' (babor) o 'right' (estribor);
// elevation: ángulo de subida en radianes. Se puede pasar 'out' para reutilizar los vectores en cada disparo.
// El barco avanza por su eje -Z local, así que su costado derecho (estribor) es +X y el izquierdo (babor) es -X.
export function getMuzzle(
  shipObject,
  side,
  elevation = BULLET.elevation,
  out = { position: new THREE.Vector3(), direction: new THREE.Vector3() },
) {
  const sign = side === 'left' ? -1 : 1
  out.position
    .set(sign * BULLET.muzzleOffset, BULLET.muzzleHeight, 0)
    .applyQuaternion(shipObject.quaternion)
    .add(shipObject.position)
  out.direction
    .set(sign * Math.cos(elevation), Math.sin(elevation), 0)
    .applyQuaternion(shipObject.quaternion)
  return out
}
