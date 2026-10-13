import { useFrame, useThree } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { CAMERA } from '@/config/camera'

export default function FollowCamera() {
  const scene = useThree((s) => s.scene)
  const shipRef = useRef(null)
  const ready = useRef(false)
  // Vectores que se reutilizan en cada fotograma: así no se crean objetos nuevos 60 veces por segundo
  const v = useMemo(
    () => ({
      offset: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      lookTarget: new THREE.Vector3(),
      lookCurrent: new THREE.Vector3(),
    }),
    []
  )

  useFrame(({ camera }, delta) => {
    // Busca el barco por su nombre hasta encontrarlo (Ship.jsx lo llama "ship")
    if (!shipRef.current) shipRef.current = scene.getObjectByName('ship') ?? null
    const ship = shipRef.current
    if (!ship) return

    // Posición deseada: detrás y arriba del barco, girando con su rumbo
    v.offset.set(...CAMERA.offset).applyQuaternion(ship.quaternion)
    v.desired.copy(ship.position).add(v.offset)
    // Punto al que mira: un poco por delante de la proa (el frente del barco es -Z)
    v.forward.set(0, 0, -1).applyQuaternion(ship.quaternion)
    v.lookTarget.copy(ship.position).addScaledVector(v.forward, CAMERA.lookAhead)
    v.lookTarget.y += CAMERA.lookHeight

    if (!ready.current) {
      // Primer fotograma: se coloca de golpe para que no haya un "vuelo" desde la posición inicial
      camera.position.copy(v.desired)
      v.lookCurrent.copy(v.lookTarget)
      ready.current = true
    } else {
      // El docente suaviza con lerp de factor fijo por fotograma (clase 2), pero usamos 1 - exp(-k·delta)
      // porque la suavidad es igual en pantallas de 60 y de 144 Hz
      camera.position.lerp(v.desired, 1 - Math.exp(-CAMERA.followDamping * delta))
      v.lookCurrent.lerp(v.lookTarget, 1 - Math.exp(-CAMERA.lookDamping * delta))
    }
    camera.lookAt(v.lookCurrent)
  })

  return null
}